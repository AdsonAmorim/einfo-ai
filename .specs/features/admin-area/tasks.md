# Área de Admin Separada — Tasks

**Design**: `.specs/features/admin-area/design.md`
**Status**: T1–T9 Done · T10 parcial (verificado por curl/build; roteiro no navegador pendente)

> Caminhos relativos a `apps/web/`. Comandos rodam na raiz do monorepo, salvo indicação.
> O diretório não é um repositório git hoje. Se virar, faça um commit por task com a mensagem sugerida.

---

## Execution Plan

### Phase 1: Componentes novos e limpeza do header (paralelo)

Nenhum deles muda rotas; o app continua funcionando depois de cada um.

```
T1 [P]  StoreShell
T2 [P]  NotFoundContent
T3 [P]  AdminHeader
T4 [P]  SiteHeader sem "Admin"
```

### Phase 2: Reestruturação das rotas (sequencial)

```
T1 ──→ T5 ──┬──→ T6   (precisa de T2)
            └──→ T7 ──→ T8   (T7 precisa de T3)
```

### Phase 3: Verificação

```
T4, T6, T7, T8 ──→ T9 ──→ T10
```

---

## Task Breakdown

### T1: Criar `StoreShell` [P]

**What**: Componente com o chrome da loja (`<SiteHeader />` + `<main>`), copiado do root layout atual.
**Where**: `components/store-shell.tsx` (novo)
**Depends on**: None
**Reuses**: markup de `app/layout.tsx` (`<main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">`)
**Requirement**: ADMA-05, ADMA-03

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Exporta `StoreShell({ children }: { children: React.ReactNode })`
- [ ] Server Component (sem `"use client"`)
- [ ] Ainda não é usado em nenhum lugar (o app segue igual)

**Verify**: `pnpm typecheck` → sem erros.
**Commit**: `feat(web): add StoreShell component`

---

### T2: Extrair `NotFoundContent` [P]

**What**: Mover o JSX do `Empty` "Página não encontrada" + botão "Ir para o catálogo" de `app/not-found.tsx` para um componente; `app/not-found.tsx` passa a renderizá-lo (sem mudança visual por enquanto).
**Where**: `components/not-found-content.tsx` (novo), `app/not-found.tsx` (modificar)
**Depends on**: None
**Reuses**: `components/ui/empty.tsx`, conteúdo atual de `app/not-found.tsx`
**Requirement**: ADMA-03

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `NotFoundContent()` exportado, texto idêntico ao atual
- [ ] `app/not-found.tsx` = `return <NotFoundContent />`
- [ ] `/nao-existe` renderiza igual a antes

**Verify**: `pnpm typecheck`; abrir `localhost:3000/nao-existe` → mesmo 404.
**Commit**: `refactor(web): extract NotFoundContent`

---

### T3: Criar `AdminHeader` [P]

**What**: Header do admin: marca (`CpuIcon` + "einfo.tech") → `/admin`, `Badge` "Admin", nav "Produtos" → `/admin`, "Novo produto" → `/admin/products/new`, "Ver loja" → `/`. Sem `CartBadge`.
**Where**: `components/admin/admin-header.tsx` (novo)
**Depends on**: None
**Reuses**: classes e estrutura de `components/site-header.tsx`; `components/ui/button.tsx`, `components/ui/badge.tsx`
**Requirement**: ADMA-04

**Tools**: MCP: NONE · Skill: NONE (opcional: `frontend-design` se quiser refinar o visual)

**Done when**:

- [ ] Server Component, sem props
- [ ] Não importa `CartBadge` nem nada de `lib/cart-store`
- [ ] Três links de nav com os `href` acima

**Verify**: `pnpm typecheck`; `grep -n "CartBadge\|cart-store" apps/web/components/admin/admin-header.tsx` → nenhum resultado.
**Commit**: `feat(web): add AdminHeader component`

---

### T4: Remover o link "Admin" do `SiteHeader` [P]

**What**: Apagar o `<Button asChild variant="ghost"><Link href="/admin">Admin</Link></Button>` da nav pública.
**Where**: `components/site-header.tsx` (modificar)
**Depends on**: None
**Requirement**: ADMA-01, ADMA-02

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] A nav pública tem só "Catálogo" e `CartBadge`
- [ ] `grep -rn '/admin' apps/web/components --include='*.tsx' | grep -v 'components/admin/'` → nenhum resultado

**Verify**: o grep acima; abrir `/` → sem botão "Admin".
**Commit**: `feat(web): remove admin link from public header`

