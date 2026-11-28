---
title: "Edge AI: como escolher hardware para inferência local"
slug: "edge-ai-hardware-para-inferencia-local"
description: "Edge AI na empresa: quando levar a inferência para perto da câmera ou da máquina e como escolher entre Jetson Orin, Jetson Thor, IGX e servidor com L4."
date: "2026-11-28"
author: "Equipe Tyar"
category: "Inteligência Artificial"
tags: ["edge AI", "inferência local", "Jetson Thor", "Jetson Orin", "NVIDIA L4", "IGX Thor", "visão computacional"]
focus_keyword: "edge AI hardware"
link_terms: ["edge AI", "inferência local", "inferência na borda", "Jetson Thor"]
reading_time: 7
cta_product: "https://tyar.com.br/produtos/inteligencia-artificial"
faq:
  - q: "O que é edge AI?"
    a: "Edge AI é rodar a inferência de modelos de IA no próprio local onde os dados são gerados, como a linha de produção, a loja ou o veículo, em vez de enviar tudo para um datacenter ou para a nuvem. Isso reduz latência, tráfego de rede e exposição de dados."
  - q: "Qual hardware usar para edge AI?"
    a: "Depende do porte da carga. Módulos Jetson Orin (7 a 60 W) atendem visão computacional em poucas câmeras; Jetson Thor (40 a 130 W, 128 GB) roda modelos generativos e VLMs na borda; servidores edge com GPUs como a L4 (72 W, 24 GB) centralizam dezenas de fluxos de vídeo em um site."
  - q: "Dá para rodar LLM em um dispositivo de edge?"
    a: "Sim, com modelos pequenos ou quantizados. A NVIDIA publicou 150,8 tokens/s para o Llama 3.1 8B e 79,1 tokens/s para o Qwen3-32B no Jetson Thor, em seu teste de referência. Modelos maiores ou muitos usuários simultâneos pedem um servidor com GPU."
  - q: "Edge AI substitui o servidor de IA no datacenter?"
    a: "Não. A borda faz a inferência perto do dado; o datacenter continua responsável por treinar e retreinar modelos, guardar histórico e consolidar resultados. A arquitetura típica combina os dois."
---

# Edge AI: como escolher hardware para inferência local

Edge AI é rodar a inferência de IA no lugar onde o dado nasce, como a câmera da linha de produção, o equipamento médico ou o caixa da loja, em vez de mandar tudo para o datacenter ou para a nuvem. O hardware certo depende de três números: quantos fluxos de dados (câmeras, sensores) cada ponto processa, qual o tamanho do modelo e quanta energia e espaço existem no local. Para poucas câmeras, um módulo Jetson resolve; para modelos generativos na borda, Jetson Thor ou IGX; para dezenas de câmeras em um mesmo site, um servidor edge com GPU de baixo consumo.

