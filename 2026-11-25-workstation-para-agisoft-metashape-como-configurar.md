---
title: "Workstation para Agisoft Metashape: como configurar"
slug: "workstation-para-agisoft-metashape-como-configurar"
description: "Quanto de CPU, GPU, RAM e SSD a fotogrametria no Agisoft Metashape exige, com dados oficiais da Agisoft e testes de mercado para drones e topografia."
date: "2026-11-25"
author: "Equipe Tyar"
category: "Workstations"
tags: ["agisoft metashape", "fotogrametria", "workstation", "drone", "topografia", "gpu"]
focus_keyword: "workstation para agisoft metashape"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/workstations"
faq:
  - q: "Quanta memória RAM preciso para o Agisoft Metashape?"
    a: "A Agisoft indica 32 GB como suficientes para a maioria das operações comuns. A RAM não acelera o processamento, mas define o tamanho máximo do projeto; projetos grandes de drone com câmeras de 40 MP pedem 64 GB ou mais."
  - q: "O Metashape usa a GPU em todas as etapas?"
    a: "Não. Segundo a Agisoft, a GPU acelera o casamento de imagens no Align Photos, o cálculo de depth maps, a geração de malha, DEM e tiled model a partir de depth maps e o texture blending. As demais etapas dependem da CPU."
  - q: "Vale a pena colocar duas placas de vídeo para o Metashape?"
    a: "Raramente compensa. Testes da Puget Systems mostram ganho de cerca de 5% a 10% no tempo total com uma segunda GPU. Na maioria dos casos, uma boa GPU NVIDIA RTX com 8 GB ou mais de VRAM é o melhor custo-benefício."
---

# Workstation para Agisoft Metashape: como configurar

Uma workstation para Agisoft Metashape precisa de uma CPU com 8 núcleos ou mais e clock base alto (3,2 GHz ou mais, segundo a própria Agisoft), uma GPU NVIDIA RTX com pelo menos 8 GB de VRAM, 32 a 128 GB de RAM conforme o tamanho dos voos e SSD NVMe dedicado aos projetos. O ponto que mais confunde compradores: **a RAM não deixa o processamento mais rápido, ela define o tamanho máximo do projeto**. Velocidade vem de CPU e GPU.

## Resumo rápido

- **CPU:** de 6 a 32 núcleos físicos, com a maior frequência base possível (mínimo de 3,2 GHz); muitos núcleos lentos não ajudam.
- **GPU:** uma NVIDIA GeForce RTX ou RTX PRO recente resolve; entre 6 GB e 8 GB de VRAM, a Agisoft recomenda 8 GB. A segunda GPU rende só cerca de 5% a 10%.
- **RAM:** 32 GB atendem a maioria dos casos; voos grandes com câmeras de 40 MP pedem 64 GB ou mais.
- **Armazenamento:** SSD para o sistema e SSD separado de 2 TB ou mais para os projetos em processamento; HD ou NAS para arquivo.
- **Erro mais caro:** comprar um processador de servidor com dezenas de núcleos e clock baixo achando que vai acelerar tudo.

## Como o Metashape usa o hardware

O Metashape é um pipeline de etapas, e cada uma estressa um componente diferente. Entender isso evita gastar onde não há retorno. A base de conhecimento da Agisoft lista as etapas aceleradas por GPU:

| Etapa | Componente principal | Observação |
|---|---|---|
| Align Photos (casamento de imagens) | GPU | Primeira fase do alinhamento |
| Align Photos (alinhamento de câmeras) | CPU | Fase rápida, pouca memória |
| Build Depth Maps | GPU | Etapa que mais consome tempo em muitos projetos |
| Build Point Cloud | GPU + CPU | Depth maps na GPU, filtragem e fusão na CPU |
| Build Mesh / DEM / Tiled Model a partir de depth maps | GPU + CPU | Clock da CPU pesa muito |
| Build Texture (texture blending) | GPU | Na CPU, o consumo de RAM cresce com o número de threads |
| Orthomosaic | CPU | Memória proporcional ao número de threads |

Segundo a Puget Systems, as etapas aceleradas por GPU no alinhamento e na nuvem densa podem representar 50% ou mais do tempo total. O resto depende de CPU, e principalmente de clock.

## CPU: clock vale mais que núcleo

A recomendação oficial da Agisoft é de 6 a 32 núcleos físicos com a maior frequência base possível, no mínimo 3,2 GHz. Para comparar modelos, a Agisoft sugere considerar frequência base de 3,0 GHz ou mais e pelo menos 8 núcleos, lembrando que tanto o desempenho single-thread quanto o multi-thread importam.

Nos testes da Puget Systems, processadores de desktop com clock alto lideram: Intel Core Ultra 7 270K Plus e AMD Ryzen 9 9900X e 9950X aparecem entre os mais rápidos. A Puget observa que contagens de núcleo muito altas não se mostraram bem aproveitadas pelo Metashape. Na prática, um Threadripper ou Xeon só faz sentido quando o projeto exige mais memória do que uma plataforma de desktop comporta, não por velocidade.

## GPU: uma boa placa basta

A GPU acelera as etapas mais pesadas, mas o ganho satura rápido:

- A Agisoft exige placas compatíveis com CUDA ou OpenCL e cita como referência de configuração avançada algo no nível de uma GeForce RTX 3080, com 1 a 2 GPUs.
- Entre 6 GB e 8 GB de VRAM, a Agisoft recomenda 8 GB. Para comparar placas, use os TFLOPS de precisão simples.
- A Puget Systems mede ganho de cerca de 5% a 10% no tempo total com uma segunda placa, prefere GeForce a RTX PRO para esse uso específico e, no momento, não recomenda placas AMD Radeon.
- Se usar duas GPUs, a Agisoft recomenda mesmo fabricante, diferença de TFLOPS de no máximo 2x e de largura de banda de memória de no máximo 1,5x.