---

### T5: Mover a loja para o grupo `(store)` e enxugar o root layout

**What**: Mudança estrutural única (fazer tudo junto para não haver estado intermediário com header duplicado ou ausente):
1. `mv app/page.tsx app/(store)/page.tsx`
2. `mv app/cart app/(store)/cart`
3. `mv app/products app/(store)/products`
4. Criar `app/(store)/layout.tsx` → `<StoreShell>{children}</StoreShell>` (tipagem `{ children: React.ReactNode }`)
5. `app/layout.tsx`: remover `SiteHeader` e `<main>`; `<body>` fica com `{children}` + `<Toaster />`. Manter `metadata`, fontes e `./globals.css`.

**Where**: `app/(store)/**` (novo/movido), `app/layout.tsx` (modificar)
**Depends on**: T1
**Reuses**: páginas existentes, sem editar o conteúdo
**Requirement**: ADMA-05, ADMA-06

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `app/` raiz contém só `layout.tsx`, `not-found.tsx`, `globals.css`, `favicon.ico`, `(store)/`, `admin/`, `api/`
- [ ] `app/api/**` intacto (sem diff)
- [ ] `/`, `/cart`, `/products/<slug>` respondem 200 com o header da loja
- [ ] Neste ponto o admin fica **sem header**. Isso é esperado e se resolve na T7.

**Verify**:
```bash
rm -rf apps/web/.next   # tipos de rota gerados apontam para os caminhos antigos
pnpm dev                # em outro terminal
for p in / /cart /products/<slug-do-seed>; do curl -s -o /dev/null -w "%{http_code} $p\n" localhost:3000$p; done   # → 200
```
**Commit**: `refactor(web): move storefront into (store) route group`

---

### T6: 404 da loja nos dois caminhos

**What**: `app/not-found.tsx` → `<StoreShell><NotFoundContent /></StoreShell>` (URLs sem rota renderizam só no root layout). Criar `app/(store)/not-found.tsx` → `<NotFoundContent />`.
**Where**: `app/not-found.tsx` (modificar), `app/(store)/not-found.tsx` (novo)
**Depends on**: T1, T2, T5
**Requirement**: ADMA-03

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `/nao-existe` → 404 com **um** `SiteHeader`
- [ ] `/products/slug-que-nao-existe` → 404 com **um** `SiteHeader`
- [ ] `/admin/xyz` → 404 da loja

**Verify**: `curl -s localhost:3000/nao-existe | grep -o '<header' | wc -l` → `1`; o mesmo para `/products/nao-existe`. Registrar em STATE.md › Lessons qual `not-found` capturou o `notFound()` do produto (incerteza do design).
**Commit**: `feat(web): store-scoped not-found pages`

---

### T7: Layout do admin com `noindex`

**What**: Criar `app/admin/layout.tsx` com `metadata = { title: "Admin — einfo.tech", robots: { index: false, follow: false } }` e `<AdminHeader />` + `<main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">`. Tipar com `LayoutProps<"/admin">`.
**Where**: `app/admin/layout.tsx` (novo)
**Depends on**: T3, T5
**Reuses**: `AdminHeader` (T3)
**Requirement**: ADMA-04, ADMA-07, ADMA-08

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `/admin`, `/admin/products/new`, `/admin/products/<id>/edit` mostram o `AdminHeader` e não mostram o `CartBadge`
- [ ] Nenhuma página em `app/admin/**` define `robots`
- [ ] Os títulos das páginas do admin continuam os mesmos

**Verify**:
```bash
curl -s localhost:3000/admin | grep -o '<meta name="robots"[^>]*>'          # → content="noindex, nofollow"
curl -s localhost:3000/admin/products/new | grep -o '<meta name="robots"[^>]*>'   # → idem
curl -s localhost:3000/ | grep -c 'name="robots"'                            # → 0
grep -rn "robots" apps/web/app/admin --include='page.tsx'                    # → nada
```
**Commit**: `feat(web): dedicated admin layout with noindex`

---

### T8: 404 do admin (P2)

**What**: `app/admin/not-found.tsx` com `Empty` "Produto não encontrado" + `Button` "Voltar para produtos" → `/admin`.
**Where**: `app/admin/not-found.tsx` (novo)
**Depends on**: T7
**Reuses**: `components/ui/empty.tsx`, `components/ui/button.tsx`
**Requirement**: ADMA-12

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `/admin/products/xxx/edit` → 404 com `AdminHeader` e link para `/admin`
- [ ] ADM-09 continua valendo (status 404 da página **e** da API `GET /api/products/xxx`)

