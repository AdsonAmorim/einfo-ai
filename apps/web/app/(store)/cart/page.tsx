import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = { title: "Carrinho — einfo.tech" };

export default function CartPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Carrinho</h1>
      <CartView />
    </div>
  );
}
