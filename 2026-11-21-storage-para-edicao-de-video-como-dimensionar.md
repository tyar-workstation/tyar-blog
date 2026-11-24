---
title: "Storage para edição de vídeo: como dimensionar para sua equipe"
slug: "storage-para-edicao-de-video-como-dimensionar"
description: "Como dimensionar storage para edição de vídeo em equipe: taxa de dados por codec, streams simultâneos, rede 10GbE, SMB/NFS e erros comuns no projeto."
date: "2026-11-21"
author: "Equipe Tyar"
category: "Storage"
tags: ["storage para edição de vídeo", "storage compartilhado", "ProRes", "10GbE", "DaVinci Resolve", "pós-produção"]
focus_keyword: "storage para edição de vídeo"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/storage"
faq:
  - q: "Quanto de banda preciso para editar ProRes 422 HQ em 4K UHD?"
    a: "Pela tabela oficial da Apple, ProRes 422 HQ em 3840x2160 a 30p tem taxa-alvo de 884 Mb/s, cerca de 110 MB/s por stream. Multiplique pelo número de streams simultâneos de cada editor e de toda a equipe."
  - q: "Rede de 1 Gigabit serve para editar vídeo direto do storage?"
    a: "Para proxies e material leve em HD, pode servir. Para 4K em ProRes 422 HQ, não: um único stream (cerca de 110 MB/s) já ocupa quase todos os 125 MB/s teóricos de um link de 1GbE. Para edição em 4K, o mínimo prático por estação é 10GbE."
  - q: "Devo usar SMB ou NFS no storage de edição?"
    a: "A Dell recomenda, no guia de boas práticas para DaVinci Resolve, NFS para estações Linux e SMB para Windows e macOS, com jumbo frames (MTU 9000) configurados ponta a ponta em redes de 10GbE ou mais."
---

# Storage para edição de vídeo: como dimensionar para sua equipe

Para dimensionar um storage para edição de vídeo, o ponto de partida não é a capacidade em terabytes, e sim a **taxa de dados sustentada** que a equipe consome ao mesmo tempo. Some a taxa do codec que vocês usam, multiplique pelo número de streams simultâneos de cada editor e pelo número de editores, e só então escolha discos, controladora e rede. Capacidade é a segunda conta; throughput é a primeira.

## Resumo rápido

- O codec define a carga: ProRes 422 HQ em 4K UHD a 30p pede cerca de 110 MB/s por stream; em 8K a 24p, cerca de 377 MB/s.
- Some streams simultâneos (multicâmera, camadas, transições) de todos os editores ativos, não só um por pessoa.
- 1GbE (125 MB/s teóricos) não sustenta nem um stream de 4K 422 HQ com folga; 10GbE por estação é o ponto de partida para 4K.
- Jumbo frames (MTU 9000) ponta a ponta e o protocolo certo por sistema (SMB no Windows/macOS, NFS no Linux) fazem diferença real.
- Banco de dados de projeto (ex.: PostgreSQL do DaVinci Resolve) não deve ficar no mesmo storage da mídia.

## Passo 1: descubra a taxa de dados do seu codec

A forma mais confiável é usar a tabela oficial do fabricante do codec. A Apple publica as taxas-alvo do ProRes no seu white paper. Convertemos de megabits (Mb/s) para megabytes (MB/s) dividindo por 8, porque storage e disco costumam ser especificados em MB/s.

| Formato (Apple ProRes) | Resolução / fps | Mb/s | MB/s por stream |
|---|---|---|---|
| ProRes 422 HQ | 1920x1080 / 30p | 220 | 27,5 |
| ProRes 422 Proxy | 3840x2160 / 30p | 182 | 22,8 |
| ProRes 422 | 3840x2160 / 30p | 589 | 73,6 |
| ProRes 422 HQ | 3840x2160 / 30p | 884 | 110,5 |
| ProRes 4444 | 3840x2160 / 30p | 1.326 | 165,8 |
| ProRes 4444 XQ | 3840x2160 / 30p | 1.989 | 248,6 |
| ProRes 422 HQ | 4096x2160 / 24p | 754 | 94,3 |
| ProRes 422 HQ | 8192x4320 / 24p | 3.017 | 377,1 |

Fonte: Apple ProRes White Paper (abril de 2017), tabela de taxas-alvo. Valores de 4444 e 4444 XQ sem canal alfa.

Repare na distância entre proxy e master: em 4K UHD, editar em ProRes 422 Proxy consome cerca de 1/5 da banda do 422 HQ. Essa é a alavanca mais barata para reduzir o custo do storage, desde que o fluxo de trabalho permita finalizar sobre o original.

Para formatos RAW de câmera (Blackmagic RAW, por exemplo), a taxa depende da câmera, da resolução e do ajuste de compressão (3:1, 5:1, 8:1, 12:1 ou qualidade constante Q0 a Q5). A própria Blackmagic oferece uma calculadora de taxa de dados na página do formato; use o número dela para a sua câmera, não uma média genérica.

## Passo 2: conte streams simultâneos, não editores

Um editor não lê um stream só. Multicâmera com quatro ângulos são quatro streams. Uma transição cruzada lê dois clipes ao mesmo tempo. Picture-in-picture e camadas de composição somam mais. Some também o que acontece em paralelo fora da timeline: ingest de cartões, render e exportação gravando no mesmo volume, e cópias para backup.

Uma conta simples por perfil de trabalho:

