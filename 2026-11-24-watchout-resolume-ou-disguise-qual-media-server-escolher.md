---
title: "WATCHOUT, Resolume ou disguise: qual media server escolher"
slug: "watchout-resolume-ou-disguise-qual-media-server-escolher"
description: "Compare WATCHOUT, Resolume e disguise: arquitetura, codecs, saídas e controle, e veja qual media server combina com museu, evento ou show ao vivo."
date: "2026-11-24"
author: "Equipe Tyar"
category: "MediaServer Watchout"
tags: ["media server", "WATCHOUT", "Resolume Arena", "disguise", "videowall", "projeção mapeada"]
focus_keyword: "qual media server escolher"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/mediaserver-watchout"
faq:
  - q: "Qual a diferença entre Resolume Avenue e Arena?"
    a: "O Arena inclui tudo do Avenue e acrescenta projeção mapeada, edge blending, entrada de SMPTE timecode, controle e saída DMX, saída por placa de captura, Groups e Slice Transforms. Na loja da Resolume, o Avenue custa € 299 e o Arena € 799 por computador."
  - q: "O WATCHOUT 7 continua tocando se o computador de programação cair?"
    a: "Sim. Pela documentação da Dataton, o show pode rodar sem o Producer depois de configurado, e o Runner continua funcionando mesmo se o Director se desconectar."
  - q: "Qual codec usar em um media server com várias saídas?"
    a: "Para muitas telas simultâneas, a família HAP é a indicada pela Dataton por ser acelerada por hardware. HEVC gera arquivos menores e Notch LC equilibra qualidade e desempenho. Resolume usa o DXV e o disguise aceita HAP, NotchLC e ProRes."
---

# WATCHOUT, Resolume ou disguise: qual media server escolher

A escolha depende do tipo de projeto. **WATCHOUT** é a opção mais natural para instalações e shows programados em timeline que rodam todos os dias com várias telas sincronizadas, como museus, centros de visitantes e cenografia corporativa. **Resolume Arena** é feito para mixagem de vídeo ao vivo, ligada a música e DJ. **disguise** atende produções de grande porte que exigem visualização 3D do palco, integração com motores de tempo real e hardware dedicado de alto custo. Abaixo, os critérios que definem a decisão.

## Resumo rápido

- **WATCHOUT 7**: arquitetura distribuída (Producer, Director, Runner, Asset Manager), timeline e cues, foco em instalações permanentes e shows multitela.
- **Resolume Arena**: software de VJ com mixagem ao vivo, sincronismo por BPM, projeção mapeada e DMX; licença de € 799 por computador.
- **disguise**: plataforma completa (software Designer + servidores VX, GX, RX, EX) com visualizador 3D e RenderStream para Unreal Engine, Notch, Unity e TouchDesigner.
- O codec pesa tanto quanto o software: HAP, Notch LC, DXV e HEVC têm comportamentos diferentes de GPU e armazenamento.
- O hardware de reprodução (GPU, SSD NVMe, sincronismo) é o que garante que o conteúdo rode sem quadros perdidos.

## Comparativo entre os três media servers

| Critério | WATCHOUT 7 | Resolume Arena | disguise |
|---|---|---|---|
| Modelo de trabalho | Timeline e cues, show programado | Mixagem ao vivo por clipes e camadas, sincronismo por BPM | Timeline com visualizador 3D do palco |
| Uso típico | Museus, exposições, eventos corporativos, cenografia | Shows musicais, festas, VJ | Turnês, teatro, broadcast, produção virtual |
| Arquitetura | Distribuída: Producer, Director, Runners, Asset Manager | Uma máquina por licença | Software Designer + servidores dedicados da marca |
| Codecs de destaque | HAP (todas as variantes), Notch LC, HEVC, ProRes | DXV 3 | NotchLC, ProRes, HAP, não comprimido |
| Controle externo | Art-Net/DMX, OSC, MIDI, LTC, HTTP, Crestron/AMX | MIDI, OSC, DMX, SMPTE (Arena), API | DMX, SMPTE, MIDI, OSC, FreeD, sistemas de tracking |
| Hardware | Workstations/servidores escolhidos pelo integrador | Qualquer computador compatível | Linha própria (ex.: VX 4+, VX 3, VX 2+) |

