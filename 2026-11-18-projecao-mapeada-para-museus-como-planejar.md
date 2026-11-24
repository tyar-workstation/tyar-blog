---
title: "Projeção mapeada para museus: como planejar o sistema"
slug: "projecao-mapeada-para-museus-como-planejar"
description: "Projeção mapeada para museus: como calcular lúmens, definir sobreposição de edge blending, escolher lentes e o media server para exposições imersivas."
date: "2026-11-18"
author: "Equipe Tyar"
category: "MediaServer Watchout"
tags: ["projeção mapeada", "museus", "Watchout", "edge blending", "media server", "exposição imersiva"]
focus_keyword: "projeção mapeada para museus"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/mediaserver-watchout"
faq:
  - q: "Quantos lúmens preciso para uma projeção mapeada em museu?"
    a: "Use a fórmula lúmens = ft-L × área em pés² ÷ ganho da superfície. Em sala escura, a referência é 16 ft-L; uma parede de 18 m² com ganho 1,0 pede cerca de 3.100 lúmens. Com luz ambiente, a meta sobe para algo perto de 50 ft-L."
  - q: "Qual a sobreposição ideal entre projetores no edge blending?"
    a: "A faixa usual é de 10% a 20% da largura da imagem. Abaixo de 10%, a emenda costuma ficar visível como uma linha ou um ponto mais claro."
  - q: "Por que usar um media server como o Watchout em vez de um player comum?"
    a: "Porque a projeção mapeada exige edge blending, correção geométrica, mapeamento sobre modelos 3D e sincronismo entre várias saídas. O Watchout faz isso numa única timeline, com importação de modelos 3D e de dados de calibração por câmera."
---

# Projeção mapeada para museus: como planejar o sistema

Projeção mapeada para museus funciona quando três coisas são dimensionadas juntas: o brilho (lúmens por área e luz ambiente), a geometria (posição, lente e sobreposição entre projetores) e o media server que faz blending, correção e sincronismo. Errar em uma delas compromete a experiência inteira, não importa a qualidade do conteúdo. Este guia mostra como calcular cada parte antes de pedir orçamento.

## Resumo rápido

- **Brilho:** lúmens = ft-L × área (pés²) ÷ ganho. Em sala escura, a referência é 16 ft-L; com luz ambiente, cerca de 50 ft-L.
- **Vários projetores:** acima de ~20–25 m² em sala escura, costuma valer dividir a imagem entre projetores com edge blending.
- **Sobreposição:** 10% a 20% da largura da imagem; abaixo de 10% a emenda tende a aparecer.
- **Lente:** throw ratio = distância ÷ largura da imagem. Defina a posição de montagem antes de escolher o projetor.
- **Media server:** precisa de edge blending, warping, mapeamento sobre 3D e sincronismo entre saídas. O Dataton Watchout reúne essas funções.

## 1. Quantos lúmens a superfície exige

A fórmula mais usada vem do cálculo de luminância de tela: **lúmens = ft-L × área em pés² ÷ ganho**. Foot-lambert (ft-L) é a luminância desejada na superfície; ganho é quanto a superfície reflete em relação a uma tela branca de referência (1,0).

As metas de referência citadas pelo ProjectorCentral:

| Ambiente | Luminância alvo | Observação |
|---|---|---|
| Sala escura | 16 ft-L (faixa SMPTE de 12 a 22 ft-L) | Padrão de cinema |
| Sala escura, imagem mais viva | 30 a 40 ft-L | Recomendação comum |
| Ambiente com luz | ~50 ft-L ou mais | Varia com a luz real do espaço |

**Exemplo prático:** uma parede de 6 m × 3 m (18 m², ou cerca de 194 pés²), com ganho 1,0.

- Galeria escura, 16 ft-L: 16 × 194 ÷ 1,0 ≈ **3.100 lúmens**.
- Hall com luz ambiente, 50 ft-L: 50 × 194 ÷ 1,0 ≈ **9.700 lúmens**.

A diferença de três vezes mostra por que o controle de luz do espaço expositivo é uma decisão de projeto, e não um detalhe. Paredes pintadas de cinza ou texturizadas têm ganho abaixo de 1,0 e aumentam a conta.

A HeavyM propõe outra estimativa rápida, baseada na luz medida no local: **lúmens ≥ 3 × lux ambiente × área (m²)**, tratada como mínimo absoluto. A mesma fonte considera que acima de 200 lux (luz do dia) a projeção deixa de ser recomendada e uma parede de LED passa a fazer mais sentido.

## 2. Um projetor ou vários?

Quando a superfície passa de algo entre 20 e 25 m² em sala escura, a HeavyM indica dividir a imagem entre vários projetores. Há duas formas:

| Técnica | Como funciona | Quando usar |
|---|---|---|
| **Edge blending** | Projetores lado a lado, com faixa de sobreposição que o software suaviza | Paredes longas, panoramas, cúpulas |
| **Stacking** | Dois ou mais projetores sobre a mesma área | Quando falta brilho e não falta resolução |

No stacking, o ganho real de brilho fica em torno de 80% a 90%, não em 100%. Além disso, a percepção de brilho é logarítmica: o dobro de lúmens não parece o dobro de luz. Stacking também exige projetores idênticos e suporte rígido.

### Sobreposição e curva de blending

A recomendação é sobrepor **10% a 20% da largura da imagem**. Com menos de 10%, a junção tende a aparecer como linha ou faixa mais clara. Prefira curvas de blending do tipo cosseno ou "S" em vez de lineares, e equalize brilho, gama e cor entre os projetores antes de liberar o espaço.

