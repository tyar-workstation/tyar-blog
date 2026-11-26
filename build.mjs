// Gera o blog estático em dist/ a partir de content/posts/*.md
// Uso: npm run build
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import fs0 from "node:fs";
import path0 from "node:path";
// Funciona com o projeto em pastas (scripts/, content/posts/, public/) ou com tudo na raiz.
const HERE = path0.dirname(new URL(import.meta.url).pathname);
const FLAT = fs0.existsSync(path0.join(HERE, "site.config.mjs"));
const cfg = (await import(FLAT ? "./site.config.mjs" : "../site.config.mjs")).default;
import { renderCovers } from "./covers.mjs";

const ROOT = FLAT ? HERE : path.resolve(HERE, "..");
const POSTS_DIR = fs.existsSync(path.join(ROOT, "content/posts")) ? path.join(ROOT, "content/posts") : ROOT;
const asset = (name) => [path.join(ROOT, "public", name), path.join(ROOT, name)].find((f) => fs.existsSync(f));
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
  .filter((f) => f.endsWith(".md") && /^\d{4}-\d{2}-\d{2}-/.test(f))
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
const LOGO = fs.readFileSync(asset("logo.svg"), "utf8").replace(/id="g"/, 'id="lg"').replace(/url\(#g\)/, "url(#lg)");
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
<script>(function(){var t="light";try{t=localStorage.getItem("tyar-tema")||"light"}catch(e){}document.documentElement.setAttribute("data-theme",t)})()</script>
<link rel="icon" type="image/png" sizes="32x32" href="${r}favicon-32.png">
<link rel="icon" type="image/png" sizes="48x48" href="${r}favicon-48.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://cdn.prod.website-files.com/69c1b09c926b19ea441f8393/6a09ce200a41da4d69ef7314_webclip.png">
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
    <button class="theme-btn" type="button" aria-label="Alternar tema claro/escuro" title="Tema claro/escuro" onclick="var h=document.documentElement,t=h.getAttribute('data-theme')==='dark'?'light':'dark';h.setAttribute('data-theme',t);try{localStorage.setItem('tyar-tema',t)}catch(e){}"><svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
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

// ---------- links internos automáticos ----------
// Liga cada artigo aos outros: a primeira menção à palavra-chave principal de outro
// artigo vira link para ele (no máximo 6 links por artigo, 1 por destino).
const MAX_AUTO_LINKS = 6;
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// termos de cada artigo: palavra-chave principal + tags exclusivas dele (ex.: "Proxmox VE", "RAID 6", "NAS")
const GENERIC = new Set(["workstation", "servidor", "servidores", "storage", "gpu", "cluster", "virtualização", "projeção", "hardware", "nvme", "inferência", "datacenter", "museus", "eventos", "arquitetura", "engenharia", "simulação", "decisão de compra", "nuvem", "on-premise", "llm", "ia local"]);
const tagCount = new Map();
for (const p of posts) for (const t of new Set((p.tags || []).map((x) => String(x).toLowerCase()))) tagCount.set(t, (tagCount.get(t) || 0) + 1);
const okTag = (t) => {
  const k = String(t).toLowerCase();
  if (GENERIC.has(k) || tagCount.get(k) !== 1) return false;
  return k.length >= 5 || /^[A-Z0-9]{3,4}$/.test(String(t));
};
const linkTargets = posts
  .map((p) => ({ slug: p.slug, terms: [p.focus_keyword, ...(Array.isArray(p.link_terms) ? p.link_terms : []), ...(p.tags || []).filter(okTag)].filter((t) => t && String(t).length >= 3).map(String) }))
  .flatMap((t) => t.terms.map((term) => ({ slug: t.slug, term, re: new RegExp(`(?<![\\p{L}\\p{N}])(${escRe(term)})(?![\\p{L}\\p{N}])`, /^[A-Z0-9]{3,4}$/.test(term) ? "u" : "iu") })))
  .sort((a, b) => b.term.length - a.term.length);

function autoLink(html, self, r) {
  const used = new Set([self]);
  for (const m of html.matchAll(/href="[^"]*?\/([a-z0-9-]+)\/"/g)) used.add(m[1]);
  let count = 0;
  const BLOCK = /^(a|h1|h2|h3|h4|h5|h6|code|pre|th|summary)$/i;
  let depth = 0;
  const parts = html.split(/(<[^>]+>)/);
  for (let i = 0; i < parts.length && count < MAX_AUTO_LINKS; i++) {
    const part = parts[i];
    if (part.startsWith("<")) {
      const m = part.match(/^<(\/?)([a-z0-9]+)/i);
      if (m && BLOCK.test(m[2]) && !part.endsWith("/>")) depth += m[1] ? -1 : 1;
      continue;
    }
    if (depth > 0 || !part.trim()) continue;
    let text = part;
    for (const t of linkTargets) {
      if (count >= MAX_AUTO_LINKS) break;
      if (used.has(t.slug)) continue;
      const mm = text.match(t.re);
      if (!mm) continue;
      const at = mm.index;
      text = `${text.slice(0, at)}<a class="ilink" href="${r}${t.slug}/">${mm[1]}</a>${text.slice(at + mm[1].length)}`;
      used.add(t.slug);
      count++;
      break; // um link por trecho de texto, para não aninhar
    }
    parts[i] = text;
  }
  return parts.join("");
}

// artigos relacionados: mesma categoria, tags em comum e palavra-chave citada no texto
function relatedFor(p) {
  const tags = new Set((p.tags || []).map((t) => String(t).toLowerCase()));
  const body = p.html.toLowerCase();
  return posts
    .filter((x) => x.slug !== p.slug)
    .map((x) => ({
      x,
      score:
        (x.catSlug === p.catSlug ? 3 : 0) +
        (x.tags || []).filter((t) => tags.has(String(t).toLowerCase())).length * 2 +
        (x.focus_keyword && body.includes(String(x.focus_keyword).toLowerCase()) ? 2 : 0) +
        (x.pillar && x.catSlug === p.catSlug ? 4 : 0),
    }))
    .sort((a, b) => b.score - a.score || (a.x.date < b.x.date ? 1 : -1))
    .slice(0, 3)
    .map((s) => s.x);
}

// guia principal (pilar) de cada categoria: artigo com "pillar: true"
const pillarOf = new Map(posts.filter((p) => p.pillar).map((p) => [p.catSlug, p]));

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
  ${pillarOf.get(c.slug) ? `<a class="pillar-box" href="${r}${pillarOf.get(c.slug).slug}/"><span class="eyebrow">Guia completo</span><strong>${esc(pillarOf.get(c.slug).title)}</strong><span>Comece por aqui →</span></a>` : ""}
  <div class="grid">${posts.filter((p) => p.catSlug === c.slug && !p.pillar).map((p) => card(p, r)).join("")}</div>
</section>`,
    })
  );
}

// ---------- recursos dos artigos ----------
const LP_URL = cfg.lpUrl || "https://workstations.tyar.com.br/";
const AUTHOR_BIO = "Time técnico da Tyar, que há mais de 25 anos projeta, configura e dá suporte a workstations, servidores, storage e infraestrutura para IA. São mais de 3.600 projetos e 18.700 máquinas entregues para empresas no Brasil.";

// parágrafos de primeiro nível (fora de listas, tabelas, citações e do "Resumo rápido")
function topParas(html) {
  const out = [];
  const re = /<(\/?)(p|li|ul|ol|table|blockquote|aside|details)\b[^>]*>/gi;
  let depth = 0, m, start = -1;
  while ((m = re.exec(html))) {
    const tag = m[2].toLowerCase(), close = !!m[1];
    if (tag === "p") {
      if (!close && depth === 0) start = m.index;
      else if (close && start >= 0) { out.push({ start, end: re.lastIndex }); start = -1; }
      continue;
    }
    depth += close ? -1 : 1;
  }
  return out;
}

// resposta curta (2 a 3 frases) logo abaixo do título: campo "answer" ou o parágrafo de abertura do artigo
function takeAnswer(p, html) {
  if (p.answer) return { answer: marked.parseInline(String(p.answer)), html };
  const firstH2 = html.search(/<h2[\s>]/);
  const first = topParas(html)[0];
  if (!first || (firstH2 >= 0 && first.start > firstH2)) return { answer: "", html };
  const inner = html.slice(first.start, first.end).replace(/^<p>|<\/p>$/g, "").trim();
  const sentences = inner.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ"“(<])/);
  let keep = Math.min(3, sentences.length);
  if (keep === 3 && sentences.slice(0, 3).join(" ").replace(/<[^>]+>/g, "").length > 560) keep = 2;
  const answer = sentences.slice(0, keep).join(" ");
  const rest = sentences.slice(keep).join(" ");
  return { answer, html: html.slice(0, first.start) + (rest ? `<p>${rest}</p>` : "") + html.slice(first.end) };
}

// link contextual para a LP de workstations no trecho que fala de dimensionar o hardware
function lpSentence(cat) {
  const a = (t) => `<a class="ilink lp-link" data-cta="lp-texto" href="${LP_URL}">${t}</a>`;
  if (/^(inteligencia-artificial|cluster)/.test(cat)) return ` Se a carga vai rodar em uma máquina local, vale conhecer a ${a("workstation para IA sob medida")} da Tyar.`;
  if (/^(workstations|decisao-de-compra)/.test(cat)) return ` Para chegar à configuração certa, veja como a Tyar monta cada ${a("workstation sob medida para o seu fluxo de trabalho")}.`;
  return ` Quando parte do trabalho roda na estação de quem usa, a Tyar também monta ${a("workstations sob medida para IA, engenharia e criação")}.`;
}
function addLpLink(html, cat) {
  if (html.includes(LP_URL)) return html;
  const paras = topParas(html);
  const firstH2 = html.search(/<h2[\s>]/);
  const pick =
    paras.find((x) => x.start > firstH2 && /dimension/i.test(html.slice(x.start, x.end))) ||
    paras.find((x) => /dimension/i.test(html.slice(x.start, x.end))) ||
    paras.find((x) => /configura|hardware|escolh/i.test(html.slice(x.start, x.end)) && x.start > firstH2) ||
    paras[paras.length - 1];
  if (!pick) return html;
  const at = pick.end - 4; // antes de </p>
  return html.slice(0, at) + lpSentence(cat) + html.slice(at);
}

// garante 2 a 3 links para artigos do mesmo tema (categoria)
function ensureSameTopicLinks(html, p, r) {
  const same = posts.filter((x) => x.catSlug === p.catSlug && x.slug !== p.slug);
  const linked = new Set([...html.matchAll(/href="[^"]*?\/([a-z0-9-]+)\/"/g)].map((m) => m[1]));
  const have = same.filter((x) => linked.has(x.slug)).length;
  if (have >= 2 || !same.length) return html;
  const tags = new Set((p.tags || []).map((t) => String(t).toLowerCase()));
  const extra = same
    .filter((x) => !linked.has(x.slug))
    .map((x) => ({ x, s: (x.pillar ? 5 : 0) + (x.tags || []).filter((t) => tags.has(String(t).toLowerCase())).length }))
    .sort((a, b) => b.s - a.s || (a.x.date < b.x.date ? 1 : -1))
    .slice(0, 3 - have)
    .map(({ x }) => `<a class="ilink" href="${r}${x.slug}/">${esc(x.title)}</a>`);
  if (!extra.length) return html;
  const list = extra.length === 1 ? extra[0] : `${extra.slice(0, -1).join(", ")} e ${extra[extra.length - 1]}`;
  const block = `<p class="same-topic">Para se aprofundar em ${esc(p.category.toLowerCase())}, leia também ${list}.</p>`;
  const help = html.search(/<h2 id="[^"]*"[^>]*>Como a Tyar/);
  return help >= 0 ? html.slice(0, help) + block + html.slice(help) : html + block;
}

// ---------- artigos ----------
for (const p of posts) {
  const r = "../";
  const url = `${SITE}/${p.slug}/`;
  const { answer, html: htmlA } = takeAnswer(p, p.html);
  const { html: html0, toc } = enhance(htmlA);
  const html = ensureSameTopicLinks(addLpLink(autoLink(html0, p.slug, r), p.catSlug), p, r);
  const updated = p.updated || p.date;
  const related = relatedFor(p);
  const pillar = pillarOf.get(p.catSlug);
  const faq = Array.isArray(p.faq) ? p.faq : [];
  const graph = [
    {
      "@type": "Article",
      headline: p.title,
      image: `${SITE}/capas/${p.slug}.png`,
      description: p.description,
      datePublished: p.date,
      dateModified: updated,
      inLanguage: "pt-BR",
      mainEntityOfPage: url,
      url,
      keywords: [p.focus_keyword, ...(p.tags || [])].join(", "),
      articleSection: p.category,
      author: { "@type": "Organization", name: p.author || "Equipe Tyar", url: cfg.org.url, description: AUTHOR_BIO },
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
    ${answer ? `<div class="answer"><p class="answer-label">Resposta rápida</p><p>${answer}</p></div>` : `<p class="lead">${esc(p.description)}</p>`}
    <div class="meta"><span>Por ${esc(p.author || "Equipe Tyar")}</span><span>Atualizado em <time datetime="${updated}">${fmtDate(updated)}</time></span>${p.reading_time ? `<span>${p.reading_time} min de leitura</span>` : ""}</div>
    ${pillar && pillar.slug !== p.slug ? `<a class="pillar-link" href="${r}${pillar.slug}/">Parte do guia: <strong>${esc(pillar.title)}</strong> →</a>` : ""}
    </div>
    <figure class="post-cover"><img src="${r}capas/${p.slug}.svg" alt="" width="1200" height="630"></figure>
  </div>
</header>
<div class="wrap post-layout">
  <article class="post">
    <div class="prose">${html}</div>
    ${faq.length ? `<section class="faq" aria-labelledby="faq"><h2 id="faq">Perguntas frequentes</h2>${faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</section>` : ""}
    <section class="author-box" aria-label="Sobre o autor">
      <div class="author-avatar" aria-hidden="true">${LOGO}</div>
      <div><p class="author-name">${esc(p.author || "Equipe Tyar")}</p><p>${AUTHOR_BIO}</p><p class="author-date">Publicado em ${fmtDate(p.date)} · Atualizado em ${fmtDate(updated)}</p></div>
    </section>
    <aside class="cta">
      <div>
        <p class="eyebrow">Workstations Tyar</p>
        <h2>Precisa rodar LLMs, RAG ou treinar modelos localmente?</h2>
        <p>A Tyar configura a máquina a partir do seu fluxo de trabalho. Orçamento em 1 dia útil.</p>
      </div>
      <div class="cta-btns">
        <a class="btn" data-cta="lp-workstations" href="${LP_URL}">Solicitar orçamento</a>
        <a class="btn btn-ghost" data-cta="especialista" href="${cfg.contactUrl}" rel="noopener">Falar no WhatsApp</a>
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

fs.copyFileSync(asset("style.css"), path.join(OUT, "style.css"));
// favicon da Tyar (o mesmo do site tyar.com.br)
fs.writeFileSync(path.join(OUT, "favicon-32.png"), Buffer.from("iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEHklEQVR4AeyV0W5bRRCGZ44LEldNeAFcXqCxVFqFlBC3TeqYIA5PEFu0UUNIbLdQ1Cu7vUGiEraJIgtQdNwnqBOCbWKQTVs1FSA5BQSXCS9AzF3AOfMzG+IoqePWTgRVpazPePec3Z35dmZ216KnXA4Bnl0POPZvXsf+NXrQFDqAByQOuHFHQQ4CsS8Ax/6lB8AoCF0u6s7/DgCi20RqHtoiDHxhVwf2C9GxB2btn0IAvCAwsWIoBIQcx6527QeiIwBH481kxYnVPGGVCFmQ/hTo7w2J0D5KRwBE9QggXgiIWa5fmOsJq3kDQgoVzdhVL3VY2gYwqxfhrVVi9Z2cL2ts6bfwv06gLnbdOHVY2gYQ1ONgsGjAZQNvN+yML/gquvo5ghaR0czIUkcJ2RbArCaeGhyFGmem7Fjet6zv24946jFh/KnhYIiV3O5oo9EWgLo4bpQTU83DuP6o3vFc7yrETROgiNIzE3ywFapHRza/PxFg1v7ZxPUl6HYjcCqc82nSNSuayPcmFPJ37VEIN5G0y21ty8cC6N7WjHejUONgrF6cP960ejW4/YiQ7gphAh31/PWcAd/ua9V4LIALTxxEXULCFqxEKyWN75PF3goBt8x4kISSwXJPo69VbbXqcMye1vNeFUJXlLswf/xWq7E7v08WTocihdc4UujvJqFaMlD2qgyohIx8MliOfDy42NMIUUuAunAZpLnNYPZQ2hwymZEfBj4b/tHOBL8PzYw8iMwEl+Izbyw5RqaH75enh+9V04E7K+nA3T9Sge9A4BVVUSXQW+IKra+vVy6X/OmrpaHlWM5fM+B7Anz+ZjXERJp4RCb+7oZb5g13RSeUxZLbsOCQUErDkxBBSET0fpABEIzLj2r9UI2uaU26BBBT+krpbPZaZXhVdex6mgAydtWrE+I6mVVIFUFnqMAIKZB5Gp/AeidYTFliibls+SLF/hejxX4/SG7oYJ0v3a64envSnqUJ4IhYo7p6r07eNARWGzp1yzzp20MWK+WKhD3gl98r9B2byPeFpwr9qVi+b1mHksbaa2hBqGmtEOi5OVTa84DaBbC5epKEqDUYU4wagSog94Z65cwLR57vnvjqlO/dwsnYVLEvO17s3XRpMrDkTZ+/G0kFKk5yqLyml9UKICmF6SKIqtAWEL15rtR0TO8COCIUgrqTmaMbHtd36csT3ZcWTvjHF04lxhdeqeghVFNVlLGXvNPB+5FPg/ec9PCdNYvqK2BJAQiBSHOASNegom/E5m+zLXCdjwIFr9HRkF0AF+d9ibE5X3hs3peeyJ3cdGdj4M7aHL2T+VfTU/nTYbPdNO4cLb7Osa/9fHnRb11ZPMPvl86qnDNifVAa5KvfnOcPvw0cu1bcnYjWTsVPo30IcOiB/9wDT0rsfwAAAP//0p1HCAAAAAZJREFUAwBi3i1fe6RaVgAAAABJRU5ErkJggg==", "base64"));
fs.writeFileSync(path.join(OUT, "favicon-48.png"), Buffer.from("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", "base64"));
fs.copyFileSync(path.join(OUT, "favicon-32.png"), path.join(OUT, "favicon.ico"));
write(".nojekyll", "");

console.log(`OK: ${posts.length} artigos, ${categories.length} categorias → dist/`);
