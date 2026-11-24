---
title: "RAID 0, 1, 5, 6 ou 10: qual escolher para seu servidor ou storage?"
slug: "raid-0-1-5-6-10-qual-escolher"
description: "RAID 0, 1, 5, 6 ou 10? Compare capacidade útil, desempenho e tolerância a falhas e veja qual nível usar em servidores, NAS e storage."
date: "2026-11-13"
author: "Equipe Tyar"
category: "Storage"
tags: ["RAID", "RAID 5", "RAID 6", "RAID 10", "storage", "servidor", "NAS"]
focus_keyword: "qual RAID escolher"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/storage"
faq:
  - q: "Qual o melhor RAID para servidor?"
    a: "Para banco de dados e virtualização, RAID 10 pelo desempenho em escrita. Para arquivos e backup com discos grandes, RAID 6. RAID 5 só é recomendado com SSDs ou poucos discos pequenos."
  - q: "RAID substitui backup?"
    a: "Não. RAID protege contra falha de disco, mas não contra exclusão acidental, ransomware, corrupção de arquivos, incêndio ou roubo. Use a regra 3-2-1 de backup."
  - q: "Quantos discos preciso para RAID 6?"
    a: "No mínimo 4. A capacidade útil é o total de discos menos 2. Com 8 discos de 20 TB, por exemplo, sobram 120 TB úteis."
---

# RAID 0, 1, 5, 6 ou 10: qual escolher para seu servidor ou storage?

Escolher o **nível de RAID** é uma das decisões mais importantes ao montar um servidor ou storage. Ela define quanto espaço você realmente terá, quão rápido os dados serão lidos e gravados e, principalmente, **quantos discos podem falhar antes de você perder tudo**.

## Resumo rápido

| RAID | Mín. de discos | Capacidade útil | Discos que podem falhar | Melhor para |
|---|---|---|---|---|
| **0** | 2 | 100% | **Nenhum** | Cache, scratch, dados temporários |
| **1** | 2 | 50% | 1 | Sistema operacional, servidores pequenos |
| **5** | 3 | (N−1) discos | 1 | SSDs, arrays pequenos |
| **6** | 4 | (N−2) discos | 2 | Arquivos, backup, discos grandes |
| **10** | 4 | 50% | 1 por par espelhado | Banco de dados, virtualização |

## RAID 0: velocidade sem proteção

Os dados são divididos entre os discos (*striping*). Leitura e escrita ficam muito rápidas, e você aproveita 100% da capacidade.

**O problema:** se **um** disco falhar, **todos** os dados se perdem. Quanto mais discos, maior o risco.

**Use para:** área de cache de render, scratch de edição de vídeo, dados que podem ser recriados.

## RAID 1: espelhamento simples

Tudo que é gravado em um disco é copiado no outro. Se um falha, o outro segue funcionando.

**Use para:** discos de sistema operacional de servidores e pequenos servidores de arquivos.

## RAID 5: equilíbrio, com um alerta

Os dados e a informação de paridade são distribuídos entre os discos. Você perde o equivalente a um disco em capacidade e suporta a falha de um disco.

**O alerta:** com HDs de alta capacidade (16, 20 TB ou mais), a **reconstrução** (*rebuild*) depois de uma falha pode levar dias. Durante esse tempo:

- os discos restantes trabalham no limite;
- se **outro disco falhar** ou houver um erro de leitura irrecuperável, o array inteiro pode ser perdido.

Por isso, muitos fabricantes e administradores **não recomendam RAID 5 com HDs grandes**.

**Use para:** arrays de SSDs e arrays pequenos com discos de baixa capacidade.

## RAID 6: o padrão para discos grandes

Funciona como o RAID 5, mas com **dupla paridade**. Suporta a falha de **dois discos** ao mesmo tempo, o que cobre exatamente o risco do rebuild longo.

O custo é perder dois discos de capacidade e ter escrita um pouco mais lenta.

**Use para:** servidores de arquivos, repositórios de backup, acervo de mídia, dados de pesquisa e qualquer array com HDs de alta capacidade.

**Exemplo:** 8 discos de 20 TB em RAID 6 → **120 TB úteis**, suportando 2 falhas.

## RAID 10: desempenho com segurança

Combina espelhamento (RAID 1) e *striping* (RAID 0). Tem o melhor desempenho em escrita aleatória e rebuild rápido, porque basta copiar o disco espelho.

O custo: só 50% da capacidade fica utilizável.

**Use para:** bancos de dados, máquinas virtuais, ERPs e qualquer carga com muita escrita pequena e aleatória.

## Hardware, software ou ZFS?

- **RAID por controladora (hardware):** usa um processador dedicado e cache com proteção de energia. É comum em servidores corporativos.
- **RAID por software (Linux mdadm, Windows Storage Spaces):** flexível e sem custo de controladora.
- **ZFS (RAIDZ1/Z2/Z3):** sistema de arquivos com RAID integrado, verificação de integridade dos dados e snapshots. É muito usado em storages e NAS. RAIDZ2 equivale ao RAID 6.

A escolha depende do sistema operacional, do orçamento e de quem vai administrar o equipamento.

## RAID não é backup

Este é o erro mais caro que vemos. O RAID protege contra **falha de disco**. Ele **não** protege contra:

- exclusão acidental;
- ransomware (os arquivos criptografados são "protegidos" pelo RAID também);
- corrupção de arquivos ou erros de software;
- incêndio, enchente ou roubo do equipamento.

Siga a **regra 3-2-1**: **3** cópias dos dados, em **2** mídias diferentes, com **1** fora da empresa ou na nuvem. Se puder, mantenha ainda uma cópia **imutável** ou desconectada contra ransomware.

## Qual RAID escolher: guia de decisão

1. **Os dados podem ser recriados facilmente?** → RAID 0
2. **É só o disco do sistema operacional?** → RAID 1
3. **Banco de dados, VMs ou muita escrita?** → RAID 10
4. **Muito volume com HDs grandes?** → RAID 6 (ou RAIDZ2)
5. **Poucos SSDs e orçamento apertado?** → RAID 5

E, em todos os casos: **tenha backup**.

## Como a Tyar pode ajudar

A Tyar projeta **servidores e soluções de storage** dimensionados para o volume, o desempenho e o nível de proteção que o seu negócio precisa. Fazemos a configuração do RAID, testamos e entregamos com suporte pós-venda.

👉 [Conheça as soluções de storage da Tyar](https://tyar.com.br/produtos/storage) · [Servidores](https://tyar.com.br/produtos/servidores)
