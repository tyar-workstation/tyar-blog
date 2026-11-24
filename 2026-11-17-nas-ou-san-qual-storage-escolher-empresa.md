---
title: "NAS ou SAN: qual storage escolher para sua empresa"
slug: "nas-ou-san-qual-storage-escolher-empresa"
description: "NAS ou SAN? Entenda a diferença entre storage de arquivos e de blocos, protocolos (SMB, NFS, iSCSI, FC, NVMe/TCP) e qual escolher para cada uso."
date: "2026-11-17"
author: "Equipe Tyar"
category: "Storage"
tags: ["NAS", "SAN", "storage corporativo", "iSCSI", "Fibre Channel", "NVMe/TCP", "virtualização"]
focus_keyword: "NAS ou SAN"
reading_time: 6
cta_product: "https://tyar.com.br/produtos/storage"
faq:
  - q: "Qual a principal diferença entre NAS e SAN?"
    a: "O NAS entrega arquivos e pastas pela rede usando protocolos como SMB e NFS. A SAN entrega blocos de disco (volumes/LUNs) que o servidor enxerga como um disco local, usando protocolos como iSCSI, Fibre Channel ou NVMe/TCP."
  - q: "Para virtualização é melhor NAS ou SAN?"
    a: "Os dois funcionam. A SAN (bloco) é a escolha tradicional para clusters de hipervisores e bancos de dados que exigem baixa latência; o NAS via NFS também é suportado por hipervisores e costuma ser mais simples de operar. A decisão depende da carga, da rede disponível e da equipe."
  - q: "Preciso de Fibre Channel para ter uma SAN?"
    a: "Não. Uma SAN pode rodar sobre Ethernet com iSCSI ou NVMe/TCP, aproveitando switches e placas de rede padrão. Fibre Channel é uma rede dedicada, indicada quando previsibilidade de latência e isolamento são prioridade."
---

# NAS ou SAN: qual storage escolher para sua empresa

A escolha entre **NAS ou SAN** depende do que vai consumir o storage. Se o objetivo é compartilhar arquivos entre pessoas e aplicações (pastas de projeto, backups, mídia), um **NAS** resolve com menos custo e complexidade. Se o storage vai sustentar bancos de dados, clusters de virtualização ou aplicações sensíveis à latência, uma **SAN**, que entrega blocos de disco diretamente aos servidores, tende a ser a opção mais adequada. Muitas empresas acabam usando as duas abordagens, ou um storage unificado que faz ambas.

## Resumo rápido

- **NAS = arquivos.** Compartilha pastas pela rede via SMB (Windows) e NFS (Linux/Unix). O próprio equipamento gerencia o sistema de arquivos.
- **SAN = blocos.** Entrega volumes (LUNs) que o servidor formata e usa como disco local, via iSCSI, Fibre Channel, FCoE ou NVMe over Fabrics.
- **NAS** é mais barato e simples de implantar; **SAN** exige mais investimento inicial, rede dedicada ou bem segmentada e configuração especializada.
- **Use NAS** para file server, colaboração, backup e repositórios de mídia. **Use SAN** para bancos de dados, virtualização e aplicações de alta performance.
- SAN não significa obrigatoriamente Fibre Channel: iSCSI e NVMe/TCP rodam sobre Ethernet padrão.

## O que é NAS (Network Attached Storage)

Um NAS é um equipamento de armazenamento conectado à rede local que **compartilha arquivos** por protocolos comuns como **SMB** (o padrão de compartilhamento do Windows) e **NFS** (padrão em ambientes Linux e em vários hipervisores). O sistema de arquivos fica no próprio NAS: os clientes enxergam pastas, não discos.

Na prática, isso significa:

- Vários usuários e servidores acessam os mesmos arquivos ao mesmo tempo, com permissões controladas no NAS.
- A implantação exige basicamente o equipamento e a rede existente.
- O desempenho fica limitado pela rede e pelo overhead do protocolo de arquivos, o que pesa em cargas com muitas operações pequenas e aleatórias.

## O que é SAN (Storage Area Network)

Uma SAN é uma rede de armazenamento que entrega **armazenamento em nível de bloco**. O storage apresenta volumes (LUNs, ou namespaces no caso de NVMe) e cada servidor os enxerga como se fossem discos físicos locais: é o próprio servidor, ou o hipervisor, que cria o sistema de arquivos sobre eles (NTFS, ext4/XFS, VMFS etc.).

Protocolos mais usados em SAN:

| Protocolo | Meio físico | Característica |
|---|---|---|
| **iSCSI** | Ethernet (TCP/IP) | Comandos SCSI sobre rede IP; usa switches e placas de rede padrão |
| **Fibre Channel (FC)** | Rede FC dedicada | Rede separada, com HBAs e switches FC próprios |
| **FCoE** | Ethernet | Encapsula Fibre Channel em Ethernet |
| **FC-NVMe** | Rede FC | Protocolo NVMe sobre infraestrutura Fibre Channel |
| **NVMe/TCP** | Ethernet (TCP/IP) | NVMe sobre TCP, aproveitando a infraestrutura de rede existente |
| **NVMe/RoCE** | Ethernet com RDMA | NVMe sobre RDMA em Ethernet |

O Fibre Channel evolui dobrando a taxa de dados a cada poucos anos. Segundo a Fibre Channel Industry Association (FCIA), a geração "Gen 8" introduziu o **128GFC** (transceptor SFP112), compatível com as duas velocidades anteriores, **64GFC** (SFP56) e **32GFC**, e o **256GFC** está em desenvolvimento.

