import type { Product } from "@einfo/db";
import type { CartProduct } from "@/lib/cart-store";

export function toCartProduct(p: Pick<Product, "id" | "slug" | "name" | "priceCents" | "stock">): CartProduct {
  return { productId: p.id, slug: p.slug, name: p.name, priceCents: p.priceCents, stock: p.stock };
}
