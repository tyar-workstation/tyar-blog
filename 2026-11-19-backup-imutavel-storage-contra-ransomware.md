---
title: "Backup imutável: como montar o storage contra ransomware"
slug: "backup-imutavel-storage-contra-ransomware"
description: "Entenda o que é backup imutável, a regra 3-2-1-1-0, Object Lock e repositório Linux hardened, e como dimensionar o storage para resistir a ransomware."
date: "2026-11-19"
author: "Equipe Tyar"
category: "Storage"
tags: ["backup imutável", "ransomware", "storage para backup", "regra 3-2-1-1-0", "Object Lock", "Veeam"]
focus_keyword: "backup imutável"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/storage"
faq:
  - q: "O que é backup imutável?"
    a: "É uma cópia de backup gravada no modelo WORM (write once, read many): depois de gravada, não pode ser alterada nem apagada até o fim do período de retenção definido, nem por um administrador com credenciais comprometidas."
  - q: "Backup imutável substitui o backup offline?"
    a: "Não necessariamente. A regra 3-2-1-1-0 aceita uma cópia offline, air-gapped ou imutável, mas a CISA recomenda manter backups offline e criptografados e alerta que armazenamento imutável mal configurado pode não atender certas exigências regulatórias."
  - q: "Qual a diferença entre modo governance e modo compliance no S3 Object Lock?"
    a: "No modo governance, usuários com a permissão s3:BypassGovernanceRetention podem remover a trava. No modo compliance, ninguém pode apagar ou sobrescrever o objeto antes do fim da retenção, nem o usuário root da conta AWS."
---

# Backup imutável: como montar o storage contra ransomware

Backup imutável é a cópia de dados que, depois de gravada, não pode ser alterada nem apagada até o fim de um prazo de retenção definido. Ele existe porque o ransomware moderno não ataca só os servidores de produção: ele procura os backups acessíveis na rede e tenta apagá-los ou criptografá-los antes de pedir resgate. A CISA, agência de cibersegurança dos EUA, registra exatamente isso no seu guia #StopRansomware: muitas variantes "tentam encontrar e depois apagar ou criptografar backups acessíveis". Um storage de backup bem projetado tira essa possibilidade do atacante, mesmo que ele tenha obtido credenciais de administrador.

## Resumo rápido

- Backup imutável usa o modelo WORM (write once, read many): grava uma vez, lê quantas vezes quiser, não apaga antes da retenção.
- A referência de mercado é a regra **3-2-1-1-0**: 3 cópias, 2 mídias, 1 fora do site, 1 offline/air-gapped/imutável e 0 erros na verificação de restauração.
- As três formas mais comuns de imutabilidade são: repositório Linux "hardened" local, storage de objetos com Object Lock (S3 ou compatível) e mídia offline (fita ou disco desconectado).
- Imutabilidade não substitui teste de restauração: backup que nunca foi restaurado é suposição, não proteção.
- O storage precisa ser dimensionado para guardar o período inteiro de retenção travado, sem possibilidade de liberar espaço apagando cópias antigas.

## Por que o backup comum não basta contra ransomware

Em um ambiente típico, o servidor de backup grava em um NAS ou em um volume compartilhado montado pela rede. Se o atacante compromete uma conta de domínio com privilégios, ele enxerga esse destino como qualquer outra pasta. O resultado é conhecido: produção criptografada e backups apagados no mesmo ataque.

A CISA recomenda "manter backups offline e criptografados dos dados críticos e testar regularmente a disponibilidade e a integridade dos backups em um cenário de recuperação de desastre". O ponto central é separar o backup do alcance de quem controla a rede de produção, seja por desconexão física (offline), seja por uma trava que o próprio sistema de armazenamento impõe (imutabilidade).

## A regra 3-2-1-1-0 na prática

O guia de boas práticas da Veeam define a regra 3-2-1-1-0 assim:

| Número | O que significa | Exemplo prático |
|---|---|---|
| 3 | Três cópias dos dados | Produção + backup local + cópia secundária |
| 2 | Dois tipos de mídia diferentes | Disco no repositório local + objeto ou fita |
| 1 | Uma cópia fora do local | Outro site da empresa ou nuvem |
| 1 | Uma cópia offline, air-gapped ou imutável | Repositório hardened ou bucket com Object Lock |
| 0 | Zero erros, com verificações regulares de recuperação | Testes de restauração agendados e documentados |

O último "0" é o que mais se perde na prática. A CISA também insiste em testar os procedimentos de backup regularmente e em manter "golden images" atualizadas dos sistemas críticos, para reconstruir servidores sem depender de imagens possivelmente comprometidas.

## As três formas de obter imutabilidade

### 1. Repositório Linux hardened (local)

É um servidor Linux dedicado que recebe os backups e aplica uma trava no próprio sistema de arquivos. Na documentação da Veeam, o papel de Hardened Repository "pode ser atribuído a uma máquina Linux com armazenamento em bloco local ou conectado remotamente", e o fabricante recomenda, para reduzir a superfície de ataque, usar uma máquina física com armazenamento local.

Na implementação descrita em detalhe pela StarWind (Veeam v11 com Ubuntu 20.04), a imutabilidade usa o atributo de imutável do sistema de arquivos XFS, e o volume é formatado com reflink habilitado para aproveitar o Fast Clone, que reduz o consumo de espaço em fulls sintéticos. Outros pontos dessa arquitetura:

- conta de serviço sem sudo, com credenciais de uso único na hora de cadastrar o servidor;
- login de root desabilitado no SSH;
- cadeia de backup do tipo forever incremental não é suportada nesse modo: usa-se incremental com fulls sintéticos ou ativos periódicos.

