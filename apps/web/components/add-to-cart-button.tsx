"use client";

import { ShoppingCartIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore, type CartProduct } from "@/lib/cart-store";

export function AddToCartButton({
  product,
  size = "default",
  className,
}: {
  product: CartProduct;
  size?: "default" | "sm" | "lg";
  className?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const soldOut = product.stock === 0;

  function handleClick() {
    if (addItem(product) === "max") {
      toast.warning("Estoque máximo atingido", {
        description: `Só há ${product.stock} unidade(s) de ${product.name}.`,
      });
      return;
    }
    toast.success("Adicionado ao carrinho", { description: product.name });
  }

  return (
    <Button size={size} className={className} disabled={soldOut} onClick={handleClick}>
      <ShoppingCartIcon />
      {soldOut ? "Esgotado" : "Adicionar ao carrinho"}
    </Button>
  );
}