Já o **NVMe/TCP**, segundo a NVM Express, foi criado para mapear as filas do NVMe sobre TCP, permitindo que empresas usem SSDs NVMe em rede aproveitando a infraestrutura existente, sem trocar todo o cabeamento e os switches.

## NAS ou SAN: comparação direta

| Critério | NAS | SAN |
|---|---|---|
| Nível de acesso | Arquivo (pastas e arquivos) | Bloco (volumes/LUNs) |
| Protocolos | SMB 3.x, NFSv4.1/4.2 | iSCSI, FC, FCoE, FC-NVMe, NVMe/TCP, NVMe/RoCE |
| Quem gerencia o sistema de arquivos | O NAS | O servidor/hipervisor |
| Rede | LAN padrão | Rede dedicada (FC) ou Ethernet segmentada |
| Custo inicial | Menor | Maior |
| Complexidade | Baixa a média | Média a alta |
| Escalabilidade | Fácil de expandir, limitada pela rede | Alta |
| Uso típico | File server, colaboração, backup, mídia | Bancos de dados, virtualização, aplicações críticas |

## Exemplos práticos

**Escritório de arquitetura com 30 workstations.** A equipe abre e salva projetos de Revit e AutoCAD em pastas compartilhadas, com controle de permissão por grupo. Aqui o NAS é a escolha natural: acesso por SMB, snapshots para recuperar versões e backup do próprio equipamento.

**Empresa com cluster de virtualização (VMware, Hyper-V ou Proxmox).** Vários hosts precisam acessar o mesmo armazenamento para migração de VMs e alta disponibilidade. Uma SAN via iSCSI ou Fibre Channel é o caminho clássico. NFS também é suportado pelos principais hipervisores e pode ser mais simples de administrar, mas a decisão deve considerar latência, a rede e o perfil de I/O das VMs.

**ERP com banco de dados SQL Server ou Oracle.** Bancos de dados fazem muitas leituras e escritas pequenas e aleatórias, e são sensíveis à latência. Storage em bloco, de preferência all-flash e com NVMe, é o mais indicado.

**Produtora de vídeo ou instalação de mídia.** Arquivos grandes, acessados por várias estações de edição. Um NAS de alto desempenho, com rede de alta velocidade, costuma atender bem; em fluxos mais exigentes, avalia-se SAN com sistema de arquivos compartilhado.

## Como escolher

1. **Comece pela carga, não pelo equipamento.** Liste o que vai rodar no storage: arquivos de usuários, VMs, bancos de dados, backup, mídia. Cargas de arquivo apontam para NAS; cargas de bloco, para SAN.
2. **Meça o perfil de I/O.** IOPS, throughput, tamanho de bloco e latência aceitável. Uma ferramenta de monitoramento no ambiente atual dá números reais para dimensionar.
3. **Avalie a rede existente.** Se a empresa já tem Ethernet de alta velocidade, iSCSI ou NVMe/TCP permitem montar uma SAN sem uma rede Fibre Channel separada. Se a prioridade é isolamento e latência previsível, FC continua sendo referência.
4. **Considere storage unificado.** Vários fabricantes oferecem equipamentos que entregam arquivo (SMB/NFS) e bloco (iSCSI/FC) no mesmo sistema, o que simplifica ambientes mistos.
5. **Planeje proteção de dados desde o início.** RAID, snapshots, replicação e backup externo são parte do projeto, não um extra.
6. **Pense no crescimento.** Verifique como o equipamento expande em capacidade (gavetas de discos) e desempenho (controladoras, portas de rede).

## Erros comuns

- **Colocar banco de dados crítico em compartilhamento de arquivos sem avaliar latência.** Funciona até o volume crescer; depois, vira gargalo.
- **Montar SAN iSCSI na mesma rede dos usuários, sem segmentação.** Tráfego de storage compete com o tráfego comum. Use VLANs ou switches dedicados e caminhos redundantes.
- **Comprar SAN para um problema de compartilhamento de arquivos.** O custo e a complexidade sobem sem ganho real.
- **Confundir RAID com backup.** RAID protege contra falha de disco, não contra exclusão, ransomware ou falha do equipamento inteiro.
- **Ignorar redundância de caminhos.** Em SAN, multipath (duas controladoras, duas placas, dois switches) evita que um único componente derrube todos os servidores.

## Como a Tyar pode ajudar

A Tyar tem mais de 25 anos de experiência e mais de 3.600 projetos entregues em hardware de alta performance. Nossa equipe faz a consultoria desde o primeiro contato: levanta as cargas, mede o perfil de I/O, define se o seu caso pede NAS, SAN ou storage unificado e entrega o equipamento configurado, com marcas homologadas e suporte pós-venda.

👉 Conheça nossas soluções de [Storage](https://tyar.com.br/produtos/storage) e de [Servidores](https://tyar.com.br/produtos/servidores) e fale com um especialista.

**Fontes:** [phoenixNAP – SAN vs. NAS](https://phoenixnap.com/kb/san-vs-nas) · [FCIA – Fibre Channel Roadmap 2023](https://fibrechannel.org/wp-content/uploads/2023/08/FCIA-Roadmap-2023-Side1-PRESS.pdf) · [NVM Express – NVMe over TCP Transport](https://nvmexpress.org/?p=18636)
