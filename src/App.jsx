import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChevronRight, Globe, Users, DollarSign, TrendingUp, MapPin, Target, Calculator, BookOpen, MessageSquare, BarChart3, Menu, X, CheckCircle, ArrowRight } from "lucide-react";

const ACCENT = "#6B7FA3", DARK = "#0F1724", DARKER = "#0A1018", CARD = "#151F2E", BORDER = "#1E2D42", TEXT = "#C8D6E5", TEXT_DIM = "#6B7B8D", WHITE = "#F0F4F8", GREEN = "#10B981", RED = "#EF4444", AMBER = "#F59E0B", BLUE = "#3B82F6";

const FDI_HIST = [{year:"2020",value:46},{year:"2021",value:46.4},{year:"2022",value:74.6},{year:"2023",value:62.4},{year:"2024",value:71.1},{year:"2025*",value:84.1},{year:"2026P",value:70}];
const FDI_COUNTRY = [{country:"EUA",stock:244.7,color:"#3B82F6"},{country:"P. Baixos",stock:145.5,color:"#6366F1"},{country:"Luxemburgo",stock:79.2,color:"#8B5CF6"},{country:"França",stock:63.3,color:"#A855F7"},{country:"Espanha",stock:61,color:"#D946EF"},{country:"UK",stock:31,color:"#EC4899"},{country:"Japão",stock:27.8,color:"#F43F5E"},{country:"Alemanha",stock:21.9,color:"#FB923C"}];
const FDI_SECTOR = [{sector:"Serv. Financeiros",value:222},{sector:"Petróleo & Gás",value:82},{sector:"Comércio",value:80},{sector:"Eletricidade",value:57},{sector:"Serv. Prof.",value:45},{sector:"Químicos",value:43},{sector:"Alimentos",value:41},{sector:"Telecom",value:32}];

const PRICING_EXEC = [{role:"Country Manager",sr:"R$ 30-60k",pl:"R$ 15-30k",usd:"USD 5-10k"},{role:"CFO",sr:"R$ 35-70k",pl:"R$ 18-35k",usd:"USD 5.8-11.7k"},{role:"CMO",sr:"R$ 30-55k",pl:"R$ 15-30k",usd:"USD 5-9.2k"},{role:"COO",sr:"R$ 35-60k",pl:"R$ 15-35k",usd:"USD 5.8-10k"},{role:"CTO",sr:"R$ 28-55k",pl:"R$ 12-28k",usd:"USD 4.7-9.2k"},{role:"CRO",sr:"R$ 45-80k",pl:"R$ 25-45k",usd:"USD 7.5-13.3k"},{role:"Board Advisor",sr:"R$ 10-30k",pl:"R$ 5-20k",usd:"USD 1.7-5k"}];
const PRICING_LEGAL = [{tier:"Tier 1",firms:"Mattos Filho, Pinheiro Neto, TozziniFreire",hourly:"R$ 1.500-5.000/h",usd:"USD 250-833/h"},{tier:"Tier 2",firms:"Demarest, Machado Meyer, Lefosse, Veirano",hourly:"R$ 800-2.500/h",usd:"USD 133-417/h"},{tier:"Tier 3",firms:"Boutiques mid-market",hourly:"R$ 350-1.000/h",usd:"USD 58-167/h"}];

const COMPETITORS = [
  {name:"Mattos Filho",type:"Law Firm T1",legal:true,tax:true,adv:true,op:false,eaas:false},
  {name:"TozziniFreire",type:"Law Firm T1",legal:true,tax:true,adv:true,op:false,eaas:false},
  {name:"Pinheiro Neto",type:"Law Firm T1",legal:true,tax:true,adv:true,op:false,eaas:false},
  {name:"Baker McKenzie",type:"Law Firm Global",legal:true,tax:true,adv:true,op:false,eaas:false},
  {name:"DLA Piper",type:"Law Firm Global",legal:true,tax:true,adv:true,op:false,eaas:false},
  {name:"Deloitte Legal",type:"Big 4",legal:true,tax:true,adv:true,op:true,eaas:false},
  {name:"PwC Legal",type:"Big 4",legal:true,tax:true,adv:true,op:true,eaas:false},
  {name:"EY Law",type:"Big 4",legal:true,tax:true,adv:true,op:true,eaas:false},
  {name:"Deel",type:"EOR",legal:false,tax:false,adv:false,op:true,eaas:false},
  {name:"Remote",type:"EOR",legal:false,tax:false,adv:false,op:true,eaas:false},
  {name:"G-P",type:"EOR",legal:false,tax:false,adv:false,op:true,eaas:false},
  {name:"BizLatinHub",type:"Back-office",legal:true,tax:true,adv:false,op:true,eaas:false},
  {name:"TMF Group",type:"Back-office",legal:false,tax:true,adv:false,op:true,eaas:false},
  {name:"Vistra",type:"Back-office",legal:false,tax:true,adv:false,op:true,eaas:false},
  {name:"Axiom",type:"ALSP",legal:true,tax:false,adv:false,op:false,eaas:false},
  {name:"Chiefs.Group",type:"EaaS",legal:false,tax:false,adv:false,op:false,eaas:true},
  {name:"Alavanka",type:"EaaS",legal:false,tax:false,adv:false,op:false,eaas:true},
  {name:"LEX EXPERIENCE",type:"LEGAL + EaaS",legal:true,tax:true,adv:true,op:true,eaas:true,hl:true},
];

const PHASES = [
  {id:1,name:"PRÉ-ENTRY",sub:"Antes da decisão",dur:"6-12 sem",ticket:"R$ 40-120k",services:[{n:"Market Assessment",p:"R$ 20-60k",t:"3-6 sem"},{n:"Regulatory Landscape",p:"R$ 10-30k",t:"2-4 sem"},{n:"Competitive Intelligence",p:"R$ 10-25k",t:"2-4 sem"},{n:"Financial Modeling",p:"R$ 15-40k",t:"3-5 sem"},{n:"Tax Structuring",p:"R$ 10-20k",t:"2-3 sem"}]},
  {id:2,name:"SETUP",sub:"Constituição",dur:"45-90 dias",ticket:"R$ 30-80k",services:[{n:"Constituição LTDA/SA",p:"R$ 5-25k",t:"2-6 sem"},{n:"Registro Junta + CNPJ",p:"Incluso",t:"1-3 sem"},{n:"Conta Bancária",p:"R$ 3-8k",t:"2-6 sem"},{n:"Registro INPI",p:"R$ 2-5k",t:"1-2 sem"},{n:"Compliance Setorial",p:"R$ 10-50k+",t:"8-24 sem"},{n:"Governance Docs",p:"R$ 3-10k",t:"1-2 sem"}]},
  {id:3,name:"LAUNCH",sub:"Primeiros 12 meses",dur:"12 meses",ticket:"R$ 150-500k",services:[{n:"Country Manager Fracionado",p:"R$ 15-35k/mês",t:"Ongoing"},{n:"CFO Fracionado",p:"R$ 8-20k/mês",t:"Ongoing"},{n:"Recrutamento Local",p:"R$ 10-40k/posição",t:"4-8 sem"},{n:"Folha + Benefícios",p:"R$ 3-8k setup",t:"2-4 sem"},{n:"Go-to-Market",p:"R$ 10-30k/mês",t:"Ongoing"},{n:"Board Advisory",p:"R$ 5-15k/mês",t:"Ongoing"}]},
  {id:4,name:"SCALE",sub:"12-24 meses",dur:"12-24 meses",ticket:"R$ 80-300k/ano",services:[{n:"Transição → Permanente",p:"15-25% sal. anual",t:"4-12 sem"},{n:"Expansão Regulatória",p:"R$ 10-50k+",t:"Variável"},{n:"M&A Advisory",p:"1-5% EV",t:"6-12 meses"},{n:"LGPD Compliance",p:"R$ 3-8k/mês",t:"Ongoing"},{n:"ESG Reporting",p:"R$ 20-80k/ano",t:"Anual"}]},
];

const LATAM = [
  {c:"🇧🇷 Brasil",setup:"60-90",cost:"5-15k",labor:"~70-75%",tax:"~34%",ease:5},
  {c:"🇲🇽 México",setup:"28-42",cost:"2-6k",labor:"~42-45%",tax:"~30%",ease:3},
  {c:"🇨🇴 Colômbia",setup:"10-30",cost:"1,5-5k",labor:"~29-30%",tax:"~35%",ease:2},
  {c:"🇨🇱 Chile",setup:"14-42",cost:"2-6k",labor:"~6-7%",tax:"~27%",ease:1},
  {c:"🇦🇷 Argentina",setup:"15-30",cost:"3,5-8k",labor:"~27-30%",tax:"~25-35%",ease:4},
];

const BUYERS = [
  {seg:"Enterprise",rev:">US$ 1B",cycle:"18-36m",entry:"M&A / Greenfield",sectors:"Energia, Infra, Pharma",origin:"EUA, França, Alemanha",decider:"CEO + Board"},
  {seg:"Mid-Market",rev:"US$ 50M-1B",cycle:"12-24m",entry:"Greenfield / JV",sectors:"Saúde, Manufatura, B2B",origin:"Alemanha, França, UK",decider:"CEO + CFO"},
  {seg:"Scale-up",rev:"US$ 10-50M",cycle:"6-12m",entry:"Parceiro → Sub",sectors:"Tech, Fintech, Agtech",origin:"EUA, Israel, EU",decider:"CEO + Board"},
  {seg:"Startup",rev:"<US$ 10M",cycle:"3-6m",entry:"Soft landing / EOR",sectors:"SaaS, Digital",origin:"Global",decider:"Founder"},
];

function KPI({label,value,sub,color=ACCENT}){return(<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:"18px 20px",borderTop:`3px solid ${color}`}}><div style={{fontSize:11,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>{label}</div><div style={{fontSize:26,fontWeight:700,color:WHITE,lineHeight:1.1}}>{value}</div>{sub&&<div style={{fontSize:11,color:TEXT_DIM,marginTop:4}}>{sub}</div>}</div>)}
function Title({children,sub}){return(<div style={{marginBottom:20}}><h2 style={{fontSize:22,fontWeight:700,color:WHITE,margin:0}}>{children}</h2>{sub&&<p style={{fontSize:12,color:TEXT_DIM,margin:"4px 0 0"}}>{sub}</p>}</div>)}
function Chk({v}){return v?<span style={{color:GREEN,fontWeight:700}}>✓</span>:<span style={{color:"#374151"}}>—</span>}

