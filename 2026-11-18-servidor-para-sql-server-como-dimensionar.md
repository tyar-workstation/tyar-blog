---
title: "Servidor para SQL Server: como dimensionar CPU, RAM e disco"
slug: "servidor-para-sql-server-como-dimensionar"
description: "Como dimensionar um servidor para SQL Server 2025: limites da edição Standard, licenciamento por núcleo, memória, storage e erros que encarecem o projeto."
date: "2026-11-18"
author: "Equipe Tyar"
category: "Servidores"
tags: ["SQL Server", "servidor para banco de dados", "licenciamento por núcleo", "dimensionamento de servidor", "SQL Server 2025"]
focus_keyword: "servidor para SQL Server"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/servidores"
faq:
  - q: "Quantos núcleos a edição Standard do SQL Server 2025 consegue usar?"
    a: "O mecanismo de banco de dados da edição Standard do SQL Server 2025 usa no máximo o menor valor entre 4 sockets ou 32 núcleos. No SQL Server 2022 e anteriores, o limite era de 24 núcleos."
  - q: "Quanta memória RAM o SQL Server Standard aproveita?"
    a: "No SQL Server 2025 Standard, o buffer pool é limitado a 256 GB por instância. O cache de segmentos columnstore e os dados in-memory têm limite de 32 GB cada. Memória acima disso ainda serve ao sistema operacional e a outros serviços, mas não ao buffer pool."
  - q: "Como funciona o licenciamento por núcleo do SQL Server?"
    a: "No licenciamento por núcleo físico, é preciso licenciar todos os núcleos do servidor, com mínimo de 4 licenças por processador físico. As licenças são vendidas em pacotes de 2 núcleos. Em máquina virtual, licencia-se cada vCPU, com mínimo de 4 por VM."
---

# Servidor para SQL Server: como dimensionar CPU, RAM e disco

Um bom servidor para SQL Server nasce da combinação entre a carga real do banco e as regras de licenciamento da Microsoft. Na prática, você escolhe a edição primeiro (Standard ou Enterprise), porque ela define quantos núcleos e quanta memória o banco consegue usar. Depois ajusta CPU para poucos núcleos rápidos, coloca RAM suficiente para manter os dados mais acessados em memória e separa dados, log e tempdb em armazenamento NVMe. Sobrar núcleo custa caro: cada núcleo físico precisa de licença.

## Resumo rápido

- **Edição define o teto:** o SQL Server 2025 Standard usa até 4 sockets ou 32 núcleos (o que for menor) e até 256 GB de buffer pool por instância.
- **Licença por núcleo pesa mais que o hardware:** licencia-se todo núcleo físico do servidor, com mínimo de 4 por processador, em pacotes de 2.
- **Prefira poucos núcleos com clock alto** a muitos núcleos lentos, especialmente na edição Standard.
- **RAM é o primeiro investimento de desempenho:** quanto mais dados quentes cabem no buffer pool, menos leitura em disco.
- **Separe dados, log e tempdb** em volumes NVMe com RAID adequado e backup fora do servidor.

## Edição do SQL Server 2025: o limite que define o hardware

A Microsoft publica limites de escala por edição. Eles valem por instância e são o ponto de partida de qualquer dimensionamento:

| Limite (SQL Server 2025) | Enterprise | Standard | Express |
|---|---|---|---|
| Capacidade de computação (Database Engine) | Máximo do sistema operacional | Menor entre 4 sockets ou 32 núcleos | Menor entre 1 socket ou 4 núcleos |
| Memória do buffer pool por instância | Máximo do sistema operacional | 256 GB | 1.410 MB |
| Cache de segmentos columnstore por instância | Ilimitado | 32 GB | 352 MB |
| Dados memory-optimized por banco | Ilimitado | 32 GB | 352 MB |
| Tamanho máximo de banco relacional | 524 PB | 524 PB | 50 GB |

Duas mudanças importam para quem está renovando o parque. A edição Standard subiu de 24 para 32 núcleos em relação ao SQL Server 2022. E agora existe a edição **Standard Developer**, com todas as funções da Standard, licenciada só para desenvolvimento e teste. Isso permite homologar no ambiente de teste exatamente o que vai para produção.

**Consequência prática:** um servidor de dois processadores com 64 núcleos e 1 TB de RAM rodando SQL Server Standard desperdiça metade dos núcleos e três quartos da memória para o banco. Ou se ajusta o hardware à edição, ou se planeja Enterprise.

## Licenciamento por núcleo: por que núcleo sobrando custa caro

Pelos termos de licenciamento da Microsoft, no modelo por núcleo físico "o número de licenças exigidas é igual ao número de núcleos físicos do servidor licenciado", com **mínimo de quatro licenças por processador físico**. As licenças de Standard e Enterprise são vendidas em pacotes de 2 núcleos.

Em máquinas virtuais (com Software Assurance ou assinatura), licencia-se cada núcleo virtual da VM, com **mínimo de quatro licenças por VM**. Na Enterprise licenciada por núcleo físico com Software Assurance ativo, é permitido rodar qualquer número de instâncias em qualquer número de VMs naquele servidor.

Por isso a escolha do processador muda o custo total do projeto:

| Cenário | Núcleos a licenciar |
|---|---|
| 1 processador de 8 núcleos | 8 |
| 2 processadores de 8 núcleos | 16 |
| 1 processador de 32 núcleos | 32 |
| 2 processadores de 2 núcleos (hipotético) | 8 (mínimo de 4 por processador) |

