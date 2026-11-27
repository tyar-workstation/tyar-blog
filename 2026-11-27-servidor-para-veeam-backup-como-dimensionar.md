---
title: "Servidor para Veeam Backup: como dimensionar CPU, RAM e rede"
slug: "servidor-para-veeam-backup-como-dimensionar"
description: "Como dimensionar servidor para Veeam Backup & Replication 13: núcleos do proxy pela janela de backup, RAM por tarefa, appliance e repositório imutável."
date: "2026-11-27"
author: "Equipe Tyar"
category: "Servidores"
tags: ["Veeam Backup & Replication", "Veeam 13", "backup proxy", "repositório hardened", "janela de backup", "dimensionamento de servidor", "imutabilidade"]
focus_keyword: "servidor para Veeam Backup"
link_terms: ["proxy Veeam", "janela de backup", "Veeam Software Appliance", "repositório hardened"]
reading_time: 7
cta_product: "https://tyar.com.br/produtos/servidores"
faq:
  - q: "Quantos núcleos precisa um proxy do Veeam?"
    a: "Depende do volume de dados e da janela de backup. O guia de boas práticas da Veeam usa a fórmula: (tamanho dos dados em MB ÷ janela em segundos) ÷ vazão por núcleo. Para proxy virtual com repositório em bloco, a referência é 230 MB/s por núcleo em backup full e 85 MB/s em incremental."
  - q: "Quanta memória RAM o servidor de backup Veeam 13 precisa?"
    a: "Para o Veeam Software Appliance (servidor de backup em Linux), a Veeam indica no mínimo 8 núcleos e 16 GB de RAM, mais 500 MB por job simultâneo. Ambientes com até 5 workloads funcionam com 6 núcleos e 16 GB."
  - q: "Posso usar o mesmo servidor como proxy e repositório hardened?"
    a: "Não é recomendado. O guia de boas práticas da Veeam orienta a não combinar o papel de proxy com o Veeam Hardened Repository, que deve ficar isolado administrativa e fisicamente."
  - q: "Quanto de RAM reservar por núcleo no proxy?"
    a: "A Veeam recomenda prever até 2 GB de RAM por núcleo físico ou vCPU do proxy, considerando 2 tarefas de proxy por núcleo."
  - q: "Repositório de backup em VM é uma boa ideia?"
    a: "Para produção, a Veeam não recomenda guardar backups em discos VMDK de máquinas virtuais. O ideal é um repositório físico, com imutabilidade e seguindo a regra 3-2-1."
---

# Servidor para Veeam Backup: como dimensionar CPU, RAM e rede

Para dimensionar um servidor para Veeam Backup, separe os papéis (servidor de backup, proxy e repositório) e calcule os núcleos do proxy pelo volume de dados dividido pela janela de backup. No Veeam Backup & Replication 13, o servidor de backup em Linux pede no mínimo 8 núcleos e 16 GB de RAM, mais 500 MB por job simultâneo. O proxy segue a fórmula oficial da Veeam: até 230 MB/s por núcleo em backup full e 85 MB/s em incremental (proxy virtual), com 2 tarefas e até 2 GB de RAM por núcleo.

## Resumo rápido

- O Veeam tem três papéis principais: **servidor de backup** (orquestra), **proxy** (lê e processa os dados) e **repositório** (armazena). Cada um é dimensionado de um jeito.
- O **proxy** é o que mais consome CPU: calcule núcleos pela fórmula da Veeam usando tamanho dos dados, taxa de mudança e janela de backup.
- Reserve **2 tarefas por núcleo** e **até 2 GB de RAM por núcleo** no proxy.
- O **Veeam Software Appliance** (v13, Linux) pede 8 núcleos e 16 GB de RAM + 500 MB por job simultâneo.
- O repositório deve ser **físico e imutável**; não combine proxy com repositório hardened.

## Quais servidores o Veeam Backup & Replication precisa?

Antes de falar em números, vale entender a arquitetura. Em ambientes pequenos, tudo pode rodar em uma máquina só; à medida que o volume cresce, os papéis são separados:

| Papel | O que faz | Recurso mais crítico |
|---|---|---|
| Servidor de backup | Agenda jobs, guarda a configuração e coordena os componentes | RAM (cresce com jobs simultâneos) |
| Backup proxy | Lê os discos das VMs, comprime, deduplica e envia ao repositório | CPU (núcleos por tarefa) |
| Repositório | Armazena os arquivos de backup, com imutabilidade | Capacidade, discos e rede |