const NAV=[{id:"overview",label:"Overview",icon:BarChart3},{id:"market",label:"Market Intel",icon:Globe},{id:"buyers",label:"Buyers",icon:Users},{id:"offers",label:"Ofertas",icon:DollarSign},{id:"competitors",label:"Radar",icon:Target},{id:"latam",label:"LatAm",icon:MapPin},{id:"metrics",label:"Métricas",icon:TrendingUp},{id:"simulator",label:"Simulador",icon:Calculator},{id:"playbook",label:"Playbook",icon:BookOpen},{id:"ai",label:"AI",icon:MessageSquare}];

function Overview(){
const KPI_DETAILS = [
  {label:"IDP Brasil 2025",value:"US$ 84,1B",sub:"Melhor desde 2014",color:GREEN,
   what:"IDP = Investimento Direto no País. É o fluxo de capital estrangeiro que entra no Brasil para criar ou expandir empresas. Medido pelo Banco Central.",
   why:"É o indicador #1 da demanda por serviços de market entry. Quanto mais IDP, mais empresas precisam de assessoria jurídica + executivos para operar no Brasil.",
   data:"2020: US$46B → 2025: US$84,1B (+83%). Brasil é o 2° maior destino global de FDI (OCDE). Estoque total: US$1,14 trilhão = 46,6% do PIB.",
   search:"Brazil foreign direct investment 2025 2026"},
  {label:"Empresas c/ Capital Estrangeiro",value:"~19.000",sub:"Censo BCB 2024",color:BLUE,
   what:"Total de empresas no Brasil que têm participação de capital estrangeiro, segundo o Censo de Capitais Estrangeiros do Banco Central (2024).",
   why:"Cada uma dessas 19.000 empresas precisou de serviços de market entry. É o TAM histórico acumulado. O fluxo anual de novas empresas é o SAM da Lex Experience.",
   data:"80% da receita concentrada no Sul e Sudeste. Setores líderes em emprego: comércio, alimentos, automotivo (43% do emprego total). 3 milhões de empregos gerados.",
   search:"empresas capital estrangeiro Brasil 2025 2026"},
  {label:"Mercosul-UE",value:"1° Mai 2026",sub:"Vigência provisória",color:AMBER,
   what:"O Acordo Mercosul-União Europeia é o maior acordo comercial do mundo. Negociado por 25 anos, foi assinado em janeiro de 2026 e entra em vigor provisório em 1° de maio de 2026.",
   why:"Vai gerar uma onda de market entry europeu no Brasil. UE elimina tarifas sobre 95% dos produtos. Setores: pharma, manufatura, automação, energia, alimentos.",
   data:"Impacto projetado: +R$37B no PIB, +R$13,6B em investimentos, +R$52,1B em exportações. França sozinha comprometeu R$100B até 2030 via 15 maiores grupos.",
   search:"Mercosul EU agreement trade impact 2026"},
  {label:"White Space",value:"CONFIRMADO",sub:"Nenhum player integra Legal+EaaS",color:GREEN,
   what:"White space = lacuna de mercado onde nenhum concorrente atua. Após mapear 25+ players, confirmamos que NENHUM combina estruturação jurídica + executivo fracionado + go-to-market operacional.",
   why:"Essa é a tese central da Lex Experience. Escritórios param no advisory. EORs param no payroll. Plataformas EaaS não fazem jurídico. A Lex é a única que cobre as 3 camadas.",
   data:"Concorrentes analisados: 5 law firms Tier 1, 4 Big 4, 3 EORs, 4 back-office providers, 2 ALSPs, 2 plataformas EaaS. Zero oferece o pacote integrado.",
   search:"fractional executive legal services market entry Brazil"},
  {label:"LTV Cliente",value:"R$ 300k-1M",sub:"30-36 meses, 4 fases",color:ACCENT,
   what:"LTV = Lifetime Value. É a receita total que um cliente gera ao longo do relacionamento com a Lex Experience, passando pelas 4 fases de market entry.",
   why:"Um LTV de R$300k-1M por cliente significa que poucos clientes geram receita significativa. Com 5-10 clientes ativos, a operação se sustenta.",
   data:"F1 Pré-Entry: R$40-120k | F2 Setup: R$30-80k | F3 Launch 12m: R$150-500k | F4 Scale 12m: R$80-300k. Renovação F2→F3: 60-75%.",
   search:"professional services LTV client lifetime value consulting"},
  {label:"ALSP Global",value:"US$ 28,5B",sub:"CAGR 18%",color:BLUE,
   what:"ALSP = Alternative Legal Service Providers. São empresas que oferecem serviços jurídicos fora do modelo tradicional de escritório. Mercado global de US$28,5B com crescimento de 18% ao ano.",
   why:"Mostra que o mercado jurídico está se abrindo para modelos alternativos — como o da Lex Experience. ALSPs independentes detêm 87% do mercado ($24,8B).",
   data:"Fonte: Thomson Reuters / Georgetown ALSP Survey 2025. Axiom lidera com 14.000 profissionais. Nenhum ALSP oferece C-level fracionado — white space confirmado.",
   search:"alternative legal service providers ALSP market 2025 2026"},
];

const TRIGGERS = [
  {i:"🇪🇺",t:"Mercosul-UE",d:"Vigência 1° mai 2026. UE elimina 95% tarifas. +R$ 37B PIB.",
   detail:"O maior acordo comercial do mundo entra em vigor em 1° de maio de 2026. No Dia 1, 82,7% das exportações brasileiras para a UE entrarão sem tarifa. A UE elimina tarifas sobre 95% dos produtos do Mercosul. Setores mais beneficiados: agronegócio (carnes, etanol, soja), autopeças, aeronaves (Embraer), farmacêutico (UE exportou US$7B+ em fármacos para o BR em 2025). Para FDI europeu: pharma, máquinas industriais, automação, software B2B e energia renovável são os setores onde o acordo acelera a entrada. Perfil típico: Mittelstand alemão, grupos franceses, operadores logísticos britânicos.",
   search:"Mercosul EU trade agreement impact sectors 2026"},
  {i:"📈",t:"FDI +67%",d:"IDE projetos produtivos BR +67% (2022-2025). 2° maior destino global.",
   detail:"Segundo análise da McKinsey (Nelson Ferreira, sócio), o IDE em novos projetos produtivos no Brasil cresceu 67% entre 2022 e maio de 2025, contra 24% da média global. O Brasil foi o 2° maior destino global de FDI no 1°S/2024 (OCDE), atrás apenas dos EUA. Em 2025 (jan-nov), o IDP atingiu US$84,1B — melhor resultado desde 2014. O estoque total de IDP é de US$1,14 trilhão (46,6% do PIB). Setores líderes: energia renovável, infraestrutura, serviços financeiros, agro.",
   search:"Brazil FDI foreign investment growth 2025 2026 projects"},
  {i:"🔄",t:"Nearshoring",d:"Tensões EUA-China + IEEPA redirecionam investimentos para LatAm.",
   detail:"A guerra comercial EUA-China e as tarifas IEEPA (International Emergency Economic Powers Act) estão redirecionando cadeias de suprimento globais para a América Latina. O Brasil captura fluxos estratégicos em manufatura, tech e energia. China investiu apenas 4,28% do estoque de FDI no Brasil em 2023 (mínimo de 7 anos), mas em 2025 subiu de 19° para 10° lugar nos fluxos, indicando redirecionamento. Empresas americanas e europeias buscam 'friendshoring' em jurisdições aliadas — Brasil e México são os principais beneficiários.",
   search:"nearshoring Latin America supply chain 2025 2026"},
  {i:"🏛️",t:"Reforma Tributária",d:"CBS/IBS 2026-2033. Split Payment. Alíquota ~28%. Empresas PRECISAM de CFO local.",
   detail:"A Emenda Constitucional 132 iniciou em 2026 a maior reforma tributária da história do Brasil. Cinco tributos (PIS, COFINS, IPI, ICMS, ISS) estão sendo substituídos pelo Dual VAT: CBS (federal) + IBS (subnacional). O Split Payment entra em vigor em 2026 com alíquota de teste de 1%. A alíquota combinada final será de 27,5-28% — entre as mais altas do mundo. O Split Payment muda radicalmente o capital de giro: o tributo é recolhido no momento da liquidação financeira. Isso obriga empresas entrantes a ter um CFO com vivência no sistema brasileiro supervisionando compliance fiscal.",
   search:"Brazil tax reform CBS IBS dual VAT 2026 split payment"},
  {i:"🇫🇷",t:"França R$ 100B",d:"15 maiores grupos franceses comprometeram R$ 100B até 2030.",
   detail:"A França é o 3° maior investidor no Brasil por critério de controlador final. São 1.300 filiais de grupos franceses no país — maior empregador estrangeiro no Brasil. A CCFB (Câmara França-Brasil) tem 1.000 associados com faturamento conjunto de R$400B e 560 mil empregos diretos. Thierry Besse (CCFB): 'Conseguir o acordo Mercosul-UE é, para a Europa, um feito extraordinário. Acessar o mercado brasileiro é vantagem competitiva enorme.' Os 15 maiores grupos franceses comprometeram R$100B em investimentos até 2030.",
   search:"France investment Brazil 2025 2026 French companies"},
  {i:"⚡",t:"Digital +14%",d:"TIC greenfield +73% em 2024. Data centers e SaaS como drivers.",
   detail:"O FDI na economia digital cresceu 14% globalmente em 2024 (UNCTAD). Investimentos greenfield em TIC dispararam 73% em valor, atingindo US$211B, puxados por data centers e processamento de dados. O mercado é dominado por poucas empresas: as 100 maiores MNCs digitais respondem por 1/3 de todo greenfield em data centers. A fatia das 5 maiores dobrou de 21% (2017) para 48% (2025). Essas gigantes (EUA e China) precisam de modelos ágeis de market entry nos países receptores — oportunidade direta para a Lex Experience.",
   search:"digital economy FDI data centers Latin America 2025 2026"},
];

const [openKpi, setOpenKpi] = useState(null);
const [openTrigger, setOpenTrigger] = useState(null);

const openPerplexity = (query) => {
  window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(query)}&focus=internet`, '_blank');
};

return(<div>
<Title sub="Visão executiva — clique em qualquer card para aprofundar">Dashboard Estratégico</Title>

{/* KPI Cards - Clickable */}
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:openKpi!==null?0:28}}>
{KPI_DETAILS.map((k,i)=>(
<div key={i} onClick={()=>{setOpenKpi(openKpi===i?null:i);setOpenTrigger(null)}} style={{background:CARD,border:`1px solid ${openKpi===i?k.color:BORDER}`,borderRadius:12,padding:"18px 20px",borderTop:`3px solid ${k.color}`,cursor:"pointer",transition:"all 0.2s",transform:openKpi===i?"scale(1.02)":"scale(1)"}}>
<div style={{fontSize:11,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>{k.label}<span style={{fontSize:9,color:openKpi===i?k.color:TEXT_DIM}}>CLIQUE ▾</span></div>
<div style={{fontSize:26,fontWeight:700,color:WHITE,lineHeight:1.1}}>{k.value}</div>
<div style={{fontSize:11,color:TEXT_DIM,marginTop:4}}>{k.sub}</div>
</div>))}
</div>

{/* KPI Expanded Detail Panel */}
{openKpi!==null&&(()=>{const k=KPI_DETAILS[openKpi];return(
<div style={{background:CARD,border:`1px solid ${k.color}`,borderRadius:12,padding:24,margin:"14px 0 28px",animation:"fadeIn 0.3s"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
<h3 style={{fontSize:18,color:WHITE,margin:0}}>{k.label}: {k.value}</h3>
<button onClick={()=>setOpenKpi(null)} style={{background:"none",border:"none",color:TEXT_DIM,cursor:"pointer",fontSize:18}}>✕</button>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:16}}>
<div style={{padding:14,background:DARKER,borderRadius:8,borderLeft:`3px solid ${BLUE}`}}>
<div style={{fontSize:11,color:BLUE,fontWeight:600,marginBottom:4}}>O QUE É</div>
<div style={{fontSize:12,color:TEXT,lineHeight:1.6}}>{k.what}</div>
</div>
<div style={{padding:14,background:DARKER,borderRadius:8,borderLeft:`3px solid ${GREEN}`}}>
<div style={{fontSize:11,color:GREEN,fontWeight:600,marginBottom:4}}>POR QUE IMPORTA</div>
<div style={{fontSize:12,color:TEXT,lineHeight:1.6}}>{k.why}</div>
</div>
<div style={{padding:14,background:DARKER,borderRadius:8,borderLeft:`3px solid ${AMBER}`}}>
<div style={{fontSize:11,color:AMBER,fontWeight:600,marginBottom:4}}>DADOS-CHAVE</div>
<div style={{fontSize:12,color:TEXT,lineHeight:1.6}}>{k.data}</div>
</div>
</div>
<button onClick={()=>openPerplexity(k.search)} style={{padding:"8px 16px",background:ACCENT,border:"none",borderRadius:6,color:WHITE,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:6}}>
<Globe size={13}/>{"Pesquisar no Perplexity: "+k.label}
</button>
</div>)})()}

{/* Charts */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:28}}>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 14px"}}>IDP Brasil (US$ bi)</h3>
<ResponsiveContainer width="100%" height={200}><BarChart data={FDI_HIST}><XAxis dataKey="year" tick={{fill:TEXT_DIM,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:TEXT_DIM,fontSize:10}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:DARKER,border:`1px solid ${BORDER}`,borderRadius:8,color:WHITE,fontSize:11}}/><Bar dataKey="value" fill={ACCENT} radius={[4,4,0,0]} name="US$ bi"/></BarChart></ResponsiveContainer>
</div>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 14px"}}>IDP por País (Estoque US$ bi)</h3>
<ResponsiveContainer width="100%" height={200}><BarChart data={FDI_COUNTRY} layout="vertical"><XAxis type="number" tick={{fill:TEXT_DIM,fontSize:10}} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="country" tick={{fill:TEXT,fontSize:10}} axisLine={false} tickLine={false} width={75}/><Tooltip contentStyle={{background:DARKER,border:`1px solid ${BORDER}`,borderRadius:8,color:WHITE,fontSize:11}}/><Bar dataKey="stock" radius={[0,4,4,0]} name="US$ bi">{FDI_COUNTRY.map((e,i)=><Cell key={i} fill={e.color}/>)}</Bar></BarChart></ResponsiveContainer>
</div>
</div>

{/* Macro Triggers - Clickable & Expandable */}
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 14px"}}>Macro Triggers <span style={{fontSize:10,fontWeight:400,color:TEXT_DIM}}>— clique para expandir e buscar notícias</span></h3>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
{TRIGGERS.map((t,i)=>(
<div key={i}>
<div onClick={()=>{setOpenTrigger(openTrigger===i?null:i);setOpenKpi(null)}} style={{padding:14,background:openTrigger===i?"rgba(107,127,163,0.12)":DARKER,borderRadius:8,border:`1px solid ${openTrigger===i?ACCENT:BORDER}`,cursor:"pointer",transition:"all 0.2s"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span style={{fontSize:22}}>{t.i}</span>
<span style={{fontSize:9,color:openTrigger===i?ACCENT:TEXT_DIM}}>▾ EXPANDIR</span>
</div>
<div style={{fontSize:13,fontWeight:600,color:WHITE,marginTop:6,marginBottom:3}}>{t.t}</div>
<div style={{fontSize:11,color:TEXT_DIM,lineHeight:1.5}}>{t.d}</div>
</div>
{openTrigger===i&&(
<div style={{padding:16,background:DARKER,borderRadius:"0 0 8px 8px",borderTop:"none",border:`1px solid ${ACCENT}`,borderTopColor:"transparent",marginTop:-4}}>
<div style={{fontSize:12,color:TEXT,lineHeight:1.7,marginBottom:12}}>{t.detail}</div>
<button onClick={()=>openPerplexity(t.search)} style={{padding:"7px 14px",background:ACCENT,border:"none",borderRadius:6,color:WHITE,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:5}}>
<Globe size={12}/>Pesquisar no Perplexity
</button>
</div>)}
</div>))}
</div></div></div>)}

function Market(){
const SECTORS = [
  {s:"Energia Renovável",d:"Leilões ANEEL, metas ESG, transição energética",p:"Enterprise EU/EUA",c:GREEN,
   detail:"O Brasil realizou leilões recordes de energia renovável em 2024-2025. Eólica offshore, solar fotovoltaica e hidrogênio verde atraem investidores europeus (Iberdrola, EDP, Engie, Enel) e fundos de infraestrutura. A capacidade instalada de renováveis no Brasil já ultrapassa 90% da matriz elétrica. O IDP em eletricidade/gás representou 9,4% dos fluxos em 2023.",
   search:"renewable energy investment Latin America Brazil 2025 2026 solar wind companies"},
  {s:"Infraestrutura",d:"Concessões, PPPs, Lei Saneamento",p:"Enterprise (fundos)",c:BLUE,
   detail:"A Lei do Saneamento (14.026/2020) abriu o setor para investimento privado com metas de universalização até 2033. Concessões de rodovias, portos e aeroportos geram fluxo constante de market entry. Fundos franceses (Meridiam, Vinci), britânicos e de Abu Dhabi lideram. O setor representou investimentos bilionários em 2024-2025.",
   search:"infrastructure investment Brazil Latin America PPP concessions 2025 2026 companies"},
  {s:"Fintech",d:"Open Finance, Pix, crédito subatendido",p:"Scale-ups EUA/EU",c:"#8B5CF6",
   detail:"O Brasil tem o sistema de Open Finance mais avançado do mundo e o Pix processa mais de 200 milhões de transações/dia. Fintechs europeias e americanas entram para atender o mercado de crédito subatendido (150M+ brasileiros). Regulação do BC favorece inovação. Scale-ups como Revolut, N26, Wise já operam ou planejam entrada.",
   search:"fintech market entry Brazil Latin America 2025 2026 companies investment Pix"},
  {s:"Agtech",d:"BR = maior exportador agro do mundo",p:"Mid-market EUA/Israel",c:"#10B981",
   detail:"O Brasil é o maior exportador mundial de soja, carne bovina, açúcar, suco de laranja e celulose. Agtechs israelenses (Netafim, Taranis), americanas (Climate Corp, Indigo) e europeias investem em agricultura de precisão, biodefensivos e rastreabilidade. O setor agro representou 14% dos fluxos de IDP em 2023 — liderança absoluta.",
   search:"agtech agriculture technology investment Brazil Latin America 2025 2026 companies"},
  {s:"TI / SaaS / Cloud",d:"5ª maior pop. digital do mundo",p:"Scale-ups globais",c:AMBER,
   detail:"O Brasil é o 5° maior mercado digital do mundo com 180M+ de usuários de internet. Data centers estão em expansão acelerada (Equinix, Digital Realty, Scala). Investimentos greenfield em TIC cresceram 73% em 2024 globalmente. SaaS B2B, cybersecurity e cloud infrastructure são os subsegmentos mais ativos em market entry.",
   search:"SaaS cloud technology market entry Brazil Latin America 2025 2026 data centers companies"},
  {s:"Pharma / HealthTech",d:"Mercado US$50B+, Mercosul-UE acelera",p:"Enterprise EU",c:"#EC4899",
   detail:"O mercado farmacêutico brasileiro é de US$50B+. A UE exportou mais de US$7B em fármacos para o Brasil em 2025 (+12,7% vs 2024). O acordo Mercosul-UE acelera investimento produtivo local em farmoquímicos e biosimilares. ANVISA é o regulador — processo de registro leva 12-24 meses. Empresas alemãs (Bayer, Boehringer), francesas (Sanofi) e suíças (Roche, Novartis) dominam.",
   search:"pharmaceutical healthtech market entry Brazil Latin America 2025 2026 companies ANVISA"},
  {s:"Manufatura 4.0",d:"Mercosul-UE, EFTA, Indústria 4.0",p:"Mittelstand alemão",c:"#6366F1",
   detail:"O acordo Mercosul-UE vai reduzir tarifas sobre 98,8% das importações industriais brasileiras da UE. Isso beneficia diretamente o Mittelstand alemão (empresas mid-market de manufatura avançada), fabricantes italianos de máquinas e operadores de automação franceses. Setores: metalurgia, automação, robótica industrial, IoT industrial. A AHK Brasil já organizou missões técnicas específicas para Indústria 4.0.",
   search:"manufacturing industry 4.0 market entry Brazil Latin America 2025 2026 German Mittelstand companies"},
];

const [openSector, setOpenSector] = useState(null);

const openSectorPerplexity = (idx) => {
  window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(SECTORS[idx].search)}&focus=internet`, '_blank');
};

