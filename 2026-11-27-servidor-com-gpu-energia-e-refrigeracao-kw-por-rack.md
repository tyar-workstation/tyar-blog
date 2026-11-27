---
title: "Servidor com GPU: energia e refrigeração (kW por rack)"
slug: "servidor-com-gpu-energia-e-refrigeracao-kw-por-rack"
description: "Quantos kW consome um servidor com GPU para IA, como calcular calor, PUE e fluxo de ar, e quando o rack exige refrigeração líquida. Guia com exemplos."
date: "2026-11-27"
author: "Equipe Tyar"
category: "Inteligência Artificial"
tags: ["energia servidor GPU", "refrigeração líquida", "kW por rack", "DGX B200", "PUE", "BTU/h", "data center para IA"]
focus_keyword: "energia e refrigeração servidor com GPU"
link_terms: ["kW por rack", "refrigeração líquida", "consumo de energia de servidor com GPU", "PUE"]
reading_time: 7
cta_product: "https://tyar.com.br/produtos/inteligencia-artificial"
faq:
  - q: "Quantos kW consome um servidor com 8 GPUs para IA?"
    a: "Depende da GPU. O NVIDIA DGX H100/H200 consome até 10,2 kW e o DGX B200 cerca de 14,3 kW no máximo. Um servidor com 8 RTX PRO 6000 Server Edition tem até 4,8 kW só nas GPUs (600 W cada), antes de CPUs, memória e ventiladores."
  - q: "Um rack comum aguenta um servidor de IA?"
    a: "Muitas vezes não. Segundo levantamento do Uptime Institute, a densidade média dos racks fica abaixo de 8 kW. Um único DGX B200 já passa de 14 kW, e quatro DGX H100 por rack somam 40,8 kW."
  - q: "Quando a refrigeração líquida passa a ser obrigatória?"
    a: "Em plataformas de rack inteiro como o GB200 NVL72, que opera entre 125 e 135 kW e foi projetado com refrigeração líquida direta no chip. Servidores com 8 GPUs PCIe ou HGX refrigerados a ar ainda funcionam com ar, desde que a sala entregue o fluxo e a temperatura exigidos."
  - q: "Como converter o consumo do servidor em carga de ar-condicionado?"
    a: "Praticamente toda a energia elétrica vira calor. Multiplique os watts por 3,412 para obter BTU/h e divida por 12.000 para obter toneladas de refrigeração (TR). Um servidor de 10,2 kW gera cerca de 34.800 BTU/h, ou 2,9 TR."
---

# Energia e refrigeração para servidor com GPU: quantos kW por rack

Um servidor com 8 GPUs de data center consome entre cerca de 5 kW e 14 kW, e quase toda essa energia vira calor que precisa ser removido da sala. Na prática, um único servidor de IA pode exigir mais que um rack inteiro de servidores convencionais, que em média fica abaixo de 8 kW. Por isso energia e refrigeração devem ser dimensionadas antes da compra da GPU, não depois.

