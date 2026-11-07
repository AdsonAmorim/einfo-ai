import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories } from "@/lib/queries";

export const metadata: Metadata = { title: "Novo produto — einfo.tech" };

export default function NewProductPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Novo produto</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-96" />}>
            <NewProductForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function NewProductForm() {
  const categories = await getCategories();
  return <ProductForm categories={categories} />;
}