return(<div>
<Title sub="FDI, setores ativos e Acordo Mercosul-UE — clique nos setores para deep dive + notícias ao vivo">Market Intelligence</Title>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 14px"}}>IDP por Setor — Estoque 2023 (US$ bi)</h3>
<ResponsiveContainer width="100%" height={260}><BarChart data={FDI_SECTOR} layout="vertical"><XAxis type="number" tick={{fill:TEXT_DIM,fontSize:10}} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="sector" tick={{fill:TEXT,fontSize:9}} axisLine={false} tickLine={false} width={100}/><Tooltip contentStyle={{background:DARKER,border:`1px solid ${BORDER}`,borderRadius:8,color:WHITE,fontSize:11}} formatter={v=>`US$ ${v}B`}/><Bar dataKey="value" fill={ACCENT} radius={[0,4,4,0]}/></BarChart></ResponsiveContainer>
</div>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 14px"}}>Setores Mais Ativos — <span style={{fontSize:10,fontWeight:400}}>clique para expandir</span></h3>
{SECTORS.map((s,i)=>(
<div key={i} onClick={()=>setOpenSector(openSector===i?null:i)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${BORDER}`,cursor:"pointer",background:openSector===i?"rgba(107,127,163,0.08)":"transparent",borderRadius:openSector===i?6:0,paddingLeft:openSector===i?8:0,transition:"all 0.15s"}}>
<div style={{width:4,height:32,background:s.c,borderRadius:2,flexShrink:0}}/>
<div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:openSector===i?WHITE:TEXT}}>{s.s}</div><div style={{fontSize:10,color:TEXT_DIM}}>{s.d}</div></div>
<div style={{fontSize:10,color:TEXT_DIM,textAlign:"right",display:"flex",alignItems:"center",gap:4}}>{s.p}<span style={{color:openSector===i?s.c:TEXT_DIM,fontSize:8}}>▾</span></div>
</div>))}
</div></div>

{/* Sector Expanded Panel */}
{openSector!==null&&(()=>{const s=SECTORS[openSector];const key="sector_"+openSector;return(
<div style={{background:CARD,border:`1px solid ${s.c}`,borderRadius:12,padding:24,marginBottom:20,animation:"fadeIn 0.3s"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
<div style={{display:"flex",alignItems:"center",gap:10}}>
<div style={{width:6,height:36,background:s.c,borderRadius:3}}/>
<div>
<h3 style={{fontSize:18,color:WHITE,margin:0}}>{s.s}</h3>
<div style={{fontSize:12,color:TEXT_DIM,marginTop:2}}>Perfil típico: {s.p}</div>
</div>
</div>
<button onClick={()=>setOpenSector(null)} style={{background:"none",border:"none",color:TEXT_DIM,cursor:"pointer",fontSize:18}}>✕</button>
</div>

<div style={{padding:14,background:DARKER,borderRadius:8,marginBottom:14,borderLeft:`3px solid ${s.c}`}}>
<div style={{fontSize:12,color:TEXT,lineHeight:1.7}}>{s.detail}</div>
</div>

<button onClick={()=>openSectorPerplexity(openSector)} style={{padding:"10px 18px",background:s.c,border:"none",borderRadius:8,color:WHITE,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:8}}>
<Globe size={14}/>{"Pesquisar no Perplexity: "+s.s}
</button>
</div>)})()}

<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 14px"}}>Acordo Mercosul-UE — Timeline</h3>
<div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8}}>
{[{d:"17 Jan",e:"Assinatura",ok:true},{d:"24 Fev",e:"Câmara aprova",ok:true},{d:"4 Mar",e:"Senado aprova",ok:true},{d:"18 Mar",e:"BR notifica UE",ok:true},{d:"1 Mai",e:"VIGÊNCIA",ok:false,hl:true},{d:"2026+",e:"Ratificação EU",ok:false}].map((e,i)=>(
<div key={i} style={{minWidth:120,padding:10,background:e.hl?"rgba(107,127,163,0.15)":DARKER,borderRadius:8,border:`1px solid ${e.hl?ACCENT:BORDER}`,textAlign:"center"}}>
<div style={{fontSize:10,color:e.ok?GREEN:e.hl?AMBER:TEXT_DIM,fontWeight:600}}>{e.d}</div>
<div style={{fontSize:11,color:e.hl?WHITE:TEXT,marginTop:3,fontWeight:e.hl?700:400}}>{e.e}</div>
{e.ok&&<CheckCircle size={12} color={GREEN} style={{marginTop:4}}/>}
</div>))}
</div></div></div>)}

function Buyers(){const[s,setS]=useState(0);const p=BUYERS[s];return(<div>
<Title sub="Quem compra market entry — segmentação, decisores, dores">Buyer Personas</Title>
<div style={{display:"flex",gap:6,marginBottom:20}}>{BUYERS.map((b,i)=>(
<button key={i} onClick={()=>setS(i)} style={{padding:"8px 16px",background:s===i?ACCENT:CARD,color:s===i?WHITE:TEXT,border:`1px solid ${s===i?ACCENT:BORDER}`,borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:s===i?700:400}}>{b.seg}</button>))}
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:18,color:WHITE,margin:"0 0 16px"}}>{p.seg}</h3>
{[["Receita",p.rev],["Ciclo",p.cycle],["Entrada",p.entry],["Setores",p.sectors],["Origem",p.origin],["Decisor",p.decider]].map(([l,v],i)=>(
<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${BORDER}`}}>
<span style={{fontSize:12,color:TEXT_DIM}}>{l}</span><span style={{fontSize:12,color:WHITE,fontWeight:600,textAlign:"right"}}>{v}</span>
</div>))}
</div>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 14px"}}>Top Dores no Market Entry</h3>
{[{p:"Complexidade tributária",d:"60+ tributos, 3 níveis. BR = 7° Global Complexity Index."},{p:"Prazo real vs esperado",d:"Planejam 3 meses, levam 12+."},{p:"Estrutura errada",d:"Filial vs subsidiária: tributação radicalmente diferente."},{p:"Sem parceiro local",d:"Fatal para mid-markets."},{p:"Desalinhamento matriz-sub",d:"21% citam due diligence inadequada (KPMG)."}].map((x,i)=>(
<div key={i} style={{padding:10,marginBottom:8,background:DARKER,borderRadius:6,borderLeft:`3px solid ${RED}`}}>
<div style={{fontSize:12,fontWeight:600,color:WHITE}}>{x.p}</div>
<div style={{fontSize:10,color:TEXT_DIM,marginTop:2}}>{x.d}</div>
</div>))}
</div></div></div>)}

