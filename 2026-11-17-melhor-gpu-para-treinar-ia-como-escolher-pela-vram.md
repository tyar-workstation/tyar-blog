---
title: "Melhor GPU para treinar IA: como escolher pela VRAM"
slug: "melhor-gpu-para-treinar-ia-como-escolher-pela-vram"
description: "Qual a melhor GPU para treinar IA? Veja quanta VRAM cada modelo exige e compare RTX 5090, RTX PRO 6000, L40S e H200 NVL com dados oficiais e reviews."
date: "2026-11-17"
author: "Equipe Tyar"
category: "Inteligência Artificial"
tags: ["GPU para IA", "treinamento de IA", "VRAM", "RTX PRO 6000", "H200", "L40S", "LLM"]
focus_keyword: "melhor GPU para treinar IA"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/inteligencia-artificial"
faq:
  - q: "Quanta VRAM é preciso para treinar um modelo de IA?"
    a: "No treinamento completo em precisão mista com o otimizador AdamW, a referência é de 16 a 18 bytes por parâmetro, sem contar as ativações. Um modelo de 7 bilhões de parâmetros exige cerca de 112 a 126 GB só para pesos, gradientes e estados do otimizador."
  - q: "A RTX 5090 serve para treinar IA?"
    a: "Serve para prototipagem, fine-tuning de modelos pequenos e inferência de modelos até cerca de 8 bilhões de parâmetros em FP16. Com 32 GB de VRAM e sem ECC, ela não comporta treinamento completo de modelos na faixa de 7B ou maiores."
  - q: "Qual a diferença entre RTX PRO 6000 Blackwell e H200 NVL para IA?"
    a: "A RTX PRO 6000 Blackwell tem 96 GB GDDR7 a 1.792 GB/s e serve tanto em workstation quanto em servidor. A H200 NVL tem 141 GB HBM3e a 4,8 TB/s, NVLink de 900 GB/s entre GPUs e é voltada a servidores de data center para modelos maiores."
---

# Melhor GPU para treinar IA: como escolher pela VRAM

A melhor GPU para treinar IA é a que comporta o seu modelo inteiro na memória de vídeo (VRAM) com folga para as ativações. Por isso, a escolha começa pela conta de memória, não pelo número de TFLOPS. Para treinamento completo em precisão mista com AdamW, reserve de 16 a 18 bytes por parâmetro; para inferência em FP16, 2 bytes por parâmetro mais cerca de 20% de overhead. Com esses números, fica claro quando uma RTX 5090 basta, quando a RTX PRO 6000 Blackwell (96 GB) é o ponto de equilíbrio e quando é preciso partir para H200 NVL em servidor.

## Resumo rápido

- **Regra de memória para treino:** 16 a 18 bytes por parâmetro (pesos + gradientes + estados do AdamW), sem contar ativações.
- **Regra para inferência:** 2 bytes/parâmetro em FP16, 1 byte em INT8, multiplicado por cerca de 1,2 de overhead.
- **RTX 5090 (32 GB):** boa para prototipagem, modelos pequenos e inferência de LLMs de até ~8B em FP16.
- **RTX PRO 6000 Blackwell (96 GB, ECC):** melhor custo de VRAM por placa para workstations e servidores de IA departamentais.
- **H200 NVL (141 GB HBM3e, 4,8 TB/s):** para modelos grandes, multi-GPU com NVLink e ambientes compartilhados via MIG.

## Quanta VRAM o seu modelo precisa

A memória da GPU é o primeiro gargalo. Se o modelo não cabe, você precisa dividir o trabalho entre várias placas ou recorrer a técnicas de economia de memória, o que muda todo o projeto do servidor.

### Treinamento completo (full fine-tuning ou pré-treino)

Segundo o guia *Transformer Math 101*, da EleutherAI, o treinamento em precisão mista com AdamW consome:

| Componente | Bytes por parâmetro |
|---|---|
| Pesos em FP16/BF16 | 2 |
| Estados do otimizador AdamW (cópia FP32 + momento + variância) | 12 |
| Gradientes | 2 (FP16) ou 4 (FP32) |
| **Total, sem ativações** | **16 a 18** |

A documentação do Hugging Face chega aos mesmos 18 bytes por parâmetro (6 de pesos, 8 de otimizador e 4 de gradientes) e lembra que as ativações variam com tamanho de lote, comprimento de sequência e arquitetura. O próprio exemplo da documentação: treinar um modelo de 4 bilhões de parâmetros em precisão mista com lote 16 exige cerca de 85 GB de memória de GPU.

Aplicando a regra:

| Modelo | Memória sem ativações (16–18 B/param) |
|---|---|
| 1B parâmetros | 16 a 18 GB |
| 4B parâmetros | 64 a 72 GB |
| 7B parâmetros | 112 a 126 GB |
| 13B parâmetros | 208 a 234 GB |

### Inferência

Para servir um modelo já treinado, a conta é bem menor: 2 bytes por parâmetro em FP16/BF16 e 1 byte em INT8, com overhead de até 20% (EleutherAI). Exemplos:

- Llama de 8B em FP16: 8 × 2 × 1,2 ≈ **19,2 GB**.
- Modelo de 70B em INT8: 70 × 1 × 1,2 ≈ **84 GB**.
- Modelo de 70B em FP16: 70 × 2 × 1,2 ≈ **168 GB**.

O cache de contexto (KV cache) cresce com o número de usuários simultâneos e o tamanho do contexto, então trate esses valores como piso.

## Comparativo das GPUs mais usadas para IA

