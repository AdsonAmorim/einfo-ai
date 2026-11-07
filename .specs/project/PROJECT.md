# einfo — Mini Loja Tech

**Vision:** Uma loja online enxuta de produtos de tecnologia (peças de computador, periféricos e monitores) rodando 100% local, com catálogo navegável e carrinho editável.
**For:** Desenvolvedores/estudantes que precisam de uma base de e-commerce simples e bem estruturada para evoluir.
**Solves:** Falta de um ponto de partida limpo (monorepo, API, validação compartilhada, UI consistente) para experimentos de e-commerce sem a complexidade de pagamentos e infraestrutura.

## Goals

- Catálogo navegável com filtro por categoria e busca, respondendo em < 200ms localmente.
- Carrinho editável (adicionar, alterar quantidade, remover) que persiste após recarregar a página.
- Admin capaz de criar/editar/excluir produtos com validação idêntica no client e no servidor (schemas Zod compartilhados).

## Tech Stack

**Core:**

- Framework: Next.js 16 (App Router, Route Handlers)
- Language: TypeScript 5
- Database: SQLite (via Prisma 7 + driver adapter better-sqlite3)
- Monorepo: pnpm workspaces

**Key dependencies:** shadcn/ui (Tailwind v4), react-hook-form, Zod 4, Zustand (persist), sonner

## Scope

**v1 includes:**

- Catálogo de produtos (listagem, filtro por categoria, busca, página de detalhe)
- Carrinho local (localStorage) com edição de quantidade validada e revalidação contra a API
- Admin de produtos (CRUD) sem autenticação
- API REST via Route Handlers (`/api/products`, `/api/categories`)
- Seed com categorias e ~20 produtos

**Explicitly out of scope:**

- Pagamentos e checkout real
- Autenticação/autorização (inclusive no admin)
- Upload de imagens (apenas URL opcional)
- Deploy / ambientes remotos
- Pedidos, histórico, frete, cupons

## Constraints

- Technical: roda somente local (`localhost:3000`), banco SQLite em arquivo.
- Resources: projeto de estudo, sem testes E2E automatizados no v1 (verificação manual guiada pelas specs).
