---
title: "Slurm ou Kubernetes para cluster de GPU: qual escolher"
slug: "slurm-ou-kubernetes-cluster-gpu"
description: "Slurm ou Kubernetes para cluster de GPU? Compare escala, gang scheduling, inferência, compartilhamento de GPU e o Slinky para decidir a orquestração."
date: "2026-11-20"
author: "Equipe Tyar"
category: "Cluster"
tags: ["slurm", "kubernetes", "cluster de gpu", "hpc", "orquestração", "slinky"]
focus_keyword: "slurm ou kubernetes"
reading_time: 7
cta_product: "https://tyar.com.br/produtos/cluster"
faq:
  - q: "Slurm ou Kubernetes: qual é melhor para treinar modelos de IA?"
    a: "Para treinamento distribuído em lotes, o Slurm costuma ser a escolha mais direta: aloca todos os nós de um job de uma vez (gang scheduling) e escala a dezenas de milhares de nós. O Kubernetes também tem gang scheduling, mas o recurso ainda está em beta e desligado por padrão."
  - q: "Dá para rodar Slurm e Kubernetes no mesmo cluster?"
    a: "Sim. O Slinky, da SchedMD (hoje parte da NVIDIA), roda clusters Slurm como pods no Kubernetes (slurm-operator) ou usa o Slurm como agendador de workloads Kubernetes (slurm-bridge), no mesmo conjunto de nós."
  - q: "O time-slicing de GPU no Kubernetes substitui o MIG?"
    a: "Não. O time-slicing divide o tempo da GPU entre pods, mas sem isolamento de memória nem de falhas. O MIG faz esse isolamento no hardware. Os dois podem ser combinados em GPUs compatíveis."
---

# Slurm ou Kubernetes para cluster de GPU: qual escolher

A resposta curta: **use Slurm quando o cluster existe para rodar jobs em lote** (treinamento de modelos, simulação, HPC) e **Kubernetes quando o foco é servir aplicações e inferência com alta disponibilidade**. Se a mesma infraestrutura precisa fazer as duas coisas, hoje existe um caminho oficial para unir os dois: o Slinky. O resto deste guia mostra os critérios técnicos para chegar nessa decisão sem retrabalho.

## Resumo rápido

- **Slurm** é o padrão em HPC: está em cerca de 60% dos supercomputadores da lista Top500 e escala a algo em torno de 30.000 nós.
- **Kubernetes** é mais forte em serviços contínuos: autoscaling, failover e ecossistema cloud-native, com escala típica citada em torno de 5.000 nós.
- **Gang scheduling** (tudo ou nada) é nativo no Slurm; no Kubernetes ele está em beta desde a v1.37 e vem desligado por padrão.
- **Slinky**, da SchedMD (agora parte da NVIDIA), permite rodar Slurm dentro do Kubernetes ou usar o Slurm como agendador do Kubernetes.
- A escolha depende mais do **perfil de carga** e da **equipe** do que do hardware.

## O que cada um resolve

### Slurm: feito para filas de jobs

O Slurm é um gerenciador de workloads criado para HPC. O usuário submete um job pedindo, por exemplo, 4 nós com 8 GPUs cada; o Slurm só inicia o job quando todos os recursos estão livres e os aloca juntos. Esse comportamento de "tudo ou nada" é exatamente o que o treinamento distribuído precisa: um job de PyTorch distribuído com metade dos nós alocados fica parado consumindo GPU sem produzir nada.

Segundo reportagem da HPCwire de maio de 2026, o Slurm roda em cerca de 60% dos supercomputadores do Top500. Na mesma matéria, Stephen Watt, da Red Hat, resume: "Ele escala a 30.000 nós. O Kubernetes escala a cerca de 5.000" e recomenda o Slurm para pré-treinamento de modelos.

### Kubernetes: feito para serviços que não podem cair

