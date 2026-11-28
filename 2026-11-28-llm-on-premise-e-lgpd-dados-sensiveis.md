---
title: "LLM on-premise e LGPD: como usar IA com dados sensíveis"
slug: "llm-on-premise-e-lgpd-dados-sensiveis"
description: "Quando rodar LLM on-premise ajuda a cumprir a LGPD? Veja as regras de transferência internacional e dados sensíveis e o que configurar no hardware."
date: "2026-11-28"
author: "Equipe Tyar"
category: "Inteligência Artificial"
tags: ["LGPD", "LLM on-premise", "dados sensíveis", "transferência internacional de dados", "cláusulas-padrão ANPD", "IA generativa", "segurança da informação"]
focus_keyword: "LLM on-premise LGPD"
link_terms: ["LGPD e IA", "IA on-premise com dados sensíveis", "transferência internacional de dados", "cláusulas-padrão da ANPD"]
reading_time: 7
cta_product: "https://tyar.com.br/produtos/inteligencia-artificial"
faq:
  - q: "Usar uma API de IA hospedada fora do Brasil é transferência internacional de dados?"
    a: "Se o prompt ou os documentos enviados contêm dados pessoais e são processados em servidores no exterior, sim. A LGPD (art. 33) só permite essa transferência em hipóteses específicas, como país com nível de proteção adequado reconhecido pela ANPD ou cláusulas-padrão contratuais aprovadas pela Resolução CD/ANPD nº 19/2024."
  - q: "Rodar o LLM on-premise dispensa a LGPD?"
    a: "Não. O tratamento continua sujeito à LGPD: é preciso base legal, finalidade definida, medidas de segurança (art. 46) e comunicação de incidentes (art. 48). O que o on-premise elimina é a transferência internacional e o compartilhamento com um fornecedor de IA, o que simplifica a conformidade."
  - q: "Qual é a multa da LGPD por tratamento irregular de dados?"
    a: "A multa simples prevista no art. 52 da LGPD é de até 2% do faturamento da empresa, grupo ou conglomerado no Brasil no último exercício, excluídos os tributos, limitada a R$ 50 milhões por infração."
  - q: "O marco legal da IA (PL 2338/2023) já está em vigor?"
    a: "Não. O projeto foi aprovado pelo Senado em dezembro de 2024 e, em outubro de 2026, aguardava parecer do relator na comissão especial da Câmara. Até lá, o uso de dados pessoais em IA segue regido pela LGPD e pelas normas da ANPD."
---

# LLM on-premise e LGPD: como usar IA com dados sensíveis

Rodar um LLM on-premise ajuda a cumprir a LGPD porque os dados pessoais enviados ao modelo não saem da infraestrutura da empresa: não há transferência internacional nem fornecedor de IA tratando os dados. A lei continua valendo, com base legal, finalidade e medidas de segurança, mas a conformidade fica mais simples de provar. Para dados sensíveis, como saúde, biometria ou dados financeiros de clientes, essa costuma ser a arquitetura de menor risco.

