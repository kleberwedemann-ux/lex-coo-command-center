const KEYWORDS = [
  "class action",
  "WAMCA",
  "tariff refund",
  "IEEPA",
  "Section 301",
  "Brazil market entry",
  "law firm Latin America",
  "forced labor",
  "CAPE CBP",
];

const TRIGGER_PATTERNS = [
  /class action/i,
  /WAMCA/i,
  /tariff refund/i,
  /IEEPA/i,
  /Section 301/i,
  /forced labor/i,
  /CAPE CBP/i,
];

const INTELLIGENCE_PATTERNS = [
  /Brazil market entry/i,
  /law firm Latin America/i,
  /competitor/i,
  /market share/i,
  /new regulation/i,
  /compliance/i,
];

function classifyArticle(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  for (const pattern of TRIGGER_PATTERNS) {
    if (pattern.test(text)) return "TRIGGER";
  }
  for (const pattern of INTELLIGENCE_PATTERNS) {
    if (pattern.test(text)) return "INTELLIGENCE";
  }
  return "MONITOR";
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return dateStr.substring(0, 16);
  }
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  const apiKey = Netlify.env.get("GNEWS_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GNEWS_API_KEY not configured", items: [] }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const keywords = body.keywords || KEYWORDS;
    const maxPerKeyword = body.maxPerKeyword || 3;

    const seen = new Set();
    const allItems = [];

    const fetches = keywords.map(async (keyword) => {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(keyword)}&lang=en&max=${maxPerKeyword}&apitoken=${apiKey}`;
      try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.articles || []).map((a) => ({ ...a, _keyword: keyword }));
      } catch {
        return [];
      }
    });

    const results = await Promise.all(fetches);

    for (const articles of results) {
      for (const article of articles) {
        const key = article.url || article.title;
        if (seen.has(key)) continue;
        seen.add(key);

        const badge = classifyArticle(article.title || "", article.description || "");

        allItems.push({
          title: article.title || "",
          description: article.description || "",
          link: article.url || "",
          date: formatDate(article.publishedAt),
          source: article.source?.name || "",
          image: article.image || null,
          badge,
          keyword: article._keyword,
        });
      }
    }

    allItems.sort((a, b) => {
      const order = { TRIGGER: 0, INTELLIGENCE: 1, MONITOR: 2 };
      return (order[a.badge] ?? 3) - (order[b.badge] ?? 3);
    });

    return new Response(
      JSON.stringify({ items: allItems, keywords, total: allItems.length }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message, items: [] }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  }
};

export const config = {
  path: "/api/gnews",
};