function Offers(){const[a,setA]=useState(0);return(<div>
<Title sub="4 fases do market entry integrado — serviços, prazos e pricing">Ofertas & Pricing</Title>
<div style={{display:"flex",gap:6,marginBottom:20,overflowX:"auto"}}>{PHASES.map((p,i)=>(
<button key={i} onClick={()=>setA(i)} style={{padding:"10px 16px",background:a===i?ACCENT:CARD,color:a===i?WHITE:TEXT,border:`1px solid ${a===i?ACCENT:BORDER}`,borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap",minWidth:110}}>
<div>F{p.id}: {p.name}</div><div style={{fontSize:10,fontWeight:400,opacity:0.8,marginTop:2}}>{p.ticket}</div>
</button>))}
</div>
<div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginBottom:24}}>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><h3 style={{fontSize:16,color:WHITE,margin:0}}>{PHASES[a].name} — {PHASES[a].sub}</h3><span style={{fontSize:11,color:ACCENT}}>{PHASES[a].dur}</span></div>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr>{["Serviço","Preço","Prazo"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 10px",color:TEXT_DIM,borderBottom:`1px solid ${BORDER}`,fontSize:10,textTransform:"uppercase",letterSpacing:1}}>{h}</th>)}</tr></thead>
<tbody>{PHASES[a].services.map((s,i)=><tr key={i}><td style={{padding:"8px 10px",color:WHITE,borderBottom:`1px solid ${BORDER}`}}>{s.n}</td><td style={{padding:"8px 10px",color:GREEN,borderBottom:`1px solid ${BORDER}`,fontWeight:600}}>{s.p}</td><td style={{padding:"8px 10px",color:TEXT_DIM,borderBottom:`1px solid ${BORDER}`}}>{s.t}</td></tr>)}</tbody></table>
</div>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<div style={{padding:"14px 0",borderBottom:`1px solid ${BORDER}`}}><div style={{fontSize:11,color:TEXT_DIM}}>LTV Total (4 fases)</div><div style={{fontSize:24,fontWeight:700,color:GREEN}}>R$ 300k — R$ 1M</div><div style={{fontSize:10,color:TEXT_DIM,marginTop:2}}>30-36 meses</div></div>
<div style={{padding:"14px 0"}}><div style={{fontSize:11,color:TEXT_DIM}}>Renovação F2→F3</div><div style={{fontSize:24,fontWeight:700,color:BLUE}}>60-75%</div></div>
</div></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 14px"}}>Pricing Executivos Fracionados (BRL/mês)</h3>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr>{["Perfil","Sênior","Pleno","≈ USD"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"7px 8px",color:TEXT_DIM,borderBottom:`1px solid ${BORDER}`,fontSize:10,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
<tbody>{PRICING_EXEC.map((p,i)=><tr key={i}><td style={{padding:"7px 8px",color:WHITE,borderBottom:`1px solid ${BORDER}`,fontWeight:600}}>{p.role}</td><td style={{padding:"7px 8px",color:TEXT,borderBottom:`1px solid ${BORDER}`}}>{p.sr}</td><td style={{padding:"7px 8px",color:TEXT,borderBottom:`1px solid ${BORDER}`}}>{p.pl}</td><td style={{padding:"7px 8px",color:TEXT_DIM,borderBottom:`1px solid ${BORDER}`}}>{p.usd}</td></tr>)}</tbody></table>
</div>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 14px"}}>Honorários Jurídicos (BRL/hora)</h3>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr>{["Tier","Escritórios","BRL/h"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"7px 8px",color:TEXT_DIM,borderBottom:`1px solid ${BORDER}`,fontSize:10,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
<tbody>{PRICING_LEGAL.map((l,i)=><tr key={i}><td style={{padding:"7px 8px",color:WHITE,borderBottom:`1px solid ${BORDER}`,fontWeight:600}}>{l.tier}</td><td style={{padding:"7px 8px",color:TEXT,borderBottom:`1px solid ${BORDER}`,fontSize:11}}>{l.firms}</td><td style={{padding:"7px 8px",color:TEXT,borderBottom:`1px solid ${BORDER}`}}>{l.hourly}</td></tr>)}</tbody></table>
<div style={{marginTop:12,padding:10,background:DARKER,borderRadius:6,borderLeft:`3px solid ${GREEN}`}}>
<div style={{fontSize:11,color:GREEN,fontWeight:600}}>Vantagem Lex Experience</div>
<div style={{fontSize:10,color:TEXT_DIM,marginTop:2}}>Pricing de boutique (Tier 3) com escopo integrado. Flat-fee caps.</div>
</div></div></div></div>)}

function Competitors(){const[f,setF]=useState("all");const fl=f==="all"?COMPETITORS:COMPETITORS.filter(c=>{
if(f==="law")return c.type.includes("Law");if(f==="big4")return c.type.includes("Big 4");if(f==="eor")return c.type==="EOR";if(f==="back")return c.type.includes("Back");if(f==="eaas")return c.eaas;return true;});
return(<div>
<Title sub="18+ players — filtre por tipo para cada deal">Competitive Radar</Title>
<div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>{[["all","Todos"],["law","Law Firms"],["big4","Big 4"],["eor","EORs"],["back","Back-office"],["eaas","EaaS"]].map(([k,v])=>(
<button key={k} onClick={()=>setF(k)} style={{padding:"5px 12px",background:f===k?ACCENT:CARD,color:f===k?WHITE:TEXT,border:`1px solid ${f===k?ACCENT:BORDER}`,borderRadius:6,cursor:"pointer",fontSize:11}}>{v}</button>))}
</div>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:14,overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr>{["Player","Tipo","Legal","Tax","Advisory","Oper.","EaaS"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 10px",color:TEXT_DIM,borderBottom:`1px solid ${BORDER}`,fontSize:10,textTransform:"uppercase",letterSpacing:0.8,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
<tbody>{fl.map((c,i)=><tr key={i} style={{background:c.hl?"rgba(107,127,163,0.12)":"transparent"}}><td style={{padding:"8px 10px",color:c.hl?WHITE:TEXT,borderBottom:`1px solid ${BORDER}`,fontWeight:c.hl?700:400,whiteSpace:"nowrap"}}>{c.name}</td><td style={{padding:"8px 10px",color:TEXT_DIM,borderBottom:`1px solid ${BORDER}`,fontSize:11}}>{c.type}</td><td style={{padding:"8px 10px",borderBottom:`1px solid ${BORDER}`}}><Chk v={c.legal}/></td><td style={{padding:"8px 10px",borderBottom:`1px solid ${BORDER}`}}><Chk v={c.tax}/></td><td style={{padding:"8px 10px",borderBottom:`1px solid ${BORDER}`}}><Chk v={c.adv}/></td><td style={{padding:"8px 10px",borderBottom:`1px solid ${BORDER}`}}><Chk v={c.op}/></td><td style={{padding:"8px 10px",borderBottom:`1px solid ${BORDER}`}}>{c.eaas?<span style={{color:GREEN,fontWeight:700}}>✓ SIM</span>:<span style={{color:"#374151"}}>—</span>}</td></tr>)}</tbody></table>
</div>
<div style={{marginTop:16,padding:16,background:"linear-gradient(135deg,rgba(107,127,163,0.15),rgba(59,130,246,0.1))",borderRadius:12,border:`1px solid ${ACCENT}`}}>
<div style={{fontSize:15,fontWeight:700,color:WHITE,marginBottom:6}}>White Space Confirmado</div>
<div style={{fontSize:12,color:TEXT,lineHeight:1.6}}>Nenhum player integra: estruturação societária + executivo fracionado + go-to-market. Escritórios param no advisory. EORs param no payroll. Plataformas EaaS não fazem jurídico. A Lex Experience é o único modelo que cobre as 3 camadas.</div>
</div></div>)}

function Latam(){return(<div>
<Title sub="5 jurisdições lado a lado — linguagem de CEO">Guia LatAm</Title>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:14,marginBottom:20,overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr>{["País","Setup (dias)","Custo (USD)","Encargos","IR Corp.","Facilidade"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 10px",color:TEXT_DIM,borderBottom:`1px solid ${BORDER}`,fontSize:10,textTransform:"uppercase",letterSpacing:0.8}}>{h}</th>)}</tr></thead>
<tbody>{LATAM.map((l,i)=><tr key={i}><td style={{padding:"8px 10px",color:WHITE,borderBottom:`1px solid ${BORDER}`,fontWeight:600}}>{l.c}</td><td style={{padding:"8px 10px",color:TEXT,borderBottom:`1px solid ${BORDER}`}}>{l.setup}</td><td style={{padding:"8px 10px",color:TEXT,borderBottom:`1px solid ${BORDER}`}}>{l.cost}</td><td style={{padding:"8px 10px",color:TEXT,borderBottom:`1px solid ${BORDER}`}}>{l.labor}</td><td style={{padding:"8px 10px",color:TEXT,borderBottom:`1px solid ${BORDER}`}}>{l.tax}</td><td style={{padding:"8px 10px",color:TEXT,borderBottom:`1px solid ${BORDER}`}}>{"⭐".repeat(6-l.ease)}</td></tr>)}</tbody></table>
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
{[{f:"🇨🇱",n:"Chile",r:"#1",d:"Encargos 6-7%, tratados extensos",c:GREEN},{f:"🇨🇴",n:"Colômbia",r:"#2",d:"SAS ágil, 10-30 dias",c:BLUE},{f:"🇲🇽",n:"México",r:"#3",d:"Tratados EUA/EU/JP, ISR 30%",c:AMBER},{f:"🇦🇷",n:"Argentina",r:"#4",d:"SAS rápido, risco cambial",c:"#F97316"},{f:"🇧🇷",n:"Brasil",r:"#5",d:"Maior mercado, mais complexo",c:RED}].map((x,i)=>(
<div key={i} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:14,textAlign:"center",borderTop:`3px solid ${x.c}`}}>
<div style={{fontSize:32,marginBottom:6}}>{x.f}</div>
<div style={{fontSize:13,fontWeight:700,color:WHITE}}>{x.n}</div>
<div style={{fontSize:10,color:x.c,fontWeight:600,margin:"3px 0"}}>{x.r}</div>
<div style={{fontSize:10,color:TEXT_DIM,lineHeight:1.4}}>{x.d}</div>
</div>))}
</div></div>)}

function Metrics(){return(<div>
<Title sub="KPIs operacionais da operação EaaS">Métricas Operacionais</Title>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:24}}>
<KPI label="LTV Médio" value="R$ 650k" sub="30-36 meses" color={GREEN}/>
<KPI label="Renovação" value="60-75%" sub="F2→F3" color={BLUE}/>
<KPI label="Ciclo Venda" value="30-90 dias" sub="Contato → fechamento" color={ACCENT}/>
<KPI label="Margem Jurídico" value="60-75%" color={GREEN}/>
<KPI label="Margem EaaS" value="50-65%" color={AMBER}/>
<KPI label="Margem M&A" value="85-95%" sub="Success fee" color={GREEN}/>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20}}>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 14px"}}>Capacidade / Executivo</h3>
{[{r:"Country Mgr (setup)",c:"1-2"},{r:"Country Mgr (steady)",c:"2-4"},{r:"CFO fracionado",c:"3-5"},{r:"Board Advisor",c:"4-8"}].map((x,i)=>(
<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${BORDER}`}}>
<span style={{fontSize:12,color:TEXT}}>{x.r}</span><span style={{fontSize:12,color:WHITE,fontWeight:600}}>{x.c}</span>
</div>))}
</div>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 14px"}}>Margens por Serviço</h3>
{[{s:"Jurídico societário",m:"60-75%"},{s:"EaaS / Exec Fracionado",m:"50-65%"},{s:"Consultoria Mgmt",m:"55-70%"},{s:"Compliance retainer",m:"65-80%"},{s:"M&A (success fee)",m:"85-95%"}].map((x,i)=>(
<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${BORDER}`}}>
<span style={{fontSize:12,color:TEXT}}>{x.s}</span><span style={{fontSize:12,color:GREEN,fontWeight:600}}>{x.m}</span>
</div>))}
</div>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 14px"}}>Canais (Rank)</h3>
{[{n:"Referral escritórios int'l",r:"#1",c:"Baixo"},{n:"Câmaras (AHK, AmCham, CCFB)",r:"#2",c:"Médio"},{n:"LinkedIn ABM",r:"#3",c:"Baixo"},{n:"Eventos (Web Summit, FBI)",r:"#4",c:"Alto"},{n:"ApexBrasil / SEBRAE",r:"#5",c:"Baixo"}].map((x,i)=>(
<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${BORDER}`,alignItems:"center"}}>
<div><span style={{fontSize:12,color:ACCENT,fontWeight:700,marginRight:6}}>{x.r}</span><span style={{fontSize:12,color:TEXT}}>{x.n}</span></div>
<span style={{fontSize:10,color:TEXT_DIM}}>CAC: {x.c}</span>
</div>))}
</div></div></div>)}

function Simulator(){const[country,setC]=useState("Brasil");const[size,setSz]=useState("Mid-Market");const[ph,setPh]=useState([true,true,true,false]);
const costs={Brasil:{s:35000,m:55000,d:75},México:{s:15000,m:35000,d:35},Colômbia:{s:10000,m:25000,d:20},Chile:{s:12000,m:28000,d:28},Argentina:{s:18000,m:30000,d:22}};
const mult=size==="Enterprise"?2.5:size==="Mid-Market"?1.5:size==="Scale-up"?1:0.6;const co=costs[country];
const pc=[ph[0]?80000*mult:0,ph[1]?co.s*mult*6:0,ph[2]?co.m*mult*12:0,ph[3]?co.m*mult*6:0];const tot=pc.reduce((a,b)=>a+b,0);
return(<div>
<Title sub="Estime o valor de um engagement">Simulador de Proposta</Title>
<div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:20}}>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 16px"}}>Configuração</h3>
<div style={{marginBottom:14}}><label style={{fontSize:11,color:TEXT_DIM,display:"block",marginBottom:4}}>País</label>
<select value={country} onChange={e=>setC(e.target.value)} style={{width:"100%",padding:"7px 10px",background:DARKER,border:`1px solid ${BORDER}`,borderRadius:6,color:WHITE,fontSize:12}}>
{Object.keys(costs).map(c=><option key={c}>{c}</option>)}</select></div>
<div style={{marginBottom:14}}><label style={{fontSize:11,color:TEXT_DIM,display:"block",marginBottom:4}}>Porte</label>
<select value={size} onChange={e=>setSz(e.target.value)} style={{width:"100%",padding:"7px 10px",background:DARKER,border:`1px solid ${BORDER}`,borderRadius:6,color:WHITE,fontSize:12}}>
{["Enterprise","Mid-Market","Scale-up","Startup"].map(s=><option key={s}>{s}</option>)}</select></div>
<div><label style={{fontSize:11,color:TEXT_DIM,display:"block",marginBottom:6}}>Fases</label>
{PHASES.map((p,i)=><label key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 0",cursor:"pointer",fontSize:12,color:ph[i]?WHITE:TEXT_DIM}}>
<input type="checkbox" checked={ph[i]} onChange={()=>{const n=[...ph];n[i]=!n[i];setPh(n)}} style={{accentColor:ACCENT}}/>F{p.id}: {p.name}</label>)}</div>
</div>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 16px"}}>Estimativa</h3>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
<KPI label="Receita Total" value={`R$ ${Math.round(tot/1000)}k`} sub={`USD ${Math.round(tot/6000)}k`} color={GREEN}/>
<KPI label="Prazo Setup" value={`${co.d} dias`} sub={country} color={AMBER}/>
</div>
{PHASES.map((p,i)=>(
<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${BORDER}`,opacity:ph[i]?1:0.3}}>
<span style={{fontSize:12,color:WHITE}}>F{p.id}: {p.name}</span>
<span style={{fontSize:12,color:ph[i]?GREEN:TEXT_DIM,fontWeight:600}}>{ph[i]?`R$ ${Math.round(pc[i]/1000)}k`:"—"}</span>
</div>))}
<div style={{marginTop:16,padding:14,background:"linear-gradient(135deg,rgba(16,185,129,0.1),rgba(59,130,246,0.1))",borderRadius:8,border:`1px solid ${GREEN}`}}>
<div style={{fontSize:11,color:TEXT_DIM}}>TOTAL ENGAGEMENT</div>
<div style={{fontSize:30,fontWeight:700,color:GREEN}}>R$ {tot.toLocaleString("pt-BR")}</div>
<div style={{fontSize:11,color:TEXT_DIM,marginTop:2}}>≈ USD {Math.round(tot/6).toLocaleString("en-US")}</div>
</div></div></div></div>)}

