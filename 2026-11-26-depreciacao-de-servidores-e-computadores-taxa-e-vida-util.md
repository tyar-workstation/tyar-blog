---
title: "Depreciação de servidores e computadores: taxa e vida útil"
slug: "depreciacao-de-servidores-e-computadores-taxa-e-vida-util"
description: "Taxa de depreciação de servidores, workstations e storage pela Receita (20% ao ano, 5 anos), turnos, bens até R$ 1.200 e como isso entra no TCO."
date: "2026-11-26"
author: "Equipe Tyar"
category: "Decisão de compra"
tags: ["depreciação de computadores", "IN RFB 1.700/2017", "NCM 8471", "vida útil de servidor", "lucro real", "TCO de hardware", "depreciação acelerada"]
focus_keyword: "depreciação de servidores e computadores"
link_terms: ["depreciação de servidores", "taxa de depreciação de computadores", "vida útil fiscal de hardware"]
reading_time: 7
cta_product: "https://tyar.com.br/produtos/servidores"
faq:
  - q: "Qual a taxa de depreciação de computadores e servidores?"
    a: "Pelo Anexo III da IN RFB 1.700/2017, máquinas automáticas para processamento de dados (NCM 8471), que incluem servidores, workstations e suas unidades, têm vida útil de 5 anos e taxa de 20% ao ano."
  - q: "Servidor que roda 24 horas pode depreciar mais rápido?"
    a: "Sim, para bens móveis no lucro real. O RIR/2018 (art. 323) admite coeficientes sobre a taxa normal: 1,0 para um turno de 8 horas, 1,5 para dois turnos e 2,0 para três turnos. Um servidor em operação contínua pode chegar a 40% ao ano."
  - q: "Posso lançar um computador direto como despesa?"
    a: "Só se o valor unitário não passar de R$ 1.200,00 ou a vida útil for de até um ano (art. 313 do RIR/2018). Servidores e workstations quase sempre ficam acima disso e precisam ser ativados e depreciados."
  - q: "Quando começa a depreciação de um servidor?"
    a: "No mês em que o equipamento é instalado, posto em serviço ou fica em condições de operar, e não na data da compra. Equipamento parado no estoque aguardando instalação ainda não deprecia."
  - q: "Switch e nobreak têm a mesma taxa do servidor?"
    a: "Não necessariamente. A tabela da Receita é organizada por NCM: a posição 8517 (aparelhos para telefonia e comunicação) tem 20% ao ano, enquanto a 8504 (conversores e transformadores) e a 8415 (ar-condicionado) têm 10% ao ano. Confirme o NCM na nota fiscal."
---

# Depreciação de servidores e computadores: taxa e vida útil

A Receita Federal admite depreciar servidores, workstations e demais "máquinas automáticas para processamento de dados" (NCM 8471) em 5 anos, à taxa de 20% ao ano, conforme o Anexo III da IN RFB 1.700/2017. No lucro real, equipamentos que operam em dois ou três turnos podem usar coeficientes de 1,5 e 2,0 sobre essa taxa. Bens de até R$ 1.200,00 por unidade podem ir direto para despesa.

## Resumo rápido

- **Servidores, workstations, storage e computadores (NCM 8471):** 5 anos de vida útil, 20% ao ano.
- **Operação em turnos:** coeficiente 1,5 (dois turnos) ou 2,0 (três turnos) sobre a taxa normal, no lucro real (art. 323 do RIR/2018).
- **Até R$ 1.200,00 por unidade** ou vida útil de até um ano: pode ser lançado como despesa (art. 313 do RIR/2018).
- **A depreciação começa na instalação**, não na compra.
- **Depreciação fiscal ≠ vida útil técnica:** um servidor bem dimensionado costuma operar além de 5 anos, e isso muda o cálculo de TCO.

## Qual é a taxa de depreciação de servidores e computadores?

A referência fiscal é o Anexo III da Instrução Normativa RFB nº 1.700/2017, que organiza os bens por código NCM. Para quem compra infraestrutura de TI, as linhas que importam são estas:

