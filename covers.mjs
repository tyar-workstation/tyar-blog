// Capas automáticas dos artigos.
// Cada artigo ganha uma arte única (semente = slug) com um motivo da sua categoria:
//   - <slug>.svg  → arte sem texto, usada nos cartões e no topo do artigo
//   - <slug>.png  → 1200×630 com logo e título, usada no compartilhamento (og:image)
import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const W = 1200;
const H = 630;

function seeded(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 3432918353), (h = (h << 13) | (h >>> 19));
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;

// ---------- motivos por categoria (desenhados na metade direita) ----------
function neural(rnd) {
  const layers = 4 + Math.floor(rnd() * 2);
  const cols = [];
  for (let l = 0; l < layers; l++) {
    const n = 3 + Math.floor(rnd() * 3);
    const x = 600 + (l * 520) / (layers - 1);
    cols.push(Array.from({ length: n }, (_, i) => ({ x, y: 315 + (i - (n - 1) / 2) * (110 + rnd() * 20) + (rnd() - 0.5) * 30 })));
  }
  let edges = "";
  let hot = "";
  for (let l = 0; l < layers - 1; l++)
    for (const a of cols[l])
      for (const b of cols[l + 1]) edges += `<line x1="${r1(a.x)}" y1="${r1(a.y)}" x2="${r1(b.x)}" y2="${r1(b.y)}"/>`;
  let pick = cols.map((c) => c[Math.floor(rnd() * c.length)]);
  for (let i = 0; i < pick.length - 1; i++)
    hot += `<line x1="${r1(pick[i].x)}" y1="${r1(pick[i].y)}" x2="${r1(pick[i + 1].x)}" y2="${r1(pick[i + 1].y)}"/>`;
  const nodes = cols
    .flat()
    .map((p) => `<circle cx="${r1(p.x)}" cy="${r1(p.y)}" r="9"/>`)
    .join("");
  const hotNodes = pick.map((p) => `<circle cx="${r1(p.x)}" cy="${r1(p.y)}" r="13"/>`).join("");
  return `<g stroke="#ffffff" stroke-opacity=".13" stroke-width="1.5">${edges}</g>
<g stroke="url(#acc)" stroke-width="4" stroke-linecap="round">${hot}</g>
<g fill="#1c1c22" stroke="#ffffff" stroke-opacity=".35" stroke-width="2">${nodes}</g>
<g fill="url(#acc)" filter="url(#glow)">${hotNodes}</g>`;
}

function rack(rnd, towers = 1) {
  let out = "";
  const units = 9 + Math.floor(rnd() * 3);
  const tw = towers === 1 ? 430 : 170;
  for (let t = 0; t < towers; t++) {
    const x0 = towers === 1 ? 660 : 600 + t * 195;
    const y0 = 70 + (towers === 1 ? 0 : t * 22);
    out += `<rect x="${x0 - 14}" y="${y0 - 14}" width="${tw + 28}" height="${units * 46 + 22}" rx="10" fill="#141418" stroke="#ffffff" stroke-opacity=".12"/>`;
    for (let u = 0; u < units; u++) {
      const y = y0 + u * 46;
      const lit = rnd() > 0.35;
      out += `<rect x="${x0}" y="${y}" width="${tw}" height="38" rx="4" fill="#1d1d23" stroke="#ffffff" stroke-opacity=".08"/>`;
      const vents = towers === 1 ? 14 : 5;
      for (let v = 0; v < vents; v++) out += `<rect x="${x0 + 18 + v * 14}" y="${y + 12}" width="6" height="14" rx="2" fill="#ffffff" fill-opacity=".07"/>`;
      out += `<circle cx="${x0 + tw - 22}" cy="${y + 19}" r="5" fill="${lit ? "url(#acc)" : "#3a3a42"}"${lit ? ' filter="url(#glow)"' : ""}/>`;
      if (towers === 1) out += `<rect x="${x0 + tw - 120}" y="${y + 15}" width="${40 + Math.floor(rnd() * 40)}" height="8" rx="4" fill="#ffffff" fill-opacity=".1"/>`;
    }
  }
  return out;
}

