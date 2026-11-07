# Catálogo Specification

## Problem Statement

O visitante precisa encontrar rapidamente peças e periféricos e entender preço e disponibilidade antes de adicionar ao carrinho.

## Goals

- [ ] Listar todos os produtos com nome, categoria, preço (BRL) e estado de estoque
- [ ] Filtrar por categoria e buscar por nome via URL (compartilhável)

## Out of Scope

| Feature                     | Reason                  |
| --------------------------- | ----------------------- |
| Paginação                   | Catálogo pequeno no v1  |
| Ordenação / faixa de preço  | Adiado para M2/Future   |
| Avaliações de produtos      | Fora do MVP             |

---

## User Stories

### P1: Navegar pelo catálogo ⭐ MVP

**User Story**: Como visitante, quero ver os produtos disponíveis para escolher o que comprar.

**Acceptance Criteria**:

1. WHEN o visitante acessa `/` THEN o sistema SHALL exibir um grid com todos os produtos (nome, categoria, preço formatado em BRL, estoque) — **CAT-01**
2. WHEN um produto tem `stock = 0` THEN o card SHALL exibir o badge "Esgotado" e o botão de adicionar desabilitado — **CAT-02**
3. WHEN `GET /api/products` é chamado THEN a API SHALL retornar `200` com a lista de produtos incluindo a categoria — **CAT-03**

**Independent Test**: Abrir `/` com o seed e ver ~20 cards; `curl /api/products` retorna JSON.

---

### P1: Filtrar e buscar ⭐ MVP

**User Story**: Como visitante, quero filtrar por categoria e buscar por nome para achar um item específico.

**Acceptance Criteria**:

1. WHEN o visitante escolhe uma categoria THEN a URL SHALL refletir `?category=<slug>` e o grid SHALL mostrar apenas produtos daquela categoria — **CAT-04**
2. WHEN o visitante busca um termo THEN a URL SHALL refletir `?q=<termo>` e o grid SHALL mostrar produtos cujo nome contém o termo — **CAT-05**
3. WHEN nenhum produto corresponde THEN o sistema SHALL exibir um estado vazio com ação para limpar filtros — **CAT-06**
4. WHEN `GET /api/products?ids=a,b` é chamado THEN a API SHALL retornar apenas os produtos existentes daqueles ids — **CAT-07**

**Independent Test**: `/?category=perifericos` mostra só periféricos; `/?q=ryzen` mostra só Ryzen.

---

### P1: Detalhe do produto ⭐ MVP

**User Story**: Como visitante, quero ver detalhes de um produto antes de adicioná-lo.

**Acceptance Criteria**:

1. WHEN o visitante acessa `/products/<slug>` THEN o sistema SHALL exibir nome, descrição, preço, estoque e botão "Adicionar ao carrinho" — **CAT-08**
2. WHEN o slug não existe THEN o sistema SHALL renderizar a página 404 — **CAT-09**

**Independent Test**: Clicar num card abre o detalhe; `/products/nao-existe` mostra 404.

---

## Edge Cases

- WHEN `category` informado não existe THEN o grid SHALL mostrar o estado vazio (CAT-06)
- WHEN `q` tem só espaços THEN o sistema SHALL ignorar o filtro
- WHEN `imageUrl` é nulo THEN o card SHALL exibir um ícone de fallback da categoria

---

## Requirement Traceability

| Requirement ID | Story                  | Phase   | Status   |
| -------------- | ---------------------- | ------- | -------- |
| CAT-01         | P1: Navegar            | Execute | Verified |
| CAT-02         | P1: Navegar            | Execute | Verified |
| CAT-03         | P1: Navegar            | Execute | Verified |
| CAT-04         | P1: Filtrar e buscar   | Execute | Verified |
| CAT-05         | P1: Filtrar e buscar   | Execute | Verified |
| CAT-06         | P1: Filtrar e buscar   | Execute | Verified |
| CAT-07         | P1: Filtrar e buscar   | Execute | Verified |
| CAT-08         | P1: Detalhe            | Execute | Verified |
| CAT-09         | P1: Detalhe            | Execute | Verified |

**Coverage:** 9 total, 9 mapeados para Execute, 0 unmapped

---

## Success Criteria

- [ ] Visitante encontra um produto específico em ≤ 2 interações (filtro ou busca)
- [ ] Zero erros de console na navegação do catálogo
