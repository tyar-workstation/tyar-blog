---
title: "Quantização de LLM: FP8, INT4 e quanta memória de GPU economiza"
slug: "quantizacao-de-llm-fp8-int4-memoria-gpu"
description: "Quantização de LLM em FP8, INT4 e NVFP4: quanta memória de GPU economiza, perda de precisão medida, GPUs compatíveis e como dimensionar o servidor."
date: "2026-11-26"
author: "Equipe Tyar"
category: "Inteligência Artificial"
tags: ["quantização de LLM", "FP8", "INT4", "NVFP4", "AWQ", "GPTQ", "KV cache FP8"]
focus_keyword: "quantização de LLM"
link_terms: ["quantização INT4", "quantização FP8", "NVFP4", "KV cache em FP8"]
reading_time: 7
cta_product: "https://tyar.com.br/produtos/inteligencia-artificial"
faq:
  - q: "Quanta memória a quantização de LLM economiza?"
    a: "Nos pesos, FP8 ocupa metade do BF16/FP16 (1 byte por parâmetro contra 2) e INT4 cerca de um quarto. O NVFP4 da NVIDIA usa cerca de 4,5 bits por valor e reduz a memória em aproximadamente 3,5 vezes frente ao FP16 e 1,8 vez frente ao FP8, segundo a NVIDIA."
  - q: "Quantizar um LLM piora muito as respostas?"
    a: "Em mais de meio milhão de avaliações com Llama 3.1 (8B, 70B e 405B), a Red Hat mediu recuperação de mais de 99% da precisão original no OpenLLM Leaderboard v1 e 99,9% (8 bits) e 98,9% (4 bits) em HumanEval. Modelos pequenos perdem mais, por isso o teste com as perguntas reais da empresa continua obrigatório."
  - q: "Qualquer GPU roda modelos em FP8?"
    a: "Não. No vLLM, FP8 W8A8 é suportado nas arquiteturas Ada Lovelace (como L40S) e Hopper (como H100 e H200), além de Blackwell. GPUs Ampere, como a A100, usam INT8 W8A8 ou INT4 (AWQ/GPTQ). O NVFP4 exige Tensor Cores de quinta geração da arquitetura Blackwell."
  - q: "Quantizar o KV cache também ajuda?"
    a: "Sim. No vLLM, armazenar o KV cache em FP8 reduz sua memória de forma significativa, o que permite guardar mais tokens, atender mais usuários simultâneos e usar contextos mais longos na mesma GPU."
---

# Quantização de LLM: FP8, INT4 e quanta memória de GPU economiza

Quantização de LLM é reduzir a precisão numérica dos pesos (e, às vezes, das ativações e do KV cache) de 16 bits para 8 ou 4 bits. Na prática, FP8 corta pela metade a memória dos pesos e INT4 ou NVFP4 a reduz para cerca de um quarto a um terço, com perda de qualidade medida em torno de 1% a 2% nos modelos grandes. Isso muda diretamente o tamanho e o custo do servidor: um modelo de 70B que exigiria duas GPUs em BF16 pode caber em uma.

