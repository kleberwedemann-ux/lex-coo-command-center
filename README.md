# Lex Experience — COO Command Center

Dashboard operacional integrado para a operação EaaS (Executives as a Service) da Lex Experience.

## Stack
- React 18 + Vite
- Recharts (gráficos)
- Lucide React (ícones)
- Claude API (AI Assistant + Web Search ao vivo)

## Setup Local

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`

## Deploy no Netlify

### Via GitHub (recomendado):
1. Push este repo para o GitHub
2. Acesse [app.netlify.com](https://app.netlify.com)
3. Clique **"Add new site"** → **"Import an existing project"**
4. Selecione **GitHub** e autorize
5. Escolha este repositório
6. Configurações de build (já pré-configuradas no `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Clique **"Deploy site"**

O site estará online em ~1 minuto.

### Atualizações automáticas:
Cada `git push` no branch `main` dispara um novo deploy automaticamente.

## Módulos

| Módulo | Descrição |
|--------|-----------|
| Overview | KPIs macro clicáveis com explicações + busca de notícias |
| Market Intel | FDI por setor, setores ativos com deep dive + notícias ao vivo |
| Buyers | 4 buyer personas interativas + estrutura de decisão + dores |
| Ofertas | 4 fases de market entry com pricing detalhado |
| Radar | 18+ competidores com filtros e white space confirmado |
| LatAm | 5 jurisdições comparadas lado a lado |
| Métricas | LTV, margens, capacidade, canais rankeados |
| Simulador | Calculator interativo de proposta por país/porte/fases |
| Playbook | Sales pitch por stakeholder + respostas a perguntas do comprador |
| AI | Chat com Claude integrado (web search habilitado) |

## Dados

Todos os dados são provenientes do EaaS Intelligence Project:
- **Gemini Deep Research**: varredura macro (FDI, ALSPs, EORs, tendências)
- **Perplexity**: validação e profundidade (players BR, pricing BRL, jurisdições LatAm, buyer personas)
- **Claude**: síntese, análise de gaps, e construção do dashboard

---

Lex Experience © 2026 — Rethink Legal Network
