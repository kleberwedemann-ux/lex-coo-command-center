export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS" },
    });
  }

  try {
    const { query } = await req.json();
    
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
    
    const response = await fetch(rssUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    
    const xml = await response.text();
    
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let count = 0;
    
    while ((match = itemRegex.exec(xml)) !== null && count < 5) {
      const itemXml = match[1];
      
      const title = (itemXml.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "";
      const link = (itemXml.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || "";
      const pubDate = (itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || "";
      const source = (itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || "";
      
      const cleanTitle = title
        .replace(/<!\[CDATA\[/g, "")
        .replace(/\]\]>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      
      const cleanSource = source
        .replace(/<!\[CDATA\[/g, "")
        .replace(/\]\]>/g, "");
      
      let dateStr = "";
      if (pubDate) {
        try {
          const d = new Date(pubDate);
          dateStr = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
        } catch(e) {
          dateStr = pubDate.substring(0, 16);
        }
      }
      
      items.push({
        title: cleanTitle,
        link: link.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, ""),
        date: dateStr,
        source: cleanSource
      });
      count++;
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