**Verify**: `curl -s -o /dev/null -w "%{http_code}" localhost:3000/api/products/xxx` → `404`; abrir a página no navegador.
**Commit**: `feat(web): admin not-found page`

---

### T9: Verificação estática e de vazamento

**What**: Rodar os checks automáticos e o grep de "traços do admin" nas páginas públicas.
**Where**: — (sem mudança de código)
**Depends on**: T4, T6, T7, T8
**Requirement**: ADMA-02, ADMA-06, ADMA-11

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm build` sem erros
- [ ] O loop abaixo imprime `0` para todas as rotas
- [ ] `grep -rln "components/admin" apps/web/app/'(store)' apps/web/components --include='*.tsx' | grep -v 'components/admin/'` → nada (nenhum módulo da loja importa admin)

**Verify**:
```bash
pnpm typecheck && pnpm lint && pnpm build && pnpm start   # start em outro terminal
for p in / "/?category=<slug-categoria>" /cart /products/<slug-do-seed> /nao-existe; do
  echo "$p: $(curl -s "localhost:3000$p" | grep -Eo 'href="/admin|>Admin<' | wc -l)"
done   # → todas 0
```

---

### T10: Regressão manual (catálogo, carrinho, admin)

**What**: Rodar os roteiros de verificação de `catalog`, `cart` e `admin-products` e o fluxo de ida e volta loja ↔ admin.
**Where**: — (navegador)
**Depends on**: T9
**Requirement**: ADMA-04, ADMA-05, ADMA-09, ADMA-10

**Tools**: MCP: NONE · Skill: `agent-browser` ou `qa-flow` (opcional, para roteiro e gravação)

**Done when**:

- [ ] CAT-01..09 passam (filtro, busca, detalhe, 404 de slug)
- [ ] CART-01..15 passam. Com itens no carrinho: ir em `/admin`, voltar com "Ver loja" e conferir que o carrinho segue intacto.
- [ ] ADM-01..11 passam: criar (toast + volta para `/admin` com `AdminHeader`), 409 de slug, editar, excluir com Dialog + toast
- [ ] Em nenhuma página da loja aparece "Admin"; em nenhuma página do admin aparece o `CartBadge`
- [ ] Spec: status ADMA-01..12 → Verified; ROADMAP: feature → COMPLETE

**Verify**: checklist acima marcado; atualizar `spec.md` (Traceability) e `ROADMAP.md`.

---

## Parallel Execution Map

```
Phase 1 (paralelo):  T1 [P]   T2 [P]   T3 [P]   T4 [P]
Phase 2:             T1 ──→ T5 ──┬──→ T6 (+T2)
                                 └──→ T7 (+T3) ──→ T8
Phase 3:             T4,T6,T7,T8 ──→ T9 ──→ T10
```

## Task Granularity Check

| Task | Scope | Status |
| --- | --- | --- |
| T1 StoreShell | 1 componente | ✅ |
| T2 NotFoundContent | 1 componente + 1 linha no consumidor | ✅ |
| T3 AdminHeader | 1 componente | ✅ |
| T4 SiteHeader | 1 remoção | ✅ |
| T5 Mover loja + root layout | 3 moves + 1 layout + 1 edição | ⚠️ Coeso de propósito: separar deixaria o app com header duplicado ou sem header entre commits |
| T6 not-found da loja | 2 arquivos pequenos e acoplados | ✅ |
| T7 Layout do admin | 1 arquivo | ✅ |
| T8 404 do admin | 1 arquivo | ✅ |
| T9/T10 Verificação | sem código | ✅ |

## Requirement Coverage

| Requirement | Tasks |
| --- | --- |
| ADMA-01 | T4, T9 |
| ADMA-02 | T4, T9 |
| ADMA-03 | T1, T2, T6 |
| ADMA-04 | T3, T7, T10 |
| ADMA-05 | T1, T5, T10 |
| ADMA-06 | T5, T9 |
| ADMA-07 | T7 |
| ADMA-08 | T7 |
| ADMA-09 | T10 |
| ADMA-10 | T10 |
| ADMA-11 | T9 |
| ADMA-12 | T8 |

**Antes de executar:** confirmar com o usuário quais MCPs/skills usar em cada task (padrão sugerido acima: nenhum, exceto `agent-browser`/`qa-flow` opcionais na T10).
