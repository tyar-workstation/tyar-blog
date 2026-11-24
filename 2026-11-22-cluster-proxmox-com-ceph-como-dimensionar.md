---
title: "Cluster Proxmox com Ceph: como dimensionar nós, rede e discos"
slug: "cluster-proxmox-com-ceph-como-dimensionar"
description: "Quantos nós, quanta RAM e qual rede um cluster Proxmox com Ceph exige? Guia técnico com os requisitos oficiais para montar alta disponibilidade."
date: "2026-11-22"
author: "Equipe Tyar"
category: "Cluster"
tags: ["proxmox", "ceph", "cluster", "alta disponibilidade", "hiperconvergência", "virtualização"]
focus_keyword: "cluster proxmox com ceph"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/cluster"
faq:
  - q: "Quantos nós são necessários para um cluster Proxmox com Ceph?"
    a: "No mínimo três servidores, de preferência idênticos. A documentação do Proxmox também recomenda pelo menos 12 OSDs (discos) distribuídos de forma igual entre os nós."
  - q: "Qual a rede mínima para Ceph no Proxmox?"
    a: "Pelo menos 10 Gbps dedicados ao tráfego do Ceph. Para ambientes de alta performance com NVMe, o Proxmox recomenda 25 Gbps ou mais, e 40 ou 100 Gbps podem ser necessários."
  - q: "Posso montar um cluster Proxmox com HA usando só dois servidores?"
    a: "Com dois nós o cluster não tem quorum confiável. É possível adicionar um terceiro voto com um QDevice, mas para Ceph são necessários três nós e três monitores."
---

# Cluster Proxmox com Ceph: como dimensionar nós, rede e discos

Um cluster Proxmox com Ceph precisa de **pelo menos três servidores (de preferência idênticos)**, **rede de no mínimo 10 Gbps exclusiva para o Ceph**, **SSDs em vez de HDDs** em ambientes pequenos, **controladora HBA em vez de RAID** e **pelo menos 8 GiB de RAM por disco (OSD)**, além da memória das próprias VMs. Esses números vêm da documentação oficial do Proxmox VE e são o ponto de partida para qualquer projeto de alta disponibilidade hiperconvergente. Abaixo, o que cada requisito significa na prática e como fechar a configuração sem gargalos.

## Resumo rápido

- **Mínimo de 3 nós** para quorum confiável e 3 monitores Ceph; o Proxmox sugere ao menos **12 OSDs** distribuídos igualmente.
- **Rede:** 10 Gbps dedicados ao Ceph é o piso; com NVMe, comece em 25 Gbps. Corosync em rede separada (1 Gbps basta), com latência abaixo de 5 ms.
- **Memória:** reserve no mínimo 8 GiB por OSD, fora a RAM das VMs e uma folga para recuperação.
- **CPU:** pelo menos 1 núcleo por serviço Ceph; OSDs em NVMe de alta performance podem consumir de 4 a 6 threads cada.
- **Capacidade útil:** com replicação padrão (3 cópias), o espaço utilizável é cerca de um terço do bruto, e o alerta de "nearfull" dispara em 85%.

## O que é um cluster Proxmox com Ceph (hiperconvergência)

No modelo hiperconvergente, os mesmos servidores rodam as máquinas virtuais (Proxmox VE) e o armazenamento distribuído (Ceph). Cada disco vira um **OSD**, e o Ceph replica os dados entre os nós. Se um servidor cai, as VMs são reiniciadas em outro nó usando os dados que já estão replicados ali, sem depender de um storage externo.

A documentação de alta disponibilidade do Proxmox lista os pré-requisitos do HA: pelo menos três nós, storage compartilhado acessível por todos os nós (o Ceph cumpre esse papel), redundância de hardware "em todo lugar" e componentes de classe servidor. O tempo típico de detecção de falha e failover é de **cerca de 2 minutos**.

## Quantos nós: por que três é o mínimo

