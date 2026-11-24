# Blog Tyar

Site estático do blog da Tyar. Os artigos ficam em `content/posts/` (um `.md` por artigo), e o build gera o site completo em `dist/`:

- página inicial e páginas por categoria;
- uma página por artigo, com dados estruturados (BlogPosting, FAQPage, Breadcrumb);
- `sitemap.xml`, `robots.txt` (liberando os robôs de busca de IA), `rss.xml` e `llms.txt`;
- Google Analytics 4 opcional, com evento `cta_click` nos botões de contato.

## Rodar localmente

```bash
npm install
npm run build     # gera dist/
npm run preview   # abre o site em http://localhost:3000
```

## Publicação automática (GitHub Pages)

1. Suba este projeto para um repositório no GitHub (branch `main`).
2. Em **Settings → Pages**, escolha **Source: GitHub Actions**.
3. Em **Settings → Secrets and variables → Actions → Variables**, crie:
   - `SITE_URL`: endereço final, ex.: `https://blog.tyar.com.br`
   - `GA4_ID`: ID do Google Analytics 4 (`G-XXXXXXX`), opcional
   - `GSC_VERIFICATION`: código da meta tag do Search Console, opcional
   - `BASE_PATH`: só se o blog ficar numa subpasta, ex.: `/blog`
4. No DNS do domínio tyar.com.br, crie um registro **CNAME** `blog` → `<usuario-ou-org>.github.io`.

A partir daí, todo artigo novo adicionado em `content/posts/` (commit na `main`) é publicado sozinho em cerca de 1 minuto.

## Formato de cada artigo

```yaml
---
title: "Título (até 65 caracteres)"
slug: "slug-sem-acentos"
description: "Descrição para o Google (140 a 155 caracteres)"
date: "2026-11-16"
author: "Equipe Tyar"
category: "Inteligência Artificial"
tags: ["...", "..."]
focus_keyword: "palavra-chave principal"
reading_time: 8
cta_product: "https://tyar.com.br/produtos/..."
faq:
  - q: "Pergunta"
    a: "Resposta"
---
Corpo em Markdown...
```

## Visual

As cores ficam no topo de `public/style.css`, nas variáveis `--brand`, `--hero` etc.