| NCM | Descrição (resumida) | Exemplos em TI | Vida útil | Taxa anual |
|---|---|---|---|---|
| 8471 | Máquinas automáticas para processamento de dados e suas unidades | Servidores, workstations, desktops, notebooks, storage | 5 anos | 20% |
| 8517 | Aparelhos elétricos para telefonia ou telegrafia | Equipamentos de comunicação (confirme o NCM do seu switch) | 5 anos | 20% |
| 8504 | Transformadores e conversores elétricos estáticos | Conversores, retificadores (confirme o NCM do nobreak) | 10 anos | 10% |
| 8415 | Máquinas e aparelhos de ar-condicionado | Climatização de sala de servidores | 10 anos | 10% |
| 9403 | Outros móveis para escritório | Móveis e mobiliário técnico | 10 anos | 10% |

Dois detalhes que costumam passar despercebidos:

- **Partes e acessórios** (memória, SSD, GPU comprados avulsos) não são depreciados enquanto não forem incorporados ao equipamento. Depois de instalados, passam a compor a base de cálculo, conforme nota do próprio Anexo III.
- **O enquadramento é pelo NCM da nota fiscal**, não pelo nome comercial. Um rack de servidor, um nobreak e um switch podem cair em posições com taxas diferentes.

## Servidor ligado 24/7 deprecia mais rápido?

Sim, no lucro real. O art. 323 do RIR/2018 (Decreto 9.580/2018) permite aplicar coeficientes de aceleração sobre a taxa normal de bens móveis, em função das horas diárias de operação:

| Regime de operação | Coeficiente | Taxa efetiva para NCM 8471 | Prazo aproximado |
|---|---|---|---|
| 1 turno de 8 horas | 1,0 | 20% a.a. | 5 anos |
| 2 turnos (16 h) | 1,5 | 30% a.a. | ~3,3 anos |
| 3 turnos (24 h) | 2,0 | 40% a.a. | 2,5 anos |

Servidores de produção, clusters de cálculo e storage que atendem a operação inteira rodam 24 horas por dia. Já workstations de engenharia, que ficam ligadas no expediente, em geral ficam no coeficiente 1,0. A aceleração precisa ser comprovável (escalas, logs de operação), e a diferença entre a depreciação contábil e a fiscal é controlada no e-Lalur e e-Lacs. Defina o critério com a contabilidade antes de aplicar.

## Quando posso lançar o equipamento direto como despesa?

O art. 313 do RIR/2018 permite deduzir como despesa operacional o custo de bens com **valor unitário de até R$ 1.200,00** ou **vida útil de até um ano**. A condição é que o bem tenha utilidade funcional por si só. Na prática, isso alcança periféricos e acessórios baratos, mas não servidores, workstations ou storage, que precisam ser ativados no imobilizado e depreciados.

Fracionar a compra de um equipamento em várias notas para ficar abaixo do limite não funciona: o que conta é a unidade que atinge a função.

## Quando a depreciação começa?

No mês em que o bem é **instalado, posto em serviço ou fica em condições de operar**. Servidor comprado em novembro e instalado em fevereiro só começa a depreciar em fevereiro. Isso reforça a vantagem de receber o equipamento já configurado e testado, pronto para entrar em produção, em vez de semanas de montagem interna.

## Exemplo prático: impacto no planejamento

Considere um servidor de virtualização com valor hipotético de R$ 100.000, instalado em janeiro, em empresa do lucro real:

| Cenário | Depreciação anual | Valor contábil após 3 anos |
|---|---|---|
| 1 turno (20% a.a.) | R$ 20.000 | R$ 40.000 |
| 3 turnos (40% a.a.) | R$ 40.000 | R$ 0 (totalmente depreciado em 2,5 anos) |

