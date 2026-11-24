---
title: "Garantia de servidor: NBD ou 4 horas, qual contratar?"
slug: "garantia-de-servidor-nbd-ou-4-horas-qual-contratar"
description: "Compare garantia de servidor NBD, 4 horas e reparo em 6 horas na Dell, HPE e Lenovo e saiba qual nível de suporte on-site cabe no seu risco de parada."
date: "2026-11-23"
author: "Equipe Tyar"
category: "Decisão de compra"
tags: ["garantia de servidor", "suporte on-site", "NBD", "SLA", "Dell ProSupport", "HPE Tech Care", "Lenovo Premier"]
focus_keyword: "garantia de servidor NBD ou 4 horas"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/servidores"
faq:
  - q: "Qual a diferença entre garantia NBD e 4 horas em servidor?"
    a: "Na NBD (Next Business Day) o técnico com a peça chega no próximo dia útil. Na de 4 horas, ele chega em até 4 horas, normalmente 24x7. Ambas medem a chegada do técnico, não o servidor consertado."
  - q: "Garantia de 4 horas garante que o servidor volta a funcionar em 4 horas?"
    a: "Não. O prazo de 4 horas é de atendimento on-site. Compromisso de reparo (call-to-repair ou CSR, de 6 horas) é outro serviço, oferecido como nível ou adicional em HPE e Lenovo e sujeito a região."
  - q: "Vale a pena pagar pelo suporte 4 horas em todos os servidores?"
    a: "Não necessariamente. Faz sentido em servidores sem redundância que sustentam operações críticas. Em clusters com failover ou máquinas de laboratório, NBD costuma bastar."
---

# Garantia de servidor NBD ou 4 horas: qual contratar?

A garantia NBD (Next Business Day) coloca um técnico com a peça no seu data center no próximo dia útil; a de 4 horas faz isso em até 4 horas, normalmente 24x7. A escolha certa depende de quanto custa uma hora do servidor parado e de quanta redundância existe na sua infraestrutura. Um detalhe que muita gente ignora: nenhum dos dois prazos garante o servidor consertado. Eles medem a chegada do técnico. Quem precisa de prazo de reparo tem de contratar um serviço específico para isso.

## Resumo rápido

- **NBD**: técnico on-site no próximo dia útil, com atendimento remoto em horário comercial nos planos básicos. Serve para cargas com redundância ou tolerantes a parada.
- **4 horas**: técnico on-site em até 4 horas, com suporte 24x7. Indicado para servidores críticos sem failover.
- **Reparo em 6 horas (call-to-repair/CSR)**: compromisso de devolver o equipamento funcionando. Existe na HPE (nível Critical) e na Lenovo (adicional, 10 horas no Brasil).
- O relógio do SLA normalmente começa após o diagnóstico remoto, não na abertura do chamado.
- Retenção de disco defeituoso é um adicional à parte, essencial para quem lida com dados sensíveis (LGPD).

## O que cada sigla significa de verdade

Os fabricantes usam nomes diferentes para níveis parecidos. Antes de comparar preço, compare o que o contrato mede:

| Termo | O que garante | O que não garante |
|---|---|---|
| NBD (Next Business Day) | Técnico e peça no próximo dia útil | Atendimento em fim de semana e feriado |
| 4 horas on-site | Técnico e peça em até 4 horas | Servidor funcionando em 4 horas |
| Call-to-repair / CSR 6 horas | Equipamento restaurado em até 6 horas | Restauração de dados, SO e aplicações |
| 9x5 | Atendimento em horário comercial | Atendimento de madrugada |
| 24x7 | Atendimento contínuo, inclusive feriados | Prazo de reparo |

Na Lenovo, por exemplo, o atendimento de 4 horas é descrito como "técnico on-site com peças 4 horas após a determinação do problema". Ou seja, o prazo só começa a correr depois que o suporte remoto isola a falha. Na prática, um chamado aberto às 2h pode ter o técnico chegando bem depois das 6h se o diagnóstico demorar.

## Como Dell, HPE e Lenovo organizam seus níveis

### Dell ProSupport

A Dell divide o suporte para infraestrutura em três níveis:

| Nível | Suporte técnico | Atendimento on-site | Destaques |
|---|---|---|---|
| Basic Hardware Support | Horário comercial local | NBD | Só hardware |
| ProSupport | 24/7/365 | NBD ou 4 horas | Hardware e software, gerente de incidente em severidade 1 |
| ProSupport Plus | 24/7/365 | 4 horas | Manutenção proativa, engenheiros sênior, Technical Customer Success Manager |

O ponto a observar: no ProSupport, a velocidade on-site é escolhida no contrato (NBD ou 4 horas). Dois servidores "com ProSupport" podem ter SLAs bem diferentes.

### HPE Tech Care

A HPE trabalha com três níveis, todos cobrindo hardware e software:

| Nível | Janela de cobertura | Retorno remoto | Hardware |
|---|---|---|---|
| Basic | 9 horas/dia em dias úteis | Callback em 2 horas | On-site no próximo dia útil |
| Essential | 24x7, inclusive feriados | 15 min (sev. 1), 1 hora (sev. 2 e 3) | On-site em 4 horas |
| Critical | 24x7, inclusive feriados | 15 min (sev. 1), 1 hora (sev. 2 e 3) | Reparo em 6 horas (call-to-repair) para sev. 1 e 2 |