Uma "tarefa" no proxy corresponde ao processamento de **um disco de VM por vez**. Por isso, um ambiente com muitas VMs de vários discos pede mais tarefas simultâneas, e portanto mais núcleos, para caber na janela.

Se o ambiente virtualizado ainda está sendo planejado, o artigo sobre [como dimensionar servidor para virtualização com Proxmox](https://blog.tyar.com.br/servidor-para-virtualizacao-proxmox-como-dimensionar/) ajuda a estimar o volume de dados que o backup terá de proteger.

## Como dimensionar o servidor de backup no Veeam 13?

Na versão 13, a Veeam passou a oferecer o **Veeam Software Appliance**, um servidor de backup baseado em Linux. Os requisitos publicados pela Veeam são:

- **CPU:** processador x86-64 com no mínimo 8 núcleos (vCPUs).
- **Memória:** 16 GB de RAM, mais 500 MB para cada job simultâneo.
- **Ambientes pequenos:** até 5 workloads funcionam com 6 núcleos e 16 GB de RAM.
- **Disco:** o appliance prefere SSD a HDD para o sistema.

Exemplo: com 10 jobs rodando ao mesmo tempo, a conta fica em 16 GB + (10 × 0,5 GB) = **21 GB de RAM**. Na prática, arredonde para a configuração de memória que preencha os canais do processador (32 GB, por exemplo), o que deixa folga para crescimento.

## Como calcular os núcleos do backup proxy?

O guia de boas práticas da Veeam traz uma fórmula direta:

- **Núcleos para full** = (tamanho dos dados em MB ÷ janela de backup em segundos) ÷ vazão por núcleo
- **Núcleos para incremental** = ((tamanho dos dados em MB × taxa de mudança) ÷ janela em segundos) ÷ vazão por núcleo

Para converter: tamanho em TB × 1.024 × 1.024 = MB; janela em horas × 3.600 = segundos.

A vazão de referência por núcleo, segundo a Veeam:

| Tipo de proxy | Repositório | Full (MB/s por núcleo) | Incremental (MB/s por núcleo) |
|---|---|---|---|
| Virtual | Bloco | 230 | 85 |
| Virtual | Objeto | 125 | 85 |
| Físico | Bloco | 250 | 250 |
| Físico | Objeto | 150 | 150 |

Os valores de objeto consideram envio direto ao object storage, sem gateway. Na v13, a troca do hash MD5 pelo BLAKE3 reduz o uso de CPU do proxy em até 30%, segundo a Veeam, mas a própria documentação orienta tratar os requisitos do guia do usuário como mínimos. Criptografia, redução de dados inline e detecção de malware inline aumentam a carga.

### Exemplo 1: empresa média com 20 TB

Premissas: 20 TB de dados, janela de full de 12 horas, janela de incremental de 8 horas, 5% de mudança diária, proxy virtual e repositório em bloco.

- Full: 20.971.520 MB ÷ 43.200 s = 485 MB/s ÷ 230 = 2,1 → **3 núcleos**
- Incremental: (20.971.520 × 0,05) ÷ 28.800 s = 36 MB/s ÷ 85 = 0,4 → **1 núcleo**

O full manda: 3 núcleos, 6 tarefas simultâneas e até 6 GB de RAM para o proxy.

### Exemplo 2: ambiente com 60 TB

Mesmas premissas, com 60 TB:

- Full, proxy virtual: 62.914.560 MB ÷ 43.200 s = 1.456 MB/s ÷ 230 = 6,3 → **7 núcleos**
- Full, proxy físico: 1.456 ÷ 250 = 5,8 → **6 núcleos**
- Incremental, proxy virtual: 109 MB/s ÷ 85 = 1,3 → **2 núcleos**

Aqui um proxy físico de 8 núcleos e 16 GB de RAM já atende com folga. A Veeam recomenda ainda **pelo menos dois proxies por site** para disponibilidade.

## E a rede entre proxy e repositório?

O guia da Veeam estima que cerca de **50% do tamanho de origem** trafega entre proxy e repositório depois de compressão e deduplicação. No exemplo de 60 TB, o full gera em torno de 728 MB/s, ou seja, aproximadamente 5,8 Gbit/s. Isso já exclui links de 1 GbE e pede **10 GbE ou mais** entre proxy e repositório. Em replicação, lembre que é preciso proxy tanto na origem quanto no destino.

## Como dimensionar o repositório?

Para o repositório, a Veeam não define núcleos por tarefa na página de boas práticas; o dimensionamento de hardware e capacidade é feito na calculadora oficial da Veeam. As recomendações que valem para qualquer porte:

- **Toda cópia de backup deve ser imutável** e a estratégia deve seguir a regra 3-2-1.
- **Prefira repositório físico.** Guardar backups em discos VMDK de VMs não é recomendado para produção.
- O **Linux Hardened Repository** usa o atributo imutável do XFS e deve ficar isolado administrativa e fisicamente.
- Com acesso direto ao storage, é possível juntar proxy e repositório no mesmo servidor, desde que ele seja dimensionado para os dois papéis. A exceção é o repositório hardened: não combine o papel de proxy com ele.

Para a parte de capacidade, veja [como calcular a capacidade útil de um storage](https://blog.tyar.com.br/capacidade-util-de-storage-como-calcular/) depois do RAID e o guia sobre [backup imutável contra ransomware](https://blog.tyar.com.br/backup-imutavel-storage-contra-ransomware/), que detalha a camada de proteção. Nos discos de sistema e cache, vale considerar [SSD enterprise em vez de SSD comum](https://blog.tyar.com.br/ssd-enterprise-ou-ssd-comum-para-servidor/), pela resistência a escrita contínua.

## Configurações de referência por porte

Com base nos requisitos e na fórmula acima, um ponto de partida:

| Porte | Servidor de backup | Proxy | Repositório |
|---|---|---|---|
| Até 5 workloads | 6 núcleos, 16 GB (pode acumular proxy) | No mesmo servidor | Físico, imutável |
| ~20 TB protegidos | 8 núcleos, 16 a 32 GB | 3 a 4 núcleos, 8 GB, ×2 proxies | Físico, hardened, 10 GbE |
| ~60 TB protegidos | 8 núcleos, 32 GB | 8 núcleos, 16 GB, ×2 proxies | Físico, hardened, 10/25 GbE |

Esses números são estimativas; refaça a conta com o seu volume, sua taxa de mudança e sua janela real. Se a equipe de TI também precisa de estações para administrar o ambiente e testar restores com folga, a Tyar monta [workstations sob medida para a equipe técnica](https://workstations.tyar.com.br/), com orçamento em 1 dia útil.

## Erros comuns

1. **Dimensionar só pelo tamanho dos dados.** Sem a janela de backup na conta, o proxy fica subdimensionado e o full invade o horário de produção.
2. **Ignorar a taxa de mudança.** Bancos de dados e servidores de arquivos movimentados podem mudar bem mais que 5% ao dia.
3. **Usar 1 GbE entre proxy e repositório.** A rede vira gargalo antes da CPU.
4. **Repositório virtual em produção.** Se o host cai, backup e produção caem juntos.
5. **Proxy no mesmo servidor do repositório hardened.** Aumenta a superfície de ataque do local que deveria ser o mais isolado.
6. **Esquecer a garantia do hardware.** O repositório é o que salva a empresa num incidente; avalie se o contrato deve ser [NBD ou 4 horas](https://blog.tyar.com.br/garantia-de-servidor-nbd-ou-4-horas-qual-contratar/).

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega servidores para cada papel do Veeam, do proxy com núcleos calculados pela sua janela de backup ao repositório físico com discos e rede adequados. São mais de 25 anos de experiência e mais de 3.600 projetos, com consultoria desde o primeiro contato e suporte pós-venda. Conheça as opções de [servidores](https://tyar.com.br/produtos/servidores) e de [storage para repositório de backup](https://tyar.com.br/produtos/storage).

---

**Fontes:**

- [Veeam Backup & Replication 13: Backup Server – System Requirements](https://helpcenter.veeam.com/docs/vbr/userguide/system_requirements_backup_server.html?ver=13)
- [Veeam Best Practice Guide: VMware Backup Proxies](https://bp.veeam.com/vbr/2_Design_Structures/D_Veeam_Components/D_backup_proxies/vmware_proxies.html)
- [Veeam Best Practice Guide: Backup Repositories](https://bp.veeam.com/vbr/2_Design_Structures/D_Veeam_Components/D_backup_repositories/)
- [Veeam Calculators](https://www.veeam.com/calculators)
