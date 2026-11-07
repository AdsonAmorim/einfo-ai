import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductImage } from "@/components/product-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";
import { getProductBySlug } from "@/lib/queries";
import { toCartProduct } from "@/lib/to-cart-product";

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" className="self-start">
        <Link href="/">
          <ArrowLeftIcon />
          Voltar ao catálogo
        </Link>
      </Button>
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <ProductDetail params={params} />
      </Suspense>
    </div>
  );
}

async function ProductDetail({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const soldOut = product.stock === 0;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <ProductImage
        imageUrl={product.imageUrl}
        name={product.name}
        categorySlug={product.category.slug}
        className="rounded-xl border"
      />
      <div className="flex flex-col gap-4">
        <Link
          href={`/?category=${product.category.slug}`}
          className="text-sm font-medium tracking-wide text-primary uppercase hover:underline"
        >
          {product.category.name}
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
        <p className="leading-relaxed text-muted-foreground">{product.description}</p>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-semibold tabular-nums">{formatPrice(product.priceCents)}</span>
          {soldOut ? (
            <Badge variant="destructive">Esgotado</Badge>
          ) : (
            <Badge variant="secondary">{product.stock} em estoque</Badge>
          )}
        </div>
        <AddToCartButton product={toCartProduct(product)} size="lg" className="mt-2 self-start" />
      </div>
    </div>
  );
}