function disks(rnd) {
  let out = "";
  const n = 5 + Math.floor(rnd() * 2);
  const cx = 900;
  for (let i = n - 1; i >= 0; i--) {
    const y = 140 + i * 72;
    const hot = i === Math.floor(rnd() * n);
    out += `<path d="M${cx - 230} ${y} v40 a230 52 0 0 0 460 0 v-40" fill="#18181d" stroke="#ffffff" stroke-opacity=".14"/>
<ellipse cx="${cx}" cy="${y}" rx="230" ry="52" fill="${hot ? "url(#accSoft)" : "#202027"}" stroke="#ffffff" stroke-opacity="${hot ? ".5" : ".16"}"/>
<ellipse cx="${cx}" cy="${y}" rx="70" ry="16" fill="none" stroke="#ffffff" stroke-opacity=".12"/>`;
  }
  return out;
}

function projection(rnd) {
  const px = 590;
  const py = 330 + (rnd() - 0.5) * 80;
  const screens = [
    { x: 930, y: 70, w: 230, h: 140 },
    { x: 980, y: 245, w: 190, h: 140 },
    { x: 930, y: 420, w: 230, h: 140 },
  ];
  let out = "";
  screens.forEach((s, i) => {
    const op = 0.1 + rnd() * 0.14;
    out += `<path d="M${px} ${r1(py)} L${s.x} ${s.y} L${s.x} ${s.y + s.h} Z" fill="url(#beam)" fill-opacity="${r1(op * 10) / 10 + 0.15}"/>`;
    out += `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="6" fill="${i === 1 ? "url(#accSoft)" : "#1c1c22"}" stroke="#ffffff" stroke-opacity=".3"/>`;
  });
  out += `<rect x="${px - 50}" y="${r1(py - 26)}" width="64" height="52" rx="8" fill="#1d1d23" stroke="#ffffff" stroke-opacity=".3"/><circle cx="${px + 6}" cy="${r1(py)}" r="12" fill="url(#acc)" filter="url(#glow)"/>`;
  return out;
}

function traces(rnd) {
  let out = "";
  for (let i = 0; i < 9; i++) {
    const y = 80 + i * 58;
    const x1 = 560 + rnd() * 120;
    const xm = x1 + 120 + rnd() * 200;
    const dy = (rnd() > 0.5 ? 1 : -1) * 29;
    const hot = rnd() > 0.75;
    out += `<path d="M${r1(x1)} ${y} H${r1(xm)} l29 ${dy} H1200" fill="none" stroke="${hot ? "url(#acc)" : "#ffffff"}" stroke-opacity="${hot ? 1 : 0.14}" stroke-width="${hot ? 3 : 2}"/><circle cx="${r1(x1)}" cy="${y}" r="6" fill="${hot ? "url(#acc)" : "#2b2b33"}"/>`;
  }
  return out;
}

const MOTIF = {
  "inteligencia-artificial": (r) => neural(r),
  workstations: (r) => rack(r, 1),
  servidores: (r) => rack(r, 1),
  cluster: (r) => rack(r, 3),
  "cluster-hpc": (r) => rack(r, 3),
  storage: (r) => disks(r),
  "mediaserver-watchout": (r) => projection(r),
};

// ---------- composição ----------
function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [""];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    if ((cur + " " + w).trim().length > max) lines.push(w);
    else lines[lines.length - 1] = (cur + " " + w).trim();
  }
  return lines;
}
const x = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// paleta clara para as capas usadas dentro do blog (a versão com título, para redes sociais, continua escura)
const LIGHT = [["#ffffff", "#3d2559"], ["#0d0d0d", "#f4eefb"], ["#1c1c22", "#ffffff"], ["#1d1d23", "#ffffff"], ["#18181d", "#f7f2fd"], ["#202027", "#ffffff"], ["#141418", "#f3ecfb"], ["#2b2b33", "#d8cbe9"], ["#3a3a42", "#cdbfe0"]];
export function coverSvg(post, opts = {}) {
  const svg = coverSvgDark(post, opts);
  return opts.light ? LIGHT.reduce((acc, [a, b]) => acc.split(a).join(b), svg) : svg;
}