| GPU | VRAM | Largura de banda | Potência máx. | ECC | MIG | Onde se encaixa |
|---|---|---|---|---|---|---|
| GeForce RTX 5090 | 32 GB GDDR7 | 1.792 GB/s | 575 W | Não | Não | Workstation de desenvolvimento |
| RTX PRO 6000 Blackwell (Workstation) | 96 GB GDDR7 | 1.792 GB/s | 600 W | Sim | Até 4 instâncias | Workstation ou servidor de IA |
| L40S | 48 GB GDDR6 | 864 GB/s | 350 W | Sim | Não | Servidor de inferência e gráficos |
| H200 NVL | 141 GB HBM3e | 4,8 TB/s | Até 600 W | Sim | Até 7 instâncias | Servidor de data center, multi-GPU |

Dados de NVIDIA (RTX PRO 6000, L40S), datasheet NVIDIA H200 distribuído pela PNY e review da Tom's Hardware (RTX 5090).

Dois pontos que a tabela não mostra diretamente:

- **Largura de banda pesa mais na inferência de LLMs.** Gerar cada token exige ler os pesos da memória; por isso os 4,8 TB/s da H200 fazem diferença em modelos grandes.
- **Interconexão pesa no treino multi-GPU.** A H200 NVL aceita ponte NVLink de 2 ou 4 vias com 900 GB/s por GPU. A L40S não tem NVLink, e a comunicação entre placas fica limitada ao PCIe.

## Qual GPU escolher para cada cenário

### Prototipagem e modelos pequenos

Para cientistas de dados que testam arquiteturas, fazem fine-tuning de modelos de até ~1B ou rodam LLMs de até 8B em FP16, uma workstation com **RTX 5090** resolve. Os 32 GB comportam os ~19 GB de um modelo 8B em inferência. O limite está na ausência de ECC e na VRAM para treinos maiores.

### Fine-tuning e inferência de modelos médios

A **RTX PRO 6000 Blackwell** é o ponto de equilíbrio. Com 96 GB e ECC, uma única placa roda um modelo de 70B em INT8 (~84 GB) e treina por completo modelos de até ~4B, dependendo do lote. Duas placas somam 192 GB, suficientes para 70B em FP16 na inferência. O MIG com até quatro instâncias isoladas permite dividir a GPU entre usuários.

### Inferência em escala com consumo moderado

A **L40S** (48 GB, 350 W) é uma opção para servidores com várias GPUs voltados a inferência de modelos médios, renderização e virtualização gráfica. Como não tem NVLink nem MIG, não é a melhor escolha para treino distribuído.

### Treinamento de modelos grandes

Para treino completo de modelos de 7B para cima, a conta de 112 a 126 GB (sem ativações) já ultrapassa uma placa de 96 GB. Aqui entram servidores com **H200 NVL**: 141 GB por GPU, NVLink de 900 GB/s e até sete instâncias MIG para dividir a máquina entre equipes. Um servidor com quatro H200 NVL interligadas soma 564 GB de HBM3e.

## Erros comuns na compra de GPU para IA

1. **Escolher pelo TFLOPS e esquecer a VRAM.** Uma GPU rápida que não comporta o modelo obriga a particionar o treino e perde desempenho na comunicação.
2. **Esquecer as ativações e o KV cache.** As regras de bytes por parâmetro são o piso. Lotes maiores e contextos longos pedem folga de memória.
3. **Usar placas de consumo em produção 24/7.** Sem ECC, erros de memória podem corromper treinos longos sem aviso.
4. **Subdimensionar fonte e refrigeração.** RTX 5090 e RTX PRO 6000 chegam a 575 W e 600 W por placa. Quatro GPUs exigem projeto elétrico e térmico próprio.
5. **Ignorar storage e rede.** GPUs paradas esperando dados são capital ocioso. O armazenamento precisa acompanhar a leitura dos datasets.
6. **Montar multi-GPU sem interconexão adequada.** Para treino distribuído, prefira plataformas com NVLink ou rede de alta velocidade entre nós.

## Como escolher em 4 passos

1. Defina o maior modelo que você vai treinar e o maior que vai servir.
2. Calcule a memória: 16–18 B/param para treino; 1–2 B/param × 1,2 para inferência.
3. Some folga para ativações, lote e contexto, e divida pela VRAM de cada GPU para saber quantas placas precisa.
4. Escolha o formato (workstation, servidor ou cluster) e dimensione energia, refrigeração e storage para essa configuração.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega workstations e servidores de IA com GPUs NVIDIA para empresas de todos os portes, com mais de 25 anos de experiência, mais de 3.600 projetos e mais de 18.700 máquinas entregues. Nossa consultoria faz a conta de memória com você desde o primeiro contato, escolhe a GPU certa para o seu modelo e acompanha o projeto com suporte pós-venda.

👉 Conheça as soluções de [Inteligência Artificial da Tyar](https://tyar.com.br/produtos/inteligencia-artificial) ou, para desenvolvimento local, as [Workstations Tyar](https://tyar.com.br/produtos/workstations).

**Fontes:** [NVIDIA RTX PRO 6000 Blackwell Workstation Edition](https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000/) · [NVIDIA L40S](https://www.nvidia.com/en-eu/data-center/l40s/) · [Datasheet NVIDIA H200 (PNY)](https://www.pny.com/File%20Library/Company/Support/linecards/data-center-gpus/h200-nvl-datasheet.pdf) · [Tom's Hardware: review GeForce RTX 5090](https://www.tomshardware.com/pc-components/gpus/nvidia-geforce-rtx-5090-review) · [EleutherAI: Transformer Math 101](https://blog.eleuther.ai/transformer-math/) · [Hugging Face: GPU memory usage](https://huggingface.co/docs/transformers/main/en/model_memory_anatomy)