O cluster Proxmox funciona por votação (quorum). Cada nó tem um voto e, se o cluster perde o quorum, ele **entra em modo somente leitura**. Com dois nós, a queda de um deles já elimina a maioria. Por isso a documentação diz que, para HA, são necessários **pelo menos três nós** para um quorum confiável.

No Ceph, a regra é parecida: **são necessários pelo menos três monitores (MON)** para quorum. Para clusters pequenos e médios, três monitores são suficientes. Também é recomendado ter mais de um gerenciador (MGR), instalado nos nós que já rodam monitores.

| Cenário | Funciona para HA? | Observação |
|---|---|---|
| 2 nós | Só com QDevice | O QDevice fornece o 3º voto do cluster, mas o Ceph continua exigindo 3 nós |
| 3 nós | Sim | Configuração mínima recomendada para Ceph + HA |
| 4 a 5 nós | Sim | Mais folga para recuperação e manutenção; malha (mesh) de rede ainda é viável até 5 nós |
| 6+ nós | Sim | Exige switches de 25 Gbps ou mais; não há limite explícito de nós no Proxmox |

Um ponto que muitos projetos ignoram: **os nós devem ser equivalentes**. O Ceph rende melhor com a mesma quantidade e o mesmo tamanho de discos em cada servidor. Um nó com o dobro de capacidade concentra mais dados e vira gargalo na recuperação.

## Rede: o componente que mais limita o Ceph

Cada escrita no Ceph é replicada para outros nós pela rede antes de ser confirmada. Por isso, a rede define a performance do cluster mais do que a CPU.

A recomendação oficial do Proxmox, em caso de dúvida, é separar **três redes**:

| Rede | Banda recomendada | Função |
|---|---|---|
| Ceph cluster (privada) | 25 Gbps ou mais | Replicação e recuperação entre OSDs |
| Ceph public | 10 Gbps ou mais | Acesso das VMs aos dados e comunicação com monitores |
| Corosync | 1 Gbps dedicado | Comunicação do cluster, sensível a latência |

Detalhes que fazem diferença:

- **Mínimo de 10 Gbps exclusivos para o Ceph.** Para alta performance, o Proxmox recomenda pelo menos 25 Gbps, e 40 ou 100 Gbps podem ser necessários.
- **Corosync nunca no mesmo link do storage.** A documentação desaconselha explicitamente compartilhar a rede do corosync com storage (exceto como link de fallback de baixa prioridade). Picos de replicação do Ceph aumentam a latência e podem derrubar o quorum.
- **Latência abaixo de 5 ms** entre todos os nós. Acima de ~10 ms, com mais de três nós, o funcionamento estável fica improvável. Ou seja: cluster esticado entre cidades não é cenário para essa arquitetura.
- **Links redundantes para o corosync.** Ele aceita até 8 links, cada um idealmente em uma conexão física própria.
- **Sem switch de 10 Gbps?** Para clusters de três a cinco nós, uma rede em malha (full mesh), com cabos diretos entre servidores, é uma alternativa prevista na documentação.

## Memória e CPU: quanto reservar para o Ceph

O erro clássico é dimensionar a RAM só pelas VMs. O Ceph consome recursos de cada nó.

**Memória:** o daemon OSD usa 4 GiB por padrão, mas o Proxmox recomenda **pelo menos 8 GiB por OSD** para boa performance. Também orienta não usar toda a memória disponível e deixar folga para os momentos de recuperação, quando o consumo sobe.

**CPU:** a regra prática é **ao menos um núcleo (ou thread) por serviço Ceph**. Um nó com MON, MGR e 6 OSDs precisa de 8 núcleos reservados só para o Ceph. Com NVMe de alta performance, o uso pode chegar a **4 a 6 threads por OSD**.

### Exemplo prático de cálculo por nó

Cluster de 3 nós, cada um com 4 SSDs NVMe (12 OSDs no total, o mínimo sugerido pelo Proxmox):

