---
title: "Licenciamento Windows Server 2025: como calcular por núcleo"
slug: "licenciamento-windows-server-2025-como-calcular"
description: "Veja como calcular o licenciamento do Windows Server 2025 por núcleo, quando Standard ou Datacenter compensa, regras de VMs, CALs e erros comuns na compra."
date: "2026-11-25"
author: "Equipe Tyar"
category: "Servidores"
tags: ["windows server 2025", "licenciamento", "virtualização", "hyper-v", "servidores"]
focus_keyword: "licenciamento windows server 2025"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/servidores"
faq:
  - q: "Quantas licenças de núcleo preciso no mínimo para o Windows Server 2025?"
    a: "Todos os núcleos físicos do servidor precisam ser licenciados, com mínimo de 8 licenças por processador físico e 16 por servidor. Um servidor com um processador de 8 núcleos ou menos exige 16 licenças."
  - q: "Quantas máquinas virtuais o Windows Server 2025 Standard permite?"
    a: "Com todos os núcleos físicos licenciados, o Standard dá direito a 2 ambientes de sistema operacional (VMs). Para cada 2 VMs adicionais, é preciso licenciar novamente todos os núcleos do servidor."
  - q: "Quando o Windows Server Datacenter compensa mais que o Standard?"
    a: "Pelo preço sugerido em dólar pela Microsoft para 16 núcleos, o Datacenter passa a compensar a partir de cerca de 12 VMs Windows no mesmo host. Abaixo disso, empilhar licenças Standard costuma sair mais barato."
---

# Licenciamento Windows Server 2025: como calcular por núcleo

O licenciamento do Windows Server 2025 Standard e Datacenter é feito **por núcleo físico** do servidor, com mínimo de 8 núcleos por processador e 16 por servidor, mais CALs para cada usuário ou dispositivo que acessa o servidor. A escolha entre Standard e Datacenter depende principalmente de quantas máquinas virtuais Windows vão rodar no host: o Standard cobre 2 VMs por licenciamento completo, o Datacenter cobre VMs ilimitadas.

Errar essa conta é comum na hora de cotar um servidor novo, e o erro aparece tanto para cima (comprar Datacenter sem precisar) quanto para baixo (ficar fora de conformidade depois de criar mais VMs). Abaixo está o cálculo passo a passo, com as regras do guia oficial da Microsoft.

## Resumo rápido

- Licencie **todos os núcleos físicos**: mínimo de 8 licenças por processador e 16 por servidor. Licenças são vendidas em pacotes de 2 e de 16 núcleos.
- **Standard** = 2 VMs por servidor totalmente licenciado. Cada 2 VMs extras exigem licenciar de novo todos os núcleos.
- **Datacenter** = VMs ilimitadas no host licenciado.
- Pelo preço sugerido (MSRP) em dólar, o Datacenter passa a compensar a partir de cerca de **12 VMs Windows** por host.
- Além das licenças de núcleo, cada usuário ou dispositivo precisa de **CAL**; acesso via Remote Desktop exige também **RDS CAL**.

## As edições do Windows Server 2025

O guia de licenciamento da Microsoft lista três edições principais:

| Edição | Modelo | Para quem | Virtualização |
|---|---|---|---|
| Standard | Por núcleo + CAL | Ambientes físicos ou pouco virtualizados | 2 VMs (ou 2 containers Hyper-V) por licenciamento completo |
| Datacenter | Por núcleo + CAL | Hosts de virtualização densos, datacenter | VMs ilimitadas |
| Essentials | Licença por servidor, só via OEM | Pequenas empresas, até 25 usuários e 50 dispositivos | 1 VM; cobre até 10 núcleos em servidor de um soquete |

O Essentials só é vendido junto com o hardware por parceiros OEM e não exige CAL base. Para qualquer empresa acima de 25 usuários ou com servidor de dois processadores, a escolha real fica entre Standard e Datacenter.