Este artigo faz parte do nosso [guia completo de infraestrutura para IA na empresa](https://blog.tyar.com.br/guia-infraestrutura-para-ia-na-empresa/).

## Resumo rápido

- O DGX H100/H200 consome até **10,2 kW**; o DGX B200, cerca de **14,3 kW** no máximo, segundo a NVIDIA.
- A densidade média dos racks em data centers ainda fica **abaixo de 8 kW** (Uptime Institute, via Upsite).
- Para converter consumo em carga térmica: **W × 3,412 = BTU/h**; 12.000 BTU/h = 1 TR.
- Racks como o **GB200 NVL72 (125 a 135 kW)** só funcionam com refrigeração líquida direta no chip.
- O PUE médio do setor foi **1,56** em 2024: cada 1 kW de TI puxa cerca de 1,56 kW da rede.

## Quanto consome um servidor com GPU para IA?

O consumo é dominado pelas GPUs. A tabela reúne os números oficiais de sistemas e placas comuns em projetos de IA:

| Equipamento | Consumo informado | Tamanho | Refrigeração |
|---|---|---|---|
| NVIDIA L40S (placa) | 350 W | Dual-slot | Passiva (depende do fluxo do servidor) |
| RTX PRO 6000 Blackwell Server Edition (placa) | 400 a 600 W | Dual-slot | Passiva |
| RTX PRO 6000 Blackwell Max-Q (placa) | 300 W | Dual-slot | Ativa |
| NVIDIA DGX H100/H200 (8 GPUs) | 10,2 kW máx. | 8U | Ar |
| NVIDIA DGX B200 (8 GPUs Blackwell) | ~14,3 kW máx. | 10U | Ar |
| GB200 NVL72 (72 GPUs, rack inteiro) | 125 a 135 kW | Rack 48U | Líquida (direct-to-chip) |

Para servidores montados com placas PCIe, some o consumo das GPUs e acrescente CPUs, memória, discos e ventiladores. Oito RTX PRO 6000 Server Edition no limite de 600 W já somam 4,8 kW só em GPU; oito L40S, 2,8 kW. A escolha da placa, que discutimos em [RTX PRO 6000 Blackwell ou H200: qual GPU para IA](https://blog.tyar.com.br/rtx-pro-6000-blackwell-ou-h200-qual-gpu-para-ia/), muda diretamente o projeto elétrico e térmico.

Um detalhe que costuma passar despercebido: o DGX H100/H200 tem seis fontes de 3,3 kW em redundância 4+2, e o sistema só liga com pelo menos três fontes operando. Isso significa circuitos dedicados, PDUs com tomadas compatíveis e, idealmente, alimentação por dois ramais independentes.

## Quantos kW cabem em um rack?

Aqui está o gargalo da maioria das empresas. O levantamento global do Uptime Institute mostra que a densidade média dos racks subiu de cerca de 5 kW, mas ainda não chegou a 8 kW, e poucas instalações têm racks acima de 30 kW.

Compare com a referência de projeto da NVIDIA para o DGX SuperPOD:

| Servidores DGX H100 por rack | Potência por rack |
|---|---|
| 1 | 10,2 kW |
| 2 | 20,4 kW |
| 4 (densidade recomendada pela NVIDIA) | 40,8 kW |

Ou seja, um único servidor de IA de 8 GPUs já supera a densidade média de um rack corporativo. Quatro deles representam cinco vezes essa média. Se o seu CPD foi projetado para servidores de virtualização e storage, a conta provavelmente não fecha sem adaptações. A diferença entre formatos também pesa, como explicamos em [servidor rack ou torre: qual escolher](https://blog.tyar.com.br/servidor-rack-ou-torre-qual-escolher/).

## Como calcular a carga térmica e o fluxo de ar?

Praticamente toda a energia elétrica consumida pelo servidor se transforma em calor. Três contas resolvem a maior parte do dimensionamento:

1. **Carga térmica:** watts × 3,412 = BTU/h.
2. **Capacidade de refrigeração:** BTU/h ÷ 12.000 = toneladas de refrigeração (TR).
3. **Fluxo de ar:** a NVIDIA exige no mínimo 157 pés³/min (4,445 m³/min) por kW de carga no projeto do SuperPOD.

### Exemplo 1: um DGX B200 na sala de servidores

- Consumo: 14,3 kW
- Carga térmica: 14.300 × 3,412 ≈ 48.800 BTU/h ≈ 4,1 TR
- Fluxo de ar mínimo: 14,3 × 157 ≈ 2.245 pés³/min

Só esse equipamento pede uma capacidade de refrigeração equivalente a vários aparelhos de ar-condicionado de conforto, com redundância, porque uma parada do ar derruba o servidor em minutos.

### Exemplo 2: servidor com 4 RTX PRO 6000 Server Edition

- GPUs: 4 × 600 W = 2,4 kW (sem contar CPU, memória e discos)
- Carga térmica só das GPUs: ≈ 8.200 BTU/h ≈ 0,7 TR

Esse perfil, comum para inferência de LLM e RAG em empresas médias, cabe num rack corporativo bem ventilado. Por isso ele aparece com frequência em [servidores para IA on-premise](https://blog.tyar.com.br/servidor-para-ia-on-premise-como-dimensionar-gpu/) que não exigem reforma da sala.

### E a temperatura da sala?

A ASHRAE recomenda entrada de ar entre 18 °C e 27 °C. A NVIDIA aceita a classe A1 até 30 °C para o DGX H100, e a ficha do DGX B200 indica operação entre 10 °C e 35 °C. Trabalhar no limite reduz a margem para picos de carga e falhas do ar-condicionado.

## Quanto de energia a instalação inteira consome? (PUE)

O PUE (Power Usage Effectiveness) relaciona a energia total da instalação com a energia entregue aos equipamentos de TI. O PUE médio global foi 1,56 em 2024, segundo o Uptime Institute; construções recentes chegam a 1,3 ou menos.

Exemplo com um DGX B200 em carga máxima contínua:

- Energia de TI por ano: 14,3 kW × 8.760 h ≈ 125.300 kWh
- Com PUE 1,56: ≈ 195.400 kWh/ano na conta de energia

Multiplique pela tarifa do seu contrato para ter o custo anual. Em cargas de treinamento que rodam dias seguidos, esse valor entra direto no TCO e é decisivo na comparação com nuvem.

## Ar ou refrigeração líquida: quando trocar?

| Cenário | Densidade típica | Abordagem |
|---|---|---|
| Workstation ou servidor com 1 a 4 GPUs PCIe | até alguns kW | Ar, com bom fluxo frente-trás |
| Servidor 8 GPUs (HGX/DGX) | 10 a 15 kW por servidor | Ar, com corredor frio/quente e capacidade dedicada |
| Vários servidores 8 GPUs por rack | 20 a 40+ kW | Ar com contenção ou trocadores na porta do rack |
| Rack inteiro tipo GB200 NVL72 | 125 a 135 kW | Líquida direct-to-chip, com CDU |

No GB200 NVL72, a Supermicro especifica CDU dentro do rack com 250 kW de capacidade e oferece soluções líquido-ar de 180 ou 240 kW para locais sem torre de resfriamento. Esse nível de densidade não é viável só com ar. Para clusters, a escolha de orquestração também afeta como a carga se distribui entre racks, tema de [Slurm ou Kubernetes para cluster de GPU](https://blog.tyar.com.br/slurm-ou-kubernetes-cluster-gpu/).

## Erros comuns

- **Comprar a GPU antes de medir a sala.** O servidor chega e o circuito, o nobreak ou o ar-condicionado não suportam a carga.
- **Usar a potência nominal da fonte como consumo real.** O correto é olhar o consumo máximo do sistema na ficha técnica e planejar redundância de fontes separadamente.
- **Esquecer o nobreak.** Um servidor de 10 a 14 kW exige UPS dimensionado para a carga e para o tempo de autonomia desejado.
- **Colocar placas passivas em gabinete sem fluxo adequado.** L40S e RTX PRO 6000 Server Edition dependem da ventilação do chassi; em gabinete errado, superaquecem e reduzem clock.
- **Ignorar a expansão.** Planejar a sala para um servidor e, seis meses depois, precisar de dois.

## Como escolher o caminho certo

1. Defina a carga: inferência, RAG, fine-tuning ou treinamento.
2. Escolha a GPU e calcule o consumo total do servidor pela ficha técnica.
3. Converta em BTU/h e TR, e verifique a capacidade atual de ar, energia e nobreak.
4. Se a soma passar da capacidade do rack ou da sala, avalie distribuir a carga, adequar a infraestrutura ou optar por colocation.

Se a demanda cabe em uma ou duas GPUs, uma [workstation para IA sob medida](https://workstations.tyar.com.br/) evita adequações de data center e pode ficar no próprio escritório.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega servidores e workstations para IA considerando o ambiente onde o equipamento vai operar: consumo, carga térmica, formato e expansão. Com mais de 25 anos de experiência e mais de 3.600 projetos, a consultoria começa no primeiro contato. Veja as opções de [servidores para inteligência artificial](https://tyar.com.br/produtos/inteligencia-artificial) e de [cluster de GPU](https://tyar.com.br/produtos/cluster).

---

**Fontes:**

- [NVIDIA DGX B200 – especificações](https://www.nvidia.com/en-gb/data-center/dgx-b200/)
- [NVIDIA DGX H100/H200 User Guide – introdução e especificações](https://docs.nvidia.com/dgx/dgxh100-user-guide/introduction-to-dgxh100.html)
- [NVIDIA DGX SuperPOD – Planning a Data Center Deployment](https://docs.nvidia.com/dgx-superpod/design-guides/dgx-superpod-data-center-design-h100/latest/planning.html)
- [Supermicro SuperCluster GB200 NVL72 – datasheet](https://www.supermicro.com/datasheet/datasheet_SuperCluster_GB200_NVL72.pdf)
- [NVIDIA RTX PRO 6000 Blackwell Series – especificações](https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000-family/)
- [AMAX – RTX PRO 6000 Blackwell Server Edition vs L40S](https://www.amax.com/nvidia-rtx-pro-6000-blackwell-server-edition-vs-nvidia-l40s/)
- [Upsite – Data Center Trends (Uptime Institute Global Data Center Survey 2024)](https://www.upsite.com/blog/data-center-trends-rack-density-rises-while-pue-and-outage-frequency-remain-flat/)
