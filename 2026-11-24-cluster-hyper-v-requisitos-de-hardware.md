---
title: "Cluster Hyper-V: requisitos de hardware no Windows Server 2025"
slug: "cluster-hyper-v-requisitos-de-hardware"
description: "Quais servidores, redes, storage e licenças um cluster Hyper-V com failover exige no Windows Server 2025, com base na documentação oficial da Microsoft."
date: "2026-11-24"
author: "Equipe Tyar"
category: "Cluster"
tags: ["cluster hyper-v", "failover cluster", "windows server 2025", "alta disponibilidade", "virtualização", "storage spaces direct"]
focus_keyword: "cluster hyper-v requisitos de hardware"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/cluster"
faq:
  - q: "Quantos servidores são necessários para um cluster Hyper-V com failover?"
    a: "O mínimo prático é dois nós, com uma testemunha (witness) de quórum, que pode ser de disco, compartilhamento de arquivos ou nuvem. Com dois nós, cada servidor precisa ter recursos livres para assumir todas as VMs do outro."
  - q: "Posso usar Windows Server Standard em um cluster Hyper-V?"
    a: "Pode. A licença Standard por núcleos dá direito a dois ambientes de sistema operacional (VMs) por host, e é possível empilhar licenças para mais VMs. A Datacenter dá VMs ilimitadas e é exigida para o Storage Replica em clusters estendidos com Storage Spaces Direct."
  - q: "Preciso de storage SAN para montar um cluster Hyper-V?"
    a: "Não. A Microsoft aceita storage compartilhado (SAS, iSCSI, Fibre Channel), compartilhamentos SMB 3.0 ou Storage Spaces Direct, que usa os discos internos dos próprios nós. A escolha depende de escala, orçamento e equipe."
---

# Cluster Hyper-V: requisitos de hardware no Windows Server 2025

Um cluster Hyper-V com failover precisa de pelo menos dois servidores com hardware igual ou muito parecido, processadores de 64 bits com virtualização assistida (Intel VT ou AMD-V), redes redundantes e separadas por função, storage compartilhado ou Storage Spaces Direct e um mecanismo de quórum. Todo o conjunto precisa ser certificado para a versão do Windows Server em uso e passar no assistente **Validate a Configuration**, senão a Microsoft não considera o cluster suportado. Abaixo está o que cada item significa na prática na hora de comprar.

## Resumo rápido

- Use servidores iguais ou com componentes muito semelhantes; em SET (Switch Embedded Teaming), placas de rede, drivers e firmware devem ser idênticos em todos os nós.
- Separe o tráfego de gerenciamento, cluster, live migration, storage e VMs em sub-redes próprias; a Microsoft recomenda rede ou VLAN dedicada para live migration.
- Storage pode ser SAN (SAS, iSCSI, Fibre Channel), SMB 3.0 ou Storage Spaces Direct; use discos básicos, nunca dinâmicos.
- Windows Server Standard licencia 2 VMs por host; Datacenter, VMs ilimitadas. O mínimo é de 16 núcleos licenciados por servidor.
- Dimensione cada nó para absorver a carga de um nó que falhar, não só a carga média.

## Servidores: o que a Microsoft exige de cada nó

Para o papel Hyper-V, a documentação de requisitos de clustering lista três itens obrigatórios de processador:

| Requisito | Detalhe |
|---|---|
| Arquitetura | Processador de 64 bits |
| Virtualização assistida por hardware | Intel VT ou AMD-V habilitado na BIOS/UEFI |
| DEP por hardware | Bit XD (Intel) ou NX (AMD) habilitado |

Além disso, a Microsoft recomenda "um conjunto de computadores correspondentes, com componentes iguais ou semelhantes". Na prática, isso significa comprar os nós no mesmo lote, com a mesma geração de CPU, mesma controladora e mesmas placas de rede. Misturar gerações complica a live migration e a validação.

### Como dimensionar CPU e memória