## Passo 1: conte os núcleos licenciáveis

A regra oficial: o número de licenças de núcleo é igual ao número de núcleos físicos, respeitando os mínimos de **8 por processador** e **16 por servidor**.

| Configuração do servidor | Núcleos físicos | Licenças de núcleo necessárias |
|---|---|---|
| 1 processador de 8 núcleos | 8 | 16 (mínimo por servidor) |
| 1 processador de 16 núcleos | 16 | 16 |
| 2 processadores de 6 núcleos | 12 | 16 (mínimo de 8 por processador) |
| 2 processadores de 10 núcleos | 20 | 20 |
| 2 processadores de 32 núcleos | 64 | 64 |

Isso tem um efeito direto na especificação do hardware: processadores com muitos núcleos aumentam o custo de licença do Windows Server proporcionalmente. Num servidor que vai rodar só serviços Windows, vale escolher a contagem de núcleos pela carga real, e não pelo maior modelo disponível.

## Passo 2: defina quantas VMs Windows vão rodar no host

### Standard: empilhamento de licenças

Com todos os núcleos licenciados, o Standard dá direito a **2 ambientes de sistema operacional** (OSEs, na prática 2 VMs). O host físico pode rodar o Windows Server além das 2 VMs desde que seja usado só para hospedar e gerenciar as VMs.

Para rodar mais VMs, é preciso **licenciar de novo todos os núcleos** a cada 2 VMs adicionais. Exemplo do próprio guia da Microsoft, para um servidor de 16 núcleos:

| VMs Windows no host | Licenças Standard de núcleo |
|---|---|
| 2 | 16 |
| 4 | 32 |
| 6 | 48 |

Clientes com assinatura ou Software Assurance ativo também podem licenciar VMs adicionais individualmente, pelos núcleos virtuais de cada VM, com mínimo de 8 licenças por VM.

### Datacenter: VMs ilimitadas

Com todos os núcleos físicos licenciados, o Datacenter permite **qualquer número de VMs** Windows Server naquele host, além de containers ilimitados.

## Passo 3: compare o custo Standard x Datacenter

A Microsoft publica um preço sugerido (MSRP) em dólar para pacotes de 16 núcleos: **US$ 1.176 para o Standard** e **US$ 6.771 para o Datacenter**. A própria página avisa que os valores variam por país; no Brasil o preço final depende do canal e do câmbio, então use a conta abaixo como proporção, não como orçamento.

Para um host de 16 núcleos:

| VMs Windows | Standard (pacotes de 16) | Custo Standard (MSRP) | Datacenter (MSRP) | Mais barato |
|---|---|---|---|---|
| 2 | 1 | US$ 1.176 | US$ 6.771 | Standard |
| 6 | 3 | US$ 3.528 | US$ 6.771 | Standard |
| 10 | 5 | US$ 5.880 | US$ 6.771 | Standard |
| 12 | 6 | US$ 7.056 | US$ 6.771 | Datacenter |

O ponto de virada fica em torno de **11 a 12 VMs por host**. Como a proporção é a mesma por pacote de 16 núcleos, o resultado vale também para hosts maiores: em um servidor de 32 núcleos, os dois lados dobram e o ponto de virada continua o mesmo em número de VMs.

Na prática, considere crescimento: se o plano é chegar a 10 VMs em dois anos, o Datacenter pode fazer sentido já na compra, para evitar recontar licenças no meio do contrato.

## Passo 4: não esqueça as CALs

As licenças de núcleo cobrem o servidor. O acesso a ele é licenciado à parte:

- **CAL base (Windows Server CAL):** obrigatória para cada usuário ou dispositivo que acessa o servidor. Escolha CAL por usuário quando as pessoas usam vários dispositivos, e por dispositivo quando vários turnos compartilham a mesma máquina.
- **RDS CAL:** obrigatória, além da CAL base, para quem acessa área de trabalho ou aplicações via Remote Desktop Services.
- **External Connector:** alternativa às CALs para usuários externos (que não são funcionários, terceiros no local ou agentes), licenciada por servidor físico acessado.

