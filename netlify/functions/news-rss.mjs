function cleanCdata(str) {
  return str.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").trim();
}

function cleanEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
    const x = match[1];

    const title = cleanEntities(cleanCdata((x.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || ""));
    const link = cleanCdata((x.match(/<link\s*>([\s\S]*?)<\/link>/) || [])[1] || "")
      || cleanCdata((x.match(/<link[^>]*href=["']([^"']+)["']/) || [])[1] || "");
    const pubDate = cleanCdata((x.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || "");
    const source = cleanCdata((x.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || "");

    if (!title) continue;

    let dateStr = "";
    if (pubDate) {
      try {
        const d = new Date(pubDate);
        if (!isNaN(d)) dateStr = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
      } catch { dateStr = pubDate.substring(0, 16); }
    }

    items.push({ title, link, date: dateStr, source });
  }
  return items;
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS" },
    });
  }

  try {
    const { query } = await req.json();

    // Try pt-BR first, fallback to en-US if no results
    const locales = [
      { hl: "pt-BR", gl: "BR", ceid: "BR:pt-419" },
      { hl: "en", gl: "US", ceid: "US:en" },
    ];

    let items = [];
    for (const loc of locales) {
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${loc.hl}&gl=${loc.gl}&ceid=${loc.ceid}`;
      const response = await fetch(rssUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsBot/1.0)" },
      });
      const xml = await response.text();
      items = parseItems(xml);
      if (items.length > 0) break;
    }

    return new Response(JSON.stringify({ items, query }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, items: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
};

export const config = {
  path: "/api/news",
};