O Kubernetes nasceu para orquestrar containers de aplicações que ficam no ar continuamente. Os pontos fortes são autoscaling, recuperação automática de pods com falha e um ecossistema enorme de ferramentas (observabilidade, CI/CD, service mesh). Para inferência, APIs de modelos e pipelines de dados, ele costuma ser a base natural. Watt observa que o Slurm não tem "um mecanismo de failover tão elegante ou sofisticado quanto o do Kubernetes".

## Tabela comparativa

| Critério | Slurm | Kubernetes |
|---|---|---|
| Carga ideal | Jobs em lote: treinamento, simulação, CFD, renderização | Serviços contínuos: inferência, APIs, pipelines |
| Escala citada | ~30.000 nós | ~5.000 nós |
| Gang scheduling | Nativo | Beta desde v1.37, desligado por padrão (feature gate `GenericWorkload`) |
| Elasticidade | Cluster mais estático | Autoscaling nativo |
| Alta disponibilidade de serviços | Limitada | Forte (failover de pods) |
| Curva de aprendizado | Menor para usuários de HPC | Maior (manifests YAML, operadores, rede) |

## Gang scheduling: a diferença que mais pesa no treinamento

Se a sua empresa vai treinar modelos em vários servidores de GPU, esse é o critério decisivo. Na documentação do Kubernetes, gang scheduling "garante que um grupo de Pods seja agendado em regime de tudo ou nada": se o cluster não comporta o grupo inteiro (ou o mínimo definido em `minCount`), nenhum pod é alocado.

A evolução no Kubernetes foi rápida, mas é recente:

- **v1.35 (dez/2025):** introduziu a Workload API e um gang scheduling básico.
- **v1.36 (mai/2026):** separou Workload API (modelo estático) e PodGroup API (estado em execução), adicionou um ciclo de agendamento por PodGroup e as primeiras versões de agendamento ciente de topologia e preempção por workload.
- **v1.37:** gang scheduling passou a beta, ainda desligado por padrão.

Na prática: no Slurm a alocação tudo ou nada é nativa. No Kubernetes é preciso habilitar feature gates em todos os componentes relevantes ou adotar ferramentas adicionais, o que aumenta a complexidade operacional.

## Compartilhamento de GPU: time-slicing x MIG

Em clusters usados por muitos desenvolvedores (notebooks, testes, inferência leve), dividir uma GPU entre vários usuários aumenta o aproveitamento. No Kubernetes, o NVIDIA GPU Operator oferece dois mecanismos:

- **Time-slicing:** o administrador define "réplicas" de uma GPU, e cada réplica pode ser entregue a um pod. A GPU divide o tempo igualmente entre os processos. A própria NVIDIA alerta: diferente do MIG, "não há isolamento de memória nem de falhas entre réplicas". Pedir mais de uma réplica também não garante mais capacidade de computação.
- **MIG (Multi-Instance GPU):** particiona a GPU no hardware, com isolamento de memória e de falhas. Só existe em GPUs compatíveis. Os dois métodos podem ser combinados.

Para treinamento pesado, nenhum dos dois faz sentido: o job quer GPUs inteiras. Para ambientes compartilhados de desenvolvimento, eles mudam a conta de quantas GPUs comprar.

## Slinky: quando a resposta é "os dois"

Muitas empresas treinam e servem modelos na mesma infraestrutura. Manter dois clusters separados duplica hardware e operação. O Slinky é o conjunto de projetos da SchedMD, empresa responsável pelo Slurm e adquirida pela NVIDIA no fim de 2025, para integrar Slurm e Kubernetes:

- **slurm-operator:** roda clusters Slurm completos como pods no Kubernetes.
- **slurm-bridge:** usa o Slurm como agendador de workloads Kubernetes, agendando jobs Slurm e pods no mesmo pool de nós.

A NVIDIA descreve o Slinky como um toolkit open source que permite rodar Slurm e Kubernetes "no mesmo pool de nós sem duplicar infraestrutura", com agendamento de GPU ciente de topologia. Segundo a HPCwire, engenheiros da NVIDIA testaram o projeto em clusters de até 8.000 GPUs.