Uma CAL dá acesso à mesma versão ou a versões anteriores do servidor. Ao migrar servidores para o 2025, as CALs de versões anteriores não cobrem o acesso ao novo servidor.

## Alternativa: pagamento por uso via Azure Arc

Para servidores on-premises conectados ao Azure Arc, a Microsoft oferece Windows Server em modelo pay-as-you-go por **US$ 33,58 por núcleo/mês** (US$ 0,046/hora). Esse modelo é contratado por instância e **não inclui virtualização ilimitada**. Ele tende a fazer sentido para cargas temporárias ou picos, não para um host de virtualização permanente. O hotpatching (atualizações sem reinicialização) do Windows Server 2025 on-premises também depende da conexão ao Azure Arc.

## Diferenças técnicas que afetam a escolha

Além do número de VMs, a página de comparação da Microsoft destaca:

| Recurso | Standard | Datacenter |
|---|---|---|
| VMs / containers Hyper-V | 2 | Ilimitados |
| Containers Windows sem isolamento Hyper-V | Ilimitados | Ilimitados |
| Storage Replica | 1 parceria, 1 grupo de recursos, volume único de 2 TB | Ilimitado |
| RAM máxima | 4 PB (paginação de 5 níveis) / 256 TB (4 níveis) | Igual |

Se o projeto prevê replicação de storage entre sites com volumes grandes, o Standard não atende, independentemente da contagem de VMs.

## Erros comuns

1. **Licenciar só os núcleos que as VMs usam.** No licenciamento por núcleo físico, todos os núcleos do servidor contam, mesmo os ociosos.
2. **Esquecer o mínimo de 16 licenças.** Um servidor de entrada com processador de 8 núcleos ainda exige 16 licenças.
3. **Escolher o processador antes de olhar a licença.** Passar de 16 para 32 núcleos dobra o custo do Windows Server; só vale se a carga realmente usar esses núcleos.
4. **Ignorar o failover em cluster.** Em um cluster Hyper-V, dimensione o licenciamento de cada host para o número de VMs que ele pode receber quando outro nó cair, não apenas para o cenário normal. Confirme a regra aplicável ao seu contrato com o revendedor.
5. **Não contar RDS CAL.** Servidores de aplicação acessados por Remote Desktop precisam de RDS CAL além da CAL base.
6. **Comparar preços em dólar como se fossem o orçamento final.** O MSRP serve para entender a proporção Standard x Datacenter; o valor em reais depende do canal.

## Como escolher em 3 perguntas

1. **Quantas VMs Windows por host hoje e em 3 anos?** Até cerca de 10: Standard. 12 ou mais: Datacenter.
2. **Quantos núcleos a carga realmente precisa?** Isso define a base do custo de licença.
3. **Há acesso remoto (RDS) ou usuários externos?** Some RDS CALs ou External Connector ao orçamento.

## Como a Tyar pode ajudar

A Tyar dimensiona o servidor junto com o licenciamento: escolhe processador e número de núcleos pela carga real, para que o custo de Windows Server não seja maior do que precisa ser. São mais de 25 anos de experiência e mais de 3.600 projetos, com consultoria desde o primeiro contato e suporte pós-venda.

👉 Fale com a Tyar sobre o seu próximo [servidor](https://tyar.com.br/produtos/servidores) ou sobre um [cluster de virtualização](https://tyar.com.br/produtos/cluster) dimensionado para o seu licenciamento.

---

**Fontes:**

- Microsoft Licensing – Windows Server 2025: https://www.microsoft.com/licensing/guidance/Windows-Server-2025
- Microsoft – Windows Server pricing e comparação de edições: https://www.microsoft.com/en-us/windows-server/pricing
