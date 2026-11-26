---
title: "RAG na empresa: qual infraestrutura é necessária"
slug: "rag-na-empresa-infraestrutura-necessaria"
description: "Infraestrutura para RAG na empresa: como dimensionar GPU, KV cache, embeddings, banco vetorial, RAM e NVMe, com contas práticas e exemplos por porte."
date: "2026-11-26"
author: "Equipe Tyar"
category: "Inteligência Artificial"
tags: ["RAG", "infraestrutura para RAG", "banco vetorial", "KV cache", "embeddings", "BGE-M3", "Qdrant"]
focus_keyword: "infraestrutura para RAG"
link_terms: ["RAG na empresa", "infraestrutura para RAG", "banco vetorial", "servidor para RAG"]
reading_time: 7
cta_product: "https://tyar.com.br/produtos/inteligencia-artificial"
faq:
  - q: "RAG precisa de mais GPU que um chatbot comum?"
    a: "Sim, por requisição. Os trechos recuperados entram no prompt e aumentam o KV cache. No Llama 3.1 70B em BF16, cada token ocupa cerca de 320 KiB; um prompt de RAG com 6 mil tokens usa perto de 1,9 GiB por usuário, contra cerca de 0,3 GiB de uma pergunta curta."
  - q: "O banco vetorial precisa rodar na GPU?"
    a: "Não. Bancos vetoriais como Qdrant rodam em CPU, RAM e NVMe. Um milhão de vetores de 1.024 dimensões em float32 ocupa cerca de 3,8 GiB de RAM só em vetores, então a maioria das bases corporativas cabe na memória de um servidor comum."
  - q: "Dá para rodar RAG em um único servidor?"
    a: "Para a maioria das empresas, sim. Um servidor com 1 a 4 GPUs de 48 a 141 GB roda o LLM, o modelo de embeddings e o reranker, enquanto CPU, RAM e NVMe do mesmo servidor atendem o banco vetorial. Separar em mais máquinas faz sentido com alta concorrência ou requisitos de alta disponibilidade."
---

# RAG na empresa: qual infraestrutura é necessária

A infraestrutura para RAG (Retrieval-Augmented Generation) na empresa tem quatro partes: uma GPU para o LLM que gera as respostas, um modelo de embeddings que transforma documentos e perguntas em vetores, um banco vetorial que guarda e busca esses vetores e o storage onde ficam os documentos originais. O que mais pesa no hardware é o LLM, e não o banco vetorial. Como o RAG injeta trechos de documentos no prompt, cada pergunta passa a usar milhares de tokens de contexto, e isso aumenta a memória de GPU consumida por usuário. Já o banco vetorial costuma caber com folga na RAM e no NVMe de um servidor.