Este artigo faz parte do [guia de infraestrutura para IA na empresa](https://blog.tyar.com.br/guia-infraestrutura-para-ia-na-empresa/). O conteúdo é informativo e não substitui a orientação do jurídico ou do encarregado de dados (DPO) da sua empresa.

## Resumo rápido

- Enviar dados pessoais para uma API de IA processada fora do país é **transferência internacional**, permitida só nas hipóteses do art. 33 da LGPD.
- Desde 23 de agosto de 2025, quem usa as **cláusulas-padrão da ANPD** (Resolução CD/ANPD nº 19/2024) precisa tê-las incorporadas aos contratos, sem alterar o texto.
- Em fevereiro de 2026, a ANPD declarou que pode fiscalizar e sancionar empresas que transferem dados ao exterior sem respaldo legal.
- O on-premise elimina a transferência, mas exige do hardware: criptografia, controle de acesso, logs e rede segmentada (art. 46).
- A multa simples da LGPD chega a 2% do faturamento no Brasil, limitada a R$ 50 milhões por infração.

## Quando a IA na nuvem vira transferência internacional?

Toda vez que um funcionário cola em um assistente de IA um contrato com CPF, um prontuário ou uma planilha de clientes, e esse conteúdo é processado em servidores no exterior, ocorre uma transferência internacional de dados pessoais. O art. 33 da LGPD diz que ela "somente é permitida" em casos específicos. Os mais usados por empresas são:

| Hipótese (art. 33) | Na prática |
|---|---|
| País com proteção adequada (inciso I) | Até fevereiro de 2026, a ANPD havia reconhecido formalmente só a União Europeia, estendida aos países do EEE pela Resolução 32/26 |
| Garantias do controlador (inciso II) | Cláusulas-padrão contratuais, cláusulas específicas, normas corporativas globais ou selos e certificados |
| Consentimento específico e destacado (inciso VIII) | Exige informar o titular sobre o caráter internacional; difícil de obter para bases inteiras |

A Resolução CD/ANPD nº 19/2024 regulamentou essas regras e trouxe o modelo de cláusulas-padrão. O prazo para incorporá-las aos contratos terminou em 23 de agosto de 2025. Segundo análise do escritório Mayer Brown, o texto deve ser mantido em sua essência, as partes precisam descrever categorias de dados, finalidades e medidas de segurança, e o importador assume obrigações como comunicar incidentes em até 3 dias e avisar sobre pedidos de acesso de autoridades estrangeiras.

Na prática, muitos serviços de IA são contratados por cartão de crédito, com termos de uso padrão que a empresa não negocia. Verificar se esses termos atendem à resolução é tarefa do jurídico, e é aí que muitas empresas descobrem que a alternativa mais simples é não enviar os dados para fora.

## Quais dados exigem mais cuidado?

A LGPD define como **dado pessoal sensível** (art. 5º, II) informações sobre origem racial ou étnica, convicção religiosa, opinião política, filiação sindical ou a organização religiosa, filosófica ou política, saúde, vida sexual, dados genéticos ou biométricos, quando vinculados a uma pessoa. O tratamento desses dados tem hipóteses mais restritas.

Na IA corporativa, eles aparecem em lugares previsíveis:

- **Saúde:** prontuários, laudos e atestados analisados por um assistente clínico.
- **RH:** atestados médicos, filiação sindical e dados de diversidade em triagem de currículos.
- **Segurança e indústria:** reconhecimento facial em portarias e controle de acesso (biometria).
- **Jurídico e financeiro:** contratos, processos e dados de crédito, que não são "sensíveis" pela definição legal, mas costumam ser sigilosos e envolvem decisões automatizadas.

Sobre esse último ponto, o art. 20 garante ao titular o direito de pedir revisão de decisões tomadas unicamente com base em tratamento automatizado que afetem seus interesses, como perfil de crédito ou profissional. Um sistema de IA que classifica candidatos ou clientes precisa permitir rastrear como a decisão foi tomada.

## O que muda quando o LLM roda on-premise?

Com o modelo rodando em servidor próprio, os prompts, documentos e respostas ficam dentro da rede da empresa. Isso traz três ganhos objetivos para a conformidade:

1. **Sem transferência internacional.** Os dados não saem do país, e o art. 33 deixa de se aplicar a esse fluxo.
2. **Sem operador externo de IA.** Não há fornecedor recebendo os dados nem termos de uso que permitam reter conteúdo para treinar modelos.
3. **Controle e prova.** A empresa define onde ficam os logs, quem acessa e por quanto tempo os dados são guardados, e consegue demonstrar isso em uma fiscalização.

O caso mais comum é o assistente interno com busca em documentos. Detalhamos a arquitetura em [RAG na empresa: infraestrutura necessária](https://blog.tyar.com.br/rag-na-empresa-infraestrutura-necessaria/); com dados pessoais, o banco vetorial e os documentos de origem ficam no mesmo perímetro do modelo. Para servir o LLM, ferramentas como vLLM e Ollama rodam totalmente offline. Comparamos as duas em [vLLM ou Ollama: qual usar para LLM na empresa](https://blog.tyar.com.br/vllm-ou-ollama-qual-usar-para-llm-na-empresa/).

## O que configurar no hardware para atender o art. 46

O art. 46 da LGPD exige medidas de segurança técnicas e administrativas para proteger os dados contra acessos não autorizados, perda, alteração ou vazamento. Em um servidor de IA, isso se traduz em itens concretos:

| Camada | Medida recomendada |
|---|---|
| Storage | Criptografia em repouso nos discos do sistema, dos modelos, dos documentos do RAG e dos logs |
| Rede | Servidor em VLAN isolada, sem saída para a internet ou com saída restrita a atualizações |
| Acesso | Autenticação integrada ao diretório da empresa (SSO/LDAP) e perfis por área |
| Logs | Registro de quem consultou o quê, com prazo de retenção definido e acesso restrito |
| Dados | Política de retenção para prompts e respostas; anonimização antes de indexar quando possível |
| Físico | Servidor em rack trancado ou data center com controle de entrada |
| Continuidade | Backup criptografado e plano para comunicar incidentes à ANPD e aos titulares (art. 48) |

Esses itens pesam no projeto. Logs e documentos indexados ocupam espaço e precisam de desempenho, como mostramos em [storage para IA: como dimensionar](https://blog.tyar.com.br/storage-para-ia-como-dimensionar/). E o tamanho do modelo define quantas GPUs são necessárias: com [quantização FP8 ou INT4](https://blog.tyar.com.br/quantizacao-de-llm-fp8-int4-memoria-gpu/), um modelo que pediria várias placas pode caber em uma ou duas.

### Exemplos de dimensionamento por cenário

| Cenário | Usuários | Arquitetura típica |
|---|---|---|
| Escritório de advocacia analisando contratos | Poucos analistas | Workstation com GPU de grande VRAM, modelo quantizado e RAG local |
| Hospital com assistente para prontuários | Dezenas de profissionais | Servidor com 2 a 4 GPUs, vLLM, storage criptografado e rede isolada |
| Empresa com chatbot interno para RH e jurídico | Centenas de funcionários | Servidor com várias GPUs, SSO, logs centralizados e alta disponibilidade |

Para equipes menores ou fase de piloto, uma [workstation para IA sob medida](https://workstations.tyar.com.br/) mantém os dados no escritório sem a complexidade de um data center. Para produção com muitos usuários, o caminho é o servidor com GPU. A conta financeira entre as duas opções e a nuvem está em [GPU na nuvem ou servidor próprio para IA](https://blog.tyar.com.br/gpu-na-nuvem-ou-servidor-proprio-para-ia-tco/).

## Erros comuns

- **Achar que on-premise resolve tudo.** O tratamento continua precisando de base legal, finalidade, registro das operações e, em muitos casos, relatório de impacto. O hardware é parte da solução, não toda ela.
- **Deixar o servidor de IA com acesso livre à internet.** Ferramentas e bibliotecas podem enviar telemetria. Restrinja a saída de rede e revise as configurações.
- **Guardar prompts para sempre.** Logs de conversa contêm os mesmos dados pessoais dos documentos. Defina retenção e quem pode ler.
- **Indexar tudo no RAG.** Se o assistente responde a todos, ele não pode ter acesso a documentos que só o RH deveria ver. Aplique permissões por documento.
- **Ignorar o uso informal de IA.** Proibir sem oferecer alternativa leva funcionários a usar serviços externos por conta própria. Um assistente interno é a forma mais eficaz de reduzir esse risco.
- **Esperar o marco legal da IA.** O PL 2338/2023 foi aprovado pelo Senado em dezembro de 2024 e, em outubro de 2026, aguardava parecer na comissão especial da Câmara. A LGPD já se aplica hoje.

## Como a Tyar pode ajudar

A Tyar projeta, configura, entrega e dá suporte a servidores com GPU, workstations e storage para IA, para empresas de todos os portes no Brasil. Com mais de 25 anos de experiência e mais de 4.000 consultorias, ajudamos a dimensionar uma infraestrutura on-premise que mantém os dados sensíveis dentro da empresa, com o desempenho que o modelo exige.

👉 Conheça as soluções de [Inteligência Artificial da Tyar](https://tyar.com.br/produtos/inteligencia-artificial) e os [servidores com GPU](https://tyar.com.br/produtos/servidores).

---

**Fontes:**

- [Lei nº 13.709/2018 – Lei Geral de Proteção de Dados Pessoais (texto compilado)](https://planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709compilado.htm)
- [Mayer Brown – Fim do período de graça da Resolução CD/ANPD nº 19/2024](https://www.mayerbrown.com/pt/insights/publications/2025/08/end-of-grace-period-implementation-of-brazils-standard-contractual-clauses-in-international-transfers-of-personal-data)
- [Migalhas – Envio de dados pessoais ao exterior está no radar fiscalizatório da ANPD](https://www.migalhas.com.br/quentes/449475/envio-de-dados-ao-exterior-esta-no-radar-fiscalizatorio-da-anpd)
- [IA.BR – PL 2338/2023: onde está o projeto de lei de IA](https://institutobrasileiro.ia.br/artigos/pl-2338-2023-onde-esta-o-projeto-de-lei-de-ia/)
