---
title: "Infraestrutura para IA na empresa: guia completo"
slug: "guia-infraestrutura-para-ia-na-empresa"
description: "Guia de infraestrutura para IA na empresa: GPU, servidor, LLM on-premise, RAG, storage, rede, cluster, energia, LGPD e custos, com exemplos por caso."
date: "2026-11-25"
author: "Equipe Tyar"
category: "Inteligência Artificial"
tags: ["infraestrutura para IA", "servidor com GPU", "LLM on-premise", "RAG", "cluster de GPU", "quantização", "LGPD"]
focus_keyword: "infraestrutura para IA na empresa"
link_terms: ["infraestrutura para IA", "guia de infraestrutura para IA", "IA on-premise na empresa"]
reading_time: 13
cta_product: "https://tyar.com.br/produtos/inteligencia-artificial"
pillar: true
faq:
  - q: "Qual é o primeiro passo para montar infraestrutura para IA na empresa?"
    a: "Definir a carga: inferência de um modelo pronto, RAG sobre documentos internos ou treino e fine-tuning. Com o modelo, a precisão (FP16, FP8, INT4), o contexto e o número de usuários simultâneos definidos, dá para calcular a memória de GPU necessária e, a partir dela, servidor, storage, rede e energia."
  - q: "Quanta memória de GPU um LLM precisa?"
    a: "Como ponto de partida, os pesos ocupam o número de parâmetros multiplicado pelos bytes por parâmetro: 2 bytes em FP16/BF16, 1 byte em FP8 e cerca de 0,5 byte em INT4. Um modelo de 70 bilhões de parâmetros ocupa perto de 140 GB em FP16 e 35 GB em INT4, antes de somar o KV cache, que cresce com o contexto e com os usuários simultâneos."
  - q: "Vale mais a pena IA on-premise ou GPU na nuvem?"
    a: "Depende da taxa de uso. Para experimentos curtos e picos esporádicos, a nuvem é flexível. Para uso contínuo, dados sensíveis sob a LGPD ou necessidade de latência previsível, servidores próprios tendem a ter TCO menor e dão controle total sobre onde os dados ficam. A comparação deve ser feita com a utilização real esperada em 3 a 5 anos."
---

# Infraestrutura para IA na empresa: guia completo

Infraestrutura para IA na empresa é o conjunto de GPUs, servidores, storage, rede, software de serviço de modelos, energia e refrigeração dimensionado para uma carga específica: rodar um LLM interno, responder perguntas sobre documentos com RAG, treinar ou ajustar modelos, ou processar imagens e vídeo. O ponto de partida não é escolher a GPU mais potente, e sim descrever a carga. A memória de GPU necessária sai do tamanho do modelo, da precisão numérica, do contexto e do número de usuários simultâneos; o resto da arquitetura (servidor, storage, rede, rack) é consequência dessa conta.

Este guia reúne a visão geral do tema e aponta para os artigos aprofundados do blog da Tyar em cada etapa.

## Resumo rápido

- A memória da GPU (VRAM) é o primeiro limite: pesos do modelo + KV cache + margem precisam caber nela.
- Precisão muda tudo: o mesmo modelo de 70B ocupa ~140 GB em FP16, ~70 GB em FP8 e ~35 GB em INT4, só em pesos.
- Inferência e RAG pedem foco em memória e latência; treino pede várias GPUs interligadas, storage com alta banda de escrita e rede de baixa latência.
- Um servidor com 8 GPUs de data center pode consumir cerca de 14 kW, o que exige planejamento de energia e refrigeração antes da compra.
- Rodar on-premise mantém dados sensíveis sob controle direto da empresa, o que simplifica a conformidade com a LGPD.

## Quais cargas de IA a empresa vai rodar?

Antes de qualquer especificação, classifique o projeto em uma (ou mais) destas cargas:

| Carga | Exemplo | O que mais pesa no hardware |
|---|---|---|
| Inferência de LLM | Chatbot interno, copiloto de código | VRAM (pesos + KV cache), banda de memória, latência |
| RAG | Perguntas sobre contratos, manuais, chamados | VRAM do LLM + CPU/RAM/NVMe para o banco vetorial e embeddings |
| Fine-tuning | Adaptar um modelo ao vocabulário da empresa | VRAM para pesos, gradientes e otimizador; storage para checkpoints |
| Treino do zero ou pré-treino continuado | Modelos próprios, pesquisa | Várias GPUs com interconexão rápida, cluster, storage paralelo |
| Visão computacional | Inspeção de qualidade, contagem, segurança | Throughput de inferência, decodificação de vídeo, inferência na borda |

A maioria das empresas brasileiras começa por inferência e RAG. Treino do zero é exceção. Essa distinção evita o erro mais caro do setor: comprar um cluster de treino para uma carga que cabe em um servidor de inferência bem dimensionado.

## Servidor com GPU para IA: por onde começar

O servidor de IA é, em essência, uma plataforma para alimentar GPUs: processadores com linhas PCIe suficientes, RAM proporcional à VRAM, NVMe local para modelos e dados ativos, fontes redundantes e fluxo de ar (ou refrigeração líquida) para dissipar centenas de watts por placa. Há dois formatos principais:

- **Servidores PCIe** com 2 a 8 GPUs (como L40S ou RTX PRO 6000 Server Edition): flexíveis, refrigerados a ar, bons para inferência, RAG, visão computacional e fine-tuning moderado.
- **Plataformas HGX/SXM** com 8 GPUs interligadas por NVLink (H200, B200, B300): voltadas a modelos grandes, treino e inferência de alta concorrência.

