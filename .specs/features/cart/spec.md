# Carrinho Specification

## Problem Statement

O visitante precisa juntar itens, ajustar quantidades e ver o total do pedido. Não há pagamento: o carrinho é editado e mantido apenas no navegador.

## Goals

- [ ] Montar e editar um carrinho sem perder dados ao recarregar a página
- [ ] Nunca permitir quantidade maior que o estoque ou menor que 1

## Out of Scope

| Feature                         | Reason                                  |
| ------------------------------- | --------------------------------------- |
| Pagamento / checkout            | Fora do escopo do projeto               |
| Carrinho no servidor / multi-device | Decisão D-01 (localStorage)         |
| Reserva de estoque              | Sem pedidos no v1                       |

---

## User Stories

### P1: Adicionar ao carrinho ⭐ MVP

**User Story**: Como visitante, quero adicionar produtos ao carrinho para comprá-los depois.

**Acceptance Criteria**:

1. WHEN o visitante clica "Adicionar ao carrinho" THEN o sistema SHALL incluir o item com qty 1 (ou somar +1 se já existir) e mostrar um toast — **CART-01**
2. WHEN o item já está com qty = estoque THEN o sistema SHALL não incrementar e SHALL avisar "Estoque máximo atingido" — **CART-02**
3. WHEN o carrinho muda THEN o badge do header SHALL mostrar a soma das quantidades — **CART-03**

**Independent Test**: Adicionar 2 produtos a partir do catálogo e ver o badge = 2.

---

### P1: Editar o carrinho ⭐ MVP

**User Story**: Como visitante, quero alterar quantidades e remover itens para ajustar meu pedido.

**Acceptance Criteria**:

1. WHEN o visitante digita uma quantidade e confirma THEN o formulário (RHF + Zod) SHALL validar inteiro entre 1 e o estoque e atualizar o item — **CART-04**
2. WHEN a quantidade é inválida (0, negativa, decimal, > estoque, vazia) THEN o formulário SHALL exibir mensagem de erro em pt-BR e NÃO SHALL alterar o carrinho — **CART-05**
3. WHEN o visitante usa os botões −/+ THEN a quantidade SHALL mudar respeitando 1..estoque — **CART-06**
4. WHEN o visitante clica "Remover" THEN o item SHALL sair do carrinho — **CART-07**
5. WHEN o visitante clica "Limpar carrinho" THEN todos os itens SHALL ser removidos — **CART-08**
6. WHEN há itens THEN a página `/cart` SHALL exibir subtotal por item, total de itens e total geral em BRL — **CART-09**

**Independent Test**: Em `/cart`, digitar 999 num item com estoque 5 mostra erro; digitar 3 atualiza o total.

---

### P1: Persistência e consistência ⭐ MVP

**User Story**: Como visitante, quero que meu carrinho continue lá ao voltar e reflita preços/estoques atuais.

**Acceptance Criteria**:

1. WHEN a página é recarregada THEN o carrinho SHALL ser restaurado do localStorage — **CART-10**
2. WHEN `/cart` é aberto THEN o sistema SHALL consultar `GET /api/products?ids=` e atualizar preço/estoque dos itens — **CART-11**
3. WHEN um produto do carrinho foi excluído THEN ele SHALL ser removido e um toast SHALL informar — **CART-12**
4. WHEN o estoque atual é menor que a qty THEN a qty SHALL ser reduzida ao estoque (removido se 0) com aviso — **CART-13**

**Independent Test**: Adicionar item, excluí-lo pelo admin, abrir `/cart` → item removido com toast.

---

### P2: Resumo sem pagamento

**User Story**: Como visitante, quero ver claramente que o pagamento não está disponível.

**Acceptance Criteria**:

1. WHEN há itens THEN o resumo SHALL exibir botão "Finalizar compra" desabilitado com aviso "Pagamentos indisponíveis nesta versão" — **CART-14**
2. WHEN o carrinho está vazio THEN o sistema SHALL mostrar estado vazio com link para o catálogo — **CART-15**

---

## Edge Cases

- WHEN localStorage contém JSON inválido/versão antiga THEN o store SHALL iniciar vazio sem quebrar
- WHEN a API falha na revalidação THEN o carrinho SHALL ser mantido como está (sem perda de dados)
- WHEN o SSR renderiza o header THEN o badge SHALL aparecer só após hidratação (sem mismatch)

---

## Requirement Traceability

| Requirement ID | Story               | Phase  | Status  |
| -------------- | ------------------- | ------ | ------- |
| CART-01..03    | P1: Adicionar       | Tasks  | Verified |
| CART-04..09    | P1: Editar          | Tasks  | Verified |
| CART-10..13    | P1: Persistência    | Tasks  | Verified |
| CART-14..15    | P2: Resumo          | Tasks  | Verified |

**Coverage:** 15 total, 15 mapeados para tasks, 0 unmapped

---

## Success Criteria

- [ ] Nenhum cenário permite qty fora de 1..estoque
- [ ] Carrinho sobrevive a reload em 100% dos casos testados
