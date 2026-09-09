# Minerva CRM

Minerva CRM é uma aplicação web acadêmica e de portfólio criada para simular a gestão comercial de pequenos negócios. O sistema centraliza clientes, leads, oportunidades, tarefas de follow-up e histórico de interações em uma interface única.

O projeto foi desenvolvido com foco em regras de negócio, organização de dados, experiência de uso e estrutura frontend preparada para futura integração com backend e banco de dados.

## Problema

Pequenos negócios frequentemente perdem oportunidades porque contatos, negociações, tarefas e históricos ficam espalhados em ferramentas diferentes ou não são registrados de forma consistente.

O Minerva CRM propõe uma interface centralizada para organizar esse fluxo comercial e tornar o acompanhamento de clientes e oportunidades mais claro.

## Solução desenvolvida

A aplicação reúne em um único ambiente:

- cadastro e acompanhamento de clientes;
- gestão de leads e oportunidades;
- funil de vendas;
- tarefas de follow-up;
- histórico de interações;
- métricas e relatórios comerciais.

## Funcionalidades

- Dashboard com clientes, leads, oportunidades, conversão, valores em negociação e tarefas próximas.
- Cadastro, edição, remoção, busca e filtro de clientes.
- Gestão de leads com etapa do funil, valor estimado, responsável e atualização de estágio.
- Funil de vendas em Kanban com contadores e soma por coluna.
- Tarefas de follow-up com prioridade, status, vencimento e destaque de atrasadas.
- Histórico de interações por tipo, responsável, próximo passo e relacionamento com cliente ou lead.
- Relatórios com distribuição por etapa, origem, status de clientes e indicadores financeiros.
- Persistência local com LocalStorage.

## Tecnologias

- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- LocalStorage
- ESLint

## Estrutura

```text
src/
  app/
    dashboard/
    clientes/
    leads/
    funil/
    tarefas/
    interacoes/
    relatorios/
  components/
    layout/
    ui/
    crm/
  constants/
  data/
  hooks/
  types/
  utils/
```

## Como rodar

Instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

Para gerar a build de produção:

```bash
npm run build
```

## Escopo atual

Esta versão é intencionalmente frontend. Atualmente não possui:

- backend próprio;
- API;
- banco de dados remoto;
- autenticação;
- gerenciamento real de usuários.

Essas limitações fazem parte do escopo acadêmico atual e estão documentadas para não apresentar o projeto como um produto comercial completo.

## Competências demonstradas

- desenvolvimento frontend com React e Next.js;
- TypeScript aplicado a aplicações web;
- modelagem de entidades de negócio;
- organização de estado e persistência local;
- construção de dashboards e métricas;
- componentização e reutilização de interface;
- organização de arquitetura frontend;
- desenvolvimento orientado a requisitos.

## Melhorias futuras

- autenticação de usuários;
- integração com banco de dados;
- API própria;
- permissões por usuário;
- integração com WhatsApp e e-mail;
- dashboard avançado;
- exportação de relatórios;
- integração com outros sistemas.

## Status

Projeto acadêmico funcional em fase de refinamento para apresentação profissional em portfólio.
