---
title: "vLLM ou Ollama: qual usar para rodar LLM na empresa"
slug: "vllm-ou-ollama-qual-usar-para-llm-na-empresa"
description: "vLLM ou Ollama? Compare throughput, concorrência, uso de VRAM e casos de uso para servir LLM on-premise na empresa e dimensionar o servidor certo."
date: "2026-11-23"
author: "Equipe Tyar"
category: "Inteligência Artificial"
tags: ["vLLM", "Ollama", "LLM on-premise", "inferência", "GPU", "servidor de IA"]
focus_keyword: "vllm ou ollama"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/inteligencia-artificial"
faq:
  - q: "Ollama aguenta vários usuários ao mesmo tempo?"
    a: "Aguenta poucos. Nas versões atuais, o padrão de requisições paralelas por modelo é 1 (fora do backend MLX) e as demais vão para uma fila de até 512 pedidos. Dá para aumentar com OLLAMA_NUM_PARALLEL, mas cada requisição paralela multiplica o contexto alocado e consome mais memória."
  - q: "vLLM precisa de GPU NVIDIA?"
    a: "Não necessariamente. A documentação do vLLM lista suporte a GPUs NVIDIA, CPUs e GPUs AMD, CPUs Intel, aceleradores Gaudi, CPUs PowerPC, TPU e AWS Trainium/Inferentia. Na prática, o ecossistema mais maduro para produção ainda é o de GPUs NVIDIA."
  - q: "Posso começar com Ollama e migrar para vLLM depois?"
    a: "Sim, e é um caminho comum. Os dois expõem API HTTP, e o vLLM oferece servidor compatível com a API da OpenAI. Valide o caso de uso com Ollama e migre quando o número de usuários simultâneos ou a exigência de latência crescer."
---

# vLLM ou Ollama: qual usar para rodar LLM na empresa

Se a ideia é servir um modelo de linguagem para muitos usuários ou aplicações ao mesmo tempo, use **vLLM**. Se o objetivo é testar modelos, prototipar ou atender um único usuário numa workstation, **Ollama** é mais simples e resolve. A diferença não é só de software: ela muda quanto de GPU, VRAM e rede você precisa comprar.

## Resumo rápido

- **Ollama** prioriza facilidade: instala em minutos, roda offline e é ótimo para desenvolvimento e uso individual.
- **vLLM** é um motor de inferência para produção, com PagedAttention e *continuous batching* para atender muitas requisições simultâneas.
- Em benchmark da Red Hat numa GPU A100 40 GB com Llama 3.1 8B, o vLLM chegou a **793 tokens/s** de pico contra **41 tokens/s** do Ollama.
- No Ollama, mais requisições paralelas multiplicam o contexto alocado e exigem mais VRAM; no vLLM, a VRAM livre vira capacidade de atendimento.
- O dimensionamento do servidor deve partir do número de usuários simultâneos, não só do tamanho do modelo.

## O que são o vLLM e o Ollama

**Ollama** é uma ferramenta derivada do projeto llama.cpp, feita para baixar e rodar modelos localmente com poucos comandos. Por padrão, escuta apenas em 127.0.0.1:11434 e mantém o modelo carregado na memória por 5 minutos após o último uso. O foco declarado é acessibilidade, não escalabilidade.

**vLLM** é ao mesmo tempo motor de inferência e servidor. Entre os recursos listados na documentação oficial estão:

- gerenciamento da memória de *key/value* (KV cache) com **PagedAttention**;
- **continuous batching** de requisições;
- paralelismo de tensor e de pipeline para inferência distribuída em várias GPUs;
- servidor compatível com a API da OpenAI, *streaming*, *prefix caching* e multi-LoRA;
- *speculative decoding* e *chunked prefill*.

## Comparativo: vLLM x Ollama

| Critério | Ollama | vLLM |
|---|---|---|
| Objetivo principal | Facilidade e uso local | Throughput e produção |
| Requisições paralelas por modelo (padrão) | 1 nas versões atuais (fora do MLX) | Gerenciadas por continuous batching |
| Fila de requisições | Até 512 por padrão; acima disso retorna erro 503 | Escalonador interno do motor |
| Contexto padrão | 4.096 tokens | Definido pelo modelo/configuração |
| Multi-GPU | Divide o modelo entre GPUs quando não cabe em uma | Paralelismo de tensor e pipeline |
| API | HTTP própria | Compatível com OpenAI |
| Hardware | CPU e GPU | GPUs NVIDIA, AMD, Intel, Gaudi, TPU, Trainium/Inferentia, entre outros |
| Melhor para | Prototipagem, workstation, usuário único | Chatbots internos, RAG, APIs multiusuário |

## O que o benchmark mostra

A Red Hat comparou as duas ferramentas numa única **NVIDIA A100-PCIE-40GB**, com Llama 3.1 8B Instruct sem quantização (vLLM 0.9.1 e Ollama 0.9.2), variando de 1 a 256 usuários virtuais em testes de 300 segundos.

| Métrica | vLLM | Ollama |
|---|---|---|
| Throughput de pico | 793 tokens/s | 41 tokens/s |
| Latência P99 no pico de throughput | 80 ms | 673 ms |

Alguns pontos relevantes do teste:

