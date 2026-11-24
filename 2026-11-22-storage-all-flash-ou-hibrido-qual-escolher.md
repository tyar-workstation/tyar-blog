---
title: "Storage all-flash ou híbrido: qual escolher para sua empresa"
slug: "storage-all-flash-ou-hibrido-qual-escolher"
description: "All-flash ou híbrido (SSD + HDD)? Compare IOPS, latência, custo por TB e cache, e veja como o working set define o storage certo para cada carga."
date: "2026-11-22"
author: "Equipe Tyar"
category: "Storage"
tags: ["storage all-flash", "storage híbrido", "SSD NVMe", "HDD enterprise", "ZFS", "TrueNAS", "working set"]
focus_keyword: "storage all-flash ou híbrido"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/storage"
faq:
  - q: "Storage híbrido é sempre mais barato que all-flash?"
    a: "Por TB bruto, sim: a TrueNAS cita diferença de custo da ordem de 20 vezes entre flash e HDD. Mas, se o volume de dados ativos não couber no cache, o híbrido entrega desempenho de disco e pode exigir mais discos ou upgrades, o que reduz a vantagem."
  - q: "Como saber se meu working set cabe no cache do storage híbrido?"
    a: "Meça o volume de dados efetivamente acessado nos ciclos diários, semanais e de fechamento de período. Se esse volume ativo for próximo ou maior que o cache prático (RAM + SSD), a recomendação dos fabricantes é all-flash."
  - q: "Posso usar SSD como cache de leitura e escrita no ZFS?"
    a: "No ZFS, o L2ARC é um cache de leitura em SSD e o SLOG acelera apenas escritas síncronas. Já o special vdev guarda metadados de forma permanente: não é cache, e sua perda compromete o pool, por isso deve ser espelhado."
---

# Storage all-flash ou híbrido: qual escolher para sua empresa

A escolha entre storage all-flash ou híbrido depende de uma pergunta: **quanto dos seus dados é realmente acessado no dia a dia?** Se o volume ativo (o *working set*) é pequeno em relação ao total e cabe no cache de SSD e RAM, um storage híbrido entrega desempenho próximo ao de flash com custo por TB bem menor. Se o volume ativo é grande, imprevisível ou a aplicação não tolera variação de latência (bancos de dados transacionais, VDI, muitas VMs), all-flash é a escolha mais segura.

## Resumo rápido

- **All-flash**: só SSDs. Latência baixa e consistente, IOPS de outra ordem de grandeza, menos espaço em rack. Custo por TB mais alto.
- **Híbrido**: SSD como cache/camada rápida + HDD para capacidade. Ótimo custo por TB quando os dados quentes cabem no cache.
- Um HDD enterprise de 7.200 rpm faz centenas de IOPS aleatórios; um SSD NVMe enterprise faz centenas de milhares a 1 milhão.
- O fator decisivo é o **working set**, não a capacidade total. Meça antes de comprar.
- Backup, arquivo, vídeo e datasets grandes tendem ao híbrido; bancos transacionais e virtualização densa tendem ao all-flash.

## O que muda entre all-flash e híbrido

Um **storage all-flash** usa apenas unidades de memória flash, sem discos giratórios. Um **storage híbrido** combina SSDs e HDDs no mesmo sistema. Segundo a TrueNAS, "híbrido" pode significar coisas diferentes conforme o fabricante: cache em SSD, posicionamento explícito de dados, tiering agendado ou tiering automático. Vale perguntar ao fornecedor qual desses mecanismos está em uso, porque o comportamento sob carga muda bastante.

### A diferença na prática: um drive de cada lado

Para entender a distância entre as tecnologias, compare dois drives enterprise conhecidos, pelas especificações publicadas:

