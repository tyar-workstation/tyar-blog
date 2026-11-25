---
title: "Capacidade útil de storage: como calcular antes de comprar"
slug: "capacidade-util-de-storage-como-calcular"
description: "Por que 14 discos de 18 TB não viram 252 TB úteis: TB × TiB, paridade RAID, padding, slop space, regra dos 80% e crescimento no cálculo do storage."
date: "2026-11-25"
author: "Equipe Tyar"
category: "Storage"
tags: ["capacidade útil de storage", "TB vs TiB", "RAIDZ2", "ZFS", "slop space", "regra dos 80%", "dimensionamento de storage"]
focus_keyword: "capacidade útil de storage"
link_terms: ["capacidade útil", "TB e TiB", "regra dos 80% do ZFS", "slop space"]
reading_time: 7
cta_product: "https://tyar.com.br/produtos/storage"
faq:
  - q: "Por que meu storage mostra menos espaço do que a soma dos discos?"
    a: "Fabricantes vendem em TB decimais (10^12 bytes) e sistemas operacionais costumam exibir em TiB binários (2^40 bytes), uma diferença de cerca de 9%. Depois disso entram paridade do RAID, padding, partições, metadados e reservas do sistema de arquivos."
  - q: "Quanto do espaço útil posso ocupar em um pool ZFS?"
    a: "A referência é cerca de 80%. Segundo a TrueNAS, pools de arquivo e escrita sequencial toleram 90% a 95%, enquanto cargas com muito I/O aleatório (virtualização, bancos, IA) podem sofrer antes disso em discos mecânicos."
  - q: "Devo contar com a compressão no cálculo de capacidade?"
    a: "Não como base. A TrueNAS relata redução típica de 1,2:1 a 1,6:1 em dados compressíveis, mas vídeo, imagens e arquivos já comprimidos quase não reduzem. Trate a compressão como folga extra, não como capacidade contratada."
---

# Capacidade útil de storage: como calcular antes de comprar

A capacidade útil de storage é o espaço que sobra para dados depois de descontar a conversão de TB para TiB, a paridade do RAID, o padding de alocação, partições, metadados e as reservas do sistema de arquivos, e depois de aplicar uma margem de ocupação segura. Em um exemplo publicado pela TrueNAS, **14 discos de 18 TB (252 TB brutos) resultam em 152,5 TiB utilizáveis** em dois grupos RAIDZ2 de 7 discos: cerca de 66% do bruto. Respeitando a regra prática de ocupar até 80%, o espaço de trabalho fica perto de 122 TiB. Quem compra pela soma dos discos descobre a diferença só depois da instalação.

## Resumo rápido

- **TB ≠ TiB:** 1 TB decimal equivale a 0,909 TiB. Só a conversão "some" cerca de 9% na tela.
- **Paridade e padding** consomem bem mais do que a conta "discos menos paridade" sugere, conforme a largura do grupo e o tamanho de bloco.
- **Reservas do sistema de arquivos** (no ZFS, o *slop space*, limitado a 128 GiB nas versões atuais) e metadados tiram mais um pouco.
- **Não planeje encher o pool:** cerca de 80% é a referência; arquivo sequencial tolera mais, virtualização e bancos toleram menos.
- **Dimensione pelo crescimento de 3 a 5 anos**, não pelo volume de hoje.

## Por que o storage mostra menos espaço do que a soma dos discos?

São perdas em camadas, e cada uma é legítima. A tabela resume o caminho do bruto até o espaço que você realmente pode usar:

| Camada | O que acontece | Ordem de grandeza |
|---|---|---|
| Unidade de medida | Fabricante vende em TB (10^12 bytes); o sistema mostra em TiB (2^40 bytes) | ~9% a menos na tela |
| Partições e rótulos | Swap, alinhamento, rótulos do volume e área de boot por disco | Pequena (no ZFS do TrueNAS, 2 GiB de swap por disco no padrão do exemplo) |
| Paridade (RAID) | Discos ou setores reservados para reconstruir dados | 1 a 3 discos por grupo, conforme o nível |
| Padding de alocação | Setores extras para completar faixas de gravação | Varia com largura do grupo e tamanho de bloco |
| Reservas e metadados | Slop space, metaslabs e estruturas internas | Até 128 GiB de slop no OpenZFS 2.0.7+ |
| Margem de ocupação | Folga para desempenho e crescimento | ~20% (regra dos 80%) |

