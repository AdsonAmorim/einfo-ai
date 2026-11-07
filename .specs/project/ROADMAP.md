# Roadmap

**Current Milestone:** M1 — MVP local
**Status:** In Progress (feature `admin-area` implementada; falta o roteiro no navegador de ADMA-09/10/12)

---

## M1 — MVP local

**Goal:** Usuário navega pelo catálogo, monta e edita um carrinho; operador gerencia produtos pelo admin. Tudo rodando em `localhost:3000`.
**Target:** Todos os requisitos P1 de `catalog`, `cart`, `admin-products` e `admin-area` verificados.

### Features

**Catálogo** (`features/catalog`) - COMPLETE

- Listagem em grid com preço, categoria e estoque
- Filtro por categoria e busca por nome
- Página de detalhe por slug

**Carrinho** (`features/cart`) - COMPLETE

- Adicionar produto a partir do catálogo/detalhe
- Editar quantidade com validação (1..estoque), remover, limpar
- Persistência em localStorage + revalidação contra a API

**Admin de produtos** (`features/admin-products`) - COMPLETE

- Tabela de produtos
- Criar/editar com formulário validado (RHF + Zod)
- Excluir com confirmação

**Área de admin separada** (`features/admin-area`) - IMPLEMENTED (9/12 requisitos Verified; ADMA-09, 10 e 12 aguardam verificação no navegador)

- Remover o link "Admin" e qualquer traço do admin da loja pública (acesso só digitando `/admin`)
- Layout próprio para `/admin/**` (header de admin, sem carrinho), loja movida para o route group `(store)`
- `noindex, nofollow` no admin; URLs e API inalteradas; sem autenticação (risco R-01, resolvido no M2)

---

## M2 — Conta e checkout simulado

**Goal:** Fluxo completo de pedido sem pagamento real.

### Features

**Autenticação do admin** - PLANNED (fecha o risco R-01 de `admin-area`: proteger `/admin/**` e as mutações de `/api/products`)
**Checkout simulado (dados do cliente + resumo do pedido)** - PLANNED
**Carrinho sincronizado no servidor (SQLite)** - PLANNED

---

## Future Considerations

- Busca avançada (faixa de preço, ordenação, marcas)
- Upload de imagens
- Testes E2E (Playwright)
- Paginação do catálogo
