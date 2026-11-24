---
title: "Servidor para IA on-premise: como dimensionar GPU e memória para rodar LLMs"
slug: "servidor-para-ia-on-premise-como-dimensionar-gpu"
description: "Quanta VRAM é preciso para rodar um LLM de 8B, 70B ou 400B? Guia com fórmula, tabela de GPUs (RTX PRO 6000, H200, B200, B300) e erros comuns."
date: "2026-11-13"
author: "Equipe Tyar"
category: "Inteligência Artificial"
tags: ["servidor para IA", "GPU para LLM", "IA on-premise", "NVIDIA H200", "NVIDIA B200", "RTX PRO 6000"]
focus_keyword: "servidor para IA"
reading_time: 9
cta_product: "https://tyar.com.br/produtos/inteligencia-artificial"
faq:
  - q: "Quanta memória de GPU preciso para rodar um modelo de 70B parâmetros?"
    a: "Em FP16, só os pesos ocupam cerca de 140 GB. Somando cache de contexto e margem, conte com 170 GB ou mais, o que pede duas GPUs de 96 a 141 GB ou uma B200. Quantizado em FP8, cai para cerca de 85 GB e cabe em uma RTX PRO 6000 de 96 GB."
  - q: "Posso usar GPU GeForce em servidor de IA?"
    a: "Para testes e pequenos times, sim. Em produção, GPUs profissionais e de data center oferecem mais memória, ECC, drivers certificados e formato adequado para rack e operação 24/7."
  - q: "Vale mais a pena rodar IA na nuvem ou on-premise?"
    a: "Nuvem é melhor para uso esporádico ou picos. On-premise compensa quando a GPU fica ocupada a maior parte do tempo, quando os dados são sensíveis (LGPD, sigilo industrial) ou quando a latência local importa."
---

# Servidor para IA on-premise: como dimensionar GPU e memória para rodar LLMs

Na hora de comprar um **servidor para IA**, a primeira pergunta quase nunca é "qual GPU é mais rápida". É **"o modelo cabe na memória?"**. Se não couber, o desempenho despenca ou o modelo simplesmente não roda.

Este guia mostra como fazer essa conta, quais GPUs fazem sentido em cada cenário e os erros mais comuns que vemos em projetos de IA on-premise.

## Resumo rápido

- A memória de GPU (VRAM) necessária depende de **número de parâmetros × precisão**, mais o **cache de contexto** e uma margem.
- Para inferência: **8B** cabe em uma GPU de 24–32 GB; **70B** pede de 85 GB (FP8) a mais de 170 GB (FP16); modelos de **400B+** exigem nós com várias GPUs de data center.
- Para **treinar** ou fazer fine-tuning completo, a necessidade de memória é de 4 a 8 vezes maior do que na inferência. Técnicas como LoRA reduzem isso drasticamente.

## Passo 1: calcule a memória dos pesos

A conta base é simples:

**Memória dos pesos ≈ número de parâmetros × bytes por parâmetro**

| Precisão | Bytes por parâmetro | Modelo de 8B | Modelo de 70B | Modelo de 405B |
|---|---|---|---|---|
| FP16 / BF16 | 2 | ~16 GB | ~140 GB | ~810 GB |
| FP8 / INT8 | 1 | ~8 GB | ~70 GB | ~405 GB |
| INT4 / FP4 | 0,5 | ~4 GB | ~35 GB | ~203 GB |

A quantização (FP8, INT4) reduz memória e aumenta velocidade, com alguma perda de qualidade. Em FP8 a perda costuma ser pequena. Em 4 bits, vale testar com seus próprios dados antes de ir para produção.

## Passo 2: some o cache de contexto (KV cache)

Durante a inferência, o modelo guarda a "memória" da conversa no chamado **KV cache**. Ele cresce com:

- o tamanho do contexto (8 mil, 32 mil, 128 mil tokens…);
- o número de usuários simultâneos.

Um assistente interno com dezenas de usuários e documentos longos pode consumir **dezenas de GB só de KV cache**. Uma regra prática é reservar de **20% a 50% acima do tamanho dos pesos**, e mais se o uso for com contexto longo e muitos acessos simultâneos.

## Passo 3: escolha a GPU pela memória, depois pelo desempenho

Principais opções em 2026:

| GPU | Memória | Largura de banda | Perfil de uso |
|---|---|---|---|
| GeForce RTX 5090 | 32 GB GDDR7 | ~1,8 TB/s | Prototipagem, modelos até ~14B, desenvolvimento |
| RTX PRO 6000 Blackwell | 96 GB GDDR7 com ECC | 1,79 TB/s | Workstations e servidores de inferência; 70B em FP8 em uma única placa |
| H200 | 141 GB HBM3e | 4,8 TB/s | Inferência e treino em servidores de data center |
| B200 | 192 GB HBM3e | 8 TB/s | Modelos grandes, alta taxa de tokens por segundo |
| B300 (Blackwell Ultra) | 288 GB HBM3e | 8 TB/s | Modelos muito grandes e contextos longos |

