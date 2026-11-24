---
title: "Render farm própria: como montar e dimensionar na empresa"
slug: "render-farm-propria-como-montar"
description: "Como montar uma render farm própria: gerenciador de fila, licenças de render node, storage compartilhado e rede. Guia para estúdios e escritórios."
date: "2026-11-19"
author: "Equipe Tyar"
category: "Cluster"
tags: ["render farm", "renderização distribuída", "Deadline", "Flamenco", "V-Ray", "Corona", "cluster de renderização"]
focus_keyword: "render farm própria"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/cluster"
faq:
  - q: "O AWS Thinkbox Deadline ainda é gratuito e pode ser usado em uma render farm própria?"
    a: "Sim. A AWS tornou o Deadline gratuito em 2022. Desde 7 de novembro de 2025 ele está em modo de manutenção: segue disponível para download, aceita novos render nodes e recebe correções críticas e de segurança, mas não ganha novos recursos."
  - q: "Preciso de uma licença completa do V-Ray ou do Corona em cada máquina da render farm?"
    a: "Não. Chaos vende licenças de render node, que renderizam sem interface gráfica. No Corona, a licença de render node roda o 3ds Max ou o Cinema 4D em linha de comando e não permite abrir o software para trabalhar na cena."
  - q: "Qual a diferença entre renderização distribuída e render farm com fila?"
    a: "Na renderização distribuída, vários computadores dividem um único frame, como no Distributed Rendering e no Swarm do V-Ray. Na render farm com fila, o gerenciador entrega frames ou jobs inteiros a cada máquina, o modelo usado por Deadline e Flamenco."
---

# Render farm própria: como montar e dimensionar na empresa

Uma render farm própria é um conjunto de computadores dedicados que recebem trabalhos de renderização em fila, liberando as workstations dos artistas. Para montar uma, você precisa de quatro peças: um gerenciador de fila (Deadline, Flamenco ou o sistema nativo do renderizador), licenças de render node para cada máquina, um storage compartilhado que todos os nós enxerguem pelo mesmo caminho e uma rede que aguente o tráfego de cenas e texturas. O hardware dos nós vem depois e segue o motor de render que você usa: CPU para V-Ray CPU e Corona, GPU para motores acelerados por placa de vídeo.

## Resumo rápido

- **Gerenciador de fila:** o AWS Thinkbox Deadline 10 é gratuito desde 2022 e está em modo de manutenção desde 7/11/2025; o Flamenco atende estúdios pequenos que usam Blender.
- **Licenças:** V-Ray e Corona têm licenças de render node, mais baratas que a licença de estação, que rodam sem interface gráfica.
- **Storage compartilhado é obrigatório:** todo nó precisa ler a cena e gravar o resultado no mesmo local, como em um NAS.
- **Pastas sincronizadas não servem:** a documentação do Flamenco descarta Dropbox, Google Drive, OneDrive e Syncthing para a farm.
- **Hardware segue o motor de render:** defina CPU ou GPU pelo renderizador antes de escolher a máquina.

## Render farm com fila ou renderização distribuída?

São dois modelos diferentes, e muitos escritórios confundem os dois na hora da compra.

| Modelo | Como funciona | Exemplos | Quando faz sentido |
|---|---|---|---|
| Render farm com fila | O gerenciador entrega frames ou jobs inteiros a cada nó | Deadline, Flamenco, Backburner | Animações, lotes de imagens, vários artistas disputando recursos |
| Renderização distribuída | Vários computadores dividem um único frame | V-Ray Distributed Rendering, V-Ray Swarm | Imagens estáticas de alta resolução que precisam sair rápido |

Segundo a Chaos, o Distributed Rendering do V-Ray serve para "distribuir um único job, dentro de um único frame, entre vários computadores da rede" e está disponível para 3ds Max, Maya, Cinema 4D, Nuke, Houdini e Unreal. Para SketchUp, Revit e Rhino, o recurso equivalente é o V-Ray Swarm. Uma farm bem projetada costuma usar os dois: fila para animações e distribuição para stills urgentes.