Lembre que a sobreposição consome pixels e lúmens: dois projetores com 15% de sobreposição cobrem cerca de 1,85 vez a largura de um só, e não 2 vezes. Inclua isso no cálculo de resolução e de brilho.

## 3. Lente, distância e resolução

O **throw ratio** liga distância e tamanho da imagem: **throw ratio = distância de projeção ÷ largura da imagem**. Faixas de referência:

| Tipo de lente | Throw ratio |
|---|---|
| Ultracurta | abaixo de 0,5 |
| Curta | 0,5 a 1,0 |
| Padrão | 1,2 a 2,0 |
| Longa (tele) | acima de 2,0 |

Em museus, a posição de montagem costuma ser limitada por circulação de visitantes, rotas de fuga, teto e conservação do acervo. Por isso, defina primeiro onde o projetor pode ficar e só depois escolha lente e modelo. Trabalhe no meio da faixa de zoom, use lens shift para centralizar e evite keystone digital, que deve ser último recurso.

Para nitidez, a HeavyM sugere pelo menos 10 PPI quando o público está a 5 m da superfície. Em vitrines e painéis vistos de perto, a exigência de resolução sobe.

**Fonte de luz:** em instalações que funcionam o dia inteiro, projetores a laser costumam ser a escolha, com vida útil de dezenas de milhares de horas, contra lâmpadas de duração muito menor e troca frequente.

## 4. O papel do media server

O projetor só entrega luz. Quem transforma vários projetores numa imagem única é o media server. No Dataton Watchout, as funções que mais importam para museus são:

- **Edge blending automático** nas áreas sobrepostas, com máscaras ajustáveis (bordas, retângulo e oval com degradê).
- **Correção geométrica (warping):** perspectiva por cantos, curvas Bézier para superfícies curvas e correção completa por pontos de controle.
- **Mapeamento sobre modelos 3D** importados em formatos como OBJ, FBX, DAE, 3DS e BLEND, com projetores virtuais configuráveis (lens shift, distância, rotação) e pré-visualização.
- **Calibração por câmera:** desde a versão 6.2, importa malhas de correção, máscaras de blend e dados de projetor de sistemas DomeProjection.
- **Sincronismo** de todas as saídas, vídeos ao vivo e telas auxiliares na mesma timeline.

Sincronismo não é opcional. A regra da HeavyM resume: se o público consegue comparar duas bordas ao mesmo tempo, as saídas precisam estar sincronizadas.

**Exemplo real:** na inauguração do POLIN, museu de história dos judeus poloneses em Varsóvia, a fachada de vidro virou uma tela única. Quatro projetores Barco HDQ-2K40 cobriram a fachada, um Barco HDF-W26 iluminou uma árvore no centro da cena, e o conjunto chegou a sete projetores e 222.000 lúmens, tudo integrado com edge blending, warping e sincronismo pelo Watchout. Como parte da fachada tinha placas a 45 graus e a luz atravessava o vidro, a correção geométrica foi decisiva.

## Erros comuns

1. **Calcular lúmens sem medir a luz do espaço.** A mesma parede pode pedir 3.100 ou 9.700 lúmens conforme a iluminação.
2. **Ignorar o ganho da superfície.** Paredes escuras ou texturizadas refletem menos que uma tela branca.
3. **Sobreposição curta demais.** Menos de 10% de overlap deixa a emenda visível.
4. **Contar com keystone digital** em vez de posicionar e escolher a lente certa.
5. **Subdimensionar o media server.** Número de saídas, resolução total e codecs definem o hardware; um servidor no limite gera travamentos visíveis em exposições que rodam o dia todo.
6. **Esquecer a operação.** Exposição permanente exige rotina de ligar e desligar, monitoramento e suporte. Planeje isso desde o projeto.

## Como escolher: checklist antes do orçamento

- Dimensões e material de cada superfície (plana, curva, 3D).
- Luz ambiente medida em lux, nos horários de visitação.
- Pontos possíveis de montagem e distâncias.
- Distância do público à superfície.
- Resolução final desejada e formato do conteúdo.
- Horas de funcionamento por dia e dias por semana.
- Necessidade de interatividade, áudio ou entradas ao vivo.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega media servers Watchout para museus, exposições e eventos, com consultoria desde o primeiro contato: dimensionamos saídas, resolução e hardware a partir do seu projeto de projeção e damos suporte pós-venda. São mais de 25 anos de experiência e mais de 3.600 projetos, e o Museu do Futebol está entre os nossos cases.

👉 Conheça o [MediaServer Watchout da Tyar](https://tyar.com.br/produtos/mediaserver-watchout) e veja outros projetos em [Cases](https://tyar.com.br/cases).

**Fontes:** [ProjectorCentral – Simple guide to calculating projector lumens](https://www.projectorcentral.com/simple-guide-to-calculating-projector-lumens.htm) · [HeavyM – Guide to multi-projector video mapping](https://www.heavym.net/guide-to-multi-projector-video-mapping/) · [HeavyM – Projector guide: throw ratio & specs](https://www.heavym.net/projector-guide-throw-ratio-specs/) · [Dataton – Edge blending and geometry correction](https://www.dataton.com/watchout-overview-edge-blending-and-geometry-correction-warping) · [Dataton – 3D projection mapping](https://dataton.com/watchout-overview-3d-projection-mapping) · [Dataton – WATCHOUT maps glass facade at Warsaw museum](https://www.dataton.com/stories/watchout-maps-glass-facade-at-warsaw-museum)
