---
title: "Cluster HPC para CFD: como dimensionar para Ansys Fluent"
slug: "cluster-hpc-para-cfd-como-dimensionar-ansys-fluent"
description: "Como dimensionar um cluster HPC para CFD no Ansys Fluent: banda de memória, rede, GPU e licenças HPC Pack. Guia técnico com números das fontes oficiais."
date: "2026-11-16"
author: "Equipe Tyar"
category: "Cluster/HPC"
tags: ["cluster HPC", "CFD", "Ansys Fluent", "InfiniBand", "HPC Pack", "simulação"]
focus_keyword: "cluster HPC para CFD"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/cluster"
faq:
  - q: "Quantos núcleos preciso em um cluster HPC para CFD?"
    a: "Depende do tamanho da malha e das licenças. No Ansys Fluent, cada sistema roda 4 núcleos sem HPC Pack; com 3 packs são 132 núcleos e com 4 packs, 516. Núcleos acima do licenciado ficam ociosos."
  - q: "Quanta memória de GPU o Fluent precisa por milhão de células?"
    a: "Segundo o manual do Fluent, cerca de 1 GB por milhão de células em malha hexaédrica, turbulência e precisão simples. Dupla precisão pede 50% a mais e malha poliédrica, de 20% a 40% a mais."
  - q: "Vale a pena usar todos os núcleos de cada nó?"
    a: "Nem sempre. Em testes da AWS com Fluent, usar 25% ou 50% dos núcleos por nó aumentou a banda de memória por núcleo e acelerou de 1,3x a 2,9x por núcleo, o que pode reduzir o custo total quando a licença é cobrada por núcleo."
---

# Cluster HPC para CFD: como dimensionar para Ansys Fluent

Um cluster HPC para CFD bem dimensionado não é o que tem mais núcleos, e sim o que equilibra **banda de memória por núcleo, rede de baixa latência e número de núcleos que suas licenças permitem usar**. No Ansys Fluent, o licenciamento por núcleo e o comportamento do solver (muito dependente de memória) fazem com que um cluster "menor e mais bem alimentado" muitas vezes entregue mais simulações por dia, e por real investido, do que um cluster grande e mal balanceado.

## Resumo rápido

- **Banda de memória por núcleo pesa mais que contagem de núcleos** no Fluent; a própria Ansys afirma que a contagem bruta de núcleos "não conta a história toda".
- **Licença define o teto útil**: sem HPC Pack, o Fluent usa 4 núcleos por sistema; com 4 packs, até 516. Núcleo sem licença é hardware parado.
- **Rede entre nós precisa ser de baixa latência e alta banda** (InfiniBand NDR a 400 Gb/s é a referência atual) para o caso escalar.
- **GPU é alternativa real**: o solver GPU do Fluent precisa de ~1 GB de VRAM por milhão de células (hexa, precisão simples).
- **Subutilizar núcleos por nó** pode acelerar o caso por núcleo de 1,3x a 2,9x, segundo benchmarks publicados pela AWS.

## Por que CFD é diferente de outras cargas de servidor

Solvers de volumes finitos como o Fluent fazem acessos à memória pouco previsíveis e trocam dados de fronteira entre partições a cada iteração. Isso cria dois gargalos clássicos:

1. **Memória**: com muitos núcleos disputando poucos canais de memória, cada núcleo passa parte do tempo esperando dados. Em um blog técnico sobre Xeon 6, a Ansys destaca que a plataforma vencedora combina desempenho por núcleo com banda de memória suficiente para alimentá-los, e que alguns modelos maiores rodaram mais rápido em um Xeon 6972P de 96 núcleos do que no modelo com mais núcleos da linha.
2. **Rede**: quando o caso é dividido entre vários nós, a latência da interconexão passa a limitar a escalabilidade. Recomendações de infraestrutura da Ansys com a HPE pedem explicitamente interconexões de baixa latência e alta banda, além de storage rápido para checkpoints.

Na prática, isso significa que dobrar núcleos sem dobrar banda de memória e sem uma rede adequada traz ganho bem abaixo de 2x.

## Licenciamento: o fator que mais muda o projeto

No Ansys, o hardware precisa ser dimensionado junto com as licenças HPC Pack. A conta, conforme documentado pela Exxact para o Ansys 2025 R1:

| HPC Packs (em um sistema) | Núcleos totais de solver |
|---|---|
| 0 | 4 |
| 1 | 12 |
| 2 | 36 |
| 3 | 132 |
| 4 | 516 |
| 5 | 2.052 |

Dois pontos importam na hora de comprar hardware:

- **Packs combinados em um único job rendem muito mais.** Quatro packs distribuídos em quatro usuários liberam 48 núcleos no total; concentrados em um único job, liberam 516.
- **Núcleos acima do licenciado ficam ociosos.** Com 2 packs (36 núcleos) em um servidor de 48 núcleos, 12 núcleos não são usados pelo solver.

A Exxact também relata que, desde o Ansys 2025 R1 SP1, existe a opção **CFD HPC Ultimate**, que remove o limite de packs para solvers de CFD, incluindo o Fluent. Vale confirmar com seu revendedor Ansys qual modelo se aplica ao seu contrato antes de fechar o hardware.

Para GPUs, a lógica muda: os HPC Packs contam **multiprocessadores (SMs) da GPU**, não núcleos de CPU. Uma RTX 6000 Ada (142 SMs) ou uma H200 NVL (132 SMs) exige 3 packs; uma RTX PRO 6000 Blackwell (188 SMs) exige 4.

