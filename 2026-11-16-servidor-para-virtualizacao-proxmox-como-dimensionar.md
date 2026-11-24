---
title: "Servidor para virtualização Proxmox: como dimensionar"
slug: "servidor-para-virtualizacao-proxmox-como-dimensionar"
description: "Requisitos oficiais do Proxmox VE 9, cálculo de RAM com ZFS e Ceph, discos com PLP, rede e cluster com HA: guia para dimensionar seu servidor."
date: "2026-11-16"
author: "Equipe Tyar"
category: "Servidores"
tags: ["Proxmox VE", "virtualização", "servidores", "ZFS", "Ceph", "cluster"]
focus_keyword: "servidor para virtualização Proxmox"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/servidores"
faq:
  - q: "Quanta memória RAM preciso em um servidor Proxmox com ZFS?"
    a: "A documentação do Proxmox VE recomenda no mínimo 2 GiB de base mais 1 GiB por TiB de armazenamento para o cache ARC do ZFS, somados aos 2 GB do sistema e à RAM reservada para as VMs."
  - q: "Posso usar controladora RAID de hardware com Proxmox?"
    a: "Com LVM, sim, desde que tenha cache de escrita protegido por bateria (BBU). Com ZFS ou Ceph, não: a documentação oficial pede discos expostos diretamente por uma HBA ou controladora em modo IT."
  - q: "Quantos servidores são necessários para alta disponibilidade no Proxmox?"
    a: "No mínimo três nós para um quórum confiável, todos na mesma versão e com latência de rede abaixo de 5 ms. Com dois nós, é possível usar um QDevice como terceiro voto."
---

# Servidor para virtualização Proxmox: como dimensionar

Um servidor para virtualização Proxmox precisa de CPU x86-64 com Intel VT ou AMD-V, pelo menos 2 GB de RAM para o sistema e os serviços do Proxmox VE (mais a memória das VMs), armazenamento redundante, de preferência SSDs com proteção contra queda de energia (PLP), e placas de rede redundantes. O que mais pesa no dimensionamento, porém, é o storage: ZFS e Ceph consomem RAM extra, não funcionam sobre controladoras RAID de hardware e exigem rede dedicada em clusters. Este guia reúne os requisitos oficiais do Proxmox VE 9 e mostra como transformá-los em uma configuração de servidor.

## Resumo rápido

- **RAM**: 2 GB para o Proxmox + memória das VMs + cerca de 1 GB por TB de storage usado em ZFS ou Ceph.
- **ZFS**: comece com pelo menos 8 GB, use memória ECC e discos em HBA (sem RAID de hardware).
- **Discos**: SSDs corporativos com PLP; SSDs de consumo são desaconselhados pela própria Proxmox.
- **Cluster com HA**: mínimo de 3 nós, mesma versão e latência abaixo de 5 ms entre eles.
- **Ceph**: 3 nós ou mais, rede de 10 Gbps exclusiva (25 Gbps com NVMe) e 8 GiB de RAM por OSD.

## Requisitos oficiais do Proxmox VE

A versão atual é a linha 9.2, baseada no Debian 13 "Trixie" e disponível também para ARM de 64 bits desde agosto de 2026. Os requisitos publicados pela Proxmox separam o mínimo para testes do recomendado para produção:

| Item | Mínimo (apenas avaliação) | Recomendado (produção) |
|---|---|---|
| CPU | 64 bits com Intel VT/AMD-V | Intel 64 ou AMD64 com VT/AMD-V; IOMMU (VT-d/AMD-Vi) para passthrough de PCIe |
| RAM | 1 GB + RAM das VMs | 2 GB para SO e serviços + RAM das VMs + extra para ZFS/Ceph |
| Disco do sistema | 1 disco | RAID de hardware com cache protegido por bateria (BBU) ou ZFS sem RAID |
| Disco das VMs | 1 disco | Storage rápido e redundante, SSDs com PLP |
| Rede | 1 NIC | NICs redundantes de 1 Gbit ou mais, com placas extras para storage e cluster |

O passthrough de PCIe (IOMMU) importa se você pretende entregar uma GPU ou uma placa de rede inteira a uma VM. Vale conferir esse suporte na placa-mãe e no BIOS antes da compra.

## Como calcular a memória RAM

A conta tem três partes: o host, as VMs e o cache do storage.

**1. Host:** 2 GB para o sistema e os serviços do Proxmox VE.

**2. VMs e contêineres:** some a RAM alocada a cada guest. Deixe folga para crescer, porque adicionar memória depois costuma exigir janela de manutenção.

**3. Storage:**
- **ZFS:** a documentação recomenda pelo menos 2 GiB de base + 1 GiB por TiB de armazenamento para o ARC (cache do ZFS). Em instalações novas, o instalador limita o ARC a 10% da RAM do host, com teto de 16 GiB. Para começar com ZFS, o mínimo indicado é 8 GB.
- **Ceph:** o daemon de cada OSD (um por disco) usa 4 GiB por padrão, e a recomendação para bom desempenho é de 8 GiB por OSD.

### Exemplo de cálculo

Um servidor com 20 VMs de 8 GB cada e um pool ZFS com 16 TiB de armazenamento:

| Componente | Cálculo | Total |
|---|---|---|
| Proxmox VE | fixo | 2 GB |
| VMs | 20 × 8 GB | 160 GB |
| ARC do ZFS | 2 GiB + 16 × 1 GiB | 18 GiB |
| **Soma** | | **cerca de 180 GB** |

Nesse caso, a configuração comercial mais próxima seria 192 GB ou 256 GB, dependendo do plano de crescimento. Como o limite padrão do ARC é de 16 GiB, para usar os 18 GiB calculados é preciso ajustar o parâmetro em `/etc/modprobe.d/zfs.conf`.