- Com configuração padrão, o throughput do Ollama ficou praticamente estável enquanto a concorrência subia, e o tempo até o primeiro token (TTFT P99) disparou, porque as requisições ficam em fila.
- Mesmo ajustando `OLLAMA_NUM_PARALLEL=32` (o maior valor estável naquela A100), o Ollama estabilizou num patamar bem inferior, e a latência entre tokens ficou errática em alta concorrência.
- O vLLM escalou quase linearmente até a saturação. Acima de 16 usuários simultâneos, a latência entre tokens do vLLM subiu, enquanto a do Ollama padrão se manteve baixa, porque ele atende poucos pedidos por vez.

Conclusão dos autores: vLLM para produção; Ollama para desenvolvimento local, prototipagem e aplicações de um usuário.

Um cuidado: o artigo cita padrão de 4 requisições paralelas no Ollama 0.9.2, mas a documentação atual informa padrão de 1. Confira sempre a versão que você vai instalar.

## Por que a escolha muda o hardware

### VRAM: peso do modelo + KV cache por usuário

Todo LLM precisa de VRAM para os pesos e para o KV cache de cada conversa ativa. No Ollama, a documentação é explícita: requisições paralelas aumentam o contexto na mesma proporção. Um contexto de 2K com 4 requisições paralelas vira 8K de contexto e mais memória alocada. Além disso, para carregar vários modelos ao mesmo tempo em GPU, cada um precisa caber inteiro na VRAM; caso contrário, novas requisições esperam na fila.

O vLLM usa PagedAttention justamente para aproveitar melhor essa memória. Na prática, a VRAM que sobra depois dos pesos se transforma em capacidade de atender mais usuários simultâneos.

### Uma GPU grande ou várias GPUs

Quando o modelo não cabe numa GPU, o Ollama o distribui entre as placas disponíveis. O vLLM oferece paralelismo de tensor e de pipeline, pensados para dividir a carga entre GPUs e até entre servidores. Isso torna relevante a interconexão entre GPUs e, em escala de cluster, a rede entre nós.

### Exemplo prático

- **Equipe de dados testando modelos abertos** (3 a 5 pessoas, uso esporádico): uma workstation com uma GPU de boa VRAM e Ollama resolve.
- **Assistente interno com RAG para 200 colaboradores**: servidor com GPU dedicada e vLLM, dimensionado pelo pico de usuários simultâneos e pelo tamanho de contexto dos documentos.
- **API de IA para produto ou vários departamentos**: servidor multi-GPU ou cluster com vLLM, com paralelismo de tensor e monitoramento de latência P99.

## Como escolher

1. **Conte usuários simultâneos, não usuários totais.** Se o pico passa de poucos pedidos ao mesmo tempo, o Ollama vai enfileirar.
2. **Defina o SLA de latência.** Chatbot interno tolera mais; integração em sistema de atendimento exige P99 baixo.
3. **Meça o contexto real.** RAG com documentos longos consome muito mais KV cache do que perguntas curtas.
4. **Prototipe com Ollama, valide carga com vLLM.** Rode um teste de carga (a Red Hat usou o GuideLLM) no hardware candidato antes de comprar.
5. **Planeje crescimento.** Se o projeto pode virar produção, escolha chassi e fonte que comportem mais GPUs.

## Erros comuns

- **Colocar Ollama em produção multiusuário sem ajuste**: com o padrão atual de 1 requisição paralela por modelo, a fila cresce e o tempo até o primeiro token explode.
- **Aumentar `OLLAMA_NUM_PARALLEL` sem recalcular VRAM**: cada pedido paralelo multiplica o contexto alocado.
- **Dimensionar a GPU só pelo tamanho do modelo**: sem folga para KV cache, o servidor atende pouquíssimos usuários.
- **Expor o serviço sem controle de acesso**: o Ollama vem preso ao localhost por padrão por um motivo. Ao abrir para a rede, coloque autenticação e proxy na frente.
- **Ignorar a versão**: padrões mudam entre releases. Documente a versão e a configuração usadas nos testes.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega servidores e workstations para IA, com consultoria desde o primeiro contato para dimensionar GPU, VRAM e rede de acordo com o número de usuários e o modelo que sua empresa vai rodar, seja Ollama na fase de prova de conceito ou vLLM em produção. São mais de 25 anos de experiência e mais de 18.700 máquinas entregues, com marcas homologadas e suporte pós-venda.

👉 Conheça as soluções de [Inteligência Artificial da Tyar](https://tyar.com.br/produtos/inteligencia-artificial) e, para ambientes multi-GPU, os [Servidores](https://tyar.com.br/produtos/servidores).

---

**Fontes:**

- [Red Hat Developer: Ollama vs. vLLM — a deep dive into performance benchmarking](https://developers.redhat.com/articles/2025/08/08/ollama-vs-vllm-deep-dive-performance-benchmarking)
- [Red Hat: vLLM vs. Ollama — when to use each framework](https://www.redhat.com/en/topics/ai/vllm-vs-ollama)
- [Ollama: FAQ (documentação oficial)](https://docs.ollama.com/faq)
- [vLLM: documentação oficial](https://docs.vllm.ai/en/v0.6.6/index.html)
