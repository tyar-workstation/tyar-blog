---
title: "Watchout 7: requisitos de hardware e como montar um media server para projeção"
slug: "watchout-7-requisitos-media-server"
description: "Requisitos oficiais do Watchout 7 (Producer e Display), armazenamento por codec (HAP, Notch LC, 8K), rede e dicas para media servers estáveis."
date: "2026-11-13"
author: "Equipe Tyar"
category: "MediaServer Watchout"
tags: ["Watchout 7", "media server", "Dataton", "projeção mapeada", "HAP", "Notch LC"]
focus_keyword: "Watchout 7 requisitos"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/mediaserver-watchout"
faq:
  - q: "Quais são os requisitos mínimos do Watchout 7?"
    a: "Windows 10 21H2 64 bits, CPU Intel Core i3/i5 ou AMD Ryzen 3/5 com suporte a AVX, 16 GB de RAM e SSD. Na máquina Display, a GPU mínima é uma NVIDIA GeForce RTX. A Dataton recomenda NVIDIA RTX PRO, 32 GB DDR5 e NVMe Gen4."
  - q: "Watchout 7 funciona com placa AMD?"
    a: "Pode funcionar, mas a Dataton recomenda NVIDIA e indica que GPUs AMD exigem testes adicionais antes do uso em produção."
  - q: "Que SSD preciso para rodar vídeo 8K no Watchout?"
    a: "HAP 8K a 60 fps exige cerca de 949 MiB/s de leitura sustentada (NVMe Gen3 ou superior). Sequências de imagens 8K a 60 fps exigem cerca de 7.600 MiB/s, o que pede um array RAID de NVMe Gen4."
---

# Watchout 7: requisitos de hardware e como montar um media server para projeção

O **Dataton Watchout** é um dos softwares mais usados no mundo para controlar projeções multitela, mapeamento de projeção e instalações de mídia em museus, eventos, shows e espaços corporativos. Com o **Watchout 7**, os requisitos de hardware mudaram. Montar o media server certo é o que separa uma instalação estável de uma que trava na estreia.

Este guia reúne os **requisitos oficiais** da Dataton e as orientações práticas que usamos ao montar media servers.

## Producer e Display: duas funções, dois perfis

Um sistema Watchout tem dois tipos de máquina:

- **Producer:** onde o show é criado e editado.
- **Display:** as máquinas que reproduzem o conteúdo e enviam o sinal para projetores, painéis de LED e telas.

## Requisitos da máquina Display (reprodução)

| Componente | Mínimo | Recomendado |
|---|---|---|
| Sistema | Windows 10 21H2 64 bits | Windows 11 23H2+ 64 bits |
| CPU | Core i3/i5, Ryzen 3/5 ou Xeon/EPYC equivalente | Core i7/i9, Ryzen 7/9 ou Xeon/EPYC equivalente |
| RAM | 16 GiB DDR4 | 32 GiB DDR5 ou mais |
| GPU | NVIDIA GeForce RTX | **NVIDIA RTX PRO** |
| Armazenamento | SSD SATA, 500+ MiB/s sustentados | **NVMe Gen4, 3.500+ MiB/s sustentados** |
| Rede | Gigabit Ethernet | 2,5 Gigabit Ethernet |

## Requisitos da máquina Producer (edição)

| Componente | Mínimo | Recomendado |
|---|---|---|
| Sistema | Windows 10 21H2 64 bits | Windows 11 23H2+ 64 bits |
| CPU | Core i3/i5 ou Ryzen 3/5 | Core i7/i9 ou Ryzen 7/9 |
| RAM | 16 GiB DDR4 | 32 GiB DDR5 ou mais |
| GPU | Compatível com Vulkan 1.3, 4 GiB VRAM | NVIDIA RTX PRO |
| Armazenamento | SSD, 100 GiB livres | NVMe Gen4, 1 TiB+ livres |
| Rede | Gigabit Ethernet | 2,5 Gigabit Ethernet |

