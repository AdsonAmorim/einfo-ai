# State

## Decisions

| ID   | Decisão                                                                                       | Motivo                                                                  |
| ---- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| D-01 | Carrinho persistido em localStorage (Zustand `persist`, key `einfo-cart`)                      | Escolha do usuário: edição local, sem sessão/servidor                   |
| D-02 | Prisma 7.10.1 + `@prisma/adapter-better-sqlite3` (SQLite em `packages/db/prisma/dev.db`)        | Escolha do usuário; `latest` no npm é 8.0.0-rc → fixado na estável 7.x  |
| D-03 | pnpm workspaces simples: `apps/web`, `packages/db`, `packages/validators`                      | Escolha do usuário (sem Turborepo)                                      |
| D-04 | Formulários RHF + Zod: edição de item do carrinho e CRUD do admin                              | Escolha do usuário                                                      |
| D-05 | Schemas Zod em `@einfo/validators`, usados no client (zodResolver) e nos Route Handlers         | Uma única fonte de verdade para validação                               |
| D-06 | Preços armazenados em centavos (`priceCents Int`)                                              | Evita erros de ponto flutuante                                          |
| D-07 | App roda em porta fixa 3000 (`next dev -p 3000`)                                               | Previsibilidade                                                          |
| D-08 | Leituras em Server Components usam Prisma direto; mutações do admin passam pela API REST       | API é o contrato público; RSC evita round-trip HTTP desnecessário        |
| D-09 | Admin separado da loja: root layout mínimo + `app/(store)/layout.tsx` (loja) + `app/admin/layout.tsx` (admin, `robots: noindex, nofollow`). Nenhum link loja → admin; o link admin → loja é permitido | Pedido do usuário ("funções de admin visíveis só para quem acessar /admin"). Um só root layout evita full reload entre áreas e o `global-not-found` experimental |
| D-10 | Sem `robots.txt` `Disallow: /admin`; o `noindex` vai só por metadata | O `Disallow` publicaria o caminho que a feature quer esconder |
| D-11 | `/admin` é **escondido, não protegido** (risco R-01): a API de mutação segue aberta até a autenticação do M2 | Autenticação fora de escopo no M1; o app roda só local |

## Blockers

_Nenhum._

## Risks

- **R-01** (`admin-area`): `/admin` e `POST/PATCH/DELETE /api/products` acessíveis a qualquer um que saiba a URL. Mitigação: só rodar localmente; resolver com a autenticação do admin no M2. Não publicar antes disso.

## Lessons

- Next 16 com `cacheComponents`: consultas do better-sqlite3 (síncrono) rodariam no prerender; toda leitura em `lib/queries.ts` chama `await connection()` e os componentes ficam em `<Suspense>`.
- Zod 4: `.partial()` aplica `.default()` em campos omitidos — o `productUpdateSchema` é derivado sem defaults para o PATCH não sobrescrever `description`.
- `npm view prisma` aponta `latest` para 8.0.0-rc; o adapter `@prisma/adapter-better-sqlite3@7.10.1` depende de `better-sqlite3@12` (versão alinhada).
- React Compiler ativo: usar `useWatch` em vez de `form.watch` e não ler refs durante o render.
- `admin-area` / not-found (incerteza da T6): `notFound()` em `(store)/products/[slug]` é capturado pelo `app/(store)/not-found.tsx` (o payload RSC registra `(store)/not-found.tsx` como boundary do segmento), renderizado dentro do layout da loja → um só `SiteHeader`. URLs sem rota (`/nao-existe`, `/admin/xyz`) caem no `app/not-found.tsx` raiz (status 404, um `SiteHeader` via `StoreShell`). `notFound()` em `/admin/products/[id]/edit` → boundary `admin/not-found.tsx`. Como o `notFound()` dessas páginas roda dentro de `<Suspense>`, o status HTTP é 200 (streaming já começou; o Next envia `noindex` + `$RX` e o cliente renderiza o 404) — comportamento pré-existente, não introduzido pela feature.
- Mover páginas de lugar deixa `.next/types/validator.ts` apontando para os caminhos antigos e quebra o `tsc`; rodar `next typegen` (em `apps/web`) regenera sem mexer no dev server.

## Todos

- [x] M1: executar `features/admin-area` (tasks T1..T10)
- [ ] M1: roteiro no navegador de `admin-area` (ADMA-09 toasts/Dialog/redirect, ADMA-10 carrinho loja ↔ admin, ADMA-12 UI do 404 do admin) → então ROADMAP COMPLETE
- [ ] M2: autenticação do admin (fecha R-01)

## Deferred Ideas

- Carrinho no servidor com cookie anônimo
- Formulário de filtros com faixa de preço

## Preferences

_—_
