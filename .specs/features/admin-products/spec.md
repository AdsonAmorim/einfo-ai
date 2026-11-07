# Admin de Produtos Specification

## Problem Statement

O operador da loja precisa manter o catálogo (cadastrar, corrigir preço/estoque, remover itens) sem mexer no banco diretamente.

## Goals

- [ ] CRUD completo de produtos pela UI em `/admin`
- [ ] Mesma validação no formulário e na API (schemas compartilhados)

## Out of Scope

| Feature                   | Reason                         |
| ------------------------- | ------------------------------ |
| Autenticação do admin     | Planejado para M2              |
| CRUD de categorias        | Categorias fixas via seed      |
| Upload de imagem          | Apenas URL opcional            |

---

## User Stories

### P1: Listar produtos ⭐ MVP

**User Story**: Como operador, quero ver todos os produtos em uma tabela para gerenciá-los.

**Acceptance Criteria**:

1. WHEN o operador acessa `/admin` THEN o sistema SHALL exibir uma tabela com nome, categoria, preço, estoque e ações (editar/excluir) — **ADM-01**

---

### P1: Criar produto ⭐ MVP

**User Story**: Como operador, quero cadastrar um produto novo.

**Acceptance Criteria**:

1. WHEN o operador preenche o formulário válido e envia THEN o sistema SHALL chamar `POST /api/products`, mostrar toast de sucesso e voltar para `/admin` — **ADM-02**
2. WHEN campos são inválidos (nome < 2, slug fora do padrão `a-z0-9-`, preço ≤ 0, estoque negativo/decimal, categoria vazia, URL inválida) THEN o formulário SHALL exibir erros por campo em pt-BR sem enviar — **ADM-03**
3. WHEN o operador digita o nome e o slug não foi editado manualmente THEN o slug SHALL ser gerado automaticamente — **ADM-04**
4. WHEN a API recebe payload inválido THEN SHALL responder `400` com os erros por campo — **ADM-05**
5. WHEN o slug já existe THEN a API SHALL responder `409` e o formulário SHALL mostrar o erro no campo slug — **ADM-06**

---

### P1: Editar produto ⭐ MVP

**User Story**: Como operador, quero corrigir dados de um produto.

**Acceptance Criteria**:

1. WHEN o operador acessa `/admin/products/<id>/edit` THEN o formulário SHALL vir preenchido — **ADM-07**
2. WHEN envia alterações válidas THEN o sistema SHALL chamar `PATCH /api/products/<id>` e refletir no catálogo — **ADM-08**
3. WHEN o id não existe THEN a página SHALL renderizar 404 e a API SHALL responder `404` — **ADM-09**

---

### P1: Excluir produto ⭐ MVP

**User Story**: Como operador, quero remover produtos descontinuados.

**Acceptance Criteria**:

1. WHEN o operador clica "Excluir" THEN um Dialog de confirmação SHALL aparecer — **ADM-10**
2. WHEN confirma THEN o sistema SHALL chamar `DELETE /api/products/<id>`, remover da tabela e mostrar toast — **ADM-11**

---

## Edge Cases

- WHEN o preço é digitado com vírgula ("1.299,90" ou "1299,90") THEN o sistema SHALL interpretar corretamente em centavos
- WHEN a API retorna erro inesperado THEN o formulário SHALL mostrar toast de erro e manter os dados digitados
- WHEN `categoryId` não existe THEN a API SHALL responder `400`

---

## Requirement Traceability

| Requirement ID | Story        | Phase | Status  |
| -------------- | ------------ | ----- | ------- |
| ADM-01         | P1: Listar   | Tasks | Verified |
| ADM-02..06     | P1: Criar    | Tasks | Verified |
| ADM-07..09     | P1: Editar   | Tasks | Verified |
| ADM-10..11     | P1: Excluir  | Tasks | Verified |

**Coverage:** 11 total, 11 mapeados para tasks, 0 unmapped

---

## Success Criteria

- [ ] Operador cadastra um produto em < 1 minuto
- [ ] Nenhum payload inválido chega ao banco
