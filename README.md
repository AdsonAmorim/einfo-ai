# einfo.tech — mini loja tech

Monorepo (pnpm workspaces) com Next.js 16, SQLite (Prisma 7), shadcn/ui, react-hook-form e Zod.

```
apps/web             Next.js (App Router + Route Handlers em app/api)
packages/db          @einfo/db — schema Prisma, client e seed (SQLite em prisma/dev.db)
packages/validators  @einfo/validators — schemas Zod compartilhados (client + API)
.specs/              documentação spec-driven (projeto, roadmap, specs por feature)
```

## Rodando

```bash
pnpm setup   # install + db push + seed
pnpm dev     # http://localhost:3000
```

Outros scripts: `pnpm db:seed` (restaura os dados), `pnpm build`, `pnpm lint`, `pnpm typecheck`.

## API

| Método | Rota                    | Descrição                                   |
| ------ | ----------------------- | ------------------------------------------- |
| GET    | `/api/products`         | Lista; filtros `?q=`, `?category=`, `?ids=` |
| POST   | `/api/products`         | Cria (400 inválido, 409 slug duplicado)     |
| GET    | `/api/products/:id`     | Detalhe (404)                               |
| PATCH  | `/api/products/:id`     | Atualiza parcialmente                       |
| DELETE | `/api/products/:id`     | Remove (204)                                |
| GET    | `/api/categories`       | Lista categorias                            |

O carrinho fica no `localStorage` (`einfo-cart`) e é revalidado contra `/api/products?ids=` ao abrir `/cart`. Não há pagamento nem autenticação (o `/admin` é aberto).