function Playbook(){
const STEPS = [
  {s:1,l:"Câmaras de comércio",i:"🏛️",d:"1° contato para empresas EU/EUA",
   pitch:"Não venda para a câmara — torne-se o especialista técnico dela. Ofereça palestras em comitês (ex: 'Reforma Tributária para empresas entrantes'), escreva artigos para a newsletter, participe de missões de delegação. A AHK faz 200+ eventos/ano com 13.000 participantes. A CCFB tem categoria específica para empresas francesas sem presença local (anuidade R$3-80k). A AmCham reúne 180k executivos em 16 hubs. Sua meta: ser o nome que a câmara menciona quando um membro pergunta 'quem me ajuda a entrar no Brasil?'. Não peça referral exclusivo — construa credibilidade e as indicações vêm organicamente.",
   tip:"Script de approach: 'Gostaríamos de oferecer uma sessão técnica gratuita para seus associados sobre [Reforma Tributária / Market Entry / Mercosul-UE]. Somos escritório especializado em market entry com executivos fracionados — um modelo novo que reduz 70% do custo de entrada.'",
   search:"chambers of commerce Brazil foreign companies market entry events 2025 2026"},
  {s:2,l:"Network pessoal C-suite",i:"🤝",d:"Principal driver de contratação",
   pitch:"O CEO europeu que conhece alguém em São Paulo vale mais que qualquer RFP. Seu trabalho é ESTAR na rede certa. Participe de boards, advisory de aceleradoras, eventos de CEO (CEO Conference da AHK, Fórum AmCham). Cultive relações com managing partners de escritórios internacionais que não têm operação no Brasil — eles são seus melhores referrers. O modelo de referral fee é regulado e legítimo: 10-25% dos honorários, averbado na OAB (art. 15, §9°, COSIT 161/2025).",
   tip:"Script para escritório internacional: 'Quando seus clientes consideram o Brasil, nós oferecemos o que nenhum escritório local oferece: estruturação jurídica completa + um Country Manager fracionado que opera a empresa nos primeiros 12-24 meses. Fee de referral de 15% sobre honorários.'",
   search:"C-suite networking executive referral law firms international partnerships Brazil"},
  {s:3,l:"Consultorias de estratégia",i:"📊",d:"McKinsey/BCG — market assessment para enterprises",
   pitch:"Consultorias de estratégia (McKinsey, BCG, Bain) fazem o market assessment mas NÃO fazem a implementação. Posicione a Lex Experience como o parceiro de execução pós-assessment. Quando o relatório da McKinsey diz 'recomendamos market entry no Brasil', alguém precisa constituir a empresa, contratar o time, e operar. Esse alguém somos nós. Cultive relações com partners de consulting que cobrem LatAm — eles precisam de alguém para indicar na fase de implementação.",
   tip:"Script: 'Sabemos que vocês entregam a estratégia — nós executamos. Da constituição societária ao Country Manager operando no primeiro mês. Podemos ser o parceiro de implementação que vocês indicam quando o cliente decide ir.'",
   search:"management consulting market entry implementation Brazil Latin America McKinsey BCG"},
  {s:4,l:"Big 4 (due diligence)",i:"🔍",d:"Fiscal, legal e operacional",
   pitch:"As Big 4 (Deloitte, PwC, EY, KPMG) fazem due diligence fiscal e legal mas cobram premium e NÃO oferecem executivos fracionados. Posicione a Lex como alternativa para mid-market que não tem budget de Big 4, ou como complemento para enterprises que precisam de execução pós-due diligence. Dado: 21% dos investidores reconhecem que 'falta de diligência adequada' foi o maior erro no último M&A na LatAm (KPMG).",
   tip:"Script para prospect mid-market: 'As Big 4 cobram R$200-500k só pela due diligence. Nós fazemos a diligência jurídica + tributária + constituímos a empresa + colocamos um executivo para operar — tudo por um valor que cabe no orçamento de uma empresa de US$50-200M.'",
   search:"Big 4 due diligence market entry Brazil costs alternatives mid-market 2025"},
  {s:5,l:"RFP formal",i:"📋",d:"Enterprises com governança rígida",
   pitch:"RFPs são comuns em enterprises com governança rígida (board approval). O diferencial da Lex na RFP é ÚNICO: nenhum outro respondente pode oferecer legal + EaaS integrado. Na proposta, destaque o modelo de 4 fases com pricing transparente, flat-fee caps (vs. hourly billing aberto dos Tier 1), e o fato de que o cliente terá UM ponto de contato para tudo — não precisa coordenar escritório + consultoria + recrutador + EOR separadamente.",
   tip:"Na RFP, inclua: (1) Tabela comparativa mostrando que concorrentes cobrem no máximo 3 de 5 serviços, (2) Cronograma visual das 4 fases com marcos, (3) Case study com números reais, (4) Proposta com 3 tiers de preço (básico/standard/premium).",
   search:"RFP process corporate legal services market entry best practices"},
  {s:6,l:"Especialistas market entry",i:"🎯",d:"AQUI ENTRA A LEX EXPERIENCE",
   pitch:"Este é o seu espaço. Quando o cliente chega aqui, ele já decidiu entrar no Brasil e precisa de alguém para FAZER. O pitch é simples: 'Somos o único escritório que integra estruturação jurídica + executivo fracionado + go-to-market operacional. Você contrata a Lex e em 90 dias tem uma empresa constituída com um Country Manager operando.' Diferenciação vs. cada concorrente: vs. escritórios Tier 1 (preço 60% menor + EaaS), vs. EORs (solução permanente + governança), vs. Chiefs.Group (base jurídica + compliance), vs. BizLatinHub (executivo + go-to-market).",
   tip:"Elevator pitch 30 segundos: 'A Lex Experience é o único escritório na América Latina que entrega market entry completo — da constituição societária até o Country Manager operando sua empresa. Nossos clientes pagam 60% menos que um Tier 1 e recebem 3x mais escopo. Em 90 dias, sua empresa está operando no Brasil.'",
   search:"market entry services Brazil integrated legal executive fractional 2025 2026"},
];

const QUESTIONS = [
  {q:"Qual formato jurídico mais adequado (LTDA, SA, filial)?",
   answer:"Para 90% dos casos de market entry, a LTDA (Sociedade Limitada) é a melhor opção. É o equivalente à LLC americana: governança simples, responsabilidade limitada, custo de manutenção menor que a SA. Use SA apenas se planeja levantar capital externo ou abrir capital na B3. Filial é rara — exige autorização federal do DREI, demora 90-180 dias, e a matriz responde integralmente pelas dívidas da filial no Brasil.",
   pitch:"A Lex Experience faz a análise de estrutura como parte da Fase 1 (Pré-Entry). Em 2-3 semanas, entregamos um parecer com a recomendação fundamentada — LTDA vs. SA vs. filial vs. JV — considerando seu setor, origem do capital, planos de M&A futuro, e otimização tributária. Custo: R$10-20k (flat fee, não hourly).",
   search:"Brazil company formation LTDA SA foreign subsidiary 2025 2026 best structure"},
  {q:"Quanto tempo e custo para estar operacional?",
   answer:"LTDA com sócio estrangeiro: 60-90 dias, custo jurídico R$15-50k + taxas. O gargalo real é a Junta Comercial (2-8 semanas) + abertura de conta bancária (2-10 semanas). Para estar PLENAMENTE operacional (emitindo NF, contratando, faturando), conte 4-6 meses no total. Filial: 90-180 dias, R$30-100k+.",
   pitch:"A Lex Experience garante um cronograma com marcos definidos. Diferente de escritórios que cobram por hora sem compromisso de prazo, nós trabalhamos com flat-fee e SLA: constituição em 60 dias ou comunicamos o impedimento com antecedência. Nosso pacote F2 (Setup): R$30-80k tudo incluso.",
   search:"how long open company Brazil foreign investor 2025 2026 timeline cost"},
  {q:"Quais são os riscos regulatórios específicos do nosso setor?",
   answer:"Depende do setor. Fintech: licença do BC (90-180 dias). Pharma: registro ANVISA (12-24 meses). Energia: concessão ANEEL + licença ambiental. Agro: registros fitossanitários. Tech/SaaS: sem licença especial, mas LGPD é crítica. O erro mais comum é subestimar o prazo regulatório — empresas planejam 3 meses e levam 12+.",
   pitch:"Na Fase 1, fazemos o Regulatory Landscape Analysis completo do seu setor em 2-4 semanas. Mapeamos TODOS os órgãos reguladores, licenças necessárias, prazos reais (não os prazos legais, os prazos de verdade), e custos. Você recebe um roadmap regulatório antes de comprometer capital. R$10-30k.",
   search:"Brazil regulatory requirements by sector fintech pharma energy agtech 2025 2026"},
  {q:"Podem contratar por nós antes do CNPJ?",
   answer:"Sim, via duas opções: (1) EOR (Employer of Record) — uma plataforma como Deel ou Remote contrata o profissional usando sua entidade local, enquanto você constitui a empresa. Funciona para contratações operacionais. (2) Contrato de prestação de serviços PJ — se o profissional for PJ, pode começar a prestar serviços sob contrato antes do CNPJ. Mas atenção: para funções comerciais (vender, faturar clientes), você PRECISA do CNPJ.",
   pitch:"A Lex Experience oferece um modelo único: na Fase 2, enquanto constituímos sua empresa (60-90 dias), já alocamos um Country Manager fracionado que começa a operar via contrato PJ com a nossa consultoria. Quando o CNPJ sai, transferimos. Zero tempo perdido. Nenhum concorrente oferece isso.",
   search:"hire employees Brazil before company registration EOR PJ contractor 2025"},
  {q:"Como estruturar o reporting para a matriz?",
   answer:"O reporting para a matriz precisa cobrir 4 dimensões: (1) Financeiro — P&L mensal em IFRS/US GAAP, reconciliado com a contabilidade brasileira (BR GAAP). (2) Tributário — status de obrigações acessórias, posição de IRPJ/CSLL, PIS/COFINS, ISS. (3) Trabalhista — headcount, custo por FTE, obrigações eSocial. (4) Regulatório — status de licenças e compliance setorial.",
   pitch:"O CFO fracionado da Lex Experience faz exatamente isso. Ele prepara o reporting mensal no formato que sua matriz exige — em inglês, em IFRS, com dashboard executivo. Seu CFO global recebe um pacote pronto, não precisa decifrar contabilidade brasileira. Isso é um dos maiores diferenciais: nenhum escritório de advocacia entrega reporting financeiro.",
   search:"financial reporting foreign subsidiary Brazil IFRS US GAAP compliance 2025"},
  {q:"Custo total de um Country Manager local?",
   answer:"Country Manager full-time CLT no Brasil: salário R$21-60k/mês + encargos trabalhistas ~70% + benefícios = custo total R$35-100k/mês (R$420k-1,2M/ano). Country Manager fracionado via Lex Experience: R$15-35k/mês retainer PJ, sem encargos, sem benefícios, sem risco trabalhista. Economia: 50-70%.",
   pitch:"Um Country Manager fracionado da Lex custa R$15-35k/mês — versus R$35-100k/mês de um full-time com encargos. Mas a economia não é o principal argumento: é que nos primeiros 12 meses, você NÃO PRECISA de um executivo full-time. Precisa de alguém sênior 2-3 dias por semana que conhece o mercado, fala com reguladores, e abre portas. Quando a operação justificar, nós mesmos recrutamos o permanente (Fase 4).",
   search:"country manager Brazil cost salary fractional vs full time 2025 2026"},
  {q:"Tributação de remessa de royalties e dividendos?",
   answer:"Dividendos: isentos de IR na remessa para o exterior (lei atual). Atenção: a reforma tributária pode alterar isso. Royalties: tributação na fonte de 15% (IRRF) para países sem tratado, podendo ser reduzida para 10-12,5% com tratado de bitributação. O Brasil NÃO tem tratado com EUA — royalties para matrizes americanas pagam 15% na fonte. Tem tratado com Japão, e reciprocidade com vários países europeus. Transfer pricing: regras novas alinhadas à OCDE entraram em vigor em 2024.",
   pitch:"A Lex Experience estrutura o planejamento tributário completo na Fase 1, incluindo: melhor veículo para remessas (dividendos vs. royalties vs. serviços intercompany), aproveitamento de tratados de bitributação, e compliance com as novas regras de transfer pricing (OCDE). Nosso CFO fracionado na Fase 3 executa esse planejamento na prática — garantindo que sua matriz não pague mais imposto do que deveria.",
   search:"Brazil dividend royalty remittance tax withholding transfer pricing 2025 2026"},
];

const [openStep, setOpenStep] = useState(null);
const [openQ, setOpenQ] = useState(null);

const openPbPerplexity = (query) => {
  window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(query)}&focus=internet`, '_blank');
};

return(<div>
<Title sub="Clique em cada etapa para ver o sales pitch e buscar notícias ao vivo">Playbook de Vendas</Title>

{/* SEQUÊNCIA DE COMPRA */}
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20,marginBottom:20}}>
<h3 style={{fontSize:15,color:WHITE,margin:"0 0 14px"}}>Sequência de Compra — <span style={{fontSize:11,fontWeight:400,color:TEXT_DIM}}>clique para sales pitch + notícias</span></h3>
{STEPS.map((x,i)=>(
<div key={i}>
<div onClick={()=>{setOpenStep(openStep===i?null:i);setOpenQ(null)}} style={{display:"flex",gap:10,padding:"10px 8px",borderBottom:`1px solid ${BORDER}`,alignItems:"center",cursor:"pointer",background:openStep===i?"rgba(107,127,163,0.08)":"transparent",borderRadius:openStep===i?8:0,transition:"all 0.15s"}}>
<div style={{width:30,height:30,background:x.s===6?ACCENT:openStep===i?"rgba(107,127,163,0.2)":DARKER,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{x.i}</div>
<div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:x.s===6?GREEN:openStep===i?WHITE:TEXT}}>{x.s}. {x.l}</div><div style={{fontSize:10,color:TEXT_DIM,marginTop:1}}>{x.d}</div></div>
<span style={{fontSize:9,color:openStep===i?ACCENT:TEXT_DIM}}>▾ PITCH</span>
</div>
{openStep===i&&(
<div style={{padding:16,background:DARKER,borderRadius:"0 0 10px 10px",border:`1px solid ${BORDER}`,borderTop:"none",marginBottom:8}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
<div style={{padding:14,background:"rgba(107,127,163,0.08)",borderRadius:8,borderLeft:`3px solid ${ACCENT}`}}>
<div style={{fontSize:11,color:ACCENT,fontWeight:700,marginBottom:6}}>COMO ABORDAR</div>
<div style={{fontSize:12,color:TEXT,lineHeight:1.7}}>{x.pitch}</div>
</div>
<div style={{padding:14,background:"rgba(16,185,129,0.08)",borderRadius:8,borderLeft:`3px solid ${GREEN}`}}>
<div style={{fontSize:11,color:GREEN,fontWeight:700,marginBottom:6}}>SCRIPT / FRASE-CHAVE</div>
<div style={{fontSize:12,color:TEXT,lineHeight:1.7,fontStyle:"italic"}}>{x.tip}</div>
</div>
</div>
<button onClick={()=>openPbPerplexity(x.search)} style={{padding:"8px 16px",background:ACCENT,border:"none",borderRadius:6,color:WHITE,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:6}}>
<Globe size={13}/>Pesquisar no Perplexity
</button>
</div>)}
</div>))}
</div>

{/* PERGUNTAS DO COMPRADOR */}
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20,marginBottom:20}}>
<h3 style={{fontSize:15,color:WHITE,margin:"0 0 14px"}}>Perguntas do Comprador — <span style={{fontSize:11,fontWeight:400,color:TEXT_DIM}}>clique para resposta + pitch da Lex</span></h3>
{QUESTIONS.map((x,i)=>(
<div key={i}>
<div onClick={()=>{setOpenQ(openQ===i?null:i);setOpenStep(null)}} style={{display:"flex",gap:8,padding:"10px 8px",borderBottom:`1px solid ${BORDER}`,alignItems:"center",cursor:"pointer",background:openQ===i?"rgba(107,127,163,0.08)":"transparent",borderRadius:openQ===i?8:0,transition:"all 0.15s"}}>
<ChevronRight size={14} color={openQ===i?ACCENT:TEXT_DIM} style={{flexShrink:0,transform:openQ===i?"rotate(90deg)":"none",transition:"transform 0.15s"}}/>
<span style={{fontSize:13,color:openQ===i?WHITE:TEXT,fontWeight:openQ===i?600:400}}>{x.q}</span>
</div>
{openQ===i&&(
<div style={{padding:16,background:DARKER,borderRadius:"0 0 10px 10px",border:`1px solid ${BORDER}`,borderTop:"none",marginBottom:8}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
<div style={{padding:14,background:"rgba(59,130,246,0.08)",borderRadius:8,borderLeft:`3px solid ${BLUE}`}}>
<div style={{fontSize:11,color:BLUE,fontWeight:700,marginBottom:6}}>RESPOSTA TÉCNICA</div>
<div style={{fontSize:12,color:TEXT,lineHeight:1.7}}>{x.answer}</div>
</div>
<div style={{padding:14,background:"rgba(16,185,129,0.08)",borderRadius:8,borderLeft:`3px solid ${GREEN}`}}>
<div style={{fontSize:11,color:GREEN,fontWeight:700,marginBottom:6}}>SALES PITCH — COMO A LEX RESOLVE</div>
<div style={{fontSize:12,color:TEXT,lineHeight:1.7}}>{x.pitch}</div>
</div>
</div>
<button onClick={()=>openPbPerplexity(x.search)} style={{padding:"8px 16px",background:BLUE,border:"none",borderRadius:6,color:WHITE,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:6}}>
<Globe size={13}/>Pesquisar no Perplexity
</button>
</div>)}
</div>))}
</div>

{/* MODELO DUAL ENTITY */}
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:15,color:WHITE,margin:"0 0 14px"}}>Modelo Dual Entity (OAB-Compliant)</h3>
<div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:14,alignItems:"start"}}>
<div style={{padding:16,background:DARKER,borderRadius:10,border:`1px solid ${ACCENT}`}}>
<div style={{fontSize:13,fontWeight:700,color:ACCENT,marginBottom:6}}>Entidade A — Soc. Advogados (OAB)</div>
<div style={{fontSize:11,color:TEXT,lineHeight:1.6}}>• F1: Regulatory + Tax Advisory<br/>• F2: Constituição societária, contratos<br/>• Referral fees (art. 15, §9°)<br/>• Success fee jurídico (art. 22, §4°)</div>
</div>
<div style={{display:"flex",alignItems:"center",paddingTop:40}}><ArrowRight size={20} color={ACCENT}/></div>
<div style={{padding:16,background:DARKER,borderRadius:10,border:`1px solid ${GREEN}`}}>
<div style={{fontSize:13,fontWeight:700,color:GREEN,marginBottom:6}}>Entidade B — Consultoria Ltda</div>
<div style={{fontSize:11,color:TEXT,lineHeight:1.6}}>• F1: Market assessment, financial modeling<br/>• F3: EaaS — Country Manager, CFO, GTM<br/>• F4: Scale, M&A advisory<br/>• Success fee comercial sem restrição OAB</div>
</div></div></div></div>)}

function AI(){
const [input,setInput]=useState("");
const QUICK = [
  {label:"Market entry Brasil 2026",q:"market entry Brazil 2026 latest news companies",color:GREEN},
  {label:"Nearshoring América Latina",q:"nearshoring Latin America supply chain 2025 2026",color:BLUE},
  {label:"Acordo Mercosul-UE impacto",q:"Mercosul EU agreement trade impact 2026 sectors",color:AMBER},
  {label:"Fractional executives Brasil",q:"fractional executive Brazil market 2025 2026 Chiefs Group",color:"#8B5CF6"},
  {label:"Reforma tributária CBS IBS",q:"Brazil tax reform CBS IBS dual VAT 2026 impact companies",color:RED},
  {label:"FDI Brasil setores",q:"foreign direct investment Brazil sectors 2025 2026",color:ACCENT},
  {label:"IEEPA tarifas impacto LatAm",q:"IEEPA tariffs Latin America impact 2025 2026",color:"#F97316"},
  {label:"Energia renovável investimento BR",q:"renewable energy investment Brazil 2025 2026 companies",color:GREEN},
  {label:"Fintech market entry Brasil",q:"fintech market entry Brazil 2025 2026 regulation",color:"#EC4899"},
  {label:"Honorários advocacia Brasil",q:"law firm fees Brazil hourly rate Chambers Legal 500 2025",color:ACCENT},
];
const search = (q) => window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(q)}&focus=internet`,'_blank');
const searchCustom = () => { if(input.trim()) { search(input.trim()); setInput(""); } };

