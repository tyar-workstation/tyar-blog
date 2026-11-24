---
title: "NVIDIA DGX Spark vale a pena? Quando usar e quando não usar"
slug: "nvidia-dgx-spark-vale-a-pena-para-empresas"
description: "Veja o que o NVIDIA DGX Spark entrega em IA local: 128 GB de memória unificada, limites de banda e quando um servidor com GPU dedicada faz mais sentido."
date: "2026-11-20"
author: "Equipe Tyar"
category: "Inteligência Artificial"
tags: ["DGX Spark", "NVIDIA GB10", "IA local", "LLM on-premise", "inferência", "fine-tuning", "RTX PRO 6000"]
focus_keyword: "DGX Spark vale a pena"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/inteligencia-artificial"
faq:
  - q: "Qual o tamanho máximo de modelo que o DGX Spark roda?"
    a: "Segundo a NVIDIA, uma unidade roda inferência de modelos de até 200 bilhões de parâmetros e fine-tuning de até 70 bilhões. Duas unidades conectadas via ConnectX-7 chegam a modelos de até 405 bilhões de parâmetros."
  - q: "O DGX Spark substitui um servidor com GPU para atender vários usuários?"
    a: "Na maioria dos casos, não. A memória unificada de 273 GB/s limita a velocidade de geração de tokens. Para chatbots internos com muitos usuários simultâneos, servidores com GPUs dedicadas de alta banda entregam mais throughput por requisição."
  - q: "Que sistema operacional o DGX Spark usa?"
    a: "Ele vem com o NVIDIA DGX OS, baseado em Ubuntu, com a pilha de software de IA da NVIDIA. A CPU é Arm de 20 núcleos, então é preciso confirmar se as ferramentas da sua equipe têm versão para Arm64."
---

# NVIDIA DGX Spark vale a pena? Quando usar e quando não usar

O DGX Spark vale a pena para quem precisa **prototipar, testar e ajustar modelos grandes de IA localmente**, numa mesa, com 128 GB de memória acessível pela GPU. Ele não é a melhor escolha para **servir um modelo em produção para muitos usuários**: a banda de memória de 273 GB/s limita a velocidade de geração de texto, e aí um servidor com GPUs dedicadas entrega mais. A decisão depende menos do "poder" do equipamento e mais do tipo de carga que a empresa vai rodar.

## Resumo rápido

- O DGX Spark usa o superchip **GB10 Grace Blackwell**: GPU Blackwell com 6.144 núcleos CUDA, CPU Arm de 20 núcleos e **128 GB de LPDDR5x unificada**.
- A NVIDIA indica inferência de modelos de **até 200 bilhões de parâmetros** e fine-tuning de **até 70 bilhões**; duas unidades interligadas chegam a 405 bilhões.
- O gargalo é a **banda de memória (273 GB/s)**. Uma RTX PRO 6000 Blackwell tem 1.792 GB/s, cerca de 6,5 vezes mais.
- Bom para: laboratório de IA, P&D, validação de modelos, fine-tuning e agentes locais com dados sensíveis.
- Ruim para: chatbot corporativo com dezenas de usuários simultâneos, latência baixa em produção e treinamento pesado.

## O que é o DGX Spark

O DGX Spark é um computador compacto de IA da NVIDIA, com 150 × 150 × 50,5 mm e 1,2 kg. Ele roda o **DGX OS**, baseado em Ubuntu, já com a pilha de software de IA da NVIDIA. A ideia é dar ao desenvolvedor um ambiente com a mesma arquitetura de software dos sistemas DGX de datacenter, para que um projeto validado na mesa migre depois para servidores maiores.

### Especificações principais

| Item | DGX Spark |
|---|---|
| Chip | NVIDIA GB10 Grace Blackwell (TDP de 140 W, CPU + GPU) |
| GPU | Blackwell, 6.144 núcleos CUDA, Tensor Cores de 5ª geração |
| CPU | 20 núcleos Arm (10× Cortex-X925 + 10× Cortex-A725) |
| Memória | 128 GB LPDDR5x unificada e coerente, 256 bits |
| Banda de memória | 273 GB/s |
| Desempenho de IA | Até 1 PFLOP em FP4 **com esparsidade** |
| Armazenamento | 1 TB ou 4 TB NVMe M.2 com autocriptografia |
| Rede | 10 GbE, Wi-Fi 7, ConnectX-7 (2× QSFP, 200 Gb/s) |
| Fonte | Externa de 240 W |

Um detalhe que a ficha técnica não deixa óbvio: o 1 PFLOP só vale para cargas NVFP4 que aproveitam esparsidade. O Tom's Hardware lembra que, sem esparsidade, o pico cai pela metade, para cerca de 500 TFLOPS. Nos testes do StorageReview, o desempenho medido foi de 99,8 TFLOPS em BF16 e 207,7 TFLOPS em FP8.

## Onde o DGX Spark se destaca

### Capacidade de memória para modelos grandes

O diferencial é a **quantidade** de memória, não a velocidade. Com 128 GB acessíveis pela GPU, cabem modelos que não entram numa placa de 24 ou 32 GB. Nos testes do StorageReview, o GPT-OSS 120B em NVFP4 rodou a 31,4 tokens/s com um usuário, ritmo confortável para leitura humana.

### Fine-tuning local

A NVIDIA indica fine-tuning de modelos de até 70 bilhões de parâmetros (com técnicas de eficiência como LoRA/QLoRA). O StorageReview fez fine-tuning completo de um modelo de 8B: o Qwen3 8B exigiu cerca de 132 GB com Adam padrão e cerca de 70 GB com Adam de 8 bits. Para quem precisa adaptar um modelo a documentos internos sem enviar dados para a nuvem, isso resolve muita coisa.

