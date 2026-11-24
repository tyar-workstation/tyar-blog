---
title: "Servidor próprio ou nuvem: como calcular o TCO antes de decidir"
slug: "servidor-proprio-ou-nuvem-como-calcular-tco"
description: "Servidor próprio ou nuvem? Veja como calcular o TCO em 5 anos, quais custos ocultos pesar e em que cenários cada opção sai mais barata para a empresa."
date: "2026-11-17"
author: "Equipe Tyar"
category: "Decisão de compra/TCO"
tags: ["TCO", "servidor próprio", "nuvem", "cloud repatriation", "custo de infraestrutura", "on-premise"]
focus_keyword: "servidor próprio ou nuvem"
reading_time: 6
cta_product: "https://tyar.com.br/produtos/servidores"
faq:
  - q: "Servidor próprio é sempre mais barato que a nuvem?"
    a: "Não. Para cargas estáveis e previsíveis, rodando 24/7 por vários anos, o servidor próprio tende a ter TCO menor. Para cargas sazonais, experimentais ou de curta duração, a nuvem costuma ser mais econômica porque você paga só pelo uso."
  - q: "Qual horizonte de tempo usar para comparar servidor próprio e nuvem?"
    a: "O mais comum é 3 a 5 anos, que corresponde à vida útil contábil e à duração típica de garantia estendida de servidores. Compare sempre o mesmo período e a mesma capacidade nos dois cenários."
  - q: "Quais custos costumam ser esquecidos no cálculo da nuvem?"
    a: "Transferência de dados de saída (egress), armazenamento de snapshots e backups, IPs, balanceadores, licenças e o tempo da equipe para gerenciar e otimizar a conta. Esses itens podem pesar tanto quanto as próprias instâncias."
---

# Servidor próprio ou nuvem: como calcular o TCO antes de decidir

A escolha entre **servidor próprio ou nuvem** depende do perfil de uso, não de uma regra universal. Cargas estáveis, que rodam 24 horas por dia por anos, tendem a custar menos em hardware próprio. Cargas que sobem e descem, projetos curtos e testes se encaixam melhor na nuvem. A forma correta de decidir é calcular o TCO (custo total de propriedade) dos dois cenários no mesmo horizonte, normalmente de 3 a 5 anos, incluindo os custos que não aparecem na primeira cotação.

## Resumo rápido

- Compare sempre o **mesmo período (3 a 5 anos)** e a **mesma capacidade** nos dois cenários.
- No servidor próprio, o custo é concentrado no início (CAPEX); na nuvem, é recorrente (OPEX) e cresce com o uso.
- Na nuvem, **transferência de dados de saída, armazenamento e serviços gerenciados** costumam ser os custos subestimados.
- No servidor próprio, inclua **energia, refrigeração, espaço (ou colocation), suporte e mão de obra**.
- Casos públicos de repatriação, como o da 37signals, mostram economia relevante para cargas previsíveis e de longo prazo.

## O que entra no TCO de cada opção

### Servidor próprio (on-premise ou colocation)

| Item | O que considerar |
|---|---|
| Hardware | Servidores, storage, switches, nobreaks |
| Garantia e suporte | Contrato de suporte pelo período de uso (ex.: 5 anos) |
| Infraestrutura física | Energia, refrigeração, rack, ou mensalidade de colocation |
| Licenças | Sistema operacional, hipervisor, backup |
| Pessoas | Horas da equipe para operar, atualizar e monitorar |
| Valor residual | O hardware ainda tem uso ou revenda ao fim do ciclo |

### Nuvem pública

| Item | O que considerar |
|---|---|
| Computação | Instâncias sob demanda, reservadas ou com compromisso de uso |
| Armazenamento | Volumes, snapshots, objetos e classes de retenção |
| Transferência de dados | Saída para a internet e entre regiões/zonas |
| Serviços gerenciados | Bancos de dados, balanceadores, filas, monitoramento |
| Suporte | Planos de suporte do provedor |
| Pessoas | FinOps e gestão da conta continuam exigindo tempo da equipe |

## Os números de quem já fez a conta

### 37signals: saída da nuvem

A 37signals (empresa por trás do Basecamp e do HEY) publicou os números da sua saída da nuvem. Segundo a DatacenterDynamics, a empresa gastou US$ 3,2 milhões com nuvem em 2022, sendo cerca de US$ 2,3 milhões em servidores de aplicação, cache, banco de dados e busca. Para substituir essa parte, comprou cerca de US$ 600 mil em servidores Dell (aproximadamente US$ 120 mil por ano diluídos em cinco anos) e passou a pagar perto de US$ 60 mil por mês em colocation. O custo anual estimado ficou em torno de US$ 840 mil, contra US$ 2,3 milhões na nuvem.

Em setembro de 2023, o CTO David Heinemeier Hansson relatou que a conta de nuvem (sem contar o S3) caiu de cerca de US$ 180 mil para menos de US$ 80 mil por mês, com economia de aproximadamente US$ 1 milhão por ano no ritmo atual, após investir cerca de meio milhão de dólares em máquinas novas.

### a16z: o "paradoxo do custo da nuvem"