O Flamenco, por exemplo, ainda não divide uma única imagem entre vários workers, segundo o FAQ do próprio projeto. Se o seu fluxo é de stills de arquitetura em alta resolução, isso pesa na escolha.

## Gerenciador de fila: Deadline ou Flamenco

### AWS Thinkbox Deadline 10

O Deadline é o gerenciador mais usado em estúdios de animação, VFX e visualização arquitetônica. A página oficial da AWS o descreve como um kit de gerenciamento de render para farms com Windows, Linux e macOS. Pontos que importam para quem vai comprar hardware agora:

- **Custo de licença:** em 2022 a AWS tornou gratuitos os produtos Thinkbox (Deadline, Draft, Krakatoa, Frost, XMesh, Sequoia e Stoke), segundo a CG Channel. A partir da versão 10.1.23.6, o Deadline deixou de exigir licença.
- **Modo de manutenção:** desde 7 de novembro de 2025, o Deadline 10 recebe apenas atualizações de segurança e correções críticas. Farms existentes continuam funcionando, scripts e configurações seguem válidos, é possível baixar o software e adicionar novos render nodes, e as integrações com softwares de criação continuam sendo atualizadas (CGPress).
- **Licenciamento por uso:** o recurso de Usage-Based Licensing passou a funcionar via Deadline Cloud UBL; o antigo Thinkbox UBL Marketplace deixou de funcionar, segundo a AWS.
- **Compatibilidade:** V-Ray e Corona listam o Deadline entre os gerenciadores suportados.

Na prática, o Deadline continua sendo uma escolha segura para uma farm on-premise, desde que você saiba que não haverá novos recursos. Para evolução contínua, a AWS indica o Deadline Cloud, que é um serviço em nuvem.

### Flamenco (Blender)

O Flamenco é o gerenciador de render da Blender. O FAQ do projeto diz que ele foi "feito para simplicidade e uso em estúdios pequenos ou em casa, rodando no seu próprio hardware". A arquitetura tem dois componentes: o Manager, com interface web (porta 8080 por padrão), e o Worker, instalado em cada nó. Aceita sistemas operacionais mistos, mas foi desenvolvido em Linux, para o Blender Studio, que usa só Linux.

## Licenças de render node

Licença de software é o custo que mais surpreende quem monta a primeira farm. Cada nó precisa de uma licença do renderizador, mas não da licença completa de estação.

- **Corona:** a Chaos define a licença de render node como aquela usada em um computador onde o 3ds Max ou o Cinema 4D roda em modo de linha de comando, sem interface visível. Ela não permite abrir o software para trabalhar. A mesma licença serve para 3ds Max e Cinema 4D.
- **V-Ray:** os render nodes suportam renderização em rede e distribuída no V-Ray para 3ds Max, Maya, Cinema 4D, Houdini, Nuke, Unreal, SketchUp, Rhino e Revit, com cobrança anual, mensal ou em contrato de 3 anos.

Some essas licenças recorrentes ao custo de cada nó e consulte o revendedor sobre o preço vigente antes de fechar o número de máquinas.

## Storage compartilhado: o ponto que mais derruba farms

Todos os nós precisam acessar a cena, as texturas, os proxies e o caminho de saída. A documentação do Flamenco resume a premissa: o sistema "assume que, quando um arquivo é gravado por um worker, ele fica imediatamente disponível para qualquer outro worker, como acontece com um NAS". Regras práticas que valem para qualquer gerenciador:

1. **Use um NAS ou servidor de arquivos de verdade.** Serviços de sincronização (Dropbox, Google Drive, OneDrive, Syncthing, ownCloud) não são suportados pelo Flamenco, porque a cópia não é imediata.
2. **Padronize caminhos.** No Windows, o Flamenco só aceita letras de unidade, não caminhos UNC como `\\SERVIDOR\pasta`. Mapeie o compartilhamento com a mesma letra em todas as máquinas.
3. **Evite caminhos absolutos para pastas locais.** Se a cena aponta para `C:\texturas` do artista, o nó não encontra o arquivo e o frame falha ou sai sem textura.
4. **Defina o modelo de cópia.** O Flamenco oferece três: trabalhar direto no storage compartilhado (simples e eficiente, sem isolamento entre jobs), copiar tudo a cada job (isolado, mas lento) ou usar o Shaman, que copia cada arquivo uma só vez para a farm.

O storage também precisa de desempenho: com dez nós abrindo a mesma cena ao mesmo tempo, um NAS subdimensionado vira o gargalo e deixa CPUs e GPUs paradas.

## Como dimensionar os nós

Em vez de partir de uma configuração pronta, siga a ordem:

1. **Motor de render:** Corona e V-Ray CPU escalam com núcleos de processador e memória RAM; motores GPU escalam com quantidade de placas e VRAM. Uma farm GPU cuja cena não cabe na VRAM simplesmente não renderiza.
2. **Maior cena real:** meça o consumo de RAM (ou VRAM) da cena mais pesada dos últimos meses e use esse valor, com folga, como mínimo por nó.
3. **Prazo de entrega:** cronometre um frame típico em uma máquina de referência e divida o total de frames do projeto pelo número de nós para estimar o tempo de fila.
4. **Infraestrutura física:** nós rodando 24 horas pedem rack, energia, refrigeração e acesso remoto, o que muitas vezes justifica servidores em vez de desktops.
5. **Homogeneidade:** nós iguais simplificam drivers, versões de plugins e diagnóstico de falhas.

## Erros comuns

- **Comprar nós antes de resolver o storage.** Sem caminho compartilhado e padronizado, nenhum gerenciador funciona bem.
- **Ignorar o custo de licenças por nó.** O hardware é só parte do investimento.
- **Misturar versões de software e plugins.** Uma versão diferente do V-Ray ou do Blender em um nó gera frames com aparência diferente.
- **Usar pastas sincronizadas na nuvem como storage da farm.**
- **Confundir distribuição de frame com fila de jobs** e escolher um gerenciador que não atende o fluxo de stills.
- **Não planejar o fim de vida do software.** Com o Deadline em manutenção, documente a versão usada e acompanhe as correções publicadas pela AWS.

## Como a Tyar pode ajudar

A Tyar projeta, configura, entrega e dá suporte a clusters e servidores de alta performance para empresas de todos os portes, com mais de 25 anos de experiência, mais de 3.600 projetos e mais de 18.700 máquinas entregues. A consultoria começa no primeiro contato: avaliamos seu motor de render, o tamanho das cenas e os prazos para definir nós, storage compartilhado e rede, sempre com marcas homologadas e suporte pós-venda.

👉 Conheça as soluções de [Cluster da Tyar](https://tyar.com.br/produtos/cluster) e o [Storage para a sua farm](https://tyar.com.br/produtos/storage).

---

**Fontes:**

- [AWS Thinkbox Deadline 10 (AWS)](https://aws.amazon.com/thinkbox-deadline/)
- [CGPress: Deadline to enter maintenance mode on November 7, 2025](https://cgpress.org/archives/deadline-to-enter-maintenance-mode-on-november-7-2025.html)
- [CG Channel: AWS to put Deadline into maintenance mode](https://www.cgchannel.com/2025/10/aws-to-put-deadline-into-maintenance-mode-next-month/)
- [CG Channel: Amazon makes AWS Thinkbox software available free](https://www.cgchannel.com/?p=138343)
- [Flamenco: Shared Storage](https://flamenco.blender.org/usage/shared-storage/)
- [Flamenco: FAQ](https://flamenco.blender.org/faq/)
- [Chaos: V-Ray Render Node](https://www.chaos.com/vray/render-node)
- [Chaos: Corona Render Nodes](https://www.chaos.com/corona/render-nodes)