## Como escolher

Responda a estas perguntas antes de definir a orquestração:

1. **Qual é a carga dominante?** Treinamento distribuído, simulação e renderização em lote apontam para Slurm. Inferência em produção e microserviços apontam para Kubernetes.
2. **Quem vai operar o cluster?** Equipes vindas de HPC e pesquisa estão em casa no Slurm. Equipes de DevOps/plataforma já dominam Kubernetes.
3. **Os jobs ocupam vários nós ao mesmo tempo?** Se sim, gang scheduling maduro é obrigatório; hoje isso favorece o Slurm.
4. **Muitos usuários dividem poucas GPUs?** Planeje MIG ou time-slicing e escolha GPUs compatíveis com MIG se precisar de isolamento.
5. **Treino e inferência dividem o mesmo hardware?** Avalie o Slinky em vez de manter dois clusters.

### Exemplos práticos

- **Centro de pesquisa com simulações CFD e alguns modelos de IA:** Slurm, com partições separadas para CPU e GPU.
- **Empresa de software servindo um LLM interno para 2.000 funcionários:** Kubernetes, com autoscaling das réplicas de inferência.
- **Startup que faz fine-tuning semanal e serve o modelo em produção:** Kubernetes com Slinky, para que os jobs de treino usem o Slurm sem um segundo cluster.

## Erros comuns

- **Escolher pela moda, não pela carga.** Kubernetes não é automaticamente mais moderno para treinamento; sem gang scheduling bem configurado, jobs multi-nó travam GPUs à espera de recursos.
- **Ignorar a rede.** Orquestrador nenhum compensa interconexão inadequada entre nós em treinamento distribuído.
- **Usar time-slicing onde precisa de isolamento.** Um processo que estoura a memória pode afetar todos os outros na mesma GPU.
- **Montar dois clusters sem necessidade.** Se treino e inferência alternam ao longo do dia, um pool único com Slinky tende a aproveitar melhor as GPUs.
- **Subestimar a operação.** Kubernetes exige uma equipe que domine manifests, operadores e atualizações frequentes de versão.

## Como a Tyar pode ajudar

A Tyar projeta, configura e entrega clusters de alta performance para empresas de todos os portes no Brasil, com mais de 25 anos de experiência e mais de 3.600 projetos realizados. Na consultoria, avaliamos sua carga (treino, inferência ou HPC), dimensionamos nós, GPUs e rede, e entregamos o ambiente pronto para o orquestrador escolhido, com marcas homologadas e suporte pós-venda.

👉 Conheça nossas soluções de [Cluster](https://tyar.com.br/produtos/cluster) e de [Inteligência Artificial](https://tyar.com.br/produtos/inteligencia-artificial).

---

**Fontes:**

- [HPCwire – Slurm vs. Kubernetes in the Age of AI (mai/2026)](https://www.hpcwire.com/2026/05/15/slurm-vs-kubernetes-in-the-age-of-ai/)
- [SchedMD – Slinky: Slurm and Kubernetes](https://slurm.schedmd.com/slinky.html)
- [NVIDIA – Slinky](https://www.nvidia.com/en-us/software/slinky)
- [NVIDIA GPU Operator – Time-Slicing GPUs in Kubernetes](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-sharing.html)
- [Kubernetes – Gang Scheduling](https://kubernetes.io/docs/concepts/scheduling-eviction/gang-scheduling/)
- [Kubernetes v1.35: Introducing Workload Aware Scheduling](https://kubernetes.io/blog/2025/12/29/kubernetes-v1-35-introducing-workload-aware-scheduling/)
- [Kubernetes v1.36: Advancing Workload-Aware Scheduling](https://kubernetes.io/blog/2026/05/13/kubernetes-v1-36-advancing-workload-aware-scheduling/)
- [SkyPilot – Slurm vs K8s for AI Infra](https://skypilot.ai/blog/slurm-vs-k8s)