A análise da Andreessen Horowitz sobre o custo da nuvem cita a estimativa de especialistas de que a repatriação de cargas resulta em **um terço a metade do custo** de rodar as mesmas cargas na nuvem. O texto também menciona o caso do Dropbox, que registrou cerca de **US$ 75 milhões de economia acumulada** nos dois anos anteriores ao IPO ao migrar cargas para infraestrutura própria, e aponta que o gasto comprometido com nuvem chegava, em média, a 50% do custo da receita entre empresas de software analisadas.

Esses casos são de empresas grandes e com carga previsível. O ponto não é que a nuvem seja cara para todos, mas que, a partir de certo volume estável, o modelo de aluguel deixa de compensar.

## Os custos ocultos da nuvem

### Transferência de dados de saída

A AWS oferece 100 GB por mês de transferência gratuita para a internet. Acima disso, a cobrança é por GB. Como referência, a tabela de saída do Amazon S3 para a internet citada pela Cloudflare começa em **US$ 0,09 por GB** nos primeiros 10 TB do mês (exemplo de região nos EUA). Para quem distribui arquivos grandes, vídeos ou datasets, esse item pode superar o custo de computação.

### Descontos exigem compromisso

Instâncias reservadas da AWS oferecem **até 72% de desconto** em relação ao preço sob demanda, segundo a própria AWS, com médias de cerca de 40% em contratos de 1 ano e 60% em 3 anos (instâncias padrão). Na prática, isso significa assumir um compromisso de longo prazo, que é justamente a característica do investimento em hardware próprio. Se a carga justifica um contrato de 3 anos, vale comparar com a compra do servidor.

## Como calcular o TCO na prática

1. **Defina a carga.** Liste vCPUs, memória, armazenamento (capacidade e desempenho), tráfego de saída mensal e disponibilidade exigida.
2. **Escolha o horizonte.** Use 3 ou 5 anos, alinhado à garantia do hardware.
3. **Monte o cenário nuvem.** Use a calculadora oficial do provedor com o mesmo dimensionamento. Inclua egress, snapshots, backup, IPs, balanceadores e suporte. Simule sob demanda e com reserva de 1 e 3 anos.
4. **Monte o cenário próprio.** Some hardware, garantia, licenças, energia e refrigeração (ou colocation), link de internet e horas de operação. Considere redundância (fontes, discos, um segundo servidor se a disponibilidade exigir).
5. **Compare mês a mês.** Calcule o ponto de equilíbrio: em que mês o custo acumulado da nuvem ultrapassa o do servidor próprio.
6. **Ajuste pelo risco.** Se a carga pode dobrar ou sumir em um ano, a flexibilidade da nuvem tem valor. Se é estável, o hardware próprio tende a vencer.

### Quando cada opção costuma fazer mais sentido

| Cenário | Tende a favorecer |
|---|---|
| ERP, banco de dados e virtualização interna rodando 24/7 | Servidor próprio |
| Grande volume de dados saindo para a internet | Servidor próprio ou colocation |
| Picos sazonais curtos (campanhas, eventos) | Nuvem |
| Projeto piloto ou prova de conceito | Nuvem |
| Dados sensíveis com exigência de controle físico | Servidor próprio |
| Arquitetura híbrida: base estável local + picos na nuvem | Ambos |

## Erros comuns na comparação

- **Comparar preço de instância com preço de servidor.** O TCO inclui armazenamento, rede, licenças e pessoas nos dois lados.
- **Esquecer o egress.** É o item mais citado em contas de nuvem acima do previsto.
- **Superdimensionar o hardware próprio.** Comprar capacidade para cinco anos de crescimento no primeiro dia distorce o cálculo; prefira servidores com espaço para expansão de memória e discos.
- **Ignorar a disponibilidade.** Um único servidor sem redundância não é equivalente a uma instância com SLA. Inclua o que for necessário para atingir o mesmo nível de serviço.
- **Tratar a decisão como definitiva.** Modelos híbridos permitem manter a base estável em casa e usar a nuvem só para picos.

## Como a Tyar pode ajudar

A Tyar projeta, configura, entrega e dá suporte a servidores de alta performance para empresas de todos os portes no Brasil, com mais de 25 anos de experiência e mais de 3.600 projetos realizados. Nossa consultoria ajuda a dimensionar o hardware a partir da carga real, para que a comparação com a nuvem seja feita com números concretos, com marcas homologadas e suporte pós-venda.

👉 Conheça nossas soluções de [Servidores](https://tyar.com.br/produtos/servidores) e de [Storage](https://tyar.com.br/produtos/storage) e fale com um especialista.

**Fontes:** [DatacenterDynamics – 37signals expects to save $7m over five years](https://datacenterdynamics.com/en/news/37signals-expects-to-save-7m-over-five-years-after-moving-off-of-the-cloud) · [David Heinemeier Hansson – Our cloud exit has already yielded $1m/year in savings](https://world.hey.com/dhh/our-cloud-exit-has-already-yielded-1m-year-in-savings-db358dea) · [a16z – The Cost of Cloud, a Trillion Dollar Paradox](https://a16z.com/the-cost-of-cloud-a-trillion-dollar-paradox/) · [AWS – Amazon EC2 On-Demand Pricing](https://aws.amazon.com/ec2/pricing/on-demand/) · [AWS – Amazon EC2 Reserved Instances](https://aws.amazon.com/ec2/pricing/reserved-instances/) · [Cloudflare – What is AWS data transfer pricing?](https://www.cloudflare.com/learning/cloud/what-is-aws-data-transfer-pricing/)