Um detalhe de configuração que muita gente esquece: em Tools > Preferences > GPU, marque todas as GPUs dedicadas, desmarque a GPU integrada e desative "use CPU" durante o processamento em GPU. Deixar a CPU competindo com a GPU costuma atrasar o trabalho.

Placas profissionais NVIDIA RTX PRO fazem sentido quando a mesma máquina roda outros softwares certificados (CAD, GIS, BIM) ou quando estabilidade com drivers certificados é exigência do cliente.

## RAM: dimensione pelo tamanho do voo

A Agisoft é explícita: a quantidade de RAM não afeta a velocidade, mas limita quantas imagens você consegue processar em algumas etapas. Para a maioria das operações comuns, 32 GB bastam.

Os testes oficiais da Agisoft (Metashape 1.7.2, servidor com 240 GB de RAM) dão uma boa referência de pico de memória:

| Projeto de teste | Etapa (qualidade High) | Pico de RAM |
|---|---|---|
| Aéreo: 920 fotos de 40 MP | Depth maps | 20,41 GB |
| Aéreo: 920 fotos de 40 MP | Point cloud | 15,03 GB |
| Aéreo: 920 fotos de 40 MP | Mesh (de depth maps) | 14,80 GB |
| Close-range: 772 fotos de 18 MP | Point cloud | 25,88 GB |
| Close-range: 772 fotos de 18 MP | Texture blending na CPU (16K) | 33,86 GB |
| Close-range: 772 fotos de 18 MP | Texture blending na GPU (16K, Medium) | 10,94 GB + 6 GB de VRAM |

Dois aprendizados práticos dessa tabela:

1. **Texturizar na GPU economiza RAM.** O mesmo trabalho caiu de cerca de 33 GB para cerca de 11 GB de RAM.
2. **Projetos de mil fotos já encostam em 32 GB.** Para operações recorrentes com voos maiores, câmeras de 40 MP ou mais e qualidade High/Ultra, 64 GB a 128 GB evitam falhas no meio do processamento.

A Puget lembra que a demanda de memória cresce de forma aproximadamente linear com os megapixels: câmeras de 50 MP pedem cerca de quatro vezes a RAM de câmeras de 12 MP para o mesmo número de fotos. Sempre dimensione com folga.

## Armazenamento

- **SSD NVMe de 1 TB ou mais** para sistema e Metashape.
- **SSD separado de 2 TB ou mais** para os projetos em processamento, como recomenda a Puget. Depth maps e nuvens densas geram muitos arquivos intermediários.
- **HD ou NAS** para arquivar voos concluídos. Para processamento em rede (modo cluster do Metashape), a Agisoft pede NAS com rede de pelo menos 1 Gbps.

## Configurações de referência

| Perfil | CPU | GPU | RAM | Armazenamento |
|---|---|---|---|---|
| Entrada (até ~300 fotos) | 8 núcleos, base ≥ 3,2 GHz | RTX com 8 GB | 32 GB | NVMe 1 TB + NVMe 2 TB |
| Topografia/drone recorrente | Ryzen 9 ou Core Ultra de clock alto | RTX com 12–16 GB | 64 GB | NVMe 1 TB + NVMe 4 TB |
| Grandes levantamentos (milhares de fotos de 40 MP+) | Plataforma workstation com mais canais de memória | 1–2 RTX de alto desempenho | 128 GB ou mais | NVMe + NAS para arquivo |

Os perfis seguem as faixas oficiais da Agisoft (Basic até 32 GB, Advanced de 32 a 128 GB, Extreme acima de 128 GB, já em plataforma de servidor).

## Erros comuns

- **Comprar núcleos em vez de clock.** Um processador de 64 núcleos a 2,x GHz pode ser mais lento que um desktop de 16 núcleos com clock alto em várias etapas.
- **Achar que mais RAM acelera.** Ela evita travamentos em projetos grandes, mas não reduz o tempo de processamento.
- **Investir em duas GPUs antes de resolver CPU e RAM.** O ganho da segunda placa fica na faixa de 5% a 10%.
- **Processar direto no HD ou no NAS.** Arquivos intermediários em disco lento viram gargalo; processe em SSD e arquive depois.
- **Ignorar temperatura.** A Agisoft recomenda manter a CPU abaixo de cerca de 80 °C a 90 °C; processamentos de horas exigem refrigeração dimensionada para carga contínua.

## Como a Tyar pode ajudar

A Tyar projeta e configura workstations para fotogrametria, topografia e mapeamento com drone, dimensionando CPU, GPU e memória pelo tamanho real dos seus voos e pela resolução das suas câmeras. São mais de 25 anos de experiência, mais de 3.600 projetos e suporte pós-venda incluído. Para equipes que processam muitos levantamentos em paralelo, também montamos servidores e storage para o modo de processamento em rede do Metashape.

👉 Fale com a Tyar e configure sua [workstation para fotogrametria](https://tyar.com.br/produtos/workstations) ou conheça nossos [servidores](https://tyar.com.br/produtos/servidores).

---

**Fontes:**

- [Agisoft – System requirements](https://www.agisoft.com/downloads/system-requirements)
- [Agisoft Knowledge Base – Hardware recommendations](https://agisoft.freshdesk.com/support/solutions/articles/31000172512)
- [Agisoft Knowledge Base – Memory requirements for processing operations](https://agisoft.freshdesk.com/support/solutions/articles/31000157329)
- [Puget Systems – Hardware Recommendations for Agisoft Metashape](https://www.pugetsystems.com/solutions/photogrammetry-workstations/agisoft-metashape/hardware-recommendations/)