| Item | Cálculo | Reserva por nó |
|---|---|---|
| RAM do Ceph | 4 OSDs × 8 GiB | 32 GiB |
| CPU do Ceph (NVMe) | 4 OSDs × 4 a 6 threads + MON + MGR | 18 a 26 threads |
| RAM das VMs | conforme carga | + folga para receber as VMs de um nó que caiu |

O último item é decisivo: em um cluster de 3 nós, se um cai, os outros dois precisam absorver as VMs dele. Na prática, cada nó deve operar com ocupação de RAM e CPU que permita receber até metade da carga do nó perdido.

## Discos e capacidade útil

- **SSD em vez de HDD em setups pequenos**, para reduzir o tempo de recuperação quando um disco ou nó falha.
- **HBA, não RAID.** O Ceph precisa acessar cada disco diretamente; controladoras RAID devem ser evitadas.
- **Discos de mesmo tamanho e mesma quantidade por nó.**

A replicação padrão dos pools é **size 3 / min_size 2**: cada dado tem três cópias e o pool continua aceitando escrita com duas. A documentação alerta para **nunca usar min_size 1**, porque isso permite operar com uma única cópia e pode causar perda de dados.

Na conta de capacidade, divida o bruto por três e não planeje operar perto do limite. O alerta "nearfull" do Ceph dispara em **85%** por padrão, e um rebalanceamento após falha pode encher OSDs e bloquear I/O. Exemplo: 3 nós × 4 SSDs de 3,84 TB = 46 TB brutos, cerca de 15,4 TB após replicação, e um alvo de uso confortável bem abaixo dos 85% disso.

## Erros comuns

1. **Montar com dois servidores** e descobrir que não há quorum nem para o cluster nem para o Ceph.
2. **Corosync e Ceph no mesmo link**, gerando reinicializações por perda de quorum em picos de tráfego. Sem quorum, o watchdog reinicia o nó após 60 segundos.
3. **Rede de 1 Gbps para o Ceph.** Funciona em laboratório, mas não em produção.
4. **Controladora RAID com discos em volume único**, escondendo os discos do Ceph.
5. **Nós heterogêneos** (um com 8 discos, outro com 2), que desequilibram a distribuição dos dados.
6. **RAM calculada só para as VMs**, sem os 8 GiB por OSD e sem folga para failover.
7. **Bonds de rede no modo errado.** Para o corosync, o Proxmox desaconselha balance-rr, balance-xor, balance-tlb e balance-alb; em LACP, recomenda `bond-lacp-rate fast` no servidor e no switch.

## Como escolher: Ceph hiperconvergente ou storage dedicado?

O Ceph no Proxmox faz sentido quando você quer **alta disponibilidade sem storage externo** e pretende crescer adicionando nós iguais. Se a carga é dominada por bancos de dados com latência muito baixa, ou se o volume de dados cresce muito mais rápido que a necessidade de processamento, um storage dedicado (NAS/SAN) ligado a servidores de virtualização pode ser mais eficiente. Em ambos os casos, a decisão começa pelo levantamento de carga: número de VMs, IOPS, crescimento de dados em 3 anos e tempo máximo aceitável de indisponibilidade.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega clusters com nós homogêneos, rede dimensionada para o Ceph e corosync separados, e discos e controladoras compatíveis com armazenamento distribuído, com marcas homologadas e suporte pós-venda. São mais de 25 anos de experiência e mais de 3.600 projetos entregues.

👉 Veja as soluções de [Cluster da Tyar](https://tyar.com.br/produtos/cluster) ou conheça os [Servidores](https://tyar.com.br/produtos/servidores) usados como nós de virtualização.

---

**Fontes:**

- [Proxmox VE – Deploy Hyper-Converged Ceph Cluster (documentação oficial)](https://pve.proxmox.com/pve-docs/chapter-pveceph.html)
- [Proxmox VE – Cluster Manager (wiki oficial)](https://pve.proxmox.com/wiki/Cluster_Manager)
- [Proxmox VE – High Availability (wiki oficial)](https://pve.proxmox.com/wiki/High_Availability)
