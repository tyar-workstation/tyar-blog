---
title: "Edge blending de projetores: como fazer uma emenda invisível"
slug: "edge-blending-projetores-como-fazer"
description: "Edge blending de projetores: quanto de sobreposição usar, como ajustar gamma, cor e nível de preto no WATCHOUT e quais erros deixam a emenda visível."
date: "2026-11-20"
author: "Equipe Tyar"
category: "MediaServer Watchout"
tags: ["edge blending", "projeção", "watchout", "multiprojeção", "media server", "soft edge"]
focus_keyword: "edge blending de projetores"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/mediaserver-watchout"
faq:
  - q: "Quanto de sobreposição usar no edge blending?"
    a: "A documentação do WATCHOUT 7 cita sobreposições de 10% a 20% da largura de saída do projetor como comuns, e a VIOSO recomenda no mínimo 10% e evitar mais de 25%. Abaixo de 5% a emenda fica muito difícil de esconder."
  - q: "Posso misturar projetores de modelos diferentes em um blend?"
    a: "Não é recomendado. A BenQ indica usar o mesmo modelo, resolução, razão de projeção e lente, com brilho e horas de uso parecidos. Diferenças de resolução ou de lente praticamente não têm correção."
  - q: "Por que aparece uma faixa clara ou escura no meio da emenda?"
    a: "Quase sempre é gamma do soft edge mal ajustado. No WATCHOUT 7, gamma baixo demais gera faixa escura e alto demais gera faixa clara; o valor certo deixa o branco uniforme em 25%, 50%, 75% e 100%."
---

# Edge blending de projetores: como fazer uma emenda invisível

Edge blending é a técnica de sobrepor as bordas de dois ou mais projetores e aplicar um degradê (soft edge) na área sobreposta, para que a soma de luz na emenda fique igual ao restante da imagem. Para funcionar, três coisas precisam estar certas: sobreposição suficiente (em geral 10% a 20% da largura de cada projetor), geometria corrigida antes do blend e projetores equalizados em brilho, cor e nível de preto. O media server faz o degradê; a qualidade final depende de como o sistema foi planejado e calibrado.

## Resumo rápido

- Use sobreposição de 10% a 20% da largura de saída; abaixo de 5% a emenda raramente fica invisível e acima de 25% você desperdiça resolução e brilho.
- Corrija a geometria (warp) primeiro e só depois ajuste o blend: no WATCHOUT 7 o processamento é composição → warp → máscaras → soft edge.
- Projetores iguais (modelo, lente, resolução, horas de uso) são pré-requisito, não detalhe.
- Ajuste o gamma do soft edge olhando campos de branco em 25%, 50%, 75% e 100%, depois de 15 a 30 minutos de aquecimento.
- O nível de preto na sobreposição é o ponto mais difícil: trate com ajuste dos projetores e, se preciso, compensação mecânica.

## Como o edge blending funciona

Na área onde duas projeções se cruzam, a tela recebe luz dos dois equipamentos. Sem tratamento, essa faixa fica visivelmente mais clara. O soft edge aplica uma rampa de transparência: um projetor vai de 100% a 0% enquanto o outro faz o caminho inverso, de forma que a soma permaneça constante.

Como a resposta de luz dos projetores não é linear, essa rampa precisa de correção de gamma. É por isso que todo software de blend tem um controle de curva ou gamma, e é esse ajuste que separa uma emenda imperceptível de uma faixa que o público nota na primeira cena escura.

## Quanto de sobreposição usar

As fontes técnicas convergem em uma faixa:

| Referência | Recomendação de sobreposição |
|---|---|
| Documentação do WATCHOUT 7 (Dataton) | 10% a 20% da largura de saída é comum; abaixo de 5% é muito mais difícil de blendar sem aparecer |
| VIOSO (software de calibração) | Não menos que 10% em cada borda; evitar mais de 25% |

Na prática, mais sobreposição facilita esconder a emenda, mas cada ponto percentual sobreposto é resolução e brilho que não entram na imagem final. Em um blend horizontal de três projetores, por exemplo, há duas faixas de sobreposição; com 15% em cada uma, uma parte relevante dos pixels de dois projetores é usada só para a transição. Esse cálculo precisa entrar no dimensionamento da resolução total da tela e na escolha do conteúdo, que deve ser produzido na resolução real do canvas, não na soma bruta das saídas.

## Requisitos dos projetores

O software não compensa diferenças físicas grandes entre equipamentos. A BenQ lista os critérios para um blend sem emenda:

| Critério | Por que importa |
|---|---|
| Mesmo modelo e mesma resolução | Resoluções diferentes geram pixels de tamanhos diferentes na sobreposição; a BenQ considera isso praticamente impossível de corrigir |
| Mesma razão de projeção e faixa de lente | Garante tamanho de pixel e foco equivalentes nas duas imagens |
| Brilho e horas de uso parecidos | O brilho cai com o uso; um projetor novo ao lado de um antigo cria degrau de luminância |
| Parâmetros de cor semelhantes (temperatura, cromaticidade), de preferência do mesmo lote | Diferenças de cor aparecem como mancha na transição |
| Lens shift e zoom | Permitem alinhar a geometria opticamente antes do warp digital |

