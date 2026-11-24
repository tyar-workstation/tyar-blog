---
title: "SSD enterprise ou SSD comum: qual usar em servidor?"
slug: "ssd-enterprise-ou-ssd-comum-para-servidor"
description: "SSD enterprise ou SSD comum no servidor? Entenda DWPD, TBW, proteção contra queda de energia (PLP) e latência, com dados de Samsung, Micron e Kingston."
date: "2026-11-20"
author: "Equipe Tyar"
category: "Storage"
tags: ["SSD enterprise", "DWPD", "TBW", "PLP", "NVMe", "servidores", "storage"]
focus_keyword: "ssd enterprise"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/storage"
faq:
  - q: "Posso usar SSD NVMe de consumo em servidor?"
    a: "Pode funcionar em laboratório ou cargas leves, mas SSDs de consumo têm resistência menor (o Samsung 990 PRO equivale a cerca de 0,33 DWPD) e o datasheet não especifica proteção contra queda de energia nem latência garantida. Para banco de dados, virtualização e RAID em produção, use SSD enterprise."
  - q: "Quanto DWPD eu preciso no SSD do servidor?"
    a: "Calcule o volume gravado por dia e divida pela capacidade útil do SSD. Cargas de leitura (web, arquivos, VDI de leitura) costumam caber em 1 DWPD; bancos transacionais, cache e logs pedem modelos de uso misto, com cerca de 3 DWPD."
  - q: "O que é PLP em SSD?"
    a: "PLP (Power Loss Protection) usa capacitores no próprio SSD para gravar na NAND os dados que estão em trânsito no cache quando a energia cai de repente, evitando perda ou corrupção de dados."
---

# SSD enterprise ou SSD comum: qual usar em servidor?

Para servidor em produção, a resposta é **SSD enterprise (data center)**. A diferença não está no pico de velocidade, em que um SSD de consumo NVMe pode até vencer, mas em três coisas que o servidor exige: **resistência a gravações (DWPD/TBW)**, **proteção contra queda de energia (PLP)** e **latência previsível sob carga contínua**. Um SSD comum pode ser mais rápido num benchmark de 30 segundos e, ainda assim, gastar a vida útil em poucos meses num banco de dados ou travar a latência de uma VM no pior momento.

## Resumo rápido

- **Resistência:** SSDs de data center de leitura intensiva começam em 1 DWPD por 5 anos; o Samsung 990 PRO (consumo) equivale a cerca de 0,33 DWPD.
- **PLP:** modelos enterprise como Micron 7500 e Kingston DC600M têm capacitores de proteção contra queda de energia; o datasheet do 990 PRO não menciona o recurso.
- **Latência:** SSDs enterprise especificam QoS (latência no percentil 99,999%); SSDs de consumo publicam só picos de desempenho.
- **Escolha pela carga:** leitura intensiva → ~1 DWPD; uso misto (bancos, cache, logs) → ~3 DWPD.
- **Formato:** enterprise vem em U.2, U.3, E1.S, E1.L e M.2, com suporte a backplane e hot-swap no servidor.

## O que é DWPD e TBW (e como calcular)

**TBW (Terabytes Written)** é o total de dados que o fabricante garante que o SSD aguenta gravar durante a garantia. **DWPD (Drive Writes Per Day)** traduz isso em quantas vezes a capacidade inteira do disco pode ser gravada por dia.

A Kingston publica a fórmula:

**DWPD = (TBW em TB × 1000) ÷ (365 × anos de garantia × capacidade em GB)**

Exemplo com o Samsung 990 PRO de 1 TB, que tem 600 TBW e 5 anos de garantia: 600 × 1000 ÷ (365 × 5 × 1000) = **0,33 DWPD**. A versão de 2 TB tem 1.200 TBW e chega ao mesmo índice.

Compare com o Kingston DC600M de 960 GB, um SSD SATA de data center: 1.752 TBW em 5 anos, ou seja, **1 DWPD**. O mesmo TBW aparece no Micron 7500 PRO, que a Micron classifica como leitura intensiva com 1 DWPD.

Um detalhe importante: o TBW de SSDs enterprise é medido com a carga padrão JEDEC (JESD219A). A própria Kingston alerta que o desgaste real varia conforme o fator de amplificação de escrita (WAF) da sua aplicação. Gravações aleatórias pequenas, comuns em bancos de dados, desgastam mais do que gravações sequenciais grandes.

## Comparativo: SSD de consumo x SSD enterprise

| Modelo | Categoria | Interface | Resistência | PLP no datasheet | MTBF/MTTF |
|---|---|---|---|---|---|
| Samsung 990 PRO 1 TB | Consumo | NVMe PCIe 4.0, M.2 | 600 TBW (≈0,33 DWPD), 5 anos | Não mencionado | 1,5 milhão de horas |
| Samsung PM9A3 | Data center | NVMe PCIe 4.0 (U.2, U.3, M.2, E1.S, E1.L) | 1 DWPD por 5 anos | Não consta no whitepaper | Não consta no whitepaper |
| Kingston DC600M | Data center, uso misto | SATA 6 Gb/s, 2,5" | 1 DWPD (5 anos) / 1,66 DWPD (3 anos) | Sim, por hardware | 2 milhões de horas |
| Micron 7500 PRO | Data center, leitura intensiva | NVMe | 1 DWPD, 5 anos | Sim (dados em trânsito e em repouso) | 2 milhões de horas a 55 °C |
| Micron 7500 MAX | Data center, uso misto | NVMe | 3 DWPD, 5 anos | Sim | 2 milhões de horas a 55 °C |