| Especificação | HDD Seagate Exos X24 (24 TB, SATA) | SSD Samsung PM9A3 (U.2, PCIe 4.0) |
|---|---|---|
| Leitura sequencial máxima | 285 MB/s | 6.800 MB/s |
| Escrita sequencial máxima | 285 MB/s (taxa sustentada) | 4.000 MB/s |
| Leitura aleatória 4K | 168 IOPS (QD16) | 1.000.000 IOPS |
| Escrita aleatória 4K | 550 IOPS (QD16, cache de escrita desativado) | 180.000 IOPS |
| Latência | 4,16 ms (média rotacional, spec) | 562 µs no pico de 905 mil IOPS (teste StorageReview) |
| Capacidade máxima do modelo | 24 TB | 15,36 TB |
| Durabilidade | MTBF 2,5 milhões de horas | 1 DWPD por 5 anos |

Em leitura sequencial, o SSD é cerca de 24 vezes mais rápido. Em leitura aleatória de blocos pequenos, que é o padrão de bancos de dados e máquinas virtuais, a diferença passa de 5.000 vezes por drive. É por isso que o híbrido funciona muito bem quando os acessos aleatórios caem no SSD, e mal quando não caem.

## Como o storage híbrido acelera os dados (exemplo com ZFS)

No ZFS, base do TrueNAS, o desempenho do híbrido vem de quatro componentes:

| Componente | Onde fica | Função | Ponto de atenção |
|---|---|---|---|
| ARC | RAM | Cache dos dados mais recentes e mais acessados | Mais RAM = mais acertos de cache |
| L2ARC | SSD | Extensão do ARC, apenas leitura | Cada bloco no L2ARC consome cabeçalho na RAM; L2ARC grande demais pode piorar o ARC em sistemas com pouca memória |
| SLOG | SSD | Acelera escritas síncronas (NFS, bancos, VMs) | Cargas sem escrita síncrona não usam o SLOG |
| Special vdev | SSD | Guarda metadados, blocos indiretos e tabelas de deduplicação de forma permanente | Não é cache: se perder, perde o pool. Use espelhamento |

Segundo a TrueNAS, o special vdev pode reduzir "pela metade" a média de operações em disco necessárias para localizar um arquivo. É um ganho grande em servidores de arquivos com milhões de itens, mas exige SSDs confiáveis e redundantes.

## Quando o all-flash é a escolha certa

A TrueNAS, que vende os dois tipos de sistema, recomenda all-flash quando:

- o working set ativo é **próximo ou maior** que o cache prático disponível;
- a aplicação **não tolera variação de latência** causada por leituras em disco;
- a **capacidade total é pequena**, e a economia do HDD não compensa a complexidade do híbrido.

Na prática, isso inclui:

- **Bancos de dados transacionais** (ERP, SQL Server, PostgreSQL) com muitas leituras e escritas aleatórias.
- **Virtualização densa e VDI**, em que dezenas de VMs geram I/O aleatório simultâneo (o "efeito liquidificador").
- **Ambientes de IA em treinamento** que leem o dataset inteiro a cada época e alimentam GPUs que não podem ficar ociosas.

All-flash também tende a ocupar menos rack: segundo a Everpure (antiga Pure Storage), SSDs são bem menores que HDDs e a flash leva vantagem em espaço por capacidade, o que importa em salas de servidores pequenas ou colocation pago por U.

## Quando o storage híbrido faz mais sentido

O híbrido brilha em cargas **orientadas a capacidade**, em que só uma fração dos dados está "quente":

- **Servidores de arquivos** corporativos, onde a maior parte dos documentos não é aberta há meses.
- **Backup e retenção**, com escrita majoritariamente sequencial e leitura rara.
- **Acervo de vídeo e mídia**, com arquivos grandes e acesso sequencial, no qual vários HDDs em paralelo entregam boa vazão.
- **Datasets de IA e analytics** de grande volume, com um subconjunto ativo por projeto.

A diferença de custo é o argumento principal. A TrueNAS cita uma diferença de custo bruto da ordem de **20 vezes** entre flash e HDD, e relata alta de mais de 300% no preço da memória flash no período recente. Em um caso publicado pela empresa, um cliente que ingeria 850 TB por dia a 11 GB/s economizou mais de 90% em relação às propostas all-flash.