Nas versões mais recentes do Veeam (v13), a documentação passa a exigir autenticação baseada em certificado nos repositórios configurados pelo Veeam Infrastructure Appliance. Por isso, confira sempre a página de requisitos da versão que você vai instalar.

**Vantagem:** restauração rápida, porque os dados estão no mesmo site e em disco. **Cuidado:** a segurança depende do isolamento do servidor (sem outros serviços, sem acesso remoto genérico, firmware e BMC protegidos).

### 2. Storage de objetos com Object Lock

O Amazon S3 Object Lock, e storages de objetos compatíveis com a mesma API, gravam cada versão de objeto no modelo WORM. Pela documentação da AWS:

| Recurso | Comportamento |
|---|---|
| Pré-requisito | Só funciona em buckets com versionamento habilitado |
| Modo governance | Bloqueia exclusão, exceto para quem tem a permissão `s3:BypassGovernanceRetention` |
| Modo compliance | Ninguém apaga ou sobrescreve antes do prazo, nem o root da conta; a retenção não pode ser reduzida |
| Legal hold | Trava sem data de expiração, até ser removida explicitamente |

Para proteção contra ransomware, o modo compliance é o que de fato impede um administrador comprometido de apagar os dados. A contrapartida é que um erro de configuração (retenção longa demais em um volume grande) gera custo que não pode ser revertido. A própria CISA alerta que armazenamento imutável deve ser usado com cautela, porque não atende a critérios de compliance de certas regulações e porque uma configuração errada pode impor custo significativo.

### 3. Mídia offline

Fita ou disco desconectado continuam válidos, e são o que a CISA cita primeiro. O ponto fraco é operacional: depende de rotina humana de troca e guarda de mídia, e a restauração costuma ser mais lenta.

## Como escolher a arquitetura

| Critério | Repositório hardened | Object Lock | Mídia offline |
|---|---|---|---|
| Velocidade de restauração | Alta (disco local) | Depende do link ou do storage on-premise | Baixa a média |
| Proteção contra admin comprometido | Alta, se bem isolado | Muito alta no modo compliance | Muito alta enquanto desconectada |
| Esforço operacional | Médio | Baixo após configurado | Alto |
| Fica fora do site? | Não, por padrão | Sim, se em nuvem ou outro site | Sim, se transportada |

Para a maioria das empresas, a combinação mais equilibrada é um repositório hardened local para restaurações rápidas e uma segunda cópia imutável ou offline fora do site. Isso cobre os dois "1" da regra ao mesmo tempo.

## Como dimensionar o storage de backup imutável

Com imutabilidade, o espaço ocupado durante o período de retenção não pode ser liberado. Por isso o cálculo precisa ser feito com folga:

1. **Volume protegido:** some os dados de produção que entram no backup.
2. **Taxa de mudança diária:** levante pelos relatórios do software de backup; incrementais dependem dela.
3. **Retenção travada:** quantos dias cada ponto de restauração fica imutável. Cada dia a mais é espaço que não volta.
4. **Fulls periódicos:** fulls sintéticos com Fast Clone economizam espaço em XFS com reflink; sem esse recurso, cada full ocupa o tamanho cheio.
5. **Crescimento:** projete o volume para o horizonte do contrato ou da depreciação do equipamento, não para o dia da compra.

No hardware, priorize discos com densidade alta e controladora ou layout de RAID que tolere falha dupla, porque a reconstrução de discos grandes é longa. Se a retenção for longa e a capacidade grande, o storage de backup costuma ser um equipamento dedicado, separado do storage de produção.

## Erros comuns

- **Imutabilidade só no software:** se o storage de destino aceita exclusão por qualquer conta com acesso administrativo, a trava pode ser contornada.
- **Repositório hardened ingressado no domínio:** o servidor deve ficar fora do Active Directory de produção e sem acesso remoto genérico.
- **Retenção curta demais:** alguns ataques ficam semanas no ambiente antes de criptografar; um período de imutabilidade de poucos dias pode travar só cópias já comprometidas.
- **Modo governance achando que é compliance:** no governance, quem tem a permissão de bypass consegue apagar.
- **Nunca testar a restauração:** é o "0" da regra 3-2-1-1-0 e o item que a CISA repete em todo o guia.
- **Esquecer a documentação:** a CISA recomenda guardar a documentação dos ativos de TI de forma segura, com backups offline e cópias impressas no local. Sem ela, a recuperação fica mais lenta.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega storages e servidores de backup sob medida, com marcas homologadas, consultoria desde o primeiro contato e suporte pós-venda. São mais de 25 anos de experiência e mais de 3.600 projetos entregues, o que ajuda a dimensionar capacidade, layout de discos e retenção de acordo com o seu volume real de dados.

👉 Conheça as opções de [Storage da Tyar](https://tyar.com.br/produtos/storage) e de [Servidores](https://tyar.com.br/produtos/servidores) para montar um repositório de backup imutável dedicado.

---

**Fontes:**

- [CISA – #StopRansomware Guide](https://www.cisa.gov/stopransomware/ransomware-guide)
- [Veeam Best Practices – 3-2-1-1-0 Rule](https://bp.veeam.com/vb365/guide/design/3-2-1)
- [Veeam Help Center – Hardened Repository: Requirements and Limitations](https://helpcenter.veeam.com/docs/vbr/userguide/hardened_repository_limitations.html)
- [AWS – Locking objects with Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html)
- [StarWind – Veeam Hardened Linux Repository, Part 1](https://www.starwindsoftware.com/blog/veeam-hardened-linux-repository-part-1/)
