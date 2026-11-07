# Área de Admin Separada (`/admin`) Specification

## Problem Statement

Hoje o admin compartilha o layout da loja: o header público (`components/site-header.tsx`) tem um botão "Admin" que leva qualquer visitante ao CRUD de produtos, e as páginas do admin exibem o catálogo e o carrinho no topo. O usuário pediu: _"separar o admin para a rota /admin. a ideia é que as funções de admin não fiquem visíveis para qualquer pessoa, somente quem acessar /admin"_. A loja pública não deve oferecer nenhum caminho até o admin, e o admin deve ser uma área à parte, com navegação própria.

## Goals

- [ ] Zero pontos de entrada para o admin na loja pública: o HTML de `/`, `/cart`, `/products/<slug>` e da página 404 não contém nenhum `href="/admin…"` nem texto "Admin".
- [ ] `/admin/**` usa layout próprio (header de admin, sem `CartBadge`/link de catálogo da loja) e envia `noindex, nofollow`.
- [ ] Nenhuma regressão em CAT-01..09, CART-01..15 e ADM-01..11. URLs e API ficam iguais.

## Out of Scope

| Feature | Reason |
| --- | --- |
| Autenticação/autorização do admin (login, sessão, `proxy`/middleware, senha, Basic Auth) | Planejado para M2 ("Autenticação do admin"). Esta feature **esconde** a rota, não a **protege**. |
| Proteger as rotas de API (`POST/PATCH/DELETE /api/products…`) | API não muda nesta feature; continua aberta, como hoje. Coberto pela autenticação do M2. |
| Mudar a URL base do admin (ex.: caminho secreto/aleatório) | O usuário pediu explicitamente `/admin`. |
| `robots.txt` com `Disallow: /admin` | Publicaria o caminho do admin para qualquer um que lesse o `robots.txt`; o `noindex` por metadata basta (ver ADMA-07). |
| Novas funções de admin (CRUD de categorias, dashboard, etc.) | Feature é só reorganização de rotas/layout. |
| Mudanças visuais na loja além de remover o link "Admin" | Fora do pedido. |

## Risco registrado

**R-01 — Segurança por obscuridade.** Depois desta feature, `/admin` continua acessível a quem souber (ou chutar) a URL, e a API de mutação continua aberta (`curl -X DELETE /api/products/<id>` funciona sem credencial). O caminho `/admin` é óbvio e comum. Aceitável só porque o app roda somente local (PROJECT.md › Constraints). **Não publicar o app antes da autenticação do M2.**

---

## User Stories

### P1: Loja pública sem traços do admin ⭐ MVP

**User Story**: Como dono da loja, quero que visitantes não vejam nenhum link ou função de admin, para que só quem digitar `/admin` chegue lá.

**Why P1**: É o pedido central do usuário.

**Acceptance Criteria**:

1. WHEN um visitante abre qualquer página da loja (`/`, `/?category=…`, `/?q=…`, `/cart`, `/products/<slug>`) THEN o header público SHALL exibir só a marca, "Catálogo" e o `CartBadge`, sem link/botão "Admin" — **ADMA-01**
2. WHEN o HTML de qualquer página da loja (inclusive a 404) é renderizado THEN ele SHALL conter zero `href` que comece com `/admin` e zero rótulos visíveis "Admin" — **ADMA-02**
3. WHEN um produto não existe em `/products/<slug>` ou uma URL não corresponde a nenhuma rota THEN a página 404 SHALL usar o layout da loja e oferecer só "Ir para o catálogo" (nenhuma menção ao admin) — **ADMA-03**

**Independent Test**: `curl -s localhost:3000/ | grep -c '/admin'` → `0`; o mesmo para `/cart`, `/products/<slug-do-seed>` e `/rota-inexistente`.

---

### P1: Admin como área separada com layout próprio ⭐ MVP

**User Story**: Como operador, quero que `/admin` seja uma área à parte, com navegação de admin, sem o carrinho e o catálogo da loja.

**Why P1**: É a outra metade do pedido ("separar o admin para a rota /admin").

**Acceptance Criteria**:

1. WHEN o operador acessa `/admin`, `/admin/products/new` ou `/admin/products/<id>/edit` THEN o sistema SHALL renderizar o layout do admin (header com marca + selo "Admin", nav "Produtos" → `/admin`, "Novo produto" → `/admin/products/new` e "Ver loja" → `/`) e SHALL NOT renderizar o `SiteHeader` público nem o `CartBadge` — **ADMA-04**
2. WHEN o operador está em qualquer página da loja THEN o sistema SHALL renderizar o layout da loja (`SiteHeader` + `CartBadge`) e SHALL NOT renderizar o header do admin — **ADMA-05**
3. WHEN a reorganização é feita THEN todas as URLs existentes SHALL continuar iguais (`/`, `/cart`, `/products/[slug]`, `/admin`, `/admin/products/new`, `/admin/products/[id]/edit`, `/api/**`) e os Route Handlers em `app/api/**` SHALL NOT mudar — **ADMA-06**

**Independent Test**: abrir `/admin` → header do admin, sem badge do carrinho; clicar "Ver loja" → header público, sem link de admin.

---

### P1: Admin fora dos buscadores ⭐ MVP

**User Story**: Como dono da loja, quero que as páginas do admin não sejam indexadas, para que não apareçam em resultados de busca.

**Why P1**: Barato e complementa o "esconder".