## Storage: ZFS, LVM ou Ceph?

A escolha do storage define a controladora, os discos e até a rede.

| Critério | LVM / LVM-thin | ZFS local | Ceph (distribuído) |
|---|---|---|---|
| Controladora | RAID de hardware com BBU | HBA ou controladora em modo IT | HBA |
| RAM extra | baixa | 2 GiB + 1 GiB/TiB | 8 GiB por OSD (recomendado) |
| Mínimo de servidores | 1 | 1 | 3 (de preferência idênticos) |
| Snapshots e replicação | snapshots no LVM-thin | snapshots, compressão e replicação nativos | replicação entre nós |
| Indicado para | servidor único simples | servidor único ou par com replicação | cluster com HA e storage compartilhado |

Dois pontos da documentação que costumam ser ignorados:

- **ZFS e Ceph não são compatíveis com controladoras RAID de hardware.** A controladora com cache próprio esconde os discos do sistema de arquivos e compromete a integridade dos dados. Use uma HBA ou uma controladora LSI regravada em modo "IT".
- **SSD de consumo não serve para produção.** Sem PLP, cada gravação síncrona precisa ir até a memória flash, e o desempenho cai muito. A Proxmox recomenda SSDs com proteção contra queda de energia.

## Rede e cluster

Para um servidor isolado, a recomendação é ter NICs redundantes de 1 Gbit ou mais (por exemplo, duas portas em bond). O desenho muda quando há cluster:

- **Quórum e HA:** a alta disponibilidade exige pelo menos três nós, todos na mesma versão do Proxmox VE. Com dois nós, um QDevice externo pode dar o terceiro voto.
- **Latência:** a pilha de cluster (Corosync) precisa de latência abaixo de 5 ms entre todos os nós. Acima de cerca de 10 ms, clusters com mais de três nós dificilmente ficam estáveis.
- **Rede dedicada ao Corosync:** a recomendação é uma NIC física exclusiva para o tráfego do cluster, e 1 Gbit costuma bastar. O Corosync aceita até 8 links redundantes e usa as portas UDP 5405 a 5412.
- **Rede do Ceph:** pelo menos 10 Gbps exclusivos para o Ceph, e 25 Gbps ou mais quando os OSDs forem NVMe. Em clusters de 3 a 5 nós sem switch de 10 Gbps, uma topologia full mesh é alternativa.

Na prática, um nó de cluster Proxmox com Ceph costuma ter três redes separadas: gerência e VMs, Corosync e Ceph.

## CPU: núcleos para as VMs e para o storage

O Proxmox não define um número mínimo de núcleos para produção. A conta parte da soma dos vCPUs das VMs e da taxa de consolidação aceitável para a carga. Para cargas sensíveis a latência, como bancos de dados, ERP e VDI, a consolidação deve ser menor.

Com Ceph, reserve pelo menos um núcleo (ou thread) para cada serviço. Um nó com um monitor, um manager e 6 OSDs, por exemplo, precisa de 8 núcleos só para o Ceph, antes de contar as VMs.

## Erros comuns ao montar um servidor Proxmox

1. **Usar ZFS sobre controladora RAID.** É o erro mais frequente em servidores reaproveitados. Configure a controladora em modo HBA/IT ou troque-a.
2. **Comprar SSD de consumo para economizar.** O ganho no preço desaparece com a baixa performance em escrita síncrona e o desgaste acelerado.
3. **Esquecer a RAM do ZFS ou do Ceph.** O servidor parece suficiente no papel, mas as VMs disputam memória com o cache de storage.
4. **Montar HA com dois nós sem QDevice.** Sem quórum, a falha de um nó pode paralisar o cluster.
5. **Misturar tráfego do Corosync com backup ou Ceph.** Picos de tráfego aumentam a latência e podem derrubar nós do cluster.
6. **Ignorar memória ECC.** A documentação recomenda ECC de alta qualidade para evitar corrupção de dados com ZFS.

## Como escolher a configuração

- **Um servidor, até algumas dezenas de VMs:** CPU com muitos núcleos, RAM calculada como no exemplo acima, SSDs com PLP em ZFS espelhado (via HBA) e duas NICs em bond.
- **Dois servidores com replicação:** ZFS local nos dois com replicação agendada entre eles, mais um QDevice se a ideia for ter quórum.
- **Três ou mais nós com HA real:** Ceph com servidores idênticos, ao menos 12 OSDs distribuídos entre os nós, rede de 10/25 Gbps dedicada e NIC separada para o Corosync.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega servidores para virtualização com marcas homologadas, desde um host único com ZFS até clusters com Ceph. São mais de 25 anos de experiência, mais de 3.600 projetos e mais de 18.700 máquinas entregues, com consultoria desde o primeiro contato e suporte pós-venda.

👉 Conheça nossos [servidores para virtualização](https://tyar.com.br/produtos/servidores) ou, se o projeto envolve vários nós, nossas soluções de [cluster](https://tyar.com.br/produtos/cluster).

**Fontes:** [Proxmox VE – System Requirements](https://pve.proxmox.com/wiki/System_Requirements) · [Proxmox VE – Host System Administration (ZFS)](https://pve.proxmox.com/pve-docs/chapter-sysadmin.html) · [Proxmox VE – Cluster Manager](https://pve.proxmox.com/pve-docs/chapter-pvecm.html) · [Proxmox VE – Deploy Hyper-Converged Ceph Cluster](https://pve.proxmox.com/pve-docs/chapter-pveceph.html) · [Proxmox VE – Roadmap](https://pve.proxmox.com/wiki/Roadmap)