## Como escolher: roteiro em 5 passos

1. **Meça o working set.** Use as métricas do storage atual, do hipervisor ou do banco de dados para saber quanto dado é lido e escrito por dia, por semana e nos fechamentos de mês. A capacidade total quase nunca é o número que importa.
2. **Classifique as cargas por padrão de I/O.** Aleatório e de blocos pequenos (bancos, VMs) pede flash. Sequencial e de blocos grandes (backup, vídeo) funciona bem em HDD.
3. **Verifique a sensibilidade à latência.** Se leituras ocasionais na casa dos milissegundos (cache miss indo ao disco) derrubam a experiência do usuário ou o SLA, não dependa de cache.
4. **Considere dividir.** Muitas empresas resolvem melhor com dois pools: um all-flash pequeno para produção e um híbrido grande para arquivos e backup.
5. **Teste com dados reais.** Uma prova de conceito com a carga real evita surpresas, como cache com taxa de acerto menor que o esperado.

## Erros comuns

- **Dimensionar pelo total de TB.** Um storage de 200 TB pode ter só 3 TB ativos; outro de 20 TB pode ter tudo ativo. São compras completamente diferentes.
- **Colocar L2ARC enorme com pouca RAM.** No ZFS, isso pode reduzir a eficiência do cache em vez de aumentar.
- **Special vdev sem redundância.** Um único SSD de metadados que falha leva o pool inteiro junto.
- **Usar SSD de desktop como cache.** Cache sofre escrita constante; use SSD enterprise com endurance (DWPD) adequada e proteção contra queda de energia.
- **Esquecer a rede.** Um array NVMe capaz de vários GB/s fica limitado por uma rede de 1 GbE ou 10 GbE mal dimensionada.

## Exemplo prático

Um escritório de engenharia tem 120 TB de projetos acumulados, mas a equipe trabalha diariamente em cerca de 4 TB. Um storage híbrido com HDDs de alta capacidade, RAM generosa para o ARC e SSDs espelhados para metadados atende bem, com custo por TB muito menor que um all-flash do mesmo tamanho.

Já uma empresa que roda ERP e 60 VMs em um cluster de virtualização, com 15 TB quase todos ativos ao longo do dia, ganha previsibilidade com all-flash NVMe. O mesmo cliente pode manter um híbrido separado para backup e arquivos frios.

## Como a Tyar pode ajudar

A Tyar projeta, configura, entrega e dá suporte a storages all-flash e híbridos para empresas de todos os portes, com marcas homologadas e consultoria desde o primeiro contato. São mais de 25 anos de experiência e mais de 3.600 projetos entregues. Antes da proposta, ajudamos a levantar o working set e o padrão de I/O das suas cargas para indicar a arquitetura com melhor custo-benefício.

👉 Conheça as soluções de [Storage da Tyar](https://tyar.com.br/produtos/storage) e, se a carga for virtualização ou banco de dados, veja também nossos [Servidores](https://tyar.com.br/produtos/servidores).

---

**Fontes:**

- [TrueNAS – Hybrid Flash Storage for Enterprise Workloads: sizing guide](https://www.truenas.com/blog/hybrid-flash-storage-sizing-guide/)
- [StorageReview – Seagate Exos X24 24TB HDD Review](https://www.storagereview.com/review/seagate-exos-x24-24tb-hdd-review)
- [StorageReview – Samsung PM9A3 SSD Review](https://www.storagereview.com/review/samsung-pm9a3-ssd-review)
- [Puget Systems – Samsung PM9A3 3.84TB U.2 NVMe SSD](https://www.pugetsystems.com/parts/Hard-Drive/Samsung-PM9A3-3-84TB-U-2-NVMe-SSD-15202/)
- [Everpure (Pure Storage) – What is an All-Flash Array?](https://www.everpuredata.com/uk/knowledge/what-is-an-all-flash-array.html)
- [Network World – All-flash or hybrid flash: how to decide](https://www.networkworld.com/article/3282830/all-flash-or-hybrid-flash-how-to-decide.html)