## WATCHOUT 7: instalações multitela e shows programados

O WATCHOUT 7 usa, segundo a Dataton, uma "arquitetura distribuída, centrada em rede", dividida em funções:

- **Producer**: interface de programação e controle do show.
- **Director**: o coordenador do sistema; distribui os dados do show, gerencia o sincronismo, atua como servidor de tempo NTP e recebe protocolos externos.
- **Runner**: faz a reprodução de áudio e vídeo; vários Runners podem ser distribuídos na rede.
- **Asset Manager**: repositório de mídia que otimiza os arquivos e os entrega aos Runners.

Essa divisão tem uma consequência prática importante para quem opera um museu ou um espaço permanente: a documentação afirma que o show pode rodar sem o Producer depois de configurado, que o Runner continua funcionando se o Director se desconectar e que os renderizadores mantêm a saída se o Runner cair. A Dataton descreve modos de implantação que vão do "All-in-One" (tudo em uma máquina) até instalações com Director sem interface e vários Runners.

Outros pontos técnicos da versão 7:

- **Codecs**: aceita a família HAP completa (HAP, HAP Alpha, HAP Q, HAP Q Alpha, HAP R), Notch LC, ProRes 422/4444, H.264 (até o level 5.2), HEVC 8 e 10 bits e MPEG2. O Asset Manager converte o material para formatos otimizados de reprodução. A própria Dataton recomenda HAP para configurações com muitas telas.
- **Limite de pixels**: a partir da 7.1.2, o limite passou a ser 8 × DCI 4K (8 × 4096 × 2160).
- **Projeção**: malhas de warp, editor de máscara para qualquer saída, soft-edge e suporte a MPCDI 1.0.
- **Sincronismo**: as notas de versão registram que o sincronismo por hardware funciona para uma tela por servidor e recomendam NVIDIA Mosaic para agrupar saídas. Esse é um ponto de projeto, não um detalhe: a configuração de GPU e drivers precisa ser validada antes da instalação.
- **Integração**: Art-Net/DMX, OSC, MIDI, timecode LTC e sistemas de automação como Crestron e AMX.

## Resolume Arena: vídeo ao vivo e VJ

A Resolume vende duas versões. O Avenue (€ 299 por computador) é o mixador de vídeo; o **Arena** (€ 799 por computador) acrescenta os recursos que interessam a projetos com projeção e iluminação:

- projeção mapeada e edge blending;
- entrada de SMPTE timecode;
- controle DMX e saída para fixtures DMX;
- saída por placa de captura;
- Groups e Slice Transforms;
- integração com Denon StageLinq e Pioneer Pro DJ Link.

O codec próprio, **DXV 3**, foi criado para transferir a decodificação para a placa de vídeo e permitir mais camadas em resolução maior; ele aceita canal alfa e tem exportador para Premiere Pro, Media Encoder e After Effects. O software também recebe NDI, Spout, Syphon e placas de captura Blackmagic, AJA e Datapath.

É a escolha certa quando o conteúdo é disparado e mixado ao vivo, acompanhando a música. Para uma exposição que precisa tocar a mesma sequência sincronizada em dezenas de telas por meses, o modelo de timeline e a arquitetura distribuída do WATCHOUT tendem a ser mais adequados.

## disguise: grandes produções e tempo real

O disguise combina o software **Designer** com uma linha própria de servidores. O diferencial é o visualizador 3D, que, segundo o fabricante, cria uma representação em tempo real e precisa em pixels de todo o ambiente da produção, incluindo projeção de footprints, sombras, sobreposição e medição de lúmens dos projetores. O **RenderStream** integra Unreal Engine, Notch, Unity e TouchDesigner, o que explica o uso em produção virtual e turnês.