Como a licença normalmente custa mais que a CPU, o raciocínio se inverte em relação a outros servidores: em vez de "mais núcleos pelo mesmo preço", busque **o menor número de núcleos que atende a carga, com a maior frequência possível**. Processadores com contagem baixa de núcleos e clock alto existem justamente para workloads licenciados por núcleo.

## Requisitos mínimos x configuração real

Os requisitos oficiais do SQL Server 2025 no Windows são modestos: processador x64 (Intel ou AMD) de 1,4 GHz no mínimo e 2,0 GHz ou mais recomendado, 1 GB de RAM no mínimo e pelo menos 4 GB recomendado, e 6 GB livres em disco para a instalação. O sistema precisa ser Windows Server 2019 ou superior, e as edições Enterprise e Standard não são suportadas em Windows 10/11.

Esses números servem para instalar, não para rodar ERP em produção. O dimensionamento real parte de quatro perguntas:

1. **Qual o tamanho dos dados "quentes"?** São as tabelas e índices consultados no dia a dia. O ideal é que caibam no buffer pool.
2. **Qual o perfil de carga?** Transacional (OLTP, como ERP e PDV) pede latência baixa de disco e CPU rápida. Analítico (relatórios, BI) pede mais memória e throughput de leitura, e se beneficia de columnstore.
3. **Quantos usuários e integrações simultâneas?** Picos de fechamento de mês e rotinas noturnas costumam definir a CPU, não a média do dia.
4. **Qual a meta de recuperação?** Tempo aceitável de parada e perda máxima de dados definem redundância, backup e se vale ter réplica.

## Como escolher CPU, memória e storage

### CPU

- Comece pelo número de núcleos que a edição e o orçamento de licenças permitem.
- Dê preferência a clock alto e cache L3 grande.
- Em servidores de dois processadores, lembre que o SQL Server enxerga nós NUMA. Distribua a memória igualmente entre os canais de cada processador.

### Memória RAM

- Na Standard, dimensione pensando no teto de 256 GB de buffer pool, mais memória para o sistema operacional e outros serviços da máquina.
- Na Enterprise, a referência é o volume de dados quentes e o crescimento previsto para o ciclo de vida do servidor.
- Use todos os canais de memória do processador para não perder largura de banda.

### Storage

- **Dados, log de transações e tempdb em volumes separados.** O log é gravação sequencial e sensível a latência. O tempdb sofre em consultas com ordenação e tabelas temporárias.
- **NVMe para dados e log** em bancos transacionais. SSD SATA atende cargas leves. Disco mecânico fica para backup.
- **RAID 10 para log e dados de alta escrita**, RAID 5/6 para volumes de leitura predominante. Já explicamos o tema em detalhe no artigo sobre qual RAID escolher.
- **Backup fora do servidor**, em storage dedicado ou NAS, com teste periódico de restauração.

### Exemplo prático de raciocínio

Uma indústria com ERP de 300 GB de banco, 80 usuários simultâneos e relatórios no fechamento de mês. O caminho típico: SQL Server Standard, um processador de poucos núcleos e clock alto (licenciando só o necessário), memória suficiente para que a maior parte dos dados quentes caiba no buffer pool dentro do limite de 256 GB, NVMe em RAID 10 para dados e log, tempdb em volume próprio e backup diário para um storage separado. Se o banco crescer para vários terabytes com BI pesado, a conta passa a favorecer a Enterprise.

## Erros comuns

- **Comprar servidor de dois processadores com muitos núcleos para rodar Standard.** Paga-se licença de todos os núcleos, e a edição só usa até 32.
- **Colocar 1 TB de RAM em instância Standard** esperando ganho no buffer pool, que para em 256 GB.
- **Dados, log e tempdb no mesmo volume**, criando gargalo de I/O que nenhuma CPU resolve.
- **Usar requisitos mínimos como base de compra.** 4 GB de RAM é o recomendado para instalar, não para produção.
- **Esquecer o licenciamento ao virtualizar.** Cada VM exige no mínimo 4 licenças de núcleo.
- **Não testar o restore.** Backup que nunca foi restaurado não é plano de recuperação.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega servidores para banco de dados sob medida, equilibrando núcleos, memória e storage com o licenciamento do SQL Server para que o investimento não fique preso em recursos que a edição não usa. São mais de 25 anos de experiência, mais de 3.600 projetos e mais de 18.700 máquinas entregues, com marcas homologadas, consultoria desde o primeiro contato e suporte pós-venda.

👉 Conheça nossos [servidores para banco de dados e virtualização](https://tyar.com.br/produtos/servidores) e, se o backup e o crescimento dos dados também estão na pauta, veja nossas soluções de [storage](https://tyar.com.br/produtos/storage).

**Fontes:** [Microsoft Learn – Editions and supported features of SQL Server 2025](https://learn.microsoft.com/en-us/sql/sql-server/editions-and-components-of-sql-server-2025) · [Microsoft Learn – Hardware and software requirements for SQL Server 2025](https://learn.microsoft.com/en-us/sql/sql-server/install/hardware-and-software-requirements-for-installing-sql-server-2025) · [Microsoft Product Terms – SQL Server](https://www.microsoft.com/licensing/terms/productoffering/SQLServer/MCA/Availability/37)