**Acceptance Criteria**:

1. WHEN qualquer página sob `/admin` é renderizada THEN o `<head>` SHALL conter `<meta name="robots" content="noindex, nofollow">` — **ADMA-07**
2. WHEN qualquer página da loja é renderizada THEN ela SHALL NOT conter `noindex` (salvo a 404, onde o Next o injeta) — **ADMA-08**

**Independent Test**: `curl -s localhost:3000/admin | grep -o '<meta name="robots"[^>]*>'` → `noindex, nofollow`; para `/` → nenhum resultado.

---

### P1: Sem regressões ⭐ MVP

**User Story**: Como operador e como cliente, quero que tudo que já funcionava continue funcionando.

**Why P1**: A feature é um refactor estrutural; regressão anularia o ganho.

**Acceptance Criteria**:

1. WHEN o fluxo do admin é exercitado (listar, criar com validação e auto-slug, 409 de slug, editar, 404 de id inexistente, excluir com Dialog) THEN ADM-01..11 SHALL continuar passando, incluindo os toasts (o `Toaster` precisa estar disponível nas duas áreas) — **ADMA-09**
2. WHEN o catálogo e o carrinho são exercitados THEN CAT-01..09 e CART-01..15 SHALL continuar passando, incluindo a persistência do carrinho em localStorage ao ir e voltar entre loja e admin — **ADMA-10**
3. WHEN `pnpm typecheck`, `pnpm lint` e `pnpm build` rodam THEN SHALL terminar sem erros — **ADMA-11**

**Independent Test**: roteiro manual das specs `catalog`, `cart` e `admin-products` + os três comandos.

---

### P2: 404 dentro do admin com contexto de admin

**User Story**: Como operador, quero que um produto inexistente no admin mostre um 404 que me leve de volta à lista do admin, não ao catálogo.

**Why P2**: Melhora a navegação, mas o 404 genérico já atende ADM-09.

**Acceptance Criteria**:

1. WHEN `/admin/products/<id-inexistente>/edit` é acessado THEN o sistema SHALL responder com a UI de 404 dentro do layout do admin, com ação "Voltar para produtos" → `/admin` — **ADMA-12**

**Independent Test**: abrir `/admin/products/xxx/edit` → 404 com header do admin e botão para `/admin`.

---

## Edge Cases

- WHEN uma URL inexistente sob `/admin` é acessada (ex.: `/admin/xyz`) THEN o sistema SHALL renderizar o 404 da loja (ADMA-03). Não precisa de tratamento especial: isso não revela nada além do que a URL digitada já diz.
- WHEN o operador sai do admin pelo "Ver loja" e volta digitando `/admin` THEN o carrinho SHALL continuar intacto (mesmo localStorage `einfo-cart`).
- WHEN o admin salva/exclui e redireciona (`router.push("/admin")`, `router.refresh()`) THEN o redirecionamento SHALL continuar dentro do layout do admin, e o toast SHALL aparecer.
- WHEN a tabela do admin linka o nome do produto para `/products/<slug>` THEN o link SHALL continuar funcionando (o link admin → loja é permitido; a proibição vale só no sentido loja → admin).
- WHEN alguém inspeciona os bundles JS da loja THEN componentes de `components/admin/**` SHALL NOT ser importados por nenhum módulo da loja (o code splitting por rota do Next os mantém fora). Strings em manifests internos do Next ficam fora do escopo de verificação (ver R-01).

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| ADMA-01 | P1: Loja sem traços do admin | Execute | Verified |
| ADMA-02 | P1: Loja sem traços do admin | Execute | Verified |
| ADMA-03 | P1: Loja sem traços do admin | Execute | Verified |
| ADMA-04 | P1: Admin com layout próprio | Execute | Verified |
| ADMA-05 | P1: Admin com layout próprio | Execute | Verified |
| ADMA-06 | P1: Admin com layout próprio | Execute | Verified |
| ADMA-07 | P1: Admin fora dos buscadores | Execute | Verified |
| ADMA-08 | P1: Admin fora dos buscadores | Execute | Verified |
| ADMA-09 | P1: Sem regressões | Execute | Implemented — parcial: API (400/201/409/200/204/404) e render das páginas OK via curl; toasts, Dialog e redirect não exercitados (sem navegador) |
| ADMA-10 | P1: Sem regressões | Execute | Implemented — parcial: páginas do catálogo/carrinho renderizam com header da loja; persistência do carrinho (localStorage) e navegação loja ↔ admin não exercitadas (sem navegador) |
| ADMA-11 | P1: Sem regressões | Execute | Verified |
| ADMA-12 | P2: 404 do admin | Execute | Implemented — parcial: `admin/not-found.tsx` registrado como boundary no payload RSC e página com AdminHeader; a UI final é renderizada no cliente (notFound() dentro de Suspense) e não foi observada (sem navegador) |

**Coverage:** 12 total, 12 mapeados para tasks, 0 unmapped · 9 Verified, 3 com verificação parcial (pendente roteiro no navegador)

---

## Success Criteria

- [ ] `grep -c '/admin'` no HTML de `/`, `/cart`, `/products/<slug>` e `/nao-existe` retorna `0` em todos.
- [ ] `/admin` mostra o header do admin, sem carrinho, com `noindex, nofollow`.
- [ ] Roteiros de verificação de `catalog`, `cart` e `admin-products` passam sem mudança.
