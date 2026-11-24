---
title: "Storage para IA: como dimensionar para treino e checkpoint"
slug: "storage-para-ia-como-dimensionar"
description: "Como dimensionar storage para IA: throughput de leitura e escrita, checkpoints, cache em NVMe local e GPUDirect Storage, com números da NVIDIA e MLPerf."
date: "2026-11-24"
author: "Equipe Tyar"
category: "Storage"
tags: ["storage para IA", "checkpoint", "GPUDirect Storage", "NVMe", "treinamento de modelos", "sistema de arquivos paralelo"]
focus_keyword: "storage para IA"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/storage"
faq:
  - q: "Quanto de throughput de storage um cluster de GPUs precisa?"
    a: "Depende do tipo de treino. A arquitetura de referência DGX SuperPOD B200 da NVIDIA indica 40 GB/s de leitura e 20 GB/s de escrita agregados por Scalable Unit no perfil Standard, e 125 GB/s de leitura e 62 GB/s de escrita no perfil Enhanced, voltado a treinos multimodais com datasets que não cabem em cache."
  - q: "Por que a escrita importa tanto em storage para IA?"
    a: "Porque checkpoints de modelos grandes podem ter terabytes e costumam ser gravados de forma síncrona: o treino para enquanto o arquivo é escrito. A NVIDIA recomenda considerar pelo menos metade do desempenho de leitura como desempenho de escrita em cargas de LLM."
  - q: "Preciso de GPUDirect Storage?"
    a: "Não é obrigatório, mas ajuda quando o I/O limita o treino. O GPUDirect Storage cria um caminho DMA direto entre o storage e a memória da GPU, eliminando a cópia intermediária na RAM da CPU, o que reduz latência e carga de CPU e aumenta a banda útil."
---

# Storage para IA: como dimensionar para treino e checkpoint

Dimensionar storage para IA é definir três coisas: quanta banda de leitura as GPUs precisam para não ficarem ociosas, quanta banda de escrita é necessária para gravar checkpoints sem travar o treino e quanta capacidade o projeto vai acumular entre datasets, checkpoints e modelos. Capacidade costuma ser a parte fácil. O que derruba projetos é subestimar throughput, sobretudo de escrita.

## Resumo rápido

- A NVIDIA sugere, por Scalable Unit (SU) do DGX SuperPOD B200, 40 GB/s de leitura e 20 GB/s de escrita no perfil Standard e 125/62 GB/s no perfil Enhanced.
- Checkpoints de modelos grandes podem ter terabytes e são gravados de forma síncrona: o treino para enquanto o arquivo é escrito.
- Regra da NVIDIA para LLMs: escrita de pelo menos metade da leitura.
- Cache em RAM e NVMe local reduz a pressão sobre o storage compartilhado quando o dataset cabe nele.
- GPUDirect Storage elimina a cópia intermediária na memória da CPU e aumenta a banda útil.

## Por que storage vira gargalo em projetos de IA

Uma GPU parada esperando dados é o recurso mais caro do datacenter sem produzir nada. No treinamento, o storage participa de dois momentos distintos:

1. **Leitura do dataset** a cada época, com padrão de acesso aleatório e muitos arquivos pequenos (imagens, trechos de texto) ou arquivos grandes sequenciais (vídeo, dados de sensores).
2. **Gravação de checkpoints**, que salvam pesos e estados do otimizador em intervalos regulares para permitir retomar o treino após uma falha.

O segundo momento é o mais subestimado. Segundo a documentação da NVIDIA para o DGX SuperPOD, checkpoints "podem ter terabytes" e, embora não sejam escritos com frequência, normalmente são gravados de forma síncrona, bloqueando o progresso do modelo. Cada minuto gasto gravando checkpoint é um minuto de todas as GPUs do cluster paradas.

## Quanto throughput é preciso: a referência da NVIDIA

A arquitetura de referência do DGX SuperPOD com DGX B200 define dois níveis de desempenho de storage. Uma Scalable Unit é o bloco de construção do SuperPOD; os números são agregados do sistema de storage, em GB/s:

| Perfil | Leitura (1 SU) | Escrita (1 SU) | Leitura (4 SU) | Escrita (4 SU) |
|---|---|---|---|---|
| Standard | 40 GB/s | 20 GB/s | 160 GB/s | 80 GB/s |
| Enhanced | 125 GB/s | 62 GB/s | 500 GB/s | 250 GB/s |

Como a NVIDIA diferencia os perfis:

| Perfil | Carga típica | Dataset |
|---|---|---|
| Standard | Vários treinos de LLM ou fine-tuning simultâneos com checkpoints periódicos; computação domina o I/O | Cabe no cache de memória dos servidores de computação; modalidade única |
| Enhanced | Vários treinos multimodais simultâneos; I/O pesa no tempo total de treino | Grande demais para o cache local; múltiplas modalidades e modelos com bilhões de parâmetros |

Dois pontos específicos da mesma documentação ajudam a ajustar o projeto:

- **Visão computacional e automotivo:** datasets que facilmente passam de 30 TB exigem cerca de **4 GB/s de leitura por GPU**.
- **LLM e modelos grandes:** considere **pelo menos metade da leitura como escrita recomendada**, justamente por causa dos checkpoints.

Um ambiente on-premise de uma empresa média raramente tem o tamanho de uma SU, mas a lógica escala: some a demanda de leitura por GPU, aplique a proporção de escrita e verifique se o storage e a rede entregam isso de forma sustentada, não só em pico.

## Como estimar o tamanho de um checkpoint

