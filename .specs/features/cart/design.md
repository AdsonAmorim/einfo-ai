# Carrinho — Design

## Arquitetura

```mermaid
flowchart LR
  PC[ProductCard / AddToCartButton] -->|addItem| S[(Zustand store\npersist → localStorage 'einfo-cart')]
  CF[CartItemForm\nRHF + zodResolver] -->|updateQty / remove| S
  H[CartBadge] -->|count selector| S
  CP[/cart page/] -->|on mount: GET /api/products?ids=| API[Route Handler]
  API --> DB[(SQLite via Prisma)]
  CP -->|sync(products)| S
```

## Componentes

| Arquivo | Responsabilidade |
| --- | --- |
| `apps/web/lib/cart-store.ts` | Store Zustand com `persist` (`version: 1`). Estado `items: CartItem[]`. Ações `addItem`, `updateQty`, `removeItem`, `clear`, `sync(products)` (retorna lista de ajustes para toast). |
| `apps/web/lib/use-hydrated.ts` | Hook que retorna `true` após mount — evita mismatch SSR no badge e na página do carrinho. |
| `apps/web/components/add-to-cart-button.tsx` | Botão client que chama `addItem` e mostra toast (CART-01/02). |
| `apps/web/components/cart-badge.tsx` | Badge com a soma de quantidades (CART-03). |
| `apps/web/components/cart-item-form.tsx` | Form RHF por item, `cartItemQtySchema(stock)` de `@einfo/validators`; botões −/+, remover (CART-04..07). |
| `apps/web/app/cart/page.tsx` → `cart-view.tsx` | Lista, resumo, limpar, revalidação (CART-08..15). |

## Modelo

```ts
type CartItem = { productId: string; slug: string; name: string; priceCents: number; stock: number; qty: number };
```

## Decisões

- Validação da qty usa schema fábrica `cartItemQtySchema(max)` (Zod `z.coerce.number().int().min(1).max(max)`), compartilhado.
- `sync` é idempotente: atualiza preço/estoque/nome, ajusta qty, remove ausentes.
- Falha de rede em `sync` → mantém estado (edge case).