return(<div>
<Title sub="Pesquise qualquer tema no Perplexity — sua assinatura Pro, zero custo adicional">Central de Pesquisa</Title>

<div style={{display:"flex",gap:6,marginBottom:20}}>
<input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&searchCustom()} placeholder="Digite qualquer pergunta e pesquise no Perplexity..." style={{flex:1,padding:"12px 16px",background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,color:WHITE,fontSize:13,outline:"none"}}/>
<button onClick={searchCustom} style={{padding:"12px 20px",background:ACCENT,border:"none",borderRadius:8,color:WHITE,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:600}}><Globe size={14}/>Pesquisar</button>
</div>

<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20,marginBottom:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 16px"}}>Pesquisas Rápidas — 1 clique, abre no Perplexity</h3>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
{QUICK.map((q,i)=>(
<button key={i} onClick={()=>search(q.q)} style={{padding:"12px 16px",background:DARKER,border:`1px solid ${BORDER}`,borderRadius:8,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,transition:"all 0.15s"}}>
<Globe size={14} color={q.color}/>
<span style={{fontSize:12,color:WHITE,fontWeight:500}}>{q.label}</span>
</button>
))}
</div>
</div>

<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
<h3 style={{fontSize:13,color:TEXT_DIM,textTransform:"uppercase",letterSpacing:1,margin:"0 0 16px"}}>Abrir ferramentas de pesquisa</h3>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
{[
  {name:"Perplexity Pro",url:"https://www.perplexity.ai",desc:"Pesquisa com AI + fontes",color:"#20B8CD"},
  {name:"Claude.ai",url:"https://claude.ai",desc:"Análise e síntese de dados",color:ACCENT},
  {name:"Gemini",url:"https://gemini.google.com",desc:"Deep Research",color:"#4285F4"},
  {name:"Chambers & Partners",url:"https://chambers.com/legal-guide/brazil-95",desc:"Rankings jurídicos Brasil",color:AMBER},
  {name:"Legal 500 Brasil",url:"https://www.legal500.com/c/brazil/",desc:"Rankings e análises",color:GREEN},
  {name:"BCB Setor Externo",url:"https://www.bcb.gov.br/estatisticas/estatisticassetorexterno",desc:"Dados IDP oficiais",color:BLUE},
].map((t,i)=>(
<a key={i} href={t.url} target="_blank" rel="noopener noreferrer" style={{padding:"14px 16px",background:DARKER,border:`1px solid ${BORDER}`,borderRadius:8,textDecoration:"none",display:"block",transition:"all 0.15s"}}>
<div style={{fontSize:13,color:WHITE,fontWeight:600,marginBottom:3}}>{t.name}</div>
<div style={{fontSize:10,color:TEXT_DIM}}>{t.desc}</div>
</a>
))}
</div>
</div>
</div>)}