A depreciação acumulada nunca pode passar do custo de aquisição. No cenário de três turnos, o servidor chega a valor contábil zero em 30 meses, mas continua operando. É aqui que entra a decisão de compra: **vida útil fiscal não é vida útil técnica**. Um servidor com processadores, memória e discos dimensionados para crescer, mais garantia e suporte adequados, costuma operar bem além do prazo fiscal. Para avaliar o momento de substituir, veja os [sinais e o cálculo de quando trocar o servidor](https://blog.tyar.com.br/quando-trocar-servidor-sinais-e-calculo/).

## Depreciação acelerada da Lei 14.871/2024 ainda vale?

A Lei 14.871/2024 criou quotas diferenciadas (até 50% no ano de instalação e até 50% no ano seguinte) para máquinas e equipamentos novos, regulamentadas pelo Decreto 12.175/2024. O benefício tinha regras restritas: só lucro real, habilitação prévia na Receita, atividade principal em CNAEs específicos (majoritariamente indústria, construção e transporte) e aquisição até 31/12/2025. Para compras feitas em 2026, vale o regime normal descrito acima, salvo nova legislação. Confirme com sua contabilidade.

## Como a depreciação entra no TCO e na comparação com nuvem

Na comparação entre infraestrutura própria e nuvem, a depreciação transforma o investimento (CAPEX) em custo anual dedutível no lucro real, enquanto a nuvem é despesa operacional mês a mês. Dois pontos fazem diferença no cálculo:

1. **Use a vida útil técnica no TCO e a fiscal no fluxo de impostos.** Diluir o hardware só em 5 anos (ou 2,5 anos, com três turnos) subestima o retorno de um equipamento que vai operar por mais tempo.
2. **Inclua a garantia no horizonte.** Um contrato que cobre todo o período de uso evita custos não previstos depois que o bem já está depreciado. Veja a comparação entre [garantia de servidor NBD ou 4 horas](https://blog.tyar.com.br/garantia-de-servidor-nbd-ou-4-horas-qual-contratar/).

O passo a passo completo está no artigo sobre [como calcular o TCO de servidor próprio ou nuvem](https://blog.tyar.com.br/servidor-proprio-ou-nuvem-como-calcular-tco/). Para quem compra workstations, vale o mesmo raciocínio: máquinas profissionais tendem a durar mais que equipamentos de consumo, como mostra a comparação entre [workstation ou PC gamer para trabalho](https://blog.tyar.com.br/workstation-ou-pc-gamer-para-trabalho/).

## Erros comuns

- **Depreciar a partir da data da nota fiscal** em vez da data de instalação.
- **Aplicar a mesma taxa a todo o projeto.** Servidor, nobreak, ar-condicionado e rack podem ter NCMs e prazos diferentes.
- **Usar a aceleração por turnos sem comprovação** do regime de operação.
- **Confundir prazo fiscal com prazo de troca.** Equipamento totalmente depreciado e em bom estado não precisa ser substituído por isso.
- **Subdimensionar para economizar no CAPEX.** Um servidor que esgota a capacidade em dois anos obriga a nova compra antes de o anterior gerar retorno. Dimensionar CPU, memória e expansão corretamente, como em uma [workstation ou servidor configurado sob medida](https://workstations.tyar.com.br/), alonga a vida útil técnica.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega hardware de alta performance há mais de 25 anos, com mais de 3.600 projetos e 18.700 máquinas entregues. Os equipamentos saem configurados e testados, prontos para entrar em operação, e com suporte pós-venda. A consultoria ajuda a dimensionar a configuração para que a vida útil técnica supere com folga o prazo fiscal. Conheça as linhas de [servidores](https://tyar.com.br/produtos/servidores) e [storage](https://tyar.com.br/produtos/storage).

*Este conteúdo é informativo e não substitui a orientação do seu contador ou consultor tributário.*

---

**Fontes:**

- [Anexo III da IN RFB 1.700/2017 – taxas de depreciação (Normas Legais)](https://www.normaslegais.com.br/legislacao/anexoIII-in-rfb-1700-2017.htm)
- [Receita Federal – Perguntas e Respostas PJ 2021, Capítulo VIII: Lucro Operacional](https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/ecf/perguntas-e-respostas-pessoa-juridica-2021-arquivos/capitulo-viii-lucro-operacional-2021.pdf)
- [Depreciação acelerada por turnos – Tributo Devido](https://tributodevido.com.br/portal/depreciacao-acelerada-por-turnos/)
- [Lei nº 14.871/2024 – Planalto](https://www.planalto.gov.br/ccivil_03/_Ato2023-2026/2024/Lei/L14871.htm)
- [Decreto nº 12.175/2024 – Planalto](https://www.planalto.gov.br/ccivil_03/_Ato2023-2026/2024/Decreto/D12175.htm)
