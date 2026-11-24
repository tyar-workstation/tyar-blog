// Gera o blog estático em dist/ a partir de content/posts/*.md
// Uso: npm run build
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import cfg from "../site.config.mjs";
import { renderCovers } from "./covers.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const POSTS_DIR = path.join(ROOT, "content/posts");
const OUT = path.join(ROOT, "dist");
const SITE = cfg.siteUrl.replace(/\/$/, "") + cfg.basePath;
fs.rmSync(OUT, { recursive: true, force: true });

// ---------- utilidades ----------
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slugify = (s) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fmtDate = (d) =>
  new Date(d + "T12:00:00-03:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
const write = (rel, content) => {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
};
const jsonld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

// ---------- leitura e validação dos posts ----------
const REQUIRED = ["title", "slug", "description", "date", "category", "focus_keyword"];
const errors = [];
// nomes antigos de categoria → nome padrão
const CATEGORY_ALIAS = { "Cluster/HPC": "Cluster", "Decisão de compra/TCO": "Decisão de compra" };
const posts = fs
  .readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    if (CATEGORY_ALIAS[data.category]) data.category = CATEGORY_ALIAS[data.category];
    for (const k of REQUIRED) if (!data[k]) errors.push(`${file}: campo obrigatório ausente "${k}"`);
    if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) errors.push(`${file}: slug inválido "${data.slug}"`);
    if (data.description && data.description.length > 160)
      console.warn(`aviso: ${file}: description com ${data.description.length} caracteres (ideal ≤ 155)`);
    // remove o H1 do corpo: o título é renderizado pelo template
    const body = content.replace(/^\s*#\s+.+\n/, "");
    const date = String(data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date);
    return { ...data, date, file, html: marked.parse(body, { breaks: true }), catSlug: slugify(data.category || "geral") };
  })
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));

const seen = new Set();
for (const p of posts) {
  if (seen.has(p.slug)) errors.push(`slug duplicado: ${p.slug}`);
  seen.add(p.slug);
}
if (errors.length) {
  console.error("Erros nos artigos:\n- " + errors.join("\n- "));
  process.exit(1);
}

const categories = [...new Map(posts.map((p) => [p.catSlug, p.category])).entries()].map(([slug, name]) => ({
  slug,
  name,
  count: posts.filter((p) => p.catSlug === slug).length,
}));

