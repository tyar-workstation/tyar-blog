---
title: "Quando trocar servidor: sinais, prazos e como calcular"
slug: "quando-trocar-servidor-sinais-e-calculo"
description: "Quando trocar servidor: ciclo de 3 a 5 anos, fim do suporte do Windows Server 2016 em 2027, custo de manter hardware antigo e um roteiro para decidir."
date: "2026-11-19"
author: "Equipe Tyar"
category: "Decisão de compra/TCO"
tags: ["quando trocar servidor", "renovação de servidores", "TCO", "Windows Server 2016", "fim de suporte", "ciclo de vida de hardware"]
focus_keyword: "quando trocar servidor"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/servidores"
faq:
  - q: "De quanto em quanto tempo uma empresa deve trocar o servidor?"
    a: "Estudos da IDC patrocinados pela Dell defendem ciclos de cerca de 3 anos, porque o custo de operação sobe após o terceiro ano. Na prática, muitas empresas trabalham com 4 a 5 anos, desde que a garantia e o suporte do fabricante e do sistema operacional estejam ativos."
  - q: "Quando acaba o suporte do Windows Server 2016?"
    a: "O suporte estendido do Windows Server 2016 termina em 12 de janeiro de 2027. Depois disso só há atualizações de segurança via ESU, um programa pago de até três anos que não inclui novos recursos nem suporte técnico geral."
  - q: "Vale a pena só fazer upgrade de memória ou disco em vez de trocar o servidor?"
    a: "Vale quando o gargalo é pontual (RAM ou armazenamento), o hardware ainda tem garantia e a plataforma suporta o sistema operacional que você vai usar nos próximos anos. Se a garantia acabou ou o sistema operacional está perto do fim do suporte, o upgrade só adia a troca."
---

# Quando trocar servidor: sinais, prazos e como calcular

A resposta curta: troque o servidor quando o custo de mantê-lo (paradas, horas de TI, garantia estendida, licenças de segurança extras) passar a ser maior que o custo de um equipamento novo, ou quando o software que ele roda perder suporte. Para a maioria das empresas isso acontece entre o 3º e o 5º ano de uso. E há uma data concreta no horizonte: o suporte estendido do **Windows Server 2016 termina em 12 de janeiro de 2027**. Se a sua empresa ainda roda 2016 em hardware antigo, a decisão de troca já está no calendário.

## Resumo rápido

- **Ciclo de referência:** a IDC, em estudo patrocinado pela Dell, defende renovar servidores a cada 3 anos, porque os custos de operação "sobem fortemente" depois do terceiro ano.
- **Prazo real em 2027:** o Windows Server 2016 sai do suporte estendido em 12/01/2027; depois disso, só com ESU pago por até 3 anos.
- **Sinais de troca:** garantia vencida, paradas não planejadas recorrentes, gargalo de CPU/RAM que upgrade não resolve e sistema operacional sem suporte.
- **Upgrade x troca:** upgrade de RAM ou disco faz sentido só se o hardware ainda tem garantia e roda o sistema operacional dos próximos anos.
- **Decisão por TCO:** compare o custo de manter por mais 2 anos com o custo de trocar agora, incluindo horas da equipe e risco de parada.

## Quanto tempo dura um servidor na prática

Um servidor bem dimensionado pode ligar por 7 ou 8 anos. A questão não é se ele liga, e sim quanto custa mantê-lo útil e seguro. Dois estudos da IDC publicados com a Dell ajudam a enxergar isso:

| Indicador | Resultado | Fonte |
|---|---|---|
| Ciclo recomendado | Renovação a cada 3 anos | IDC/Dell (estudo com 14 empresas) |
| Custo operacional nos anos 4 a 6 | Custos acumulados podem chegar a 10x o valor inicial do servidor | IDC/Dell |
| Retorno do investimento na troca | Menos de 1 ano | IDC/Dell |
| Paradas não planejadas (ciclo de 3 anos x 6 anos) | 49% menos interrupções | IDC, dez/2024 |
| Desempenho de aplicações | 21% melhor | IDC, dez/2024 |
| Horas de gestão por servidor | 69 horas a menos | IDC, dez/2024 |

Leia esses números com senso crítico: são estudos patrocinados por um fabricante e feitos com empresas grandes. O valor deles está na tendência, que bate com o que se vê em campo. Depois do terceiro ano, o servidor custa mais em energia por unidade de trabalho, em horas da equipe e em risco de parada, enquanto entrega menos desempenho que uma plataforma atual.

## O prazo de 2027: fim do suporte do Windows Server 2016

Pela página oficial de ciclo de vida da Microsoft, o Windows Server 2016 segue a política de ciclo fixo: o suporte padrão acabou em janeiro de 2022 e o **suporte estendido termina em 12 de janeiro de 2027**. Depois disso, o sistema deixa de receber correções de segurança gratuitas.

A Microsoft oferece o **ESU (Extended Security Updates)** para as edições Standard e Datacenter, mas com limites claros:

| Ponto | Como funciona o ESU do Windows Server 2016 |
|---|---|
| Duração | Até 3 anos (ano 1 até jan/2028, ano 2 até jan/2029, ano 3 até jan/2030) |
| O que inclui | Só atualizações de segurança classificadas como Críticas ou Importantes |
| O que não inclui | Novos recursos, correções não relacionadas a segurança sob demanda, suporte técnico geral |
| Custo | Pago, inclusive no Azure (não há ESU gratuito para o 2016) |
| Requisitos on-premises | Software Assurance ativo ou licenças por assinatura; via Azure Arc ou licenciamento por volume |
| Compra | Ano 2 e ano 3 só podem ser comprados depois do ano anterior |