Este artigo faz parte do [guia de infraestrutura para IA na empresa](https://blog.tyar.com.br/guia-infraestrutura-para-ia-na-empresa/).

## Resumo rápido

- Leve a inferência para a borda quando latência, banda de rede, conectividade instável ou dados sensíveis tornam inviável enviar tudo ao datacenter.
- Jetson Orin vai de 7 W a 60 W e até 275 TOPS (INT8 esparso): bom para visão computacional em poucas câmeras.
- Jetson AGX Thor (T5000) entrega até 2.070 TFLOPS FP4 esparsos, 128 GB de memória e 40 a 130 W: roda LLMs e modelos de visão e linguagem na borda.
- Um servidor edge com GPUs L4 (72 W, 24 GB, 4 decodificadores de vídeo cada) centraliza muitos fluxos em um site.
- O datacenter continua necessário para treinar, retreinar e consolidar; edge AI complementa, não substitui.

## Quando faz sentido rodar IA na borda?

A pergunta não é "edge ou nuvem", e sim "onde cada etapa roda melhor". A borda ganha quando pelo menos um destes fatores pesa:

| Fator | Por que favorece a borda | Exemplo |
|---|---|---|
| Latência | A decisão precisa sair em milissegundos, sem ida e volta pela rede | Rejeitar peça defeituosa na esteira, parar um robô |
| Banda de rede | Vídeo bruto de muitas câmeras satura o link com o datacenter | Inspeção com 16 câmeras em alta resolução |
| Conectividade | O local pode ficar offline e a operação não pode parar | Mineração, agro, plataformas, lojas remotas |
| Dados sensíveis | Imagens de pessoas ou dados de pacientes não precisam sair do local | Clínicas, controle de acesso, varejo |
| Custo recorrente | Enviar e armazenar vídeo continuamente na nuvem custa caro | Monitoramento 24×7 |

O ponto de dados sensíveis conversa diretamente com a LGPD: processar imagens localmente e enviar só metadados (contagens, alertas, coordenadas) reduz a exposição. O tema é aprofundado em [LLM on-premise e LGPD para dados sensíveis](https://blog.tyar.com.br/llm-on-premise-e-lgpd-dados-sensiveis/).

## Quais são as opções de hardware para edge AI?

Existem três degraus, do menor ao maior:

### 1. Módulos embarcados Jetson Orin

São computadores compactos com GPU integrada, pensados para ficar dentro da máquina, do robô ou de uma caixa industrial. Segundo a NVIDIA:

| Módulo | IA (até) | Memória | Banda de memória | Potência |
|---|---|---|---|---|
| Jetson AGX Orin 64 GB | 275 TOPS | 64 GB LPDDR5 | 204,8 GB/s | 15 a 60 W |
| Jetson Orin NX 16 GB | 100 TOPS | 16 GB LPDDR5 | 102,4 GB/s | 10 a 25 W |
| Jetson Orin Nano 8 GB | 40 TOPS | 8 GB LPDDR5 | 102 GB/s | 7 a 15 W |

São a escolha natural para detecção de objetos, leitura de placas, contagem e inspeção visual com modelos convolucionais ou transformers de visão de porte pequeno a médio.

### 2. Jetson Thor e IGX Thor: IA generativa na borda

O Jetson AGX Thor (módulo T5000) traz GPU Blackwell de 2.560 núcleos, CPU Arm de 14 núcleos e 128 GB de LPDDR5X a 273 GB/s, com potência configurável de 40 a 130 W. A NVIDIA declara até 2.070 TFLOPS em FP4 esparso e até 7,5 vezes mais computação de IA que o AGX Orin, com 3,5 vezes mais eficiência energética. O kit de desenvolvimento tem uma porta QSFP28 (4×25 GbE) e codifica até 6 fluxos 4Kp60.

A diferença prática é a memória: 128 GB permitem rodar LLMs e modelos de visão e linguagem (VLMs) localmente. No teste de referência da NVIDIA (sequência de 2.048 tokens, saída de 128), o Thor gerou 150,8 tokens/s com Llama 3.1 8B e 79,1 tokens/s com Qwen3-32B, contra 16,84 tokens/s do Orin no Qwen3-32B. Há também a versão T4000, com 64 GB e 40 a 70 W, cujos números a NVIDIA ainda marca como preliminares.

Para aplicações industriais e médicas que exigem segurança funcional, a plataforma IGX Thor combina o mesmo SoC com uma GPU dedicada RTX PRO 6000 Blackwell Max-Q (96 GB GDDR7), somando até 5.581 TFLOPS FP4 esparsos, com ilha de segurança funcional no SoC, MCU de segurança na placa e duas portas de 200 GbE.

Quem quer entender por que a memória define o tamanho do modelo que cabe no dispositivo deve ler [quantização de LLM em FP8 e INT4 e o efeito na memória da GPU](https://blog.tyar.com.br/quantizacao-de-llm-fp8-int4-memoria-gpu/): em INT4, um modelo de 32B ocupa cerca de 16 GB só em pesos.

### 3. Servidor edge com GPU de baixo consumo

Quando um mesmo site tem dezenas de câmeras (uma fábrica, um centro de distribuição, um campus), costuma ser mais eficiente concentrar a inferência em um servidor compacto no rack local do que espalhar módulos. A NVIDIA L4 é a GPU típica desse cenário:

| Especificação L4 | Valor |
|---|---|
| Memória | 24 GB, 300 GB/s |
| FP8 / INT8 | 485 TFLOPS / 485 TOPS (com esparsidade; metade sem) |
| Vídeo | 2 codificadores, 4 decodificadores, 4 decodificadores JPEG |
| Potência máxima | 72 W |
| Formato | PCIe Gen4, slot único, perfil baixo |

Por ocupar um slot e consumir 72 W, a L4 cabe em servidores curtos de borda, sem exigir a infraestrutura elétrica de um servidor de GPUs de data center. A NVIDIA relata até 120 vezes mais desempenho em pipeline de vídeo com IA usando 8 L4 em comparação com um servidor de duas CPUs Intel Xeon 8362.

## Como dimensionar um projeto de edge AI?

Siga esta sequência antes de escolher o equipamento:

1. **Conte os fluxos por site.** Número de câmeras, resolução e quadros por segundo realmente analisados (muitas vezes 5 a 10 fps bastam para inspeção).
2. **Defina o modelo e a precisão.** Um detector leve em INT8 roda em um Orin Nano; um VLM que descreve cenas em linguagem natural pede Thor ou servidor com GPU.
3. **Meça latência e vazão no hardware-alvo.** Benchmarks de fabricante são referência; o número que vale é o do seu modelo com o seu vídeo.
4. **Verifique o ambiente físico.** Temperatura, poeira, vibração e energia disponível no local podem exigir gabinete industrial e refrigeração passiva.
5. **Planeje a gestão remota.** Dezenas de dispositivos espalhados precisam de atualização de modelos, monitoramento e acesso remoto centralizados.

Exemplos de ponto de partida, a validar com teste real:

| Cenário | Opção inicial |
|---|---|
| 1 a 4 câmeras em uma máquina, detecção de defeitos | Jetson Orin NX ou AGX Orin junto ao equipamento |
| Robô ou veículo com VLM para entender o ambiente | Jetson AGX Thor |
| Equipamento médico ou industrial com requisito de segurança funcional | IGX Thor |
| 20 a 60 câmeras em uma planta, várias análises | Servidor edge com 2 a 4 GPUs L4 no rack local |
| Assistente com LLM para uma filial sem link confiável | Workstation ou servidor compacto com GPU de 48 a 96 GB |

Para equipes que vão desenvolver e testar os modelos antes de embarcá-los, uma [workstation para IA sob medida](https://workstations.tyar.com.br/) com GPU profissional costuma ser o ambiente de prototipagem mais produtivo. Para quem avalia um equipamento compacto de mesa para LLMs, vale comparar com o que mostramos em [NVIDIA DGX Spark: vale a pena para empresas](https://blog.tyar.com.br/nvidia-dgx-spark-vale-a-pena-para-empresas/).

## Qual o papel do datacenter numa arquitetura de edge AI?

A borda executa; o centro aprende. Na arquitetura típica:

- **Borda:** inferência em tempo real, filtragem e envio apenas de eventos, recortes e metadados.
- **Datacenter on-premise:** treino e retreino dos modelos com as imagens selecionadas, versionamento, armazenamento de histórico e painéis de resultados.
- **Ciclo contínuo:** casos difíceis capturados na borda voltam para o treino, e o modelo atualizado é distribuído de novo aos dispositivos.

O servidor central é dimensionado com a mesma lógica de qualquer projeto de IA: memória de GPU para o modelo, storage para o dataset e rede para trazer os dados. O passo a passo está em [como dimensionar GPU em um servidor para IA on-premise](https://blog.tyar.com.br/servidor-para-ia-on-premise-como-dimensionar-gpu/).

## Erros comuns em projetos de edge AI

- **Escolher o dispositivo pelo TOPS do catálogo.** TOPS de pico com esparsidade raramente se repetem no seu modelo; teste com o vídeo real.
- **Ignorar a decodificação de vídeo.** Em visão computacional, o gargalo muitas vezes é decodificar os fluxos, não a inferência. Conte os decodificadores de hardware.
- **Subestimar o ambiente.** Um equipamento de escritório não sobrevive a calor, poeira e vibração de chão de fábrica.
- **Esquecer a gestão da frota.** Atualizar modelos à mão em 50 dispositivos não escala.
- **Mandar vídeo bruto para o centro "por garantia".** Isso anula o ganho de banda e aumenta a exposição de dados pessoais.
- **Não prever o retreino.** Sem servidor para retreinar, o modelo da borda envelhece e a acurácia cai.

## Como a Tyar pode ajudar

A Tyar projeta, configura, entrega e dá suporte a hardware de alta performance para IA, das workstations de desenvolvimento aos servidores com GPU que treinam e servem os modelos. Com mais de 25 anos de experiência e mais de 3.600 projetos, partimos da sua carga (câmeras, modelos, latência e ambiente) para definir o que roda na borda e o que fica no datacenter, com marcas homologadas e suporte pós-venda.

👉 Conheça as soluções de [Inteligência Artificial da Tyar](https://tyar.com.br/produtos/inteligencia-artificial) e os [servidores para IA e inferência](https://tyar.com.br/produtos/servidores).

---

**Fontes:**

- [NVIDIA Technical Blog – Introducing NVIDIA Jetson Thor, the Ultimate Platform for Physical AI](https://developer.nvidia.com/blog/introducing-nvidia-jetson-thor-the-ultimate-platform-for-physical-ai/)
- [NVIDIA – Jetson Orin](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/)
- [NVIDIA – L4 Tensor Core GPU](https://www.nvidia.com/en-us/data-center/l4/)
- [NVIDIA – IGX Thor Developer Kit datasheet](https://developer.download.nvidia.com/assets/igx/robotics-datasheet-igx-thor-developer-kit-nvidia-us-web.pdf)