A VIOSO acrescenta configurações a fazer em cada projetor antes da calibração: rodar na resolução nativa, usar o melhor modo de cor (normalmente "Cinema" ou "Simulation"), desativar todo keystone e qualquer zoom digital, focar bem e garantir que os projetores estejam firmes. Eles não devem ser movidos durante nem depois da calibração.

## Passo a passo no WATCHOUT 7

O WATCHOUT 7 oferece soft edge automático: na seção **Mask** das propriedades do dispositivo, a opção **Automatic Soft Edges** detecta as sobreposições no stage e gera os degradês. Um fluxo de trabalho consistente segue esta ordem:

1. **Aquecimento.** Ligue os projetores e aguarde de 15 a 30 minutos, como indica a documentação, antes de qualquer calibração de blend.
2. **Geometria primeiro.** Alinhe opticamente (lens shift, zoom, foco) e depois ajuste o warp. O WATCHOUT oferece correção de perspectiva, curvas com Bezier e correção completa por pontos, além de importação de dados de sistemas externos de calibração. Como o warp é processado antes das máscaras, mexer na geometria depois de ajustar o blend desfaz o trabalho.
3. **Ative o soft edge.** Use o Automatic Soft Edges ou, quando ele não se aplica, máscaras manuais com presets Left, Right, Top, Bottom, Rectangular ou Round. O degradê deve cobrir toda a área de sobreposição.
4. **Ajuste o gamma.** O controle Gamma Correction do soft edge automático vai de 0,5 a 1,5 (padrão 1,0). Faixa escura no centro da emenda indica gamma baixo demais; faixa clara, gamma alto demais.
5. **Teste em vários níveis.** Avalie com campo branco em 25%, 50%, 75% e 100%, rampa de cinza e o conteúdo real do show. O blend correto é aquele que fica uniforme em todos os níveis, não só no branco total.
6. **Equalize a cor.** Use os controles de White Point (R, G, B) de cada display para igualar a temperatura de cor entre projetores.
7. **Trate o nível de preto.** Iguale o preto o máximo possível nas configurações dos projetores; quando necessário, use compensação mecânica, como máscaras pretas na frente da lente.

Em projetores com blend interno, como os da Epson, o procedimento é análogo pelo menu Multi-Projection > Edge Blending (borda, início e largura do blend, curva). Mas, quando o media server já faz o blend, o recurso interno do projetor deve ficar desligado para não aplicar o degradê duas vezes.

## Erros comuns

- **Ajustar o blend antes do warp.** Qualquer mudança de geometria posterior desloca a área de sobreposição e invalida o degradê.
- **Calibrar com o projetor frio.** Brilho e cor ainda estão mudando nos primeiros minutos; o ajuste feito ali não se sustenta.
- **Deixar keystone ou zoom digital ativos no projetor.** Eles reduzem resolução efetiva e conflitam com a correção feita no software.
- **Sobreposição curta demais para "ganhar" resolução.** Abaixo de 5% o resultado tende a mostrar a emenda, principalmente em conteúdo com gradientes suaves.
- **Testar só com branco 100%.** A falha de gamma aparece em tons médios; a de nível de preto, em cenas escuras.
- **Não recalibrar após mudanças físicas.** A documentação do WATCHOUT orienta revisar warp, gamma, preto e cor depois de qualquer alteração na instalação, inclusive troca de lâmpada ou ajuste de suporte.
- **Misturar projetores com horas de uso muito diferentes.** Em instalações permanentes, planeje a substituição em conjunto.

## Como escolher a solução de blend

Para telas planas com dois ou três projetores e geometria simples, o soft edge automático do media server costuma resolver bem. Superfícies curvas, domos, projeção mapeada em objetos e instalações com muitos projetores pedem warp por pontos ou sistemas de calibração por câmera, cujos dados o WATCHOUT pode importar. Instalações permanentes, como museus e espaços imersivos, justificam o investimento em calibração precisa, porque a imagem será vista todos os dias e os projetores envelhecem.

O hardware do media server também precisa acompanhar: número de saídas de vídeo, resolução total do canvas e capacidade de reproduzir o conteúdo nessa resolução sem perda de quadros. Esses pontos devem ser definidos junto com o projeto óptico, não depois.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega media servers WATCHOUT para multiprojeção, com consultoria desde o primeiro contato e suporte pós-venda. São mais de 25 anos de experiência e mais de 3.600 projetos, incluindo o Museu do Futebol.

👉 Conheça o [MediaServer Watchout da Tyar](https://tyar.com.br/produtos/mediaserver-watchout) e veja projetos entregues em [Cases](https://tyar.com.br/cases).

---

**Fontes:**

- [Dataton – WATCHOUT 7: Edge Blending](https://docs.dataton.com/watchout-7-new/watchout/displays-and-outputs/edge-blending.html)
- [Dataton – Edge blending and geometry correction](https://www.dataton.com/watchout-overview-edge-blending-and-geometry-correction-warping)
- [BenQ – How to make a great seamless edge blending](https://www.benq.com/en-in/business/resource/trends/how-to-make-a-great-seamless-edge-blending.html)
- [Epson – Blending the Image Edges](https://files.support.epson.com/docid/cpd6/cpd61218/source/adjustments/tasks/multi_projector_tasks/multi_projector_edge_blending.html)
- [VIOSO – Projector setup](https://helpdesk.vioso.com/documentation/preparation-projector)