Exemplos de hardware da linha VX, conforme o site do fabricante:

| Modelo | Saídas | GPU | Armazenamento | RAM |
|---|---|---|---|---|
| VX 4+ | 4× 4K | AMD Radeon Pro VII | 4× 1,92 TB NVMe removível (RAID 10) | 128 GB |
| VX 3 | 3× 4K | NVIDIA RTX A4500 | 1× 3,84 TB NVMe removível | 96 GB |
| VX 2+ | 2× 4K | NVIDIA RTX A4500 | 1× 3,84 TB NVMe removível | 96 GB |

O ecossistema é poderoso, mas fechado: o hardware é da própria marca e a curva de aprendizado é longa. Para a maioria das instalações em museus e eventos corporativos, é mais capacidade (e custo) do que o projeto exige.

## Como escolher

1. **Show programado ou ao vivo?** Sequência fixa, com cues e horários: WATCHOUT. Conteúdo disparado na hora, acompanhando música: Resolume Arena.
2. **Quantas saídas e qual resolução total?** Some todos os pixels das telas e projetores. Isso define quantos Runners (ou servidores) e quais GPUs o projeto precisa.
3. **O sistema vai rodar sem operador?** Em instalações permanentes, resiliência e operação autônoma pesam mais que efeitos ao vivo. A arquitetura do WATCHOUT foi desenhada para isso.
4. **Precisa simular o palco em 3D ou integrar Unreal?** Se sim, o disguise se justifica.
5. **Qual codec o estúdio de conteúdo entrega?** Defina o codec antes de comprar o hardware: HAP e Notch LC exigem mais armazenamento e banda de disco; HEVC economiza espaço, mas depende da decodificação da GPU.

## Erros comuns

- **Comprar a licença antes de dimensionar o hardware.** O software não compensa GPU fraca, SSD lento ou sincronismo mal configurado.
- **Ignorar o sincronismo entre saídas.** No WATCHOUT 7, o próprio fabricante documenta limitações de sincronismo por hardware e de sincronismo entre canais de GPU conforme versão do Windows e driver.
- **Entregar conteúdo em H.264 de alta resolução sem verificar o limite.** O WATCHOUT aceita H.264 só até o level 5.2; para muitas telas, HAP é a recomendação.
- **Usar Resolume Avenue esperando edge blending.** Edge blending, projeção mapeada e DMX são exclusivos do Arena.
- **Não prever redundância.** Em museus e espaços abertos ao público, um servidor reserva e uma rotina de recuperação evitam tela preta.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega media servers WATCHOUT dimensionados para cada instalação, com marcas homologadas, consultoria desde o primeiro contato e suporte pós-venda. Com +25 anos de experiência e +3.600 projetos, temos casos como o Museu do Futebol.

👉 Conheça o [MediaServer Watchout da Tyar](https://tyar.com.br/produtos/mediaserver-watchout) e veja projetos entregues em [Cases](https://tyar.com.br/cases).

---

**Fontes:**

- [Dataton – WATCHOUT 7 Overview](https://docs.dataton.com/watchout-7/about.html)
- [Dataton – WATCHOUT 7 Architecture](https://docs.dataton.com/watchout-7/.architecture.html)
- [Dataton – WATCHOUT 7 Supported Media Formats](https://docs.dataton.com/watchout-7/am/formats_and_codecs.html)
- [Dataton – WATCHOUT 7 Release Notes](https://dataton.com/watchout-7-release-notes)
- [Resolume – Difference between Avenue and Arena](https://resolume.com/support/en/avenue-arena-difference)
- [Resolume – Avenue & Arena](https://resolume.com/software/avenue-arena)
- [Resolume – DXV Codec](https://resolume.com/software/codec)
- [disguise – VX range](https://www.disguise.one/en/products/vx-range)
- [disguise – Designer](https://www.disguise.one/en/products/designer)