A regra que mais pesa no custo é a de capacidade N+1: se um nó cair, os outros precisam rodar todas as VMs dele. Em um cluster de dois nós, cada servidor deve suportar 100% da carga sozinho. Em três nós, cada um precisa de folga para cerca de metade da carga de outro; em quatro, um terço. Por isso, clusters com mais nós costumam aproveitar melhor o hardware comprado.

Um exemplo simples: um ambiente com 20 VMs que somam 256 GB de RAM em uso.

| Topologia | RAM mínima por nó para suportar a falha de um nó |
|---|---|
| 2 nós | 256 GB (cada nó carrega tudo sozinho) |
| 3 nós | 128 GB (dois nós dividem a carga) |
| 4 nós | ~86 GB (três nós dividem a carga) |

Some a isso a memória do próprio host e uma margem de crescimento. A mesma conta vale para núcleos de CPU.

## Rede: separar tráfego é requisito, não luxo

O guia de recomendações de rede para failover cluster com Hyper-V (atualizado em 2025 para o Windows Server 2025) identifica seis tipos de tráfego: gerenciamento, cluster, live migration, storage, réplica e acesso das VMs. Pontos que afetam a compra de placas e switches:

- **Uma sub-rede por rede.** O Failover Clustering reconhece apenas um endereço IP por sub-rede.
- **Live migration em rede ou VLAN dedicada.** O exemplo da Microsoft usa uma rede de 10 GbE para migração dentro do cluster.
- **Storage com no mínimo duas placas do mesmo tipo e velocidade**, para que o SMB Multichannel funcione.
- **RDMA é recomendado, mas não obrigatório.** Atenção: o NIC Teaming tradicional (LBFO) desativa o RDMA das placas.
- **Sem ponto único de falha.** Cada caminho crítico precisa de redundância, inclusive switches.

Para iSCSI, a Microsoft recomenda Gigabit Ethernet ou superior e placas dedicadas ao iSCSI. Hoje, para um cluster de produção, 10 GbE ou mais é o ponto de partida sensato.

### Pesos de QoS sugeridos

O mesmo guia sugere pesos mínimos de banda (escala de 1 a 100) quando o tráfego é convergido em poucas placas:

| Tráfego | Peso sugerido |
|---|---|
| Live migration | 40 |
| Storage | 40 |
| Cluster | 10 |
| Gerenciamento | 10 |
| Réplica | 10 |
| Acesso das VMs | 1, 3 ou 5 |

## Storage: as três opções suportadas

O Windows Server aceita três caminhos para o armazenamento das VMs em cluster:

| Opção | Como funciona | Quando faz sentido |
|---|---|---|
| Storage compartilhado (SAN) | SAS, iSCSI ou Fibre Channel com LUNs visíveis por todos os nós | Quem já tem SAN ou precisa escalar computação e storage separadamente |
| SMB 3.0 | VMs em compartilhamentos de um servidor de arquivos | Ambientes com servidor de arquivos de alta disponibilidade |
| Storage Spaces Direct (S2D) | Discos internos dos nós formam um pool replicado | Hiperconvergência, sem comprar storage externo |

Regras que valem para todas:

- Use **discos básicos**, não dinâmicos. MBR ou GPT são aceitos.
- Cluster Shared Volumes em SAN usam NTFS; em Storage Spaces Direct usam ReFS.
- Em SAS ou Fibre Channel, MPIO, DSM, HBAs, drivers e firmware devem ser idênticos em todos os nós.
- Isole o storage: um cluster por dispositivo, com LUN masking ou zoning.

