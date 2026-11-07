import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductImage } from "@/components/product-image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import type { ProductWithCategory } from "@/lib/queries";
import { toCartProduct } from "@/lib/to-cart-product";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const soldOut = product.stock === 0;

  return (
    <Card className="group flex flex-col gap-0 overflow-hidden pt-0">
      <Link href={`/products/${product.slug}`} className="relative block">
        <ProductImage
          imageUrl={product.imageUrl}
          name={product.name}
          categorySlug={product.category.slug}
          className="rounded-none transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {soldOut && (
          <Badge variant="destructive" className="absolute top-3 left-3">
            Esgotado
          </Badge>
        )}
      </Link>
      <CardContent className="flex flex-1 flex-col gap-1.5 pt-4">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {product.category.name}
        </span>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 leading-snug font-medium hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-baseline justify-between pt-2">
          <span className="text-lg font-semibold tabular-nums">{formatPrice(product.priceCents)}</span>
          {!soldOut && (
            <span className="text-xs text-muted-foreground tabular-nums">{product.stock} em estoque</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <AddToCartButton product={toCartProduct(product)} className="w-full" />
      </CardFooter>
    </Card>
  );
}
