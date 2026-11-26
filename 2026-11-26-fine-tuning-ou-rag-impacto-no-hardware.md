---
title: "Fine-tuning ou RAG: qual o impacto no hardware de IA"
slug: "fine-tuning-ou-rag-impacto-no-hardware"
description: "Fine-tuning, LoRA, QLoRA, RAG ou prompt: quanta VRAM cada abordagem exige e como dimensionar as GPUs para customizar um LLM dentro da sua empresa."
date: "2026-11-26"
author: "Equipe Tyar"
category: "Inteligência Artificial"
tags: ["fine-tuning", "RAG", "LoRA", "QLoRA", "VRAM", "LLM on-premise", "GPU para IA"]
focus_keyword: "fine-tuning ou RAG"
link_terms: ["fine-tuning de LLM", "LoRA e QLoRA", "VRAM para fine-tuning"]
reading_time: 7
cta_product: "https://tyar.com.br/produtos/inteligencia-artificial"
faq:
  - q: "Fine-tuning exige mais hardware que RAG?"
    a: "Sim. O fine-tuning completo precisa guardar pesos, gradientes e estados do otimizador, cerca de 18 bytes por parâmetro em precisão mista com AdamW. O RAG usa o modelo só em inferência, com cerca de 2 bytes por parâmetro em FP16/BF16, mais cache de contexto e banco vetorial."
  - q: "Dá para fazer fine-tuning de um modelo de 70B em uma GPU só?"
    a: "Com QLoRA (4 bits), sim: a Unsloth indica cerca de 41 GB de VRAM mínima para 70B, o que cabe em uma GPU de 96 GB. Com LoRA em 16 bits o mínimo sobe para cerca de 164 GB, o que exige duas GPUs grandes."
  - q: "Quando escolher RAG em vez de fine-tuning?"
    a: "Quando o problema é dar ao modelo acesso a documentos internos que mudam com frequência. O fine-tuning serve melhor para ensinar formato, tom ou uma tarefa específica. Muitas empresas começam com RAG e só depois fazem LoRA sobre o mesmo servidor."
---

# Fine-tuning ou RAG: qual o impacto no hardware de IA

Fine-tuning ou RAG? Do ponto de vista do hardware, a resposta é direta: **RAG e engenharia de prompt rodam no mesmo servidor de inferência**, enquanto **o fine-tuning completo multiplica a memória de GPU necessária por cerca de 9 vezes** em relação a apenas servir o modelo. Técnicas como LoRA e QLoRA reduzem essa diferença a ponto de ser possível ajustar um modelo de 70 bilhões de parâmetros em uma única GPU de 96 GB. A escolha da estratégia, portanto, define quantas GPUs, quanta VRAM e que tipo de servidor a empresa precisa comprar.

