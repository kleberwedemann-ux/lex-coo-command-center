export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS" },
    });
  }

  try {
    const { query, context } = await req.json();
    const apiKey = Netlify.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `Você é o assistente de inteligência da Lex Experience, escritório de advocacia especializado em market entry na América Latina com Executives as a Service (EaaS).

CONTEXTO: ${context || "Market entry, FDI, executivos fracionados, América Latina, Brasil"}

TAREFA: Pesquise e resuma as informações mais recentes e relevantes sobre: ${query}

FORMATO DE RESPOSTA (em português brasileiro):
📰 NOTÍCIAS RECENTES
• [Título da notícia] — [Fonte] — [Resumo de 1 linha]
(liste 3-5 notícias)

🏢 EMPRESAS E MOVIMENTAÇÕES
• [Nome da empresa] — [O que fizeram] — [Relevância para market entry]
(liste 2-3 exemplos se aplicável)

💡 RELEVÂNCIA PARA A LEX EXPERIENCE
[1-2 frases sobre como isso impacta a operação de market entry da Lex Experience]

Seja direto, concreto, com dados. Sem enrolação.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const data = await response.json();
    
    let text = "";
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      text = data.candidates[0].content.parts
        .filter(p => p.text)
        .map(p => p.text)
        .join("\n");
    } else if (data.error) {
      text = `Erro da API: ${data.error.message || JSON.stringify(data.error)}`;
    } else {
      text = "Não foi possível obter resultados. Tente novamente.";
    }

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/api/search",
};
