"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  stock: number;
  qty: number;
};

export type CartProduct = Omit<CartItem, "qty">;

/** Resultado de adicionar um item: "added" | "max" (estoque esgotado no carrinho) */
export type AddResult = "added" | "max";

/** Ajustes aplicados ao sincronizar com a API (para exibir avisos) */
export type SyncChange =
  | { type: "removed"; name: string }
  | { type: "qty-reduced"; name: string; qty: number }
  | { type: "price-changed"; name: string };

type CartState = {
  items: CartItem[];
  addItem: (product: CartProduct) => AddResult;
  updateQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  sync: (products: CartProduct[]) => SyncChange[];
};

const clampQty = (qty: number, stock: number) => Math.max(1, Math.min(Math.trunc(qty), stock));

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const existing = get().items.find((i) => i.productId === product.productId);
        const currentQty = existing?.qty ?? 0;
        if (currentQty >= product.stock) return "max";

        set({
          items: existing
            ? get().items.map((i) =>
                i.productId === product.productId ? { ...i, ...product, qty: currentQty + 1 } : i,
              )
            : [...get().items, { ...product, qty: 1 }],
        });
        return "added";
      },

      updateQty: (productId, qty) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, qty: clampQty(qty, i.stock) } : i,
          ),
        }),

      removeItem: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),

      clear: () => set({ items: [] }),

      sync: (products) => {
        const byId = new Map(products.map((p) => [p.productId, p]));
        const changes: SyncChange[] = [];
        const items: CartItem[] = [];

        for (const item of get().items) {
          const fresh = byId.get(item.productId);
          if (!fresh || fresh.stock === 0) {
            changes.push({ type: "removed", name: item.name });
            continue;
          }
          const qty = Math.min(item.qty, fresh.stock);
          if (qty < item.qty) changes.push({ type: "qty-reduced", name: fresh.name, qty });
          if (fresh.priceCents !== item.priceCents) changes.push({ type: "price-changed", name: fresh.name });
          items.push({ ...fresh, qty });
        }

        set({ items });
        return changes;
      },
    }),
    {
      name: "einfo-cart",
      version: 1,
      partialize: (state) => ({ items: state.items }),
      // Estado salvo em formato desconhecido: começa com carrinho vazio
      migrate: () => ({ items: [] }),
    },
  ),
);

export const selectCount = (state: CartState) => state.items.reduce((sum, i) => sum + i.qty, 0);
export const selectTotalCents = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.qty * i.priceCents, 0);