### Escalar para duas unidades

As portas ConnectX-7 permitem ligar dois DGX Spark e trabalhar com modelos de até 405 bilhões de parâmetros. É uma forma de testar modelos muito grandes sem investir de saída num servidor multi-GPU.

## Onde ele não é a melhor escolha

### A banda de memória limita a geração de tokens

Na geração de texto (fase de *decode*), cada token novo exige ler os pesos do modelo na memória. Por isso a banda pesa mais que o poder de cálculo. O StorageReview resume: o *prefill* é competitivo, mas o *decode* expõe a limitação de banda. Compare:

| Equipamento | Memória | Banda de memória | Consumo |
|---|---|---|---|
| DGX Spark (sistema completo) | 128 GB LPDDR5x unificada | 273 GB/s | Fonte de 240 W |
| RTX PRO 6000 Blackwell Workstation Edition (só a placa) | 96 GB GDDR7 com ECC | 1.792 GB/s | 600 W |

A RTX PRO 6000 tem um pouco menos memória, mas cerca de 6,5 vezes mais banda. Para um modelo que cabe nos 96 GB, a geração tende a ser bem mais rápida na GPU dedicada.

### Números reais de throughput

Resultados do StorageReview com vLLM (tokens/s somando todas as requisições):

| Modelo e precisão | 1 usuário | Com concorrência |
|---|---|---|
| Llama 3.1 8B FP4 | 34,1 | 924,1 (128 req.) |
| Llama 3.1 8B BF16 | 13,6 | 408,6 (128 req.) |
| Qwen3 Coder 30B-A3B FP8 | 46,5 | 482,6 (64 req.) |
| Mistral Small 3.1 24B BF16 | 5,3 | 158,9 (128 req.) |
| GPT-OSS 120B NVFP4 | 31,4 | 162,7 (64 req.) |

Dois pontos práticos: a precisão faz enorme diferença (o Llama 3.1 8B em FP4 é 2,5 vezes mais rápido que em BF16 para um usuário), e modelos densos em BF16, como o Mistral Small 24B, ficam lentos para uso interativo. Com 64 usuários no GPT-OSS 120B, cada um recebe em média cerca de 2,5 tokens/s, pouco para um chatbot corporativo.

### Arquitetura Arm e I/O

A CPU é Arm, não x86. Bibliotecas Python e contêineres comuns de IA já têm versão Arm64, mas ferramentas legadas ou softwares proprietários podem não ter. O SSD interno M.2 2242 é prático, mas o StorageReview o considera limitado para cargas pesadas de I/O; para datasets grandes, vale planejar acesso a um storage em rede.

## Como escolher: DGX Spark, workstation ou servidor

| Cenário | Melhor caminho |
|---|---|
| Cientista de dados testando modelos de 70B a 200B | DGX Spark |
| Fine-tuning de modelos pequenos e médios com dados sigilosos | DGX Spark ou workstation com GPU profissional |
| Desenvolvedor que também usa CUDA em x86, render ou simulação | Workstation com RTX PRO |
| Chatbot/RAG interno para dezenas ou centenas de usuários | Servidor com GPUs dedicadas de alta banda |
| Treinamento de modelos do zero ou datasets grandes | Servidor multi-GPU ou cluster com storage dedicado |

Perguntas que ajudam a decidir:

1. **Quantos usuários simultâneos?** Se forem mais que poucos, priorize banda de memória e várias GPUs.
2. **Qual o maior modelo e em que precisão?** Calcule a memória necessária (pesos + cache KV) antes de escolher.
3. **O software roda em Arm64?** Confirme antes da compra.
4. **É laboratório ou produção?** Laboratório tolera menos throughput; produção exige redundância, monitoramento e suporte.

## Erros comuns

- **Comparar só o "1 PFLOP".** O número é teórico em FP4 com esparsidade. Para LLMs, olhe primeiro a banda de memória.
- **Usar o Spark como servidor de produção.** Ele não foi pensado para alta disponibilidade, fontes redundantes ou dezenas de usuários.
- **Rodar modelos em BF16 sem necessidade.** Precisões FP8 e FP4 multiplicam o throughput com perda de qualidade que deve ser validada caso a caso.
- **Ignorar o armazenamento.** Datasets e checkpoints crescem rápido; 4 TB internos acabam logo num projeto real.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega hardware de alta performance para IA há mais de 25 anos, com mais de 3.600 projetos realizados. Antes da compra, nossa consultoria ajuda a dimensionar memória, banda e número de GPUs a partir do modelo, da precisão e da quantidade de usuários do seu caso, seja para um laboratório de P&D, seja para um ambiente de produção com suporte pós-venda.

👉 Conheça nossas soluções em [Inteligência Artificial](https://tyar.com.br/produtos/inteligencia-artificial) e os [Servidores](https://tyar.com.br/produtos/servidores) para cargas de IA em produção.

---

**Fontes:**

- [NVIDIA DGX Spark User Guide – Hardware Overview](https://docs.nvidia.com/dgx/dgx-spark/hardware.html)
- [NVIDIA DGX Spark – página do produto](https://www.nvidia.com/en-us/products/workstations/dgx-spark/)
- [StorageReview – NVIDIA DGX Spark Review](https://www.storagereview.com/review/nvidia-dgx-spark-review-the-ai-appliance-bringing-datacenter-capabilities-to-desktops)
- [Tom's Hardware – Nvidia DGX Spark review](https://www.tomshardware.com/pc-components/gpus/nvidia-dgx-spark-review/2)
- [NVIDIA RTX PRO 6000 Blackwell Workstation Edition](https://www.nvidia.com/en-eu/products/workstations/professional-desktop-gpus/rtx-pro-6000)
