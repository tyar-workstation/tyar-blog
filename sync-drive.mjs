// Busca artigos novos na pasta pública "Blog Tyar - Artigos" do Google Drive
// e salva na raiz do repositório. Roda no GitHub Actions (ver .github/workflows/publicar-blog.yml).
import fs from "node:fs";
import matter from "gray-matter";

const FOLDER = process.env.DRIVE_FOLDER_ID || "1uKYHVd2XBSplIvin81j8xHb2xLlrr0tS";
const REQUIRED = ["title", "slug", "description", "date", "category", "focus_keyword"];
const NAME_OK = /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/;

export function parseFolder(html) {
  const out = [];
  const re = /id="entry-([\w-]+)"[\s\S]*?class="flip-entry-title">([^<]+)</g;
  let m;
  while ((m = re.exec(html))) out.push({ id: m[1], name: m[2].trim() });
  return out;
}

async function main() {
  const existentes = fs.readdirSync(".").filter((f) => NAME_OK.test(f));
  const slugs = new Set(
    existentes.map((f) => {
      try {
        return matter(fs.readFileSync(f, "utf8")).data.slug;
      } catch {
        return null;
      }
    })
  );

  const res = await fetch(`https://drive.google.com/embeddedfolderview?id=${FOLDER}`);
  if (!res.ok) throw new Error(`Não consegui ler a pasta do Drive (HTTP ${res.status})`);
  const arquivos = parseFolder(await res.text());
  console.log(`${arquivos.length} arquivos na pasta do Drive`);

  let novos = 0;
  for (const { id, name } of arquivos) {
    if (!NAME_OK.test(name) || fs.existsSync(name)) continue;
    const r = await fetch(`https://drive.google.com/uc?export=download&id=${id}`);
    if (!r.ok) {
      console.log(`! falhou ao baixar ${name} (HTTP ${r.status})`);
      continue;
    }
    const texto = await r.text();
    let data;
    try {
      data = matter(texto).data;
    } catch (e) {
      console.log(`! ignorado ${name}: cabeçalho inválido (${e.message})`);
      continue;
    }
    const faltando = REQUIRED.filter((k) => !data[k]);
    if (faltando.length) {
      console.log(`! ignorado ${name}: faltam ${faltando.join(", ")}`);
      continue;
    }
    if (slugs.has(data.slug)) {
      console.log(`! ignorado ${name}: slug repetido (${data.slug})`);
      continue;
    }
    fs.writeFileSync(name, texto);
    slugs.add(data.slug);
    novos++;
    console.log(`+ novo artigo: ${name}`);
  }

  console.log(`${novos} artigo(s) novo(s)`);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `novos=${novos}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