*Especificações por GPU, versões SXM para H200/B200/B300. Fontes: NVIDIA e reviews técnicos citados ao final.*

Por que a **largura de banda** importa tanto? Na geração de texto, cada token exige ler os pesos do modelo na memória. Por isso, GPUs com HBM (H200, B200, B300) geram tokens muito mais rápido que placas GDDR com a mesma capacidade.

## Exemplos de dimensionamento

**Chatbot interno com modelo de 8B (até ~50 usuários)**
Uma única RTX PRO 6000 ou RTX 5090 resolve com folga, inclusive em FP16. Uma boa workstation de IA pode ser suficiente.

**Assistente corporativo com modelo de 70B e base documental (RAG)**
- Em FP8: uma RTX PRO 6000 (96 GB) para poucos usuários, ou duas para mais concorrência.
- Em FP16: duas H200 ou uma B200.

**Modelos de 400B+ ou treino próprio**
Aqui o caminho é um servidor com 8 GPUs de data center, interligadas por NVLink, e em muitos casos um **cluster** com rede de alta velocidade e **storage** paralelo para alimentar o treino.

## E para treinar ou fazer fine-tuning?

O treino completo guarda, além dos pesos, gradientes e estados do otimizador. Com Adam em precisão mista, a conta fica em torno de **16 bytes por parâmetro**: um modelo de 7B já passa de 110 GB.

Por isso, a maioria das empresas usa **LoRA ou QLoRA**, que treinam só uma pequena parte dos pesos e permitem ajustar modelos de 7B a 70B com uma ou poucas GPUs.

## Não esqueça o resto do servidor

A GPU é a estrela, mas um servidor de IA mal balanceado desperdiça o investimento. Fique atento a:

- **RAM do sistema:** no mínimo igual à soma das VRAMs; o ideal é o dobro.
- **Storage NVMe:** para carregar modelos e datasets rapidamente. Um modelo de 140 GB em SSD SATA leva minutos para subir.
- **Energia e refrigeração:** uma B300 pode chegar a 1.400 W. Um servidor com 8 dessas GPUs exige infraestrutura elétrica e de refrigeração planejada (muitas vezes líquida).
- **Rede:** 25/100 GbE ou InfiniBand se houver mais de um nó.

## On-premise ou nuvem?

| Critério | Nuvem | On-premise |
|---|---|---|
| Uso esporádico ou picos | ✅ | ❌ |
| GPU ocupada a maior parte do tempo | Custo alto | ✅ Melhor custo total |
| Dados sensíveis (LGPD, P&D, saúde) | Exige cuidados contratuais | ✅ Dados não saem da empresa |
| Latência e disponibilidade previsíveis | Depende do provedor | ✅ |

Uma regra comum de mercado: se a GPU fica ocupada mais da metade do tempo ao longo de um ou dois anos, o on-premise tende a sair mais barato. Mas vale fazer a conta com seus números.

## Erros comuns

1. **Comprar pela GPU mais rápida e esquecer a memória.** O modelo não cabe e acaba rodando com offload para a CPU, muito mais lento.
2. **Ignorar o KV cache.** O modelo roda nos testes, mas trava quando 30 pessoas usam ao mesmo tempo.
3. **Subdimensionar fonte e refrigeração.** O resultado é throttling e instabilidade.
4. **Não planejar crescimento.** Prefira chassis com slots e energia sobrando para adicionar GPUs depois.

## Como a Tyar pode ajudar

A Tyar projeta, monta e entrega **servidores e workstations para inteligência artificial** configurados para o seu modelo, seu número de usuários e seu orçamento. São mais de 25 anos de experiência e mais de 18.700 máquinas entregues no Brasil.

👉 [Conheça as soluções de IA da Tyar](https://tyar.com.br/produtos/inteligencia-artificial) ou fale com um especialista para dimensionar seu projeto.

---

**Fontes:**
[StorageReview – RTX PRO 6000 Blackwell](https://www.storagereview.com/review/nvidia-rtx-pro-6000-workstation-gpu-review-blackwell-architecture-and-96-gb-for-pro-workflows) ·
[Spheron – Rubin vs Blackwell vs Hopper](https://www.spheron.network/blog/nvidia-rubin-vs-blackwell-vs-hopper/) ·
[CG Channel – Review RTX 5090/5080](https://www.cgchannel.com/2025/12/review-are-the-geforce-rtx-5090-and-5080-worth-the-money-for-cg/)