Este artigo detalha um dos capítulos do [guia de infraestrutura para IA na empresa](https://blog.tyar.com.br/guia-infraestrutura-para-ia-na-empresa/).

## Resumo rápido

- RAG = LLM + embeddings + banco vetorial + documentos. Só o LLM exige GPU grande.
- O contexto extra do RAG infla o KV cache: no Llama 3.1 70B em BF16, são cerca de 320 KiB por token, ou ~1,9 GiB por requisição de 6 mil tokens.
- 1 milhão de trechos (chunks) com embeddings de 1.024 dimensões ocupa ~3,8 GiB em float32: o banco vetorial cabe em RAM.
- NVMe rápido importa quando os vetores ficam em disco: a Qdrant recomenda SSDs locais com pelo menos 50 mil IOPS.
- Dimensione pela concorrência real (usuários simultâneos × tokens por requisição), não pelo número total de funcionários.

## Como funciona o RAG e onde cada parte roda?

O fluxo tem duas fases:

1. **Ingestão (offline):** os documentos (PDFs, contratos, manuais, chamados) são divididos em trechos, cada trecho vira um vetor no modelo de embeddings e o vetor é gravado no banco vetorial com metadados.
2. **Consulta (online):** a pergunta do usuário vira vetor, o banco devolve os trechos mais parecidos, um reranker opcional reordena os resultados e o LLM recebe pergunta + trechos para redigir a resposta.

| Componente | Exemplo | Onde roda | Recurso crítico |
|---|---|---|---|
| LLM | Llama 3.1 8B/70B, Qwen, Mistral | GPU | VRAM (pesos + KV cache) e banda de memória |
| Embeddings | BGE-M3 | GPU pequena ou CPU | Vazão na ingestão |
| Reranker | Cross-encoder | GPU pequena ou CPU | Latência por consulta |
| Banco vetorial | Qdrant, Milvus, pgvector | CPU + RAM + NVMe | RAM para vetores e índice, IOPS |
| Documentos e pipeline | Servidor de arquivos, OCR, parsers | CPU + storage | Capacidade e leitura sequencial |

O modelo de embeddings é leve comparado ao LLM. O BGE-M3, por exemplo, gera vetores de 1.024 dimensões, aceita entradas de até 8.192 tokens, funciona em mais de 100 idiomas (inclusive português) e oferece busca densa, esparsa e multivetor no mesmo modelo.

## Quanta memória de GPU o RAG consome a mais?

A diferença está no KV cache, a memória que guarda o estado de cada requisição durante a geração. A conta por token é:

**KV por token = 2 × camadas × cabeças KV × dimensão da cabeça × bytes por elemento**

Para o Llama 3.1 70B (80 camadas, 8 cabeças KV, dimensão 128, BF16), isso dá 327.680 bytes, ou 320 KiB por token. No Llama 3.1 8B, são 128 KiB por token.

Agora compare uma pergunta curta de chatbot com uma consulta típica de RAG (8 trechos de ~500 tokens + pergunta + resposta):

| Cenário | Tokens por requisição | KV no 70B (BF16) | KV no 8B (BF16) |
|---|---|---|---|
| Chatbot simples | ~1.000 | ~0,31 GiB | ~0,12 GiB |
| RAG típico | ~6.000 | ~1,9 GiB | ~0,75 GiB |
| RAG com documentos longos | ~32.000 | ~10 GiB | ~4 GiB |

Multiplicando pela concorrência: 20 consultas de RAG simultâneas no 70B somam ~37 GiB só de KV cache, além dos pesos do modelo. Um detalhe que costuma passar despercebido: quantizar os pesos em FP8 não reduz o KV cache, a menos que o software de serviço também use KV cache em FP8.

Por isso o software de inferência faz diferença. Servidores como o vLLM gerenciam o KV cache em blocos e atendem mais requisições na mesma GPU; a comparação está em [vLLM ou Ollama para LLM na empresa](https://blog.tyar.com.br/vllm-ou-ollama-qual-usar-para-llm-na-empresa/).

## Quanta RAM e disco o banco vetorial precisa?

Pela metodologia de capacity planning da Qdrant, a memória dos vetores densos é:

**vetores × dimensões × bytes por dimensão** (4 bytes em float32, 2 em float16, 1 em uint8)

O índice HNSW soma aproximadamente vetores × m × 2 × 4 bytes × 1,2 (com m = 16 por padrão), e a recomendação é acrescentar cerca de 20% de folga ao total.

Exemplo: uma empresa com 1 milhão de trechos indexados com embeddings de 1.024 dimensões:

- Vetores em float32: 1.000.000 × 1.024 × 4 B ≈ 3,8 GiB
- Índice HNSW: 1.000.000 × 16 × 2 × 4 B × 1,2 ≈ 0,14 GiB
- Com 20% de folga: **~4,8 GiB de RAM**

Dez milhões de trechos levam a algo em torno de 48 GiB, ainda dentro da RAM de um servidor de dois soquetes. A Qdrant indica que um único nó chega a cerca de 100 milhões de vetores antes de precisar de cluster.

Quando a base cresce além da RAM, os vetores podem ficar em disco, mas o desempenho passa a depender do SSD. A documentação recomenda SSDs locais com pelo menos 50 mil IOPS e observa que reduzir pela metade os vetores residentes em RAM praticamente dobra a latência de busca. Num teste antigo da própria Qdrant com 1 milhão de vetores e pouca RAM, o mesmo cenário rodou a 0,4 consulta por segundo em um disco de 63,2 mil IOPS e a 7 consultas por segundo em um de 183 mil IOPS. Para essa camada, vale entender a diferença entre [SSD enterprise e SSD comum em servidor](https://blog.tyar.com.br/ssd-enterprise-ou-ssd-comum-para-servidor/).

Os documentos originais (PDFs, imagens, versões) ocupam muito mais espaço que os vetores e pedem storage com capacidade e proteção adequadas; o tema é tratado em [storage para IA: como dimensionar](https://blog.tyar.com.br/storage-para-ia-como-dimensionar/).

## Exemplos de dimensionamento de RAG

Pontos de partida a validar com testes de carga usando perguntas reais:

| Porte | Base e uso | LLM | Configuração inicial |
|---|---|---|---|
| Piloto departamental | Até 1 mi de trechos, até 10 usuários simultâneos | 8B a 32B em FP8/INT4 | 1 servidor com 1 GPU de 48 a 96 GB, 128 a 256 GB de RAM, NVMe |
| Empresa média | Até 10 mi de trechos, 20 a 50 simultâneos | 70B em FP8 | 1 servidor com 2 a 4 GPUs de 96 a 141 GB, 512 GB de RAM, NVMe enterprise |
| Grande porte ou alta disponibilidade | Dezenas de milhões de trechos, centenas de simultâneos | 70B+ | Inferência em servidores dedicados, banco vetorial em nós separados com replicação |

Conta rápida para o cenário médio: o 70B em FP8 ocupa ~70 GB em pesos; 20 consultas simultâneas de 6 mil tokens somam ~40 GB de KV cache em BF16. Com margem para ativações e picos, o projeto pede mais de 110 GB de VRAM, o que aponta para duas GPUs de 96 GB ou uma de 141 GB com contexto controlado. A escolha entre essas opções está em [RTX PRO 6000 Blackwell ou H200](https://blog.tyar.com.br/rtx-pro-6000-blackwell-ou-h200-qual-gpu-para-ia/), e o método completo de cálculo em [como dimensionar GPU em servidor para IA on-premise](https://blog.tyar.com.br/servidor-para-ia-on-premise-como-dimensionar-gpu/).

## RAG on-premise e LGPD

RAG costuma indexar justamente o que a empresa tem de mais sensível: contratos, dados de clientes, prontuários, informações de RH. Enviar esse conteúdo para APIs processadas fora do Brasil caracteriza transferência internacional de dados, regulamentada pela Resolução CD/ANPD nº 19/2024. Manter embeddings, banco vetorial e LLM no próprio datacenter deixa os dados sob controle direto da empresa e facilita aplicar no RAG as mesmas permissões de acesso dos sistemas de origem (cada usuário só recupera trechos que já poderia ler).

## Erros comuns

- **Dimensionar a GPU como se fosse um chatbot simples.** O contexto do RAG multiplica o KV cache por requisição.
- **Configurar contexto máximo sem necessidade.** Reservar 128 mil tokens por usuário quando o RAG usa 6 mil desperdiça memória e reduz a concorrência.
- **Colocar o banco vetorial em disco lento.** Com vetores fora da RAM, IOPS viram latência para o usuário.
- **Quantizar embeddings sem medir o recall.** A Qdrant alerta que alguns modelos perdem qualidade de busca quando quantizados; teste antes.
- **Esquecer a ingestão.** Reindexar milhões de documentos com OCR e embeddings consome CPU e GPU por horas; planeje janelas ou recursos dedicados.
- **Ignorar permissões.** Um RAG sem filtro por usuário pode expor documentos restritos em respostas.

## Como a Tyar pode ajudar

A Tyar projeta, configura, entrega e dá suporte a servidores com GPU, storage e clusters para IA, partindo da carga real: tamanho da base de documentos, modelo, usuários simultâneos e metas de latência. São mais de 25 anos de experiência e mais de 3.600 projetos, com marcas homologadas, consultoria desde o primeiro contato e suporte pós-venda.

👉 Conheça as soluções de [Inteligência Artificial da Tyar](https://tyar.com.br/produtos/inteligencia-artificial) e os [servidores para IA e banco vetorial](https://tyar.com.br/produtos/servidores).

---

**Fontes:**

- [Qdrant – Capacity Planning](https://qdrant.tech/documentation/capacity-planning/)
- [Qdrant – Minimal RAM you need to serve a million vectors](https://qdrant.tech/articles/memory-consumption/)
- [BAAI – BGE-M3 (Hugging Face)](https://huggingface.co/BAAI/bge-m3)
- [MinIO – KV Cache Sizing](https://docs.min.io/memkv/operate/kv-cache-sizing/)
- [Frank Denneman – The Dynamic World of LLM Runtime Memory](https://frankdenneman.ai/2026-01-12-the-dynamic-world-of-llm-runtime-memory/)
- [Kwon et al. – Efficient Memory Management for Large Language Model Serving with PagedAttention (vLLM)](https://arxiv.org/abs/2309.06180)
- [Teletime – ANPD publica resolução sobre transferência internacional de dados](https://teletime.com.br/23/08/2024/anpd-publica-resolucao-sobre-transferencia-internacional-de-dados/)