O tamanho do checkpoint depende do número de parâmetros e do que é salvo. No treino com precisão mista e otimizador Adam, o artigo do ZeRO (Microsoft) contabiliza 16 bytes por parâmetro para os estados do modelo: pesos e gradientes em FP16 (2 + 2 bytes) e, em FP32, cópia dos pesos, momento e variância (12 bytes). Um checkpoint completo normalmente inclui os pesos e os estados do otimizador.

Exemplo prático: um modelo de 70 bilhões de parâmetros com cerca de 14 bytes por parâmetro salvos (pesos FP16 + estados FP32) gera um checkpoint perto de 1 TB.

| Escrita sustentada do storage | Tempo para gravar ~1 TB |
|---|---|
| 5 GB/s | ~200 s |
| 20 GB/s | ~50 s |
| 62 GB/s | ~16 s |

Multiplique pelo número de checkpoints por dia e você tem o tempo de GPU perdido. Também é a conta que mostra quantos checkpoints manter retidos e, portanto, quanta capacidade reservar além do dataset.

## Por que a frequência de checkpoint aumenta com o tamanho do cluster

A MLCommons adicionou testes de checkpointing ao benchmark MLPerf Storage v2.0, que reuniu mais de 200 resultados de 26 organizações. O motivo é estatístico: o comunicado usa o exemplo de um acelerador com tempo médio até falha de 50.000 horas. Num cluster de 100.000 aceleradores, isso significa uma falha a cada meia hora. Quanto maior o cluster, mais vezes o treino precisa voltar ao último checkpoint, e mais frequentes eles precisam ser.

Em clusters menores, como os de empresas brasileiras com algumas dezenas de GPUs, a falha é mais rara, mas o raciocínio é o mesmo: checkpoint mais rápido permite salvar com mais frequência e perder menos trabalho quando algo dá errado.

## Cache local e GPUDirect Storage

**Cache em RAM e NVMe local.** A NVIDIA recomenda que os dados sejam armazenados em cache na primeira leitura do dataset, para não precisarem atravessar a rede nas épocas seguintes. Sistemas de arquivos compartilhados usam a RAM como primeira camada de cache, e ler do cache pode ser uma ordem de grandeza mais rápido que do storage remoto. Os servidores DGX B200 têm NVMe local que pode servir de cache ou área de staging. Se o dataset cabe nessa camada, o storage compartilhado pode ser dimensionado com foco em checkpoints e capacidade.

**GPUDirect Storage (GDS).** Sem GDS, os dados vão do storage para um "bounce buffer" na memória da CPU e só depois para a GPU: duas cópias. O GDS permite que o mecanismo de DMA próximo ao storage grave direto na memória da GPU, com uma única cópia. Segundo o guia de design da NVIDIA, isso aumenta a banda, reduz latência e diminui a carga de CPU. O guia também lembra que a banda é aditiva: mais SSDs NVMe e mais placas de rede somam throughput, desde que a topologia PCIe esteja bem distribuída.

## Como escolher a arquitetura de storage para IA

| Cenário | Arquitetura que costuma atender |
|---|---|
| 1 a 2 servidores de GPU, dataset que cabe em NVMe local | NVMe local para dados ativos + storage NAS para acervo e backup |
| Vários servidores de GPU compartilhando datasets | Storage all-flash NVMe com sistema de arquivos paralelo e rede de alta velocidade |
| Datasets multimodais grandes, muitos treinos simultâneos | Sistema de arquivos paralelo com perfil próximo ao Enhanced, GDS e camada de capacidade separada |
| Inferência e RAG | Foco em latência e IOPS para carregar modelos e consultar bases vetoriais; throughput de escrita menos crítico |

## Erros comuns

- **Dimensionar só por capacidade.** Comprar terabytes sem verificar GB/s sustentados de leitura e escrita é a causa mais comum de GPU ociosa.
- **Ignorar a escrita.** Um storage que lê bem e grava devagar transforma cada checkpoint numa pausa longa do cluster inteiro.
- **Esquecer a rede.** O throughput do storage não chega às GPUs se a rede de storage não acompanha. Banda de storage e de rede precisam ser projetadas juntas.
- **Não reservar capacidade para checkpoints.** Reter vários checkpoints de 1 TB consome espaço rápido; inclua isso no cálculo desde o início.
- **Não caracterizar a carga.** A própria NVIDIA recomenda caracterizar as cargas e as necessidades da organização antes de fechar requisitos de desempenho e capacidade.

## Como a Tyar pode ajudar

A Tyar projeta, configura, entrega e dá suporte a storage e servidores de GPU para empresas de todos os portes no Brasil, com mais de 25 anos de experiência e mais de 3.600 projetos entregues. A consultoria começa no primeiro contato: levantamos o tamanho dos datasets, a frequência de checkpoints e o número de GPUs para dimensionar throughput, rede e capacidade com marcas homologadas.

👉 Conheça as soluções de [Storage da Tyar](https://tyar.com.br/produtos/storage) e de [Inteligência Artificial](https://tyar.com.br/produtos/inteligencia-artificial).

---

**Fontes:**

- [NVIDIA DGX SuperPOD B200 – Storage Architecture](https://docs.nvidia.com/dgx-superpod/reference-architecture-scalable-infrastructure-b200/latest/storage-architecture.html)
- [NVIDIA GPUDirect Storage Design Guide – GPUDirect Storage Benefits](https://docs.nvidia.com/gpudirect-storage/design-guide/gpudirect-storage-benefits.html)
- [MLCommons – MLPerf Storage v2.0 (via StorageNewsletter)](https://www.storagenewsletter.com/2025/08/08/new-mlperf-storage-v2-0-benchmark-results-demonstrate-the-critical-role-of-storage-performance-in-ai-training-systems/)
- [Rajbhandari et al. – ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)