function coverSvgDark(post, { hue = 275, withText = false, logo = "" } = {}) {
  const rnd = seeded(post.slug);
  const gx = r1(820 + rnd() * 300);
  const gy = r1(80 + rnd() * 200);
  const motif = (MOTIF[post.catSlug] || traces)(rnd);

  let text = "";
  if (withText) {
    const size = post.title.length > 70 ? 52 : post.title.length > 48 ? 58 : 66;
    const lines = wrap(post.title, Math.floor(1000 / (size * 0.56))).slice(0, 4);
    const lh = size * 1.12;
    const y0 = H - 70 - (lines.length - 1) * lh;
    text = `<rect width="${W}" height="${H}" fill="url(#shade)"/>
<g transform="translate(64 56) scale(1.45)">${logo}</g>
<text x="64" y="${r1(y0 - size - 22)}" font-family="Inter" font-weight="500" font-size="20" letter-spacing="3" fill="#c48bf0">${x(post.category.toUpperCase())}</text>
<text font-family="Inter" font-weight="600" font-size="${size}" letter-spacing="-1.4" fill="#ffffff">${lines
      .map((l, i) => `<tspan x="64" y="${r1(y0 + i * lh)}">${x(l)}</tspan>`)
      .join("")}</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <radialGradient id="glowBg" cx="${gx}" cy="${gy}" r="620" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="hsl(${hue} 70% 50%)" stop-opacity=".62"/>
    <stop offset="1" stop-color="hsl(${hue} 70% 50%)" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glowBg2" cx="120" cy="630" r="520" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="hsl(${hue - 34} 60% 38%)" stop-opacity=".45"/>
    <stop offset="1" stop-color="hsl(${hue - 34} 60% 38%)" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="acc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c27cf2"/><stop offset="1" stop-color="#803eac"/></linearGradient>
  <linearGradient id="accSoft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a252d9" stop-opacity=".75"/><stop offset="1" stop-color="#803eac" stop-opacity=".35"/></linearGradient>
  <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c27cf2" stop-opacity=".9"/><stop offset="1" stop-color="#803eac" stop-opacity=".05"/></linearGradient>
  <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d0d0d" stop-opacity=".96"/><stop offset=".55" stop-color="#0d0d0d" stop-opacity=".72"/><stop offset="1" stop-color="#0d0d0d" stop-opacity=".1"/></linearGradient>
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity=".045"/></pattern>
  <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<rect width="${W}" height="${H}" fill="#0d0d0d"/>
<rect width="${W}" height="${H}" fill="url(#glowBg)"/>
<rect width="${W}" height="${H}" fill="url(#glowBg2)"/>
<rect width="${W}" height="${H}" fill="url(#grid)"/>
<g>${motif}</g>
${text}
</svg>`;
}

export function renderCovers({ posts, outDir, root, hueOf, logoSvg }) {
  fs.mkdirSync(outDir, { recursive: true });
  // logo dentro da capa: só os caminhos (sem <svg> externo)
  const logoInner = logoSvg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/id="lg"/g, 'id="lgc"').replace(/url\(#lg\)/g, "url(#lgc)");
  const fontFiles = ["Inter-SemiBold.otf", "Inter-Medium.otf"].map((f) => [path.join(root, "fonts", f), path.join(root, f)].find((p) => fs.existsSync(p)));
  for (const p of posts) {
    const hue = hueOf(p.catSlug);
    const art = coverSvg(p, { hue, light: true });
    fs.writeFileSync(path.join(outDir, `${p.slug}.svg`), art);
    // versão em imagem (PNG) da capa clara: é a que o Google usa como miniatura nos resultados de busca
    fs.writeFileSync(path.join(outDir, `${p.slug}-capa.png`), new Resvg(art, { fitTo: { mode: "width", value: W } }).render().asPng());
    const svg = coverSvg(p, { hue, withText: true, logo: logoInner });
    const png = new Resvg(svg, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" }, fitTo: { mode: "width", value: W } }).render().asPng();
    fs.writeFileSync(path.join(outDir, `${p.slug}.png`), png);
  }
}