## CPU ou GPU para Fluent?

| Critério | Cluster de CPU | Nó(s) com GPU |
|---|---|---|
| Recursos do solver | Cobertura completa de modelos físicos | Solver GPU nativo; alguns modelos exigem GPU com FP64 |
| Limite de malha | Memória RAM somada dos nós | VRAM: ~1 GB por milhão de células (hexa, precisão simples) |
| Dupla precisão | Sem penalidade relevante de memória | +50% de VRAM |
| Malha poliédrica | Sem restrição específica | +20% a 40% de VRAM |
| Licenciamento | Por núcleo de CPU | Por SM da GPU |
| Escala | Muitos nós via InfiniBand | Poucas GPUs grandes por nó |

Exemplo prático com os números do manual do Fluent: uma malha hexaédrica de 40 milhões de células, turbulenta, em precisão simples, precisa de cerca de 40 GB de VRAM. A mesma malha em dupla precisão sobe para cerca de 60 GB; se for poliédrica, some mais 20% a 40%. Isso já define se o caso cabe em uma GPU ou exige várias.

## Subscrição de núcleos: usar menos pode sair mais barato

A AWS publicou benchmarks do Fluent com malhas de 33, 71 e 140 milhões de células. Ao usar apenas 50% ou 25% dos núcleos de cada instância, a banda de memória por núcleo aumentou e o desempenho por núcleo subiu:

| Caso (Fluent 2023 R1) | Ganho por núcleo com subscrição parcial |
|---|---|
| Exaustão veicular (33M células) | 1,3x a 1,8x |
| Combustor (71M células) | 1,7x a 2,6x |
| Carro de F1 (140M células) | 1,8x a 2,9x |

A conclusão do estudo: nós totalmente ocupados dão o melhor desempenho por custo de hardware, mas, quando se soma o custo da licença por núcleo, a subscrição parcial pode dar o melhor custo total. Em um cluster próprio, o mesmo raciocínio vale para escolher CPUs com menos núcleos e mais banda por núcleo.

## Como escolher: roteiro de dimensionamento

1. **Levante os casos reais**: tamanho típico e máximo de malha, regime (permanente ou transiente), precisão e modelos físicos.
2. **Comece pela licença**: quantos núcleos (ou SMs) você pode rodar em um único job? Esse número define o tamanho útil do cluster.
3. **Escolha CPU pela banda por núcleo**: priorize plataformas com mais canais de memória e memória rápida. A Ansys cita MRDIMM a até 8.800 MT/s em Xeon 6 como forma de aliviar o gargalo.
4. **Defina a rede**: para mais de um nó, use InfiniBand NDR (400 Gb/s por porta em adaptadores ConnectX-7) ou equivalente de baixa latência.
5. **Planeje storage para checkpoints e resultados**: casos transientes gravam muitos dados; storage lento trava o solver.
6. **Avalie um nó GPU** se a maioria das malhas couber na VRAM disponível e os modelos físicos forem suportados pelo solver GPU.

## Erros comuns

- **Comprar núcleos que a licença não usa.** Um servidor de 64 núcleos com 2 HPC Packs roda o Fluent em 36.
- **Ignorar a banda de memória.** Processadores com muitos núcleos e poucos canais por núcleo escalam mal em CFD.
- **Usar Ethernet comum entre nós.** A latência limita a escalabilidade justamente nos casos grandes, que motivaram o cluster.
- **Dimensionar GPU só pelo tamanho da malha em precisão simples** e descobrir depois que o caso exige dupla precisão (+50% de VRAM).
- **Esquecer storage e refrigeração.** Um cluster rodando 24/7 precisa de energia, ar-condicionado e área de dados compatíveis.

## Como a Tyar pode ajudar

A Tyar projeta, configura, entrega e dá suporte a clusters e servidores de alta performance para engenharia e simulação, com mais de 25 anos de experiência, mais de 3.600 projetos e marcas homologadas. A consultoria começa no primeiro contato: cruzamos o tamanho das suas malhas, o modelo de licenciamento e o orçamento para chegar ao equilíbrio certo entre CPU, memória, rede e GPU.

👉 Conheça nossas soluções de [Cluster HPC](https://tyar.com.br/produtos/cluster) e de [Servidores](https://tyar.com.br/produtos/servidores) e fale com um especialista.

**Fontes:** [Ansys – Choosing Intel Xeon 6 processors for Ansys Fluent workloads](https://www.ansys.com/en-gb/blog/choosing-intel-xeon-6-processors-for-ansys-fluent-workloads) · [Ansys – Best practices to optimize infrastructure for Ansys simulations](https://www.ansys.com/de-de/blog/best-practices-to-optimize-infrastructure-ansys-simulations) · [Exxact – Ansys HPC Pack for CPUs and GPUs explained](https://www.exxactcorp.com/blog/engineering-mpd/ansys-hpc-pack-for-cpus-and-gpus-explained) · [Ansys Fluent User's Guide – GPU Memory Usage](https://ansyshelp.ansys.com/public/Views/Secured/corp/v242/en/flu_ug/flu_ug_sec_gpu_solver_gpu_memory.html) · [AWS – Deep-dive into Ansys Fluent performance on Ansys Gateway](https://aws.amazon.com/blogs/hpc/deep-dive-into-ansys-fluent-performance-on-ansys-gateway-powered-by-aws) · [NVIDIA – ConnectX-7 NDR 400G InfiniBand](https://www.nvidia.com/content/dam/en-zz/Solutions/networking/infiniband-adapters/infiniband-connectx7-data-sheet.pdf)