A própria Microsoft descreve o ESU como "último recurso" e "ponte temporária". Para quem roda o 2016 em servidores comprados entre 2016 e 2019, o ESU significa pagar para manter um sistema antigo em hardware que já passou do ponto ideal de troca. A recomendação da Microsoft é migrar para o Windows Server 2025 ou para a nuvem. O Windows Server 2019, para referência, tem suporte estendido até 9 de janeiro de 2029.

## Sinais de que é hora de trocar o servidor

**1. Garantia do fabricante vencida.** Sem garantia, uma placa-mãe ou controladora RAID com defeito pode deixar a operação parada por dias, à espera de peça. Garantia estendida de equipamento antigo costuma ser cara e nem sempre está disponível.

**2. Paradas não planejadas se repetindo.** Discos falhando com frequência, erros de memória corrigíveis (ECC) aparecendo nos logs, fontes queimando. Cada parada tem um custo para o negócio que raramente entra na planilha de TI.

**3. Gargalo que upgrade não resolve.** Se a CPU vive no limite e a placa não aceita processadores mais novos, ou se os slots de memória já estão no máximo suportado, não há para onde crescer.

**4. Sistema operacional ou hypervisor sem suporte.** Além do Windows Server 2016, versões novas de hypervisors e bancos de dados costumam exigir hardware mais recente. Confira a lista de compatibilidade de hardware (HCL) do software que você vai usar nos próximos anos.

**5. Consolidação possível.** Quando vários servidores antigos podem virar um ou dois novos com virtualização, a economia de energia, espaço em rack e licenças por servidor muda a conta.

## Upgrade ou troca: como decidir

| Situação | Melhor caminho |
|---|---|
| Servidor com até 3 anos, garantia ativa, falta só RAM ou disco | Upgrade |
| Servidor com 4 ou 5 anos, garantia ativa, sistema operacional suportado | Upgrade pontual e planejamento da troca |
| Garantia vencida ou vencendo em menos de 12 meses | Troca |
| Roda Windows Server 2016 e o hardware não suporta a versão nova | Troca junto com a migração |
| Vários servidores subutilizados | Consolidar em menos máquinas novas |

## Como calcular se vale trocar agora

Monte uma comparação simples para os próximos 24 meses:

**Custo de manter**
- Garantia estendida ou contrato de manutenção de terceiros.
- Licenças de ESU, se o sistema operacional estiver fora de suporte.
- Horas da equipe de TI dedicadas a esse servidor (incidentes, ajustes, monitoramento).
- Custo estimado de parada: horas paradas por ano multiplicadas pelo custo por hora da operação afetada.
- Energia e refrigeração.

**Custo de trocar**
- Hardware novo com garantia de 3 a 5 anos.
- Licenças (verifique se o modelo por núcleo muda a conta com processadores de mais núcleos).
- Projeto de migração e janela de manutenção.

Se o custo de manter por 24 meses estiver próximo ou acima do custo de trocar, a troca é a decisão mais barata, mesmo antes de considerar o ganho de desempenho.

## Erros comuns

- **Comprar o servidor novo "igual ao antigo".** O perfil de carga mudou desde a compra anterior. Meça CPU, memória, IOPS e crescimento de dados antes de especificar.
- **Ignorar o licenciamento por núcleo.** Processadores atuais têm muito mais núcleos. Sem planejar, a licença do sistema operacional ou do banco de dados pode custar mais que o hardware.
- **Deixar para dezembro.** Migração de servidor exige teste e janela de manutenção. Com o prazo de 12/01/2027, quem ainda não começou já está apertado.
- **Pagar ESU sem plano de saída.** O ESU tem prazo final e o custo se repete a cada ano. Use-o só como ponte para uma migração já agendada.
- **Esquecer o backup na migração.** Toda troca é um bom momento para validar se o backup restaura de verdade.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega servidores para empresas de todos os portes no Brasil, com mais de 25 anos de experiência, mais de 3.600 projetos e mais de 18.700 máquinas entregues. A consultoria começa no primeiro contato: avaliamos a carga atual, o licenciamento e o prazo de suporte do seu ambiente para dimensionar a troca no tamanho certo, com marcas homologadas e suporte pós-venda.

👉 Conheça as opções em [Servidores Tyar](https://tyar.com.br/produtos/servidores) e, se a renovação envolver mais capacidade de dados, veja também [Storage](https://tyar.com.br/produtos/storage).

**Fontes:** [Microsoft Lifecycle – Windows Server 2016](https://learn.microsoft.com/en-us/lifecycle/products/windows-server-2016) · [Microsoft – Planning ahead for Windows Server 2016 end of support](https://www.microsoft.com/en-us/windows-server/blog/2026/02/25/planning-ahead-for-windows-server-2016-end-of-support/) · [Microsoft – Extended Security Updates FAQ](https://learn.microsoft.com/en-us/lifecycle/faq/extended-security-updates) · [Microsoft Lifecycle – Windows Server 2019](https://learn.microsoft.com/lifecycle/products/windows-server-2019) · [Dell – Refreshed servers can refresh profitability (IDC)](https://www.dell.com/en-us/blog/refreshed-servers-can-refresh-profitability-while-boosting-speed-innovation-and-agility/) · [IDC – The Business Value of Dell Technology Rotation for Servers (dez/2024)](https://www.delltechnologies.com/asset/da-dk/solutions/financing-and-payment-solutions/industry-market/idc-business-value-tr-servers.pdf)