| Perfil | Streams por editor (pico) | Exemplo com ProRes 422 HQ UHD 30p |
|---|---|---|
| Corte simples / jornalismo | 2 | 221 MB/s por estação |
| Edição com camadas e transições | 3 a 4 | 331 a 442 MB/s por estação |
| Multicâmera (4 ângulos) | 4 ou mais | 442 MB/s ou mais por estação |

### Exemplo prático

Uma produtora com 4 editores trabalhando em ProRes 422 HQ UHD 30p, cada um com pico de 2 streams:

- Por estação: 2 × 110,5 = **221 MB/s**. Isso já ultrapassa os 125 MB/s teóricos de um link de 1GbE.
- Equipe inteira: 8 × 110,5 = **884 MB/s** sustentados que o storage precisa entregar, antes de contar ingest e render.
- Um único uplink de 10GbE no storage (1.250 MB/s teóricos) ficaria apertado depois do overhead de protocolo e sem espaço para ingest. Aqui faz sentido agregar links ou usar 25GbE no lado do storage.

Se a mesma equipe editar em proxy (22,8 MB/s por stream), a demanda cai para cerca de 182 MB/s no total, e o projeto de storage muda completamente.

## Passo 3: rede e protocolo

A rede costuma ser o gargalo antes dos discos. Pontos que valem para a maioria dos ambientes:

- **Velocidade por estação:** 1GbE atende proxy e HD leve; para 4K em codecs intermediários, planeje 10GbE por estação e uplinks mais largos no storage.
- **Jumbo frames:** o guia de boas práticas da Dell para DaVinci Resolve afirma que jumbo frames (MTU 9000) podem ter impacto positivo significativo em fluxos de alto throughput, especialmente em conexões de 10GbE ou mais, e alerta que toda a cadeia (storage, switch e estação) precisa estar configurada igual.
- **Protocolo:** o mesmo documento recomenda NFS para estações Linux e SMB para Windows e macOS, citando o SMB3 multichannel como forma de aumentar o throughput de um único stream no Windows.

## Passo 4: capacidade (a conta que vem depois)

Com a taxa em MB/s, a capacidade é aritmética: 110,5 MB/s × 3.600 s ≈ 398 GB por hora de material ProRes 422 HQ UHD 30p, por stream gravado. Multiplique pelas horas de material bruto por projeto, pelo número de projetos ativos no volume e reserve espaço livre para o sistema de arquivos não degradar. Defina também onde ficam os projetos arquivados: storage de produção rápido e caro não precisa guardar o que ninguém abre há meses.

## Erros comuns

1. **Dimensionar só por terabytes.** Um storage grande com poucos discos ou controladora fraca não sustenta streams simultâneos de 4K.
2. **Confiar em teste de velocidade sintético.** A Dell observa que ferramentas como o Blackmagic Disk Speed Test podem dar resultados enganosos por causa de cache de leitura e escrita; valide com a aplicação real, reproduzindo a timeline sem perder quadros.
3. **Esquecer a estação.** O mesmo guia lembra que uma workstation pode ser sobrecarregada ao reproduzir vários streams de ProRes 422 HQ 4K 60p muito antes de o storage atingir seu limite. Storage, rede e workstation precisam ser dimensionados juntos.
4. **Banco de projeto no volume de mídia.** Para o DaVinci Resolve, a Dell não recomenda guardar o banco PostgreSQL dos projetos no storage compartilhado de mídia; o indicado é um servidor de projetos dedicado.
5. **Jumbo frames pela metade.** MTU 9000 configurado no storage e na estação, mas não no switch, gera fragmentação e piora o desempenho.
6. **Sem plano de backup.** RAID protege contra falha de disco, não contra exclusão acidental ou ransomware. O material bruto precisa de cópia fora do volume de produção.

## Como escolher: checklist antes de pedir orçamento

- Codec e resolução de trabalho (e se haverá proxy).
- Número de editores ativos ao mesmo tempo e pico de streams por editor.
- Sistemas operacionais das estações (define SMB/NFS).
- Rede atual: switches, velocidade por porta, suporte a jumbo frames.
- Horas de material bruto por mês e por quanto tempo os projetos ficam ativos.
- Política de backup e arquivamento.

Com essas respostas, a conta de throughput, rede e capacidade fica objetiva e evita tanto storage subdimensionado quanto investimento parado.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega storage compartilhado para pós-produção e mídia, dimensionado a partir do codec, do número de editores e da rede do cliente, com marcas homologadas e suporte pós-venda. São mais de 25 anos de experiência e mais de 3.600 projetos entregues.

👉 Conheça as soluções de [Storage da Tyar](https://tyar.com.br/produtos/storage) e, se a equipe também precisa renovar as estações de edição, veja nossas [Workstations](https://tyar.com.br/produtos/workstations).

---

**Fontes:**

- [Apple ProRes White Paper (abril de 2017)](https://www.apple.com/euro/final-cut-pro/f/generic/docs/Apple_ProRes_White_Paper.pdf)
- [Blackmagic RAW – Blackmagic Design](https://blackmagicdesign.com/products/blackmagiccinemacamera/blackmagicraw)
- [Dell EMC Isilon: OneFS 8.x Best Practices for Collaborative Workflows on DaVinci Resolve (H17701, março de 2021)](https://www.delltechnologies.com/asset/en-us/products/storage/industry-market/h17701-dell-emc-isilon-onefs-davinci-resolve-wp.pdf)