// ---------- template ----------
const LOGO = fs.readFileSync(path.join(ROOT, "public/logo.svg"), "utf8").replace(/id="g"/, 'id="lg"').replace(/url\(#g\)/, "url(#lg)");
const CAT_CODE = {
  "inteligencia-artificial": "IA",
  workstations: "WS",
  servidores: "SRV",
  storage: "STO",
  "mediaserver-watchout": "WO",
  cluster: "HPC",
  "cluster-hpc": "HPC",
};
const catCode = (slug) => CAT_CODE[slug] || slug.split("-").map((w) => w[0]).join("").slice(0, 3).toUpperCase();
const CAT_HUE = { "inteligencia-artificial": 280, workstations: 262, servidores: 250, storage: 300, "mediaserver-watchout": 318, cluster: 238 };
const catHue = (slug) => CAT_HUE[slug] ?? 275;

// Acrescenta ids nos H2 (sumário) e destaca o "Resumo rápido"
function enhance(html) {
  const toc = [];
  const used = new Set();
  html = html.replace(/<h2>(.*?)<\/h2>/g, (_, inner) => {
    const text = inner.replace(/<[^>]+>/g, "");
    let id = slugify(text) || "secao";
    while (used.has(id)) id += "-2";
    used.add(id);
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  html = html.replace(
    /<h2 id="([^"]+)">(Resumo rápido)<\/h2>\s*(<ul>[\s\S]*?<\/ul>)/,
    '<aside class="tldr" aria-labelledby="$1"><h2 id="$1">$2</h2>$3</aside>'
  );
  // tabelas roláveis no celular
  html = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, "</table></div>");
  return { html, toc };
}

function layout({ depth, title, description, canonical, body, head = "", ogType = "website", progress = false, image = "" }) {
  const r = depth === -1 ? (cfg.basePath || "") + "/" : depth === 0 ? "./" : "../".repeat(depth);
  const ga = cfg.gtmId
    ? `<script>window.dataLayer=window.dataLayer||[];(function(w,d,s,l,i){w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${cfg.gtmId}');
document.addEventListener('click',function(e){var a=e.target.closest('a[data-cta]');if(a)dataLayer.push({event:'cta_click',cta:a.dataset.cta,page_path:location.pathname});});</script>`
    : cfg.ga4Id
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${cfg.ga4Id}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${cfg.ga4Id}');
document.addEventListener('click',function(e){var a=e.target.closest('a[data-cta]');if(a)gtag('event','cta_click',{cta:a.dataset.cta,page:location.pathname});});</script>`
    : "";
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="theme-color" content="#0d0d0d">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="${esc(cfg.name)}">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
${image ? `<meta property="og:image" content="${image}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta name="twitter:image" content="${image}">` : ""}
${cfg.gscVerification ? `<meta name="google-site-verification" content="${esc(cfg.gscVerification)}">` : ""}
<link rel="alternate" type="application/rss+xml" title="${esc(cfg.name)}" href="${SITE}/rss.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap">
<link rel="stylesheet" href="${r}style.css">
${head}
${ga}
</head>
<body>
${cfg.gtmId ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${cfg.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : ""}
${progress ? '<div class="progress" aria-hidden="true"><span id="progress"></span></div>' : ""}
<header class="top">
  <div class="wrap top-in">
    <a class="brand" href="${r}" aria-label="Blog Tyar – início">${LOGO}<span class="brand-tag">Blog</span></a>
    <nav class="nav" aria-label="Soluções Tyar">${cfg.nav.map((n) => `<a href="${n.href}">${esc(n.label)}</a>`).join("")}</nav>
    <a class="btn btn-sm" data-cta="header" href="${cfg.contactUrl}" rel="noopener">Entre em contato</a>
  </div>
</header>
<main>${body}</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot-top">
      <div class="foot-brand">${LOGO}<p>Soluções de alta performance. Projeto, configuração, entrega e suporte.</p></div>
      <dl class="stats">
        <div><dt>+25</dt><dd>anos de experiência</dd></div>
        <div><dt>+3.600</dt><dd>projetos realizados</dd></div>
        <div><dt>+18.700</dt><dd>máquinas entregues</dd></div>
      </dl>
    </div>
    <div class="foot-bottom">
      <span>${esc(cfg.org.address)}</span>
      <span>${cfg.org.phone} · ${cfg.org.email}</span>
      <span><a href="${cfg.mainSite}">tyar.com.br</a> · <a href="${r}rss.xml">RSS</a></span>
    </div>
  </div>
</footer>
${progress ? `<script>(function(){var b=document.getElementById('progress'),a=document.querySelector('.prose');if(!b||!a)return;function u(){var r=a.getBoundingClientRect(),h=r.height-innerHeight;b.style.transform='scaleX('+Math.min(1,Math.max(0,-r.top/(h>0?h:1)))+')'}addEventListener('scroll',u,{passive:true});u();
var links=[].slice.call(document.querySelectorAll('.toc a'));if('IntersectionObserver' in window&&links.length){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'0px 0px -70% 0px'});document.querySelectorAll('.prose h2[id]').forEach(function(h){io.observe(h)})}})();</script>` : ""}
</body>
</html>`;
}

const thumb = (p, r) =>
  `<div class="thumb"><img src="${r}capas/${p.slug}.svg" alt="" width="1200" height="630" loading="lazy" decoding="async"></div>`;

const card = (p, r) => `<article class="card">
  <a class="card-link" href="${r}${p.slug}/" aria-label="${esc(p.title)}"></a>
  ${thumb(p, r)}
  <div class="card-body">
    <span class="pill">${esc(p.category)}</span>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.description)}</p>
    <div class="meta"><time datetime="${p.date}">${fmtDate(p.date)}</time>${p.reading_time ? `<span>${p.reading_time} min de leitura</span>` : ""}</div>
  </div>
</article>`;

const catBar = (r, active) => `<nav class="cats" aria-label="Categorias">
  <a href="${r}" class="${active ? "" : "on"}">Todos <span>${posts.length}</span></a>
  ${categories.map((c) => `<a href="${r}categoria/${c.slug}/" class="${active === c.slug ? "on" : ""}">${esc(c.name)} <span>${c.count}</span></a>`).join("")}
</nav>`;

renderCovers({ posts, outDir: path.join(OUT, "capas"), root: ROOT, hueOf: catHue, logoSvg: LOGO });

// ---------- página inicial ----------
const [featured, ...rest] = posts;
write(
  "index.html",
  layout({
    depth: 0,
    title: `${cfg.name} – ${cfg.tagline}`,
    description: `${cfg.tagline}. Conteúdo técnico da Tyar, com mais de 25 anos projetando hardware de alta performance no Brasil.`,
    canonical: `${SITE}/`,
    image: featured ? `${SITE}/capas/${featured.slug}.png` : "",
    head: jsonld({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${cfg.org.url}/#org`,
          name: cfg.org.name,
          url: cfg.org.url,
          telephone: cfg.org.phone,
          email: cfg.org.email,
          address: { "@type": "PostalAddress", streetAddress: cfg.org.address, addressCountry: "BR" },
          sameAs: cfg.org.sameAs,
        },
        { "@type": "Blog", "@id": `${SITE}/#blog`, name: cfg.name, url: `${SITE}/`, inLanguage: "pt-BR", publisher: { "@id": `${cfg.org.url}/#org` } },
      ],
    }),
    body: `<section class="hero">
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="eyebrow">Blog Tyar</p>
      <h1>Hardware de alta performance, explicado por quem monta.</h1>
      <p class="lead">Guias práticos sobre IA, workstations, servidores, storage e media servers, para dimensionar, comparar e comprar melhor.</p>
    </div>
    ${
      featured
        ? `<article class="feature">
      <a class="card-link" href="./${featured.slug}/" aria-label="${esc(featured.title)}"></a>
      ${thumb(featured, "./")}
      <div class="feature-body">
        <span class="pill">Mais recente · ${esc(featured.category)}</span>
        <h2>${esc(featured.title)}</h2>
        <p>${esc(featured.description)}</p>
        <span class="read-more">Ler artigo <span aria-hidden="true">→</span></span>
      </div>
    </article>`
        : ""
    }
  </div>
</section>
<section class="wrap list">
  <div class="list-head"><h2>Todos os artigos</h2>${catBar("./", null)}</div>
  <div class="grid">${(rest.length ? rest : posts).map((p) => card(p, "./")).join("")}</div>
</section>`,
  })
);

