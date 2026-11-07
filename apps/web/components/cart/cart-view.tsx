"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import { toast } from "sonner";
import { CartItemForm } from "@/components/cart/cart-item-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/hooks/use-hydrated";
import { selectCount, selectTotalCents, useCartStore, type SyncChange } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { toCartProduct } from "@/lib/to-cart-product";

type ApiProduct = { id: string; slug: string; name: string; priceCents: number; stock: number };

function describeChange(change: SyncChange) {
  switch (change.type) {
    case "removed":
      return `${change.name} não está mais disponível e foi removido.`;
    case "qty-reduced":
      return `${change.name}: quantidade ajustada para ${change.qty} (estoque atual).`;
    case "price-changed":
      return `${change.name}: preço atualizado.`;
  }
}

/** Revalida preço/estoque dos itens contra a API ao abrir o carrinho. */
function useCartRevalidation(hydrated: boolean) {
  const sync = useCartStore((s) => s.sync);
  const done = useRef(false);

  useEffect(() => {
    if (!hydrated || done.current) return;
    done.current = true;

    const ids = useCartStore.getState().items.map((i) => i.productId);
    if (ids.length === 0) return;

    const controller = new AbortController();
    fetch(`/api/products?ids=${encodeURIComponent(ids.join(","))}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ApiProduct[]>;
      })
      .then((products) => {
        const changes = sync(products.map(toCartProduct));
        if (changes.length > 0) {
          toast.info("Seu carrinho foi atualizado", {
            description: changes.map(describeChange).join(" "),
          });
        }
      })
      .catch((error: unknown) => {
        // Falha de rede: mantém o carrinho como está
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Falha ao revalidar carrinho", error);
      });

    return () => controller.abort();
  }, [hydrated, sync]);
}

export function CartView() {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCount);
  const totalCents = useCartStore(selectTotalCents);
  const clear = useCartStore((s) => s.clear);
  useCartRevalidation(hydrated);

  if (!hydrated) return <Skeleton className="h-64 rounded-xl" />;

  if (items.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShoppingCartIcon />
          </EmptyMedia>
          <EmptyTitle>Seu carrinho está vazio</EmptyTitle>
          <EmptyDescription>Explore o catálogo e adicione peças e periféricos.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/">Ver catálogo</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
      <Card>
        <CardHeader>
          <CardTitle>Itens</CardTitle>
          <CardDescription>Ajuste as quantidades ou remova itens.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          {items.map((item, index) => (
            <div key={item.productId}>
              {index > 0 && <Separator className="my-4" />}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <Link href={`/products/${item.slug}`} className="font-medium hover:text-primary">
                    {item.name}
                  </Link>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {formatPrice(item.priceCents)} · {item.stock} em estoque
                  </span>
                </div>
                <div className="flex items-start gap-4 sm:flex-col sm:items-end sm:gap-2">
                  {/* key com estoque: recria o resolver quando o limite muda após a revalidação */}
                  <CartItemForm key={item.stock} item={item} />
                  <span className="font-semibold tabular-nums">{formatPrice(item.priceCents * item.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="text-muted-foreground" onClick={clear}>
            Limpar carrinho
          </Button>
        </CardFooter>
      </Card>

      <Card className="lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Itens</span>
            <span className="tabular-nums">{count}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="tabular-nums">{formatPrice(totalCents)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(totalCents)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-2">
          <Button size="lg" disabled>
            Finalizar compra
          </Button>
          <p className="text-center text-xs text-muted-foreground">Pagamentos indisponíveis nesta versão.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