Se a opção for um storage dedicado, vale avaliar antes o nível de RAID e o tipo de disco adequados para cada carga (veja as opções de [storage](https://tyar.com.br/produtos/storage)).

## Quórum e topologias

O cluster precisa de quórum para decidir quem continua no ar quando nós perdem contato. Os modelos são Node Majority, Node and Disk Majority, Node and File Share Majority e Disk Only. Em clusters com número par de nós, em especial os de dois, uma testemunha é essencial.

A documentação de topologias do Windows Server 2025 descreve:

- **Cluster simples:** um único local, latência de até 1 ms entre nós.
- **Campus cluster com S2D:** novidade do Windows Server 2025 (exige a atualização cumulativa KB5072033), com dois racks como domínios de falha, até 10 nós (5+5) e testemunha em um terceiro local (arquivo, disco, nuvem ou USB).
- **Stretch cluster:** dois sites; replicação síncrona exige latência de ida e volta inferior a 5 ms, e a testemunha deve ser de compartilhamento de arquivos ou de nuvem. Com S2D, o Storage Replica exige a edição Datacenter.

## Licenciamento: Standard ou Datacenter

Licença entra no projeto de hardware porque depende do número de núcleos de cada nó:

| Item | Standard | Datacenter |
|---|---|---|
| VMs Windows Server por host licenciado | 2 (empilhável) | Ilimitadas |
| Mínimo de núcleos licenciados | 16 por servidor, 8 por processador | 16 por servidor, 8 por processador |
| Storage Replica em stretch com S2D | Não | Sim |

Na Standard, cada novo par de VMs exige licenciar de novo todos os núcleos do host. A Dell dá o exemplo de um servidor de 32 núcleos com seis VMs: são necessários 96 núcleos licenciados. Em cluster, considere quantas VMs cada host pode ter que rodar durante um failover e confirme as regras nos Product Terms da Microsoft. Com muitas VMs por nó, a Datacenter costuma sair mais barata, e servidores com muitos núcleos encarecem a licença.

## Erros comuns

1. **Comprar nós diferentes.** Placas de rede, firmware ou HBAs diferentes quebram o SET e o MPIO e fazem a validação falhar.
2. **Dimensionar pela carga média.** Sem folga N+1, o failover funciona, mas as VMs ficam lentas ou nem sobem.
3. **Usar teaming LBFO na rede de storage com RDMA.** O teaming desativa o RDMA.
4. **Colocar tudo em uma única placa.** Uma placa ou um switch sem redundância vira ponto único de falha.
5. **Esquecer a testemunha** em clusters de dois nós.
6. **Ignorar a licença no projeto de CPU.** Um nó com núcleos demais pode custar mais em licença do que em hardware.
7. **Pular o Validate a Configuration.** Sem a validação aprovada, o cluster não é suportado pela Microsoft.

## Como escolher: checklist de compra

- Quantas VMs e quanta RAM/CPU elas usam hoje e em três anos?
- Quantos nós: dois (mais simples) ou três ou mais (melhor uso do hardware)?
- SAN existente, SMB ou Storage Spaces Direct?
- Placas de rede de 10/25 GbE com RDMA e switches redundantes?
- Standard ou Datacenter, considerando o número de VMs por host em failover?
- Todo o hardware certificado para Windows Server 2025?

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega clusters e servidores com marcas homologadas, com mais de 25 anos de experiência e mais de 3.600 projetos realizados. A consultoria começa no primeiro contato: dimensionamos os nós para failover N+1, definimos rede e storage e entregamos o ambiente com suporte pós-venda.

👉 Conheça as soluções de [Cluster da Tyar](https://tyar.com.br/produtos/cluster) e de [Servidores](https://tyar.com.br/produtos/servidores) e fale com um consultor.

---

**Fontes:**

- [Microsoft Learn: Failover clustering hardware requirements and storage options](https://learn.microsoft.com/windows-server/failover-clustering/clustering-requirements)
- [Microsoft Learn: Failover cluster network recommendations (Hyper-V)](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/failover-cluster-network-recommendations)
- [Microsoft Learn: Failover clustering overview](https://learn.microsoft.com/windows-server/failover-clustering/failover-clustering-overview)
- [Microsoft Learn: Failover clustering topologies](https://learn.microsoft.com/windows-server/failover-clustering/topologies)
- [Microsoft Licensing: Windows Server 2025](https://www.microsoft.com/licensing/guidance/Windows-Server-2025)
- [Dell: Virtualization rights for Windows Server Standard and Datacenter editions](https://www.dell.com/support/kbdoc/en-us/000205142/virtualization-rights-for-windows-server-editions)