// ---------- páginas de categoria ----------
for (const c of categories) {
  const r = "../../";
  write(
    `categoria/${c.slug}/index.html`,
    layout({
      depth: 2,
      title: `${c.name} – ${cfg.name}`,
      description: `Artigos técnicos da Tyar sobre ${c.name}: guias, comparativos e dicas para escolher a solução certa.`,
      canonical: `${SITE}/categoria/${c.slug}/`,
      body: `<section class="hero hero-sm"><div class="wrap">
  <p class="eyebrow"><a href="${r}">Blog</a> / Categoria</p>
  <h1>${esc(c.name)}</h1>
  <p class="lead">${c.count} ${c.count === 1 ? "artigo" : "artigos"} sobre ${esc(c.name.toLowerCase())}.</p>
</div></section>
<section class="wrap list">
  <div class="list-head">${catBar(r, c.slug)}</div>
  <div class="grid">${posts.filter((p) => p.catSlug === c.slug).map((p) => card(p, r)).join("")}</div>
</section>`,
    })
  );
}

// ---------- artigos ----------
for (const p of posts) {
  const r = "../";
  const url = `${SITE}/${p.slug}/`;
  const { html, toc } = enhance(p.html);
  const related = posts
    .filter((x) => x.slug !== p.slug)
    .sort((a, b) => (b.catSlug === p.catSlug) - (a.catSlug === p.catSlug))
    .slice(0, 3);
  const faq = Array.isArray(p.faq) ? p.faq : [];
  const graph = [
    {
      "@type": "BlogPosting",
      headline: p.title,
      image: `${SITE}/capas/${p.slug}.png`,
      description: p.description,
      datePublished: p.date,
      dateModified: p.updated || p.date,
      inLanguage: "pt-BR",
      mainEntityOfPage: url,
      url,
      keywords: [p.focus_keyword, ...(p.tags || [])].join(", "),
      articleSection: p.category,
      author: { "@type": "Organization", name: p.author || "Equipe Tyar", url: cfg.org.url },
      publisher: { "@type": "Organization", name: cfg.org.name, url: cfg.org.url },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: p.category, item: `${SITE}/categoria/${p.catSlug}/` },
        { "@type": "ListItem", position: 3, name: p.title, item: url },
      ],
    },
  ];
  if (faq.length)
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });

  const tocItems = toc.filter((t) => !/^resumo/i.test(t.text));
  write(
    `${p.slug}/index.html`,
    layout({
      depth: 1,
      progress: true,
      title: `${p.title} | Tyar`,
      description: p.description,
      canonical: url,
      ogType: "article",
      image: `${SITE}/capas/${p.slug}.png`,
      head: `<meta property="article:published_time" content="${p.date}">
<meta property="article:section" content="${esc(p.category)}">
${jsonld({ "@context": "https://schema.org", "@graph": graph })}`,
      body: `<header class="post-head" style="--h:${catHue(p.catSlug)}">
  <div class="wrap post-head-in">
    <div class="post-head-text">
    <nav class="crumbs" aria-label="Você está em"><a href="${r}">Blog</a><span>/</span><a href="${r}categoria/${p.catSlug}/">${esc(p.category)}</a></nav>
    <h1>${esc(p.title)}</h1>
    <p class="lead">${esc(p.description)}</p>
    <div class="meta"><span>${esc(p.author || "Equipe Tyar")}</span><time datetime="${p.date}">${fmtDate(p.date)}</time>${p.reading_time ? `<span>${p.reading_time} min de leitura</span>` : ""}</div>
    </div>
    <figure class="post-cover"><img src="${r}capas/${p.slug}.svg" alt="" width="1200" height="630"></figure>
  </div>
</header>
<div class="wrap post-layout">
  <article class="post">
    <div class="prose">${html}</div>
    ${faq.length ? `<section class="faq" aria-labelledby="faq"><h2 id="faq">Perguntas frequentes</h2>${faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</section>` : ""}
    <aside class="cta">
      <div>
        <p class="eyebrow">Fale com a Tyar</p>
        <h2>Precisa dimensionar seu projeto?</h2>
        <p>Nossos especialistas configuram a solução certa para sua carga de trabalho e seu orçamento, com suporte depois da entrega.</p>
      </div>
      <div class="cta-btns">
        <a class="btn" data-cta="especialista" href="${cfg.contactUrl}" rel="noopener">Falar com especialista</a>
        ${p.cta_product ? `<a class="btn btn-ghost" data-cta="produto" href="${p.cta_product}">Ver soluções</a>` : ""}
      </div>
    </aside>
  </article>
  ${
    tocItems.length > 2
      ? `<aside class="toc" aria-label="Neste artigo"><p class="toc-title">Neste artigo</p><ol>${tocItems.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join("")}</ol>
    <a class="toc-cta" data-cta="sumario" href="${cfg.contactUrl}" rel="noopener"><strong>Dúvida sobre o seu caso?</strong><span>Fale com um especialista →</span></a></aside>`
      : ""
  }
</div>
${related.length ? `<section class="wrap list related"><div class="list-head"><h2>Continue lendo</h2></div><div class="grid">${related.map((x) => card(x, r)).join("")}</div></section>` : ""}`,
    })
  );
}