Este artigo faz parte do nosso [guia completo de infraestrutura para IA na empresa](https://blog.tyar.com.br/guia-infraestrutura-para-ia-na-empresa/).

## Resumo rápido

- **Prompt e RAG**: só inferência. O modelo em FP16/BF16 ocupa cerca de 2 bytes por parâmetro, mais o cache de contexto (KV cache).
- **Fine-tuning completo**: cerca de 18 bytes por parâmetro com AdamW em precisão mista, sem contar ativações. Um modelo de 8B já passa de 140 GB.
- **LoRA (16 bits)**: treina só adaptadores pequenos; a Unsloth lista 19 GB mínimos para 7B e 164 GB para 70B.
- **QLoRA (4 bits)**: o modelo base fica quantizado; 70B cabe em cerca de 41 GB de VRAM.
- Na prática, a maioria das empresas começa com RAG e reserva o fine-tuning para ajustes de formato, tom ou tarefas específicas.

## O que muda entre prompt, RAG e fine-tuning?

As três abordagens resolvem problemas diferentes:

- **Engenharia de prompt**: instruções e exemplos dentro da própria pergunta. Nenhum peso do modelo muda.
- **RAG (Retrieval-Augmented Generation)**: o sistema busca trechos relevantes em uma base de documentos (normalmente um banco vetorial) e os insere no prompt. O modelo continua o mesmo; o conhecimento fica fora dele. Detalhamos a arquitetura em [RAG na empresa: infraestrutura necessária](https://blog.tyar.com.br/rag-na-empresa-infraestrutura-necessaria/).
- **Fine-tuning**: os pesos do modelo são ajustados com dados da empresa. Pode ser completo (todos os parâmetros) ou eficiente em parâmetros (PEFT), como LoRA e QLoRA.

A diferença no hardware vem de um ponto simples: **inferência só precisa dos pesos; treino precisa dos pesos, dos gradientes e dos estados do otimizador**.

## Quanta memória de GPU cada abordagem consome?

A documentação do Hugging Face Transformers detalha a conta para treino em precisão mista com o otimizador AdamW:

| Componente | Bytes por parâmetro |
|---|---|
| Pesos (cópia FP32 + cópia FP16) | 6 |
| Estados do otimizador AdamW (2 estados) | 8 |
| Gradientes (mantidos em FP32) | 4 |
| **Total (sem ativações)** | **18** |

Para inferência, a documentação de PEFT do Hugging Face usa a referência de 2 bytes por parâmetro em FP16: um modelo de 1B ocupa cerca de 1,86 GiB. Com isso dá para comparar as abordagens:

| Abordagem | Modelo de 8B | Modelo de 70B | O que pesa no hardware |
|---|---|---|---|
| Prompt / RAG (inferência BF16) | ~16 GB de pesos | ~140 GB de pesos | KV cache cresce com o contexto recuperado |
| Fine-tuning completo (AdamW) | ~144 GB + ativações | ~1.260 GB + ativações | Várias GPUs, rede rápida entre elas |
| LoRA 16 bits (mínimo Unsloth) | 22 GB | 164 GB | Modelo base em 16 bits na VRAM |
| QLoRA 4 bits (mínimo Unsloth) | 6 GB | 41 GB | Modelo base quantizado em 4 bits |

*Valores de LoRA/QLoRA da tabela de requisitos da Unsloth, que a própria documentação descreve como "mínimo absoluto". Valores de inferência e de fine-tuning completo calculados pelas regras de bytes por parâmetro acima.*

O artigo original do LoRA (Microsoft, 2021) mostra por que a técnica mudou o jogo: no GPT-3 175B, ela reduziu o número de parâmetros treináveis em 10.000 vezes e a exigência de memória de GPU em 3 vezes, comparada ao fine-tuning completo com Adam. O QLoRA foi além: segundo os autores, permite ajustar um modelo de 65B em uma única GPU de 48 GB mantendo o desempenho do fine-tuning em 16 bits.

## RAG é "leve" em hardware?

É mais leve que treinar, mas não é gratuito. Três pontos costumam ser subestimados:

1. **Contexto longo consome VRAM.** Cada trecho recuperado entra no prompt. Mais contexto significa KV cache maior por requisição e menos usuários simultâneos por GPU. Motores como o vLLM gerenciam esse cache de forma eficiente; comparamos as opções em [vLLM ou Ollama: qual usar para LLM na empresa](https://blog.tyar.com.br/vllm-ou-ollama-qual-usar-para-llm-na-empresa/).
2. **Embeddings e reindexação.** Gerar embeddings de milhões de páginas é uma carga de GPU em lote, que se repete quando os documentos mudam.
3. **Banco vetorial e storage.** Índices vetoriais vivem em RAM e SSD NVMe. A latência do storage aparece direto no tempo de resposta. Veja [como dimensionar storage para IA](https://blog.tyar.com.br/storage-para-ia-como-dimensionar/).

## Exemplos práticos de dimensionamento

As GPUs de referência abaixo têm memória informada pela NVIDIA: **RTX PRO 6000 Blackwell com 96 GB GDDR7** e **H200 com 141 GB HBM3e**.

**Cenário 1 — Chatbot interno com RAG sobre documentos (modelo de 8B).**
Pesos em BF16 ocupam cerca de 16 GB. Uma única RTX PRO 6000 de 96 GB sobra para pesos, KV cache de várias conversas simultâneas e o modelo de embeddings. Sem treino envolvido.

**Cenário 2 — RAG com modelo de 70B.**
Cerca de 140 GB só de pesos em BF16. Não cabe com folga em uma H200 (141 GB), então o caminho é dividir o modelo em duas GPUs (paralelismo de tensor) ou usar o modelo quantizado. A quantização reduz memória, mas é decisão de qualidade que deve ser testada com os seus dados.

**Cenário 3 — Ajustar um modelo de 8B ao jargão e ao formato de laudos da empresa.**
Com QLoRA, o mínimo é cerca de 6 GB; com LoRA em 16 bits, 22 GB. Uma estação com uma GPU de 96 GB faz o treino e ainda roda testes de inferência. Fine-tuning completo do mesmo modelo, a 18 bytes por parâmetro, já passaria de 140 GB antes das ativações.

**Cenário 4 — LoRA em modelo de 70B.**
O mínimo de 164 GB pede duas GPUs grandes no mesmo servidor (2× RTX PRO 6000 somam 192 GB; 2× H200 somam 282 GB), com espaço para batch maior. Com QLoRA (41 GB), uma RTX PRO 6000 resolve.

**Cenário 5 — Fine-tuning completo de 70B.**
Cerca de 1,26 TB só de estados de treino. Isso é território de [cluster de GPU com Slurm ou Kubernetes](https://blog.tyar.com.br/slurm-ou-kubernetes-cluster-gpu/) e rede de alta velocidade entre nós. Para a maioria das empresas, não compensa frente a LoRA ou RAG.

## Como escolher entre fine-tuning e RAG

| Necessidade | Melhor abordagem | Hardware típico |
|---|---|---|
| Responder com base em documentos que mudam toda semana | RAG | Servidor de inferência + storage NVMe |
| Citar a fonte de cada resposta | RAG | Idem |
| Padronizar formato, tom ou estilo de saída | LoRA / QLoRA | 1 GPU de 48–96 GB para modelos até ~30B |
| Ensinar uma tarefa específica (classificação, extração) | LoRA / QLoRA | Idem |
| Criar um modelo de domínio a partir de um modelo base | Fine-tuning completo | Servidor multi-GPU ou cluster |
| Validar a ideia rapidamente | Prompt | O mesmo servidor de inferência |

Uma regra útil: **se o problema é "o modelo não sabe", comece por RAG; se é "o modelo não faz do jeito certo", considere LoRA**. As duas coisas podem conviver no mesmo servidor: um adaptador LoRA treinado à noite e servido de dia junto com o pipeline de RAG.

## Erros comuns

- **Comprar GPU só pela conta dos pesos.** Treino exige gradientes e estados do otimizador; inferência exige KV cache. Dimensione pelo pior caso de uso.
- **Fazer fine-tuning para "ensinar fatos".** Documentos que mudam ficam desatualizados no modelo; RAG resolve isso sem retreino.
- **Ignorar a margem sobre o "mínimo".** Os números da Unsloth são mínimos absolutos; batch maior e sequências longas pedem folga.
- **Esquecer o storage.** Datasets de treino e índices vetoriais precisam de leitura rápida, ou a GPU fica ociosa.
- **Não planejar o crescimento.** Começar com uma GPU é razoável, mas o servidor deve ter slots, fonte e refrigeração para a segunda. Mais sobre isso em [como escolher a GPU para treinar IA pela VRAM](https://blog.tyar.com.br/melhor-gpu-para-treinar-ia-como-escolher-pela-vram/).

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega servidores e workstations para IA dimensionados para a estratégia de cada empresa, seja um servidor de inferência para RAG, uma máquina para LoRA/QLoRA ou um cluster para treino completo. São mais de 25 anos de experiência, mais de 3.600 projetos e consultoria desde o primeiro contato, com marcas homologadas e suporte pós-venda.

👉 Conheça as soluções de [Inteligência Artificial da Tyar](https://tyar.com.br/produtos/inteligencia-artificial) e, se o projeto pedir várias GPUs em rede, as opções de [Cluster](https://tyar.com.br/produtos/cluster).

---

**Fontes:**

- [Hugging Face Transformers — Model training anatomy](https://huggingface.co/docs/transformers/v4.44.2/en/model_memory_anatomy)
- [Hugging Face PEFT — Memory efficient training](https://huggingface.co/docs/peft/en/developer_guides/memory_efficient_training)
- [Unsloth — Requirements](https://unsloth.ai/docs/get-started/fine-tuning-for-beginners/unsloth-requirements)
- [Dettmers et al. — QLoRA: Efficient Finetuning of Quantized LLMs (arXiv 2305.14314)](https://arxiv.org/abs/2305.14314)
- [Hu et al. — LoRA: Low-Rank Adaptation of Large Language Models (arXiv 2106.09685)](https://arxiv.org/abs/2106.09685)
- [NVIDIA — RTX PRO 6000 Blackwell](https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000/)
- [NVIDIA — H200](https://www.nvidia.com/en-us/data-center/h200/)
