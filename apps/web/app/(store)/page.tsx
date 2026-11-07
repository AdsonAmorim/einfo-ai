import { Suspense } from "react";
import Link from "next/link";
import { PackageSearchIcon } from "lucide-react";
import { productQuerySchema } from "@einfo/validators";
import { CatalogFilters } from "@/components/catalog-filters";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories, getProducts } from "@/lib/queries";

export default function CatalogPage({ searchParams }: PageProps<"/">) {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Hardware e periféricos</h1>
        <p className="text-muted-foreground">
          Processadores, placas de vídeo, memória, armazenamento, periféricos e monitores.
        </p>
      </section>
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Catalog({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const raw = await searchParams;
  const { q, category } = productQuerySchema.parse({
    q: typeof raw.q === "string" ? raw.q : undefined,
    category: typeof raw.category === "string" ? raw.category : undefined,
  });
  const [categories, products] = await Promise.all([getCategories(), getProducts({ q, category })]);

  return (
    <div className="flex flex-col gap-6">
      <CatalogFilters categories={categories} category={category} q={q} />
      {products.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageSearchIcon />
            </EmptyMedia>
            <EmptyTitle>Nenhum produto encontrado</EmptyTitle>
            <EmptyDescription>Tente outro termo de busca ou categoria.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant="outline">
              <Link href="/">Limpar filtros</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "produto" : "produtos"}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-9 w-full max-w-md" />
      <div className="flex gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-80 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