const PAGES={overview:Overview,market:Market,buyers:Buyers,offers:Offers,competitors:Competitors,latam:Latam,metrics:Metrics,simulator:Simulator,playbook:Playbook,ai:AI};

export default function App(){const[page,setPage]=useState("overview");const[sb,setSb]=useState(true);const P=PAGES[page];
return(<>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif&display=swap" rel="stylesheet"/>
<div style={{display:"flex",height:"100vh",background:DARK,color:TEXT,fontFamily:"'DM Sans',sans-serif",overflow:"hidden"}}>
<div style={{width:sb?200:54,background:DARKER,borderRight:`1px solid ${BORDER}`,display:"flex",flexDirection:"column",transition:"width 0.2s",flexShrink:0,overflow:"hidden"}}>
<div style={{padding:sb?"16px 14px":"16px 10px",borderBottom:`1px solid ${BORDER}`,display:"flex",alignItems:"center",gap:10,minHeight:56}}>
<button onClick={()=>setSb(!sb)} style={{background:"none",border:"none",color:TEXT,cursor:"pointer",padding:2}}>{sb?<X size={16}/>:<Menu size={16}/>}</button>
{sb&&<div><img src="/logo.png" alt="Lex Experience" style={{height:28,marginBottom:4,filter:"brightness(1.8)"}}/><div style={{fontSize:8,color:TEXT_DIM,letterSpacing:1.5,textTransform:"uppercase"}}>COO Command Center</div></div>}
</div>
<nav style={{flex:1,padding:"10px 6px",overflowY:"auto"}}>{NAV.map(item=>{const Icon=item.icon;const a=page===item.id;return(
<button key={item.id} onClick={()=>setPage(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:sb?"8px 10px":"8px",background:a?"rgba(107,127,163,0.15)":"transparent",border:"none",borderRadius:6,color:a?WHITE:TEXT_DIM,cursor:"pointer",fontSize:12,fontWeight:a?600:400,marginBottom:1,textAlign:"left",borderLeft:a?`3px solid ${ACCENT}`:"3px solid transparent",justifyContent:sb?"flex-start":"center"}}>
<Icon size={14}/>{sb&&item.label}</button>)})}</nav>
{sb&&<div style={{padding:"10px 14px",borderTop:`1px solid ${BORDER}`,fontSize:9,color:TEXT_DIM}}>EaaS Intelligence Project<br/>Gemini + Perplexity → Claude</div>}
</div>
<div style={{flex:1,overflowY:"auto",padding:"20px 28px"}}><P/></div>
</div></>);}