### TB e TiB: a primeira diferença

Um disco de 18 TB tem 18 × 10^12 bytes. Dividido por 2^40, isso dá 16,37 TiB. Os 252 TB brutos do exemplo da TrueNAS equivalem a 229,2 TiB antes de qualquer RAID. Não é defeito nem "espaço escondido": é só a unidade. A própria TrueNAS lembra que discos reais nem sempre têm o número redondo do rótulo; um disco de 8 TB citado no artigo tem 8.001.563.222.016 bytes. Para um cálculo exato, consulte o tamanho em bytes com ferramentas como `gpart` ou `lsblk -b`.

### Paridade e padding: o desconto que mais pesa

O nível de RAID define quantos discos (ou setores) vão para proteção. Se precisar revisar os níveis, veja nosso comparativo de [RAID 0, 1, 5, 6 e 10 e quando usar cada um](https://blog.tyar.com.br/raid-0-1-5-6-10-qual-escolher/).

A conta simples de um RAIDZ2 de 7 discos seria 5/7 de dados, ou 71,4%. Na prática, o ZFS grava em faixas cujo tamanho mínimo é "p+1" setores (p = 1 no RAIDZ1, 2 no RAIDZ2, 3 no RAIDZ3). No exemplo da TrueNAS, um bloco padrão de 128 KiB ocupa 32 setores de 4 KiB, exige 14 setores de paridade e mais 2 de padding: 48 setores no total. A eficiência real fica em 32/48, ou **66,7%**, e não nos 71,4% da conta de padeiro.

A lição prática: a largura do grupo (quantos discos por vdev) e o tamanho de bloco mudam a capacidade útil. Use uma calculadora específica do sistema de arquivos (a TrueNAS mantém uma para ZFS) em vez de aplicar só a fórmula de RAID tradicional.

### Reservas do sistema de arquivos

O ZFS reserva o *slop space* para que o pool não fique sem espaço por alterações internas. A regra é 1/32 da capacidade, com mínimo de 128 MiB e, desde o OpenZFS 2.0.7, **teto de 128 GiB**. No exemplo de 14 × 18 TB, 1/32 seriam 4,77 TiB reservados; com o teto, a reserva cai para 128 GiB. Vale confirmar a versão do sistema, porque a diferença em pools grandes é relevante.

## Quanto do espaço útil posso ocupar?

A referência do mercado é a **regra dos 80%**. Segundo a TrueNAS, o desempenho de um pool ZFS cai depois de cerca de 80% de ocupação por três motivos: fragmentação (o ZFS é copy-on-write), pressão no alocador de metaslabs e, em HDD, a perda da preferência por gravar nas regiões mais rápidas do disco. Perto de 96%, o ZFS muda para uma alocação "best-fit", ainda mais custosa.

A regra não é absoluta. A própria TrueNAS separa os cenários:

| Tipo de carga | Ocupação máxima recomendada |
|---|---|
| Arquivo, backup, escrita única e sequencial | 90% a 95% é razoável |
| Uso geral (servidor de arquivos) | ~80% |
| Virtualização, bancos de dados, ML/IA em HDD | 80% pode já ser alto demais |

Em SSD a penalidade é menor, mas existe: um SSD quase cheio sofre mais amplificação de escrita. Se a decisão entre flash e disco ainda está aberta, nosso artigo sobre [storage all-flash ou híbrido](https://blog.tyar.com.br/storage-all-flash-ou-hibrido-qual-escolher/) mostra como o volume ativo de dados muda essa escolha.

## Como calcular a capacidade útil de storage em 5 passos

1. **Meça o volume atual** por tipo de dado (arquivos, VMs, bancos, vídeo, backup). Cada tipo tem crescimento e tolerância de ocupação diferentes.
2. **Projete o crescimento** para a vida útil do equipamento, normalmente 3 a 5 anos. Use o histórico real dos últimos 12 a 24 meses.
3. **Aplique a margem de ocupação** conforme a carga (dividir por 0,8 para uso geral; por 0,9 para arquivo).
4. **Some snapshots e retenção.** O espaço de snapshots depende da taxa de alteração dos dados; meça no ambiente atual antes de estimar.
5. **Converta para capacidade bruta** com a calculadora do sistema de arquivos e o layout de RAID escolhido, e só então escolha a quantidade e o tamanho dos discos.

### Exemplo prático de dimensionamento

Uma empresa tem hoje 40 TB de dados em um servidor de arquivos, com crescimento histórico de 30% ao ano, e quer um storage para 5 anos.

- Volume em 5 anos: 40 × 1,3^5 ≈ **148,5 TB**.
- Com margem de 80%: 148,5 ÷ 0,8 ≈ **185,6 TB úteis** necessários.
- Como o exemplo da TrueNAS (2 × RAIDZ2 de 7 discos) entrega cerca de 66,5% do bruto como útil, isso indica algo próximo de **280 TB brutos**, antes de considerar snapshots.

Comprar 200 TB brutos "porque cabem 148 TB" levaria o pool a operar bem acima de 80% no fim do ciclo, com perda de desempenho justamente quando há mais dados.

Para cargas de mídia, o raciocínio é o mesmo, mas a vazão também entra na conta; veja [como dimensionar storage para edição de vídeo](https://blog.tyar.com.br/storage-para-edicao-de-video-como-dimensionar/).

## E a compressão?

A compressão ajuda, mas não deve sustentar o projeto. A TrueNAS relata redução típica de **1,2:1 a 1,6:1** em dados compressíveis e afirma que o ganho é "quase impossível de prever" sem testar com os dados reais. Documentos e bancos comprimem bem; vídeo, imagens e arquivos já compactados quase nada. Trate a compressão como folga, não como capacidade.

## Erros comuns

- **Comprar pela soma do rótulo dos discos.** O útil real em RAIDZ2 pode ficar perto de dois terços do bruto.
- **Ignorar a conversão TB × TiB** e depois achar que "falta espaço" no relatório do sistema.
- **Planejar ocupar 95% em VMs ou bancos.** Funciona no papel e degrada na operação.
- **Esquecer backup e snapshots.** A cópia de segurança precisa de capacidade própria, preferencialmente em outro equipamento; veja [backup imutável contra ransomware](https://blog.tyar.com.br/backup-imutavel-storage-contra-ransomware/).
- **Não prever expansão.** Gabinetes com baias livres ou suporte a gavetas de expansão evitam a troca completa quando o crescimento supera a projeção. A arquitetura também pesa aqui; compare [NAS ou SAN para sua empresa](https://blog.tyar.com.br/nas-ou-san-qual-storage-escolher-empresa/).

## Como a Tyar pode ajudar

A Tyar projeta, configura, entrega e dá suporte a storages para empresas de todos os portes, com marcas homologadas e consultoria desde o primeiro contato. Com mais de 25 anos de experiência e mais de 3.600 projetos, levantamos volume atual, crescimento e perfil de carga para chegar à capacidade útil real antes da proposta, e não à soma dos discos.

👉 Conheça as soluções de [Storage da Tyar](https://tyar.com.br/produtos/storage) e, se o storage vai atender virtualização ou bancos de dados, veja também nossos [Servidores](https://tyar.com.br/produtos/servidores).

---

**Fontes:**

- [TrueNAS – Understanding ZFS Capacity in TrueNAS: How ZFS Turns Disks into Usable Storage Space](https://www.truenas.com/blog/understanding-zfs-capacity-in-truenas-how-zfs-turns-disks-into-usable-storage-space)
- [TrueNAS – The ZFS 80% Rule: Why It Exists, and When You Can Bend It](https://www.truenas.com/blog/zfs-80-percent-rule/)
- [TrueNAS – OpenZFS Capacity Calculator](https://ixsystems.com/community/resources/openzfs-capacity-calculator.185/download)
