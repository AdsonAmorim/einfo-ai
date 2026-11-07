"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { selectCount, useCartStore } from "@/lib/cart-store";

export function CartBadge() {
  const hydrated = useHydrated();
  const count = useCartStore(selectCount);
  const visibleCount = hydrated ? count : 0;

  return (
    <Button asChild variant="outline" className="relative">
      <Link href="/cart" aria-label={`Carrinho com ${visibleCount} itens`}>
        <ShoppingCartIcon />
        Carrinho
        {visibleCount > 0 && (
          <span className="absolute -top-2 -right-2 flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground tabular-nums">
            {visibleCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