O nível Critical também inclui gestão de incidentes de parada. A HPE informa que o call-to-repair exige uma auditoria que leva até 30 dias após a compra; até lá, o atendimento é entregue como 4 horas on-site. E está disponível apenas em produtos selecionados.

### Lenovo Premier Support

A Lenovo separa a garantia base, a extensão Standard Support e dois níveis Premier:

| Opção | Diagnóstico | On-site | Reparo comprometido |
|---|---|---|---|
| Garantia base | 9x5 | NBD ("esforço comercialmente razoável") | Não |
| Standard Support | 9x5 | NBD após diagnóstico | Não |
| Premier NBD | 24x7 | NBD após diagnóstico | Não |
| Premier 4-Hour | 24x7 | 4 horas após diagnóstico | CSR 6 horas como adicional |

Dois detalhes relevantes para o Brasil, segundo o material da própria Lenovo: o atendimento Premier em português é 9x5, com retorno de chamada fora do horário, e o CSR que é de 6 horas em outros mercados é de **10 horas no Brasil**. Disponibilidade do 4 horas e do CSR também varia por país e produto.

## Exemplos práticos

**Servidor único de ERP em uma indústria com dois turnos.** Sem redundância, uma falha de placa-mãe na sexta à noite com NBD significa técnico só na segunda. Aqui, 4 horas 24x7 é o mínimo; se a parada custa produção, avalie call-to-repair.

**Três nós de virtualização em cluster com failover.** Se um nó cai, as VMs sobem nos outros. O risco é operar dias com capacidade reduzida e sem margem para nova falha. NBD costuma ser suficiente, desde que o cluster tenha folga de recursos para perder um nó.

**Servidor de GPU para treinamento de IA.** Um job pode ser retomado do último checkpoint. NBD tende a atender, mas confira se a GPU é coberta pela retenção de material defeituoso caso o modelo envolva dados confidenciais.

**Storage com dados de clientes.** Sem retenção de mídia, o disco defeituoso volta ao fabricante. A HPE oferece Defective Media Retention (DMR) e versões ampliadas que incluem outros componentes com dados e até GPUs; outros fabricantes têm opções equivalentes, contratadas à parte.

## Como escolher

1. **Calcule o custo de uma hora parada.** Some faturamento perdido, horas de equipe ociosa e multas contratuais. Se 20 horas paradas (um NBD de sexta para segunda pode passar disso) custam mais que a diferença de preço do contrato, o upgrade se paga.
2. **Mapeie a redundância.** Servidor com failover tolera NBD; servidor único crítico, não.
3. **Leia de onde o relógio começa.** Abertura do chamado ou fim do diagnóstico? Faz diferença de horas.
4. **Confirme a cobertura na sua cidade.** Os fabricantes deixam claro que 4 horas e reparo comprometido não estão disponíveis em todas as localidades.
5. **Verifique idioma e horário do suporte remoto.** Suporte 24x7 em inglês e 9x5 em português são coisas diferentes às 3h.
6. **Planeje a duração.** As extensões costumam ir de 3 a 5 anos, com 1 ou 2 anos adicionais pós-garantia. Contratar depois que a garantia vence pode exigir taxas ou recertificação.

## Erros comuns

- **Achar que 4 horas é prazo de conserto.** É prazo de chegada. O reparo pode levar o dia todo.
- **Comprar 4 horas para tudo.** Servidores de laboratório ou nós redundantes raramente precisam.
- **Esquecer a retenção de disco.** Sem ela, a mídia com dados sai da empresa.
- **Ignorar peças substituíveis pelo cliente.** Na garantia base de alguns fabricantes, certas peças (CRU) são trocadas pelo próprio cliente; nos níveis superiores, um técnico instala todas.
- **Não registrar o endereço correto.** Para reparo comprometido, o fabricante precisa saber onde o equipamento está para posicionar peças em estoque próximo.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega servidores de marcas homologadas para empresas de todos os portes no Brasil, com consultoria desde o primeiro contato e suporte pós-venda. São mais de 25 anos de experiência e mais de 3.600 projetos. Na especificação, ajudamos a definir o nível de garantia de cada máquina conforme a criticidade da carga e a redundância do ambiente, evitando pagar por SLA onde não é necessário e deixar descoberto o que não pode parar.

👉 Conheça as opções em [Servidores](https://tyar.com.br/produtos/servidores) e, se o ambiente exige alta disponibilidade, veja também [Cluster](https://tyar.com.br/produtos/cluster).

---

**Fontes:**

- [Dell ProSupport Infrastructure Suite – datasheet (Dell Technologies)](https://www.delltechnologies.com/asset/en-ie/services/support/briefs-summaries/prosupport-infrastructure-suite-datasheet.pdf)
- [Dell ProSupport Infrastructure Suite – comparison chart (Dell Technologies)](https://www.delltechnologies.com/asset/en-nz/services/support/technical-support/dell-prosupport-infrastructure-suite-comparison-chart.pdf.external)
- [HPE Tech Care Service – data sheet (HPE)](https://www.hpe.com/services/hpe/pdf/a00108652enw)
- [Support services for HPE ProLiant Compute (HPE)](https://www.hpe.com/br/en/services/tech-care/compute.html)
- [Premier Support for Data Centers (Lenovo)](https://www.lenovo.com/ca/en/services/support-services/premier-support-for-data-centers/)
- [Lenovo Premier Support Introduction for ISG (Lenovo)](https://download.lenovo.com/km/media/attachment/Lenovo%20Premier%20Support%20ISG%20Introduction%20v3.pdf)
