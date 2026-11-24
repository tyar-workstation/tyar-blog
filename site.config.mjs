// Configurações do blog. Altere aqui domínio, nome e IDs de rastreamento.
export default {
  name: "Blog Tyar",
  tagline: "Guias técnicos sobre IA, workstations, servidores, storage e media servers",
  // Endereço final do blog (sem barra no fim). Ex.: https://blog.tyar.com.br ou https://tyar.com.br/blog
  siteUrl: process.env.SITE_URL || "https://blog.tyar.com.br",
  // Caminho base quando o blog fica numa subpasta (ex.: "/blog"). Deixe "" para subdomínio.
  basePath: process.env.BASE_PATH || "",
  mainSite: "https://tyar.com.br",
  // ID do Google Tag Manager (ex.: GTM-XXXXXXX). Se preenchido, é usado no lugar do GA4 direto.
  gtmId: process.env.GTM_ID || "GTM-P5QS7MMQ",
  // ID do Google Analytics 4 (ex.: G-XXXXXXX). Vazio = sem rastreamento.
  ga4Id: process.env.GA4_ID || "",
  // Verificação do Google Search Console (conteúdo da meta tag). Opcional.
  gscVerification: process.env.GSC_VERIFICATION || "",
  contactUrl: "https://wa.me/5511937550088",
  org: {
    name: "Tyar",
    url: "https://tyar.com.br",
    phone: "+55 11 3335-6000",
    email: "contato@tyar.com.br",
    address: "Rua Manoel Coelho, 676, sala 1206/1207 – São Caetano do Sul, SP",
    sameAs: [
      "https://www.instagram.com/tyar_oficial",
      "https://www.facebook.com/tyaroficial",
      "https://www.linkedin.com/company/tyar",
    ],
  },
  nav: [
    { label: "Inteligência Artificial", href: "https://tyar.com.br/produtos/inteligencia-artificial" },
    { label: "Workstations", href: "https://tyar.com.br/produtos/workstations" },
    { label: "Servidores", href: "https://tyar.com.br/produtos/servidores" },
    { label: "Storage", href: "https://tyar.com.br/produtos/storage" },
    { label: "Cases", href: "https://tyar.com.br/cases" },
  ],
};
