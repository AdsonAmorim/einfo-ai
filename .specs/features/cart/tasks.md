# Carrinho — Tasks

| ID | Task | Depende de | Requisitos | Verificação |
| --- | --- | --- | --- | --- |
| T1 | `cartItemQtySchema(max)` em `@einfo/validators` | — | CART-04, CART-05 | `tsc` ok; schema rejeita 0, 1.5, max+1 |
| T2 | `cart-store.ts` (Zustand persist) + `use-hydrated.ts` | T1 | CART-01, 02, 07, 08, 10 | reload mantém itens |
| T3 | `AddToCartButton` + toast | T2 | CART-01, CART-02 | toast "adicionado" / "estoque máximo" |
| T4 | `CartBadge` no header | T2 | CART-03 | badge reflete soma |
| T5 | `CartItemForm` (RHF + Zod, −/+, remover) | T1, T2 | CART-04..07 | erro em pt-BR para 999 |
| T6 | `/cart` view: lista, totais, limpar, estado vazio, botão desabilitado | T5 | CART-08, 09, 14, 15 | totais corretos |
| T7 | Revalidação via `GET /api/products?ids=` + `sync` + toasts | T6, API | CART-11..13 | excluir produto no admin → removido |

**Paralelizável:** T3 e T4 após T2.