Os números de pico mostram por que a comparação engana: o 990 PRO anuncia até 7.450 MB/s de leitura sequencial e até 1,4 milhão de IOPS em leitura aleatória (QD32, 16 threads), com TurboWrite ativado. São picos medidos com cache SLC e filas profundas. Em fila 1, a leitura aleatória do mesmo SSD cai para 22 mil IOPS.

## Por que PLP importa em servidor

SSDs usam cache para acelerar gravações. Se a energia cai com dados nesse cache, eles podem se perder ou corromper metadados do sistema de arquivos. No **PLP (Power Loss Protection)**, capacitores no próprio SSD mantêm o disco energizado o tempo suficiente para gravar esses dados na NAND.

O datasheet do Kingston DC600M descreve "capacitores de proteção contra queda de energia para proteger os dados do usuário" e garantir que o drive reinicialize corretamente na próxima energização. A Micron especifica, para a linha 7500, proteção de dados "em trânsito e em repouso".

Há também um ganho de desempenho pouco lembrado: com PLP, o SSD pode confirmar gravações síncronas (fsync, commits de banco de dados, ZFS SLOG, journal do Ceph) assim que os dados chegam ao cache protegido, em vez de esperar a gravação física na NAND. Por isso SSDs de consumo costumam ter desempenho ruim justamente nas cargas com gravação síncrona.

Um nobreak não substitui o PLP: ele não cobre falha da fonte do servidor, desligamento forçado ou travamento do controlador.

## Latência previsível (QoS)

Servidor não é avaliado pelo pico, e sim pelo pior caso. SSDs enterprise publicam **QoS**: a latência no percentil 99,999%, com o disco em regime permanente. O Kingston DC600M de 480 GB, por exemplo, especifica 180 µs de leitura e 110 µs de escrita em QoS 99,999% (4 KB, QD1), e o datasheet associa isso a cumprir SLAs.

SSDs de consumo não publicam esse dado. Quando o cache SLC enche ou o controlador entra em coleta de lixo, a latência pode subir de forma brusca, e é isso que aparece como "VM travando" ou consulta lenta de vez em quando.

## Como escolher o SSD enterprise certo

1. **Meça a gravação diária.** Use as estatísticas do storage ou do hypervisor (ou o SMART dos discos atuais) para saber quantos GB são gravados por dia.
2. **Calcule o DWPD necessário.** Divida o volume diário pela capacidade útil do SSD e aplique folga para o WAF. Exemplo: 1,5 TB gravados por dia num SSD de 3,84 TB dá cerca de 0,4 DWPD. Um modelo de 1 DWPD atende com margem.
3. **Escolha a classe:**
   - *Leitura intensiva (~1 DWPD):* servidores web, file server, repositórios de backup, VDI predominantemente de leitura, datasets de IA.
   - *Uso misto (~3 DWPD):* bancos transacionais (SQL Server, PostgreSQL), cache, logs, SLOG/ZIL, metadados.
4. **Confirme PLP no datasheet.** Se o recurso não estiver escrito, assuma que não existe.
5. **Escolha a interface pelo servidor.** SATA (como o DC600M) atende boot e cargas moderadas; NVMe em U.2/U.3 ou E1.S entrega muito mais IOPS, mas depende do backplane e das linhas PCIe disponíveis.
6. **Verifique a compatibilidade com o fabricante do servidor.** Firmware, controladora RAID/HBA e monitoramento funcionam melhor com discos homologados.

## Erros comuns

- **Comparar só MB/s sequencial.** É o número menos relevante para servidor.
- **Usar SSD de consumo em RAID de produção.** O RAID protege contra falha de disco, não contra corrupção por queda de energia nem contra desgaste simultâneo de discos iguais.
- **Comprar 3 DWPD sem necessidade.** Para cargas de leitura, a classe de 1 DWPD oferece mais capacidade pelo mesmo investimento.
- **Ignorar o desgaste.** Acompanhe o indicador de desgaste no SMART. No DC600M, a garantia termina em 5 anos ou quando o atributo 231 ("SSD Wear Indicator") chega ao valor normalizado 1, o que ocorrer primeiro.
- **Esquecer o resfriamento.** NVMe enterprise em E1.S/U.2 depende do fluxo de ar do chassi; montar em gabinete improvisado reduz desempenho e vida útil.

## Como a Tyar pode ajudar

A Tyar dimensiona o storage a partir da sua carga real: medimos o volume de gravação, definimos a classe de SSD (leitura intensiva ou uso misto), a interface e o layout de RAID, e entregamos o equipamento configurado com marcas homologadas. São mais de 25 anos de experiência, +3.600 projetos e suporte pós-venda.

👉 Conheça nossas soluções de [Storage](https://tyar.com.br/produtos/storage) e de [Servidores](https://tyar.com.br/produtos/servidores) e fale com um consultor.

---

**Fontes:**

- [Samsung – Datasheet NVMe SSD 990 PRO](https://download.semiconductor.samsung.com/resources/data-sheet/Samsung_NVMe_SSD_990_PRO_Datasheet_Rev.1.0_10129514072296.pdf)
- [Samsung – Whitepaper PM9A3](https://download.semiconductor.samsung.com/resources/white-paper/PM9A3_SSD_Whitepaper_230327_2.pdf)
- [Kingston – O que é DWPD](https://www.kingston.com/en/ssd/dwpd)
- [Kingston – Datasheet DC600M](https://www.mouser.com/pdfDocs/sedc600m_en.pdf)
- [StorageReview – Micron 7500 PRO e 7500 MAX](https://www.storagereview.com/review/micron-7500-pro-7500-max-ssd-review)