// ---------- 404 ----------
write(
  "404.html",
  layout({
    depth: -1,
    title: "Página não encontrada – Blog Tyar",
    description: "Página não encontrada.",
    canonical: `${SITE}/`,
    body: `<section class="hero hero-sm"><div class="wrap"><p class="eyebrow">Erro 404</p><h1>Página não encontrada</h1><p class="lead"><a href="${cfg.basePath || ""}/">Voltar para o blog</a></p></div></section>`,
  })
);

// ---------- sitemap, robots, RSS, llms.txt ----------
const lastmod = posts[0]?.date || new Date().toISOString().slice(0, 10);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${SITE}/</loc><lastmod>${lastmod}</lastmod></url>
${categories.map((c) => `<url><loc>${SITE}/categoria/${c.slug}/</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}
${posts.map((p) => `<url><loc>${SITE}/${p.slug}/</loc><lastmod>${p.updated || p.date}</lastmod></url>`).join("\n")}
</urlset>`
);

write(
  "robots.txt",
  `User-agent: *
Allow: /

# Buscadores de IA são bem-vindos: queremos ser citados.
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: ${SITE}/sitemap.xml
`
);

write(
  "rss.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${esc(cfg.name)}</title><link>${SITE}/</link><description>${esc(cfg.tagline)}</description><language>pt-BR</language>
<atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
${posts.slice(0, 50).map((p) => `<item><title>${esc(p.title)}</title><link>${SITE}/${p.slug}/</link><guid>${SITE}/${p.slug}/</guid><pubDate>${new Date(p.date + "T09:00:00-03:00").toUTCString()}</pubDate><category>${esc(p.category)}</category><description>${esc(p.description)}</description></item>`).join("\n")}
</channel></rss>`
);

write(
  "llms.txt",
  `# ${cfg.name}

> Conteúdo técnico da Tyar (${cfg.org.url}), empresa brasileira com mais de 25 anos projetando, configurando e entregando hardware de alta performance: servidores e workstations para inteligência artificial, servidores, storage, clusters HPC e media servers Watchout. Sede em São Caetano do Sul (SP).

## Artigos
${posts.map((p) => `- [${p.title}](${SITE}/${p.slug}/): ${p.description}`).join("\n")}

## Soluções Tyar
${cfg.nav.map((n) => `- [${n.label}](${n.href})`).join("\n")}
- [MediaServer Watchout](https://tyar.com.br/produtos/mediaserver-watchout)
- [Cluster](https://tyar.com.br/produtos/cluster)
`
);

// CNAME para GitHub Pages quando o blog roda em subdomínio próprio
if (!cfg.basePath && !/github\.io/.test(cfg.siteUrl)) write("CNAME", new URL(cfg.siteUrl).host + "\n");

fs.copyFileSync(path.join(ROOT, "public/style.css"), path.join(OUT, "style.css"));
write(".nojekyll", "");

console.log(`OK: ${posts.length} artigos, ${categories.length} categorias → dist/`);