Este artigo aprofunda um dos pontos do nosso [guia de infraestrutura para IA na empresa](https://blog.tyar.com.br/guia-infraestrutura-para-ia-na-empresa/).

## Resumo rápido

- Memória dos pesos = parâmetros × bytes por parâmetro: 2 bytes em BF16, 1 em FP8, cerca de 0,5 em INT4 e cerca de 0,56 em NVFP4 (4,5 bits por valor).
- A Red Hat mediu recuperação acima de 99% da precisão original em Llama 3.1 quantizado (8 e 4 bits) no OpenLLM Leaderboard v1.
- O formato depende da GPU: FP8 exige Ada, Hopper ou Blackwell; NVFP4 exige Blackwell; Ampere fica com INT8 e INT4.
- 8 bits favorece vazão em servidores com muitos usuários; 4 bits favorece latência e cenários de borda.
- Quantizar o KV cache em FP8 libera memória para mais usuários e contexto maior.

## O que é quantização de LLM e por que ela importa para o hardware?

Um LLM é, essencialmente, uma enorme lista de números (os parâmetros). Treinados em BF16 ou FP16, cada parâmetro ocupa 2 bytes. Quantizar significa representá-los com menos bits, usando fatores de escala para preservar a faixa de valores.

O efeito no hardware é duplo:

1. **Menos memória**: o modelo cabe em menos GPUs ou em GPUs menores, e sobra mais VRAM para o KV cache, que define quantos usuários são atendidos ao mesmo tempo.
2. **Mais velocidade**: a geração de tokens costuma ser limitada pela banda de memória. Ler menos bytes por token acelera a resposta. Nas medições da Red Hat com vLLM, os formatos de 8 bits (W8A8) tiveram aceleração média de 1,8 vez em cenários com várias requisições, e o W4A16 (pesos em 4 bits, ativações em 16) chegou a 2,4 vezes em fluxo único.

## Quanta memória cada formato ocupa?

A conta dos pesos é direta. Abaixo, os três tamanhos do Llama 3.1, usado nas avaliações da Red Hat:

| Modelo | BF16/FP16 (2 bytes) | FP8 / INT8 (1 byte) | NVFP4 (~4,5 bits) | INT4 (~0,5 byte) |
|---|---|---|---|---|
| 8B | ~16 GB | ~8 GB | ~4,5 GB | ~4 GB |
| 70B | ~140 GB | ~70 GB | ~39 GB | ~35 GB |
| 405B | ~810 GB | ~405 GB | ~228 GB | ~203 GB |

Os valores são só dos pesos. Escalas de quantização, camadas mantidas em precisão maior, ativações e o contexto da biblioteca somam alguns gigabytes. A Red Hat cita compressão de cerca de 2 vezes nos formatos de 8 bits e cerca de 3,5 vezes no W4A16, não exatamente 4 vezes. Para o NVFP4, a NVIDIA informa redução de aproximadamente 3,5 vezes frente ao FP16 e 1,8 vez frente ao FP8; a Red Hat mediu entre 1,5 e 1,8 vez menor que FP8 em checkpoints reais.

## Quais são os formatos de quantização mais usados?

| Formato | O que é quantizado | GPUs (vLLM) | Melhor uso |
|---|---|---|---|
| FP8 W8A8 | Pesos e ativações em FP8 | Ada (L40S), Hopper (H100/H200), Blackwell | Servidores com muitos usuários |
| INT8 W8A8 | Pesos e ativações em INT8 | Turing, Ampere (A100) e posteriores | Vazão em hardware mais antigo |
| INT4 W4A16 (AWQ, GPTQ) | Só pesos em 4 bits | AWQ: Turing em diante; GPTQ: Volta em diante | Latência baixa, borda, VRAM limitada |
| NVFP4 | Pesos (e ativações) em FP4 com escala FP8 por bloco de 16 valores | Blackwell (B200, B300, RTX PRO 6000) | Modelos grandes e MoE em Blackwell |
| GGUF (llama.cpp/Ollama) | Pesos em vários níveis de bits | Amplo, inclusive CPU | Prototipagem e workstations |

A tabela de compatibilidade do vLLM é clara num ponto que costuma passar despercebido na compra: **FP8 W8A8 não roda em Ampere**. Quem tem A100 ou planeja comprar GPUs usadas dessa geração precisa trabalhar com INT8 ou INT4. A diferença entre os servidores de inferência está detalhada em [vLLM ou Ollama: qual usar para LLM na empresa](https://blog.tyar.com.br/vllm-ou-ollama-qual-usar-para-llm-na-empresa/).

### Como funciona o NVFP4?

O NVFP4 usa valores de 4 bits no formato E2M1 e uma escala FP8 (E4M3) compartilhada por bloco de 16 valores, mais um fator FP32 por tensor. Blocos menores que os 32 valores do MXFP4 preservam melhor a faixa numérica. No DeepSeek-R1-0528, a NVIDIA relata degradação de 1% ou menos frente ao FP8 nas principais tarefas (MMLU-PRO 85 contra 84; GPQA Diamond 81 contra 80) e resultado 2 pontos melhor no AIME 2024. O formato depende dos Tensor Cores de quinta geração da arquitetura Blackwell, o que pesa na escolha entre gerações, tema de [RTX PRO 6000 Blackwell ou H200: qual GPU para IA](https://blog.tyar.com.br/rtx-pro-6000-blackwell-ou-h200-qual-gpu-para-ia/).

## Quanta qualidade se perde?

Os dados públicos mais amplos vêm de dois estudos da Red Hat:

- **Llama 3.1 (8B, 70B, 405B), mais de 500 mil avaliações**: todos os esquemas recuperaram mais de 99% da média do OpenLLM Leaderboard v1; no v2, perto de 99% em média e no mínimo 96% em todos os modelos. Em código (HumanEval), 99,9% nos modelos de 8 bits e 98,9% nos de 4 bits.
- **NVFP4 em B200**: modelos de 70B a 235B recuperaram cerca de 99%; modelos de ~30B, de 97% a 99%; modelos de 7B a 14B, de 95% a 98%.

O padrão é consistente: **quanto maior o modelo, menor a perda**. Modelos pequenos quantizados agressivamente variam mais conforme a tarefa e a calibração. Por isso, a validação com perguntas reais da empresa (contratos, chamados, código) deve vir antes de fechar o hardware.

## E o KV cache, também dá para quantizar?

Sim, e muitas vezes é aí que está o ganho de capacidade. O KV cache guarda o estado de cada conversa e cresce com o contexto e com o número de usuários. Por token, ele ocupa aproximadamente 2 × camadas × cabeças KV × dimensão da cabeça × bytes por valor. Passar de FP16 (2 bytes) para FP8 (1 byte) reduz esse volume à metade.

No vLLM, a opção `kv_cache_dtype="fp8"` (variantes E4M3 e E5M2) reduz a memória do KV cache e, segundo a documentação, permite guardar mais tokens, aumentar a vazão e suportar contextos mais longos. A própria documentação recomenda calibrar as escalas com o llm-compressor e alerta que alguns tipos de camada, como as de janela deslizante, são mais sensíveis; elas podem ser mantidas na precisão original. Em projetos de RAG, em que os trechos recuperados aumentam o contexto, esse ajuste costuma valer a pena; veja [RAG na empresa: infraestrutura necessária](https://blog.tyar.com.br/rag-na-empresa-infraestrutura-necessaria/).

## Exemplo de dimensionamento: Llama 3.1 70B

Usando as memórias publicadas pela NVIDIA (L40S com 48 GB, RTX PRO 6000 Blackwell com 96 GB, H200 com 141 GB):

| Formato | Pesos | Opção de GPU | VRAM restante para KV cache e overhead |
|---|---|---|---|
| BF16 | ~140 GB | 2× H200 (282 GB) | ~142 GB |
| FP8 | ~70 GB | 1× RTX PRO 6000 (96 GB) | ~26 GB |
| FP8 | ~70 GB | 1× H200 (141 GB) | ~71 GB |
| INT4 W4A16 | ~35 GB | 1× L40S (48 GB) | ~13 GB |

A leitura correta da tabela: em FP8, uma única GPU de 96 GB roda o modelo, mas sobra pouco para contexto longo e muitos usuários; a H200 com o mesmo FP8 atende muito mais concorrência. Em INT4, uma L40S roda o modelo para poucos usuários e contexto curto. O número de usuários simultâneos é o que decide entre essas linhas, e o método completo está em [como dimensionar GPU em um servidor para IA on-premise](https://blog.tyar.com.br/servidor-para-ia-on-premise-como-dimensionar-gpu/).

Para prototipar e testar o modelo quantizado antes de investir em servidor, uma [workstation para IA sob medida](https://workstations.tyar.com.br/) com GPU de 48 a 96 GB permite validar qualidade e latência com dados reais da empresa.

## Quando não quantizar (ou quantizar menos)?

- **Treino e fine-tuning completo**: o treino usa BF16 e precisão mista; quantização é técnica de inferência (exceção: QLoRA, que mantém o modelo base em 4 bits durante o ajuste). Veja [fine-tuning ou RAG: impacto no hardware](https://blog.tyar.com.br/fine-tuning-ou-rag-impacto-no-hardware/).
- **Modelos pequenos em tarefas críticas**: abaixo de ~14B, a perda em 4 bits é maior e precisa ser medida tarefa a tarefa.
- **Quando a VRAM sobra**: se o modelo e o KV cache já cabem com folga, 8 bits pode trazer o ganho de vazão sem o risco do 4 bits.

## Erros comuns

- **Comprar GPU Ampere planejando rodar FP8.** No vLLM, FP8 W8A8 exige Ada, Hopper ou Blackwell.
- **Dimensionar só pelos pesos quantizados.** O modelo cabe, mas sem espaço para KV cache a GPU atende poucos usuários.
- **Confiar só em benchmark público.** A recuperação média de 99% não garante o mesmo resultado em português jurídico ou no jargão técnico da empresa.
- **Usar a mesma quantização para tudo.** 8 bits rende mais em servidores com muitas requisições; 4 bits, em latência de fluxo único e na borda.
- **Esquecer o KV cache.** Quantizá-lo em FP8 pode valer mais que trocar de GPU.

## Como a Tyar pode ajudar

A Tyar dimensiona servidores e workstations para IA a partir do modelo, do formato de quantização, do contexto e do número de usuários de cada projeto, com marcas homologadas, consultoria desde o primeiro contato e suporte pós-venda. São mais de 25 anos de experiência e mais de 18.700 máquinas entregues.

Conheça as soluções de [Inteligência Artificial da Tyar](https://tyar.com.br/produtos/inteligencia-artificial) e os [servidores com GPU](https://tyar.com.br/produtos/servidores).

---

**Fontes:**

- [Red Hat Developer – We ran over half a million evaluations on quantized LLMs](https://developers.redhat.com/articles/2024/10/17/we-ran-over-half-million-evaluations-quantized-llms)
- [Red Hat Developer – Accelerating large language models with NVFP4 quantization](https://developers.redhat.com/articles/2026/02/04/accelerating-large-language-models-nvfp4-quantization)
- [NVIDIA Technical Blog – Introducing NVFP4 for Efficient and Accurate Low-precision Inference](https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/)
- [vLLM – Quantization: Supported Hardware](https://docs.vllm.ai/en/v0.10.0/features/quantization/supported_hardware.html)
- [vLLM – Quantized KV Cache](https://docs.vllm.ai/en/latest/features/quantization/quantized_kvcache.html)
- [NVIDIA L40S](https://www.nvidia.com/en-us/data-center/l40s/)
- [NVIDIA H200](https://www.nvidia.com/en-us/data-center/h200/)
- [NVIDIA RTX PRO 6000 Blackwell Series](https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000-family/)