O passo a passo de dimensionamento está em [como dimensionar GPU em um servidor para IA on-premise](https://blog.tyar.com.br/servidor-para-ia-on-premise-como-dimensionar-gpu/).

## Como escolher a GPU (H200, B200, B300, RTX PRO 6000, L40S)

A escolha começa pela memória e pela banda de memória, porque a geração de tokens em LLMs costuma ser limitada pela velocidade com que a GPU lê os pesos.

| GPU | Memória | Banda de memória | Potência máxima | Perfil típico |
|---|---|---|---|---|
| L40S | 48 GB GDDR6 ECC | 864 GB/s | 350 W | Inferência de modelos médios, visão, gráficos |
| RTX PRO 6000 Blackwell Server Edition | 96 GB GDDR7 ECC | — | 400 a 600 W | Inferência e fine-tuning em servidores PCIe |
| H200 (SXM) | 141 GB HBM3e | 4,8 TB/s | até 700 W | Inferência de LLMs grandes, treino |
| B200 (no DGX B200) | 1.440 GB no sistema de 8 GPUs (180 GB por GPU) | 64 TB/s agregados | ~14,3 kW o sistema | Treino e inferência em escala |
| B300 (Blackwell Ultra) | 288 GB HBM3e | 8 TB/s | — | Modelos muito grandes, contexto longo |

Segundo a NVIDIA, a H200 acelera a inferência de LLMs em até 2 vezes frente à H100 (1,9x em Llama 2 70B). A B300, segundo o anúncio coberto pelo Tom's Hardware, traz 50% mais memória e computação FP4 que a B200 (15 petaflops FP4 densos contra 10).

Para aprofundar:

- [Melhor GPU para treinar IA: como escolher pela VRAM](https://blog.tyar.com.br/melhor-gpu-para-treinar-ia-como-escolher-pela-vram/)
- [RTX PRO 6000 Blackwell ou H200: qual GPU para IA](https://blog.tyar.com.br/rtx-pro-6000-blackwell-ou-h200-qual-gpu-para-ia/)

## Quanta memória um LLM precisa? Quantização (FP8, INT4) na prática

A conta básica dos pesos é: **parâmetros × bytes por parâmetro**.

| Modelo | FP16/BF16 (2 bytes) | FP8 (1 byte) | INT4 (~0,5 byte) |
|---|---|---|---|
| 8B | ~16 GB | ~8 GB | ~4 GB |
| 32B | ~64 GB | ~32 GB | ~16 GB |
| 70B | ~140 GB | ~70 GB | ~35 GB |

A essa memória soma-se o **KV cache**, que guarda o estado da conversa de cada usuário e cresce com o tamanho do contexto e com o número de requisições simultâneas. Em produção, o KV cache pode ocupar tanto quanto os pesos. O artigo que apresentou o vLLM mostrou que sistemas anteriores aproveitavam só 20,4% a 38,2% da memória de KV cache para estados reais de tokens, por fragmentação e duplicação, o que explica por que o software de serviço importa tanto quanto a GPU.

Quantizar para FP8 ou INT4 reduz a memória e aumenta a vazão, com alguma perda de qualidade que precisa ser testada no caso real da empresa. Regra prática: valide o modelo quantizado com perguntas reais antes de fechar o hardware.

## LLM on-premise: vLLM, Ollama, TGI e llama.cpp

O software que serve o modelo define quantos usuários a mesma GPU atende:

- **vLLM**: focado em alta concorrência; com o PagedAttention, os autores relatam vazão 2 a 4 vezes maior que sistemas como FasterTransformer e Orca, com a mesma latência.
- **Ollama** e **llama.cpp**: simples de instalar, ótimos para prototipar, workstations e poucos usuários; suportam modelos quantizados em CPU e GPU.
- **TGI (Text Generation Inference)**: servidor de inferência da Hugging Face, comum em ambientes já integrados ao ecossistema dela.

A comparação detalhada está em [vLLM ou Ollama: qual usar para LLM na empresa](https://blog.tyar.com.br/vllm-ou-ollama-qual-usar-para-llm-na-empresa/).

## RAG na empresa: o que muda na infraestrutura

RAG (Retrieval-Augmented Generation) busca trechos relevantes nos documentos da empresa e os entrega ao LLM junto com a pergunta. Isso acrescenta três componentes:

1. **Modelo de embeddings**, que transforma documentos e perguntas em vetores (leve, roda em GPU menor ou até CPU).
2. **Banco vetorial**, que precisa de RAM e NVMe rápidos para buscas com baixa latência.
3. **Contexto maior no LLM**, porque os trechos recuperados entram no prompt e aumentam o KV cache por requisição.

Na prática, um projeto de RAG pede mais VRAM por usuário que um chatbot simples e um servidor com boa RAM e NVMe para a base de documentos.

## Fine-tuning × RAG × prompt: impacto no hardware

| Abordagem | Quando usar | Impacto no hardware |
|---|---|---|
| Engenharia de prompt | Ajustar tom e formato | Nenhum além da inferência |
| RAG | Responder com base em documentos que mudam | VRAM extra para contexto + banco vetorial |
| Fine-tuning com LoRA/QLoRA | Ensinar estilo, formato ou vocabulário específico | GPU com VRAM folgada por horas ou dias |
| Fine-tuning completo | Mudanças profundas no modelo | Várias GPUs; com Adam e precisão mista, ~16 bytes por parâmetro só em estados do modelo |

Na maioria dos casos corporativos, RAG resolve o problema de conhecimento e fine-tuning resolve o problema de comportamento. Começar por RAG costuma exigir menos hardware.

## Quanto custa um servidor de IA e TCO × nuvem

O custo de um servidor de IA varia com o número e o modelo de GPUs, e o preço das placas oscila com câmbio e disponibilidade. Por isso, a conta certa é o TCO em 3 a 5 anos, comparando:

- aquisição, suporte e garantia do servidor;
- energia e refrigeração (incluindo a eficiência do datacenter);
- custo por hora de GPU na nuvem × horas de uso real por mês;
- transferência de dados e armazenamento na nuvem.

Quanto maior a utilização contínua das GPUs, mais o on-premise tende a compensar. A metodologia está em [servidor próprio ou nuvem: como calcular o TCO](https://blog.tyar.com.br/servidor-proprio-ou-nuvem-como-calcular-tco/).

## Storage para IA

Em treino, o storage precisa ler o dataset rápido o suficiente para não deixar GPUs ociosas e gravar checkpoints sem travar o cluster. A referência do DGX SuperPOD B200 da NVIDIA sugere 40 GB/s de leitura e 20 GB/s de escrita por unidade escalável no perfil Standard. Em inferência e RAG, a prioridade é latência e IOPS para carregar modelos e consultar a base vetorial. Detalhes em [storage para IA: como dimensionar](https://blog.tyar.com.br/storage-para-ia-como-dimensionar/).

## Rede para IA: InfiniBand, RoCE, 400/800G

Um servidor isolado usa NVLink internamente e Ethernet comum para acesso. A partir de dois ou mais servidores trabalhando no mesmo treino, a rede entre GPUs vira parte do desempenho. O DGX B200, por exemplo, sai de fábrica com 8 portas ConnectX-7 de até 400 Gb/s para a malha de computação. A escolha entre InfiniBand e Ethernet com RoCE envolve latência, custo, conhecimento da equipe e escala; veja [InfiniBand ou Ethernet para cluster HPC e IA](https://blog.tyar.com.br/infiniband-ou-ethernet-para-cluster-hpc-e-ia/).

## Cluster de GPU: Slurm ou Kubernetes

Com várias GPUs e vários times, alguém precisa distribuir os recursos. Slurm é o padrão em HPC e treino em lote; Kubernetes domina serviços de inferência e MLOps. Muitas empresas usam os dois. A comparação está em [Slurm ou Kubernetes para cluster de GPU](https://blog.tyar.com.br/slurm-ou-kubernetes-cluster-gpu/).

## Energia e refrigeração

É aqui que muitos projetos travam depois da compra. Referências:

- Uma L40S consome até 350 W; uma RTX PRO 6000 Server Edition, de 400 a 600 W.
- Uma H200 SXM chega a 700 W.
- Um DGX B200 completo consome cerca de 14,3 kW, em 10U.

Um único servidor HGX pode ultrapassar a capacidade elétrica e térmica de um rack corporativo tradicional. Antes de comprar, verifique circuitos, redundância de energia, capacidade de ar-condicionado por rack e, nas gerações mais densas, a viabilidade de refrigeração líquida.

## IA e LGPD: dados sensíveis on-premise

Quando o RAG ou o fine-tuning envolve dados pessoais (clientes, pacientes, colaboradores), a LGPD entra no projeto. Usar APIs ou GPUs na nuvem com processamento fora do Brasil caracteriza transferência internacional de dados, regulamentada pela Resolução CD/ANPD nº 19, de 23 de agosto de 2024, que exige mecanismos como cláusulas-padrão contratuais, cláusulas específicas ou normas corporativas globais. Rodar o modelo on-premise mantém os dados dentro do ambiente da empresa, o que simplifica a governança, o controle de acesso e a auditoria. Não elimina obrigações da LGPD, mas reduz a superfície de risco.

## Workstation para IA, ciência de dados e edge AI

Nem todo projeto começa no datacenter:

- **Workstations com GPU** profissional servem para cientistas de dados prototiparem, rodarem modelos quantizados localmente e fazerem fine-tuning leve. A RTX PRO 6000 Blackwell tem versões Workstation (600 W) e Max-Q (300 W), ambas com 96 GB.
- **Sistemas compactos** como o DGX Spark ocupam um nicho entre workstation e servidor; veja [se o NVIDIA DGX Spark vale a pena para empresas](https://blog.tyar.com.br/nvidia-dgx-spark-vale-a-pena-para-empresas/).
- **Edge AI** leva a inferência para perto da câmera ou da máquina, essencial em visão computacional industrial, onde latência e conectividade limitam o envio de vídeo ao datacenter.

## MLOps e monitoramento de GPU

Infraestrutura de IA em produção precisa de observabilidade: uso e memória de cada GPU, temperatura, consumo, erros de memória, latência por requisição e tokens por segundo. Ferramentas como NVIDIA DCGM, Prometheus e Grafana são comuns nessa camada. Sem monitoramento, não há como saber se as GPUs estão ociosas (dinheiro parado) ou saturadas (usuários esperando).

## Dimensionamento por caso de uso

Exemplos de ponto de partida, sempre a validar com testes de carga:

| Caso | Modelo típico | Configuração inicial |
|---|---|---|
| Chatbot interno, dezenas de usuários | 8B a 32B, FP8 ou INT4 | 1 servidor com 1 a 2 GPUs de 48 a 96 GB + vLLM |
| Análise de documentos com RAG | 32B a 70B + embeddings | 1 servidor com 2 a 4 GPUs de 96 GB, NVMe para base vetorial |
| Copiloto de código para o time de desenvolvimento | 30B a 70B, contexto longo | 2 a 4 GPUs de 96 a 141 GB, foco em KV cache |
| Fine-tuning recorrente | 8B a 70B com LoRA | Servidor HGX ou 4 a 8 GPUs PCIe, storage para checkpoints |
| Laboratório de IA em universidade ou empresa | Vários projetos | Cluster com agendador (Slurm/Kubernetes), storage compartilhado, workstations para prototipagem |

A conta dos pesos nesta tabela segue a regra de bytes por parâmetro mostrada acima; a margem para KV cache depende do contexto e da concorrência de cada empresa.

## Erros comuns

- **Comprar a GPU antes de definir a carga.** Sem modelo, precisão e concorrência definidos, qualquer configuração é chute.
- **Dimensionar só pelos pesos.** Esquecer o KV cache faz o servidor atender muito menos usuários que o previsto.
- **Ignorar o software de serviço.** O mesmo hardware entrega vazões muito diferentes com Ollama ou vLLM.
- **Deixar energia e refrigeração para depois.** Um servidor de 8 GPUs pode exigir uma infraestrutura elétrica que o rack atual não tem.
- **Subestimar storage e rede em treino.** GPUs esperando dados custam o mesmo que GPUs trabalhando.
- **Não avaliar a LGPD.** Dados sensíveis enviados a serviços externos exigem base legal e mecanismos de transferência.

## Como a Tyar pode ajudar

A Tyar projeta, configura, entrega e dá suporte a hardware de alta performance para IA, de workstations a servidores com GPU, storage e clusters, para empresas de todos os portes no Brasil. São mais de 25 anos de experiência, mais de 3.600 projetos e mais de 18.700 máquinas entregues, com marcas homologadas, consultoria desde o primeiro contato e suporte pós-venda. Partimos da sua carga (modelo, usuários, dados e metas de latência) para dimensionar GPU, servidor, storage, rede e energia.

👉 Conheça as soluções de [Inteligência Artificial da Tyar](https://tyar.com.br/produtos/inteligencia-artificial) e os [clusters para treino e HPC](https://tyar.com.br/produtos/cluster).

---

**Fontes:**

- [NVIDIA DGX B200](https://www.nvidia.com/en-gb/data-center/dgx-b200/)
- [NVIDIA H200](https://www.nvidia.com/en-us/data-center/h200/)
- [NVIDIA RTX PRO 6000 Blackwell Series](https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000-family/)
- [NVIDIA L40S](https://www.nvidia.com/en-us/data-center/l40s/)
- [Tom's Hardware – Nvidia announces Blackwell Ultra B300](https://www.tomshardware.com/pc-components/gpus/nvidia-announces-blackwell-ultra-b300-1-5x-faster-than-b200-with-288gb-hbm3e-and-15-pflops-dense-fp4)
- [Kwon et al. – Efficient Memory Management for Large Language Model Serving with PagedAttention (vLLM)](https://arxiv.org/abs/2309.06180)
- [NVIDIA DGX SuperPOD B200 – Storage Architecture](https://docs.nvidia.com/dgx-superpod/reference-architecture-scalable-infrastructure-b200/latest/storage-architecture.html)
- [Rajbhandari et al. – ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)
- [Teletime – ANPD publica resolução sobre transferência internacional de dados](https://teletime.com.br/23/08/2024/anpd-publica-resolucao-sobre-transferencia-internacional-de-dados/)
