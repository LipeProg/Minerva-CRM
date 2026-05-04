# Minerva CRM

Minerva CRM é um sistema web de CRM para pequenos negócios acompanharem clientes, leads, oportunidades, tarefas de follow-up e histórico de interações comerciais.

O projeto foi criado como uma aplicação de portfólio profissional, com foco em regras de negócio reais, interface limpa e estrutura preparada para uma futura integração com backend ou API.

## Problema que resolve

Pequenos negócios costumam perder oportunidades por falta de organização no relacionamento comercial: contatos ficam espalhados, negociações não têm etapa clara, follow-ups atrasam e os indicadores de venda não aparecem de forma simples.

O Minerva CRM centraliza essas informações em um fluxo único para ajudar equipes comerciais a:

- organizar clientes e contatos;
- acompanhar leads por etapa do funil;
- registrar interações comerciais;
- lembrar tarefas de follow-up;
- visualizar métricas básicas de vendas;
- tomar decisões com dados simples.

## Funcionalidades

- Dashboard com clientes, leads, oportunidades, conversão, valores em negociação e tarefas próximas.
- Cadastro, edição, remoção, busca e filtro de clientes.
- Gestão de leads com etapa do funil, valor estimado, responsável e atualização de estágio.
- Funil de vendas em Kanban com contadores e soma por coluna.
- Tarefas de follow-up com prioridade, status, vencimento e destaque de atrasadas.
- Histórico de interações por tipo, responsável, próximo passo e relacionamento com cliente ou lead.
- Relatórios com distribuição por etapa, origem, status de clientes e indicadores financeiros.
- Persistência inicial em LocalStorage, sem necessidade de backend.

## Tecnologias

- TypeScript
- Next.js com App Router
- React
- Tailwind CSS
- Componentes reutilizáveis
- Dados mockados realistas
- LocalStorage para persistência local

## Como rodar

Instale as dependências:

```bash
npm install
```

Rode o ambiente de desenvolvimento:

```bash
npm run dev
```

Acesse:

```bash
http://localhost:3000
```

Para gerar a build de produção:

```bash
npm run build
```

## Estrutura

```txt
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

## Melhorias futuras

- Autenticação de usuários.
- Integração com banco de dados.
- API própria com Node.js ou NestJS.
- Integração com WhatsApp.
- Envio de e-mails.
- Permissões por usuário.
- Dashboard avançado com gráficos reais.
- Exportação de relatórios em PDF.
- Integração com PDV.
