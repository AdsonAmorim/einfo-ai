import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { centsToInput } from "@/lib/format";
import { getCategories, getProductById } from "@/lib/queries";

export const metadata: Metadata = { title: "Editar produto — einfo.tech" };

export default function EditProductPage({ params }: PageProps<"/admin/products/[id]/edit">) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Editar produto</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-96" />}>
            <EditProductForm params={params} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function EditProductForm({ params }: Pick<PageProps<"/admin/products/[id]/edit">, "params">) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);
  if (!product) notFound();

  return (
    <ProductForm
      categories={categories}
      productId={product.id}
      defaultValues={{
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: centsToInput(product.priceCents),
        stock: product.stock,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl ?? "",
      }}
    />
  );
}