**Atenção:** o processador **precisa suportar instruções AVX**. CPUs sem AVX não rodam o Watchout 7.

**Sobre GPUs AMD:** a Dataton informa que podem funcionar, mas recomenda NVIDIA. Placas AMD exigem testes adicionais antes de ir para produção.

## Quanto de armazenamento seu conteúdo exige?

O ponto que mais derruba instalações é o **disco**. Cada formato exige uma taxa de leitura **sustentada**, não de pico:

| Conteúdo | Leitura sustentada | Armazenamento adequado |
|---|---|---|
| HAP 1080p60 | ~59 MiB/s | SSD SATA |
| HAP 4K60 | ~237 MiB/s | SSD SATA ou NVMe |
| Notch LC 4K60 | ~380 MiB/s | SSD SATA ou NVMe |
| HAP 8K60 | ~949 MiB/s | NVMe Gen3 |
| Sequência de imagens 4K60 | ~1.899 MiB/s | NVMe Gen4 |
| Sequência de imagens 8K60 | ~7.594 MiB/s | RAID de NVMe Gen4 |

*Fonte: documentação oficial Dataton Watchout 7.*

**Dica:** some todas as camadas que tocam **ao mesmo tempo** na mesma máquina Display. Três vídeos HAP 4K simultâneos já passam de 700 MiB/s.

Vídeos em ProRes e outros formatos comprimidos são **convertidos automaticamente para Notch LC** pelo Watchout 7. Considere esse tempo de conversão e o espaço extra no planejamento.

## Rede: não economize no switch

| Item | Mínimo | Recomendado |
|---|---|---|
| Velocidade | 1 Gbps | 2,5 Gbps |
| Switch | Gigabit gerenciado | Padrão empresarial com IGMP snooping |
| Topologia | Estrela, mesma sub-rede | **VLAN dedicada** para o Watchout |

Se você usa **NDI**, conte com cerca de **125 Mbps por stream 1080p60**, **250 Mbps por 4K60** e **500 Mbps por 8K60**. Vários streams simultâneos rapidamente pedem 2,5 GbE ou mais.

## Boas práticas para um media server estável

1. **GPU profissional (RTX PRO)** em instalações permanentes: drivers estáveis, recursos de sincronismo entre saídas e operação 24/7.
2. **Disco de conteúdo separado do disco de sistema.**
3. **Windows enxuto:** atualizações automáticas, antivírus e tarefas agendadas desativados ou controlados durante o show.
4. **Teste de estresse** com o conteúdo real, por horas, antes de levar para o local.
5. **Máquina reserva (backup)** configurada e pronta para eventos ao vivo.
6. **Refrigeração e chassi adequados** ao ambiente: museus e cabines de projeção costumam ser quentes e fechados.

## Instalações permanentes x eventos

- **Museus, exposições e espaços corporativos:** priorize servidores em rack, componentes de longa durabilidade e acesso remoto para suporte.
- **Eventos e turnês:** priorize chassis robustos para transporte, redundância e configurações idênticas entre máquinas, para facilitar a troca.

## Como a Tyar pode ajudar

A Tyar projeta e entrega **media servers para Watchout** já configurados e testados, com GPU, armazenamento e rede dimensionados para o seu conteúdo. Entre os nossos cases está o **Museu do Futebol**.

👉 [Conheça os MediaServers Watchout da Tyar](https://tyar.com.br/produtos/mediaserver-watchout) · [Veja nossos cases](https://tyar.com.br/cases)

---

**Fontes:**
[Dataton – Watchout 7 System Requirements](https://docs.dataton.com/watchout-7-new/watchout/getting-started/system-requirements.html) ·
[Dataton – Watchout 7 Hardware Recommendations](https://docs.dataton.com/watchout-7/appendices/hardware_recommendations.html)
