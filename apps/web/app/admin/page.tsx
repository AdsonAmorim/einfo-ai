import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PencilIcon, PlusIcon } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import { getProducts } from "@/lib/queries";

export const metadata: Metadata = { title: "Admin — einfo.tech" };

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo da loja.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusIcon />
            Novo produto
          </Link>
        </Button>
      </div>
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <ProductsTable />
      </Suspense>
    </div>
  );
}

async function ProductsTable() {
  const products = await getProducts();

  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Produto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead className="text-right">Estoque</TableHead>
            <TableHead className="w-24 pr-4 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                Nenhum produto cadastrado.
              </TableCell>
            </TableRow>
          )}
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="max-w-xs truncate pl-4 font-medium">
                <Link href={`/products/${p.slug}`} className="hover:text-primary">
                  {p.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{p.category.name}</TableCell>
              <TableCell className="text-right tabular-nums">{formatPrice(p.priceCents)}</TableCell>
              <TableCell className="text-right tabular-nums">
                {p.stock === 0 ? <Badge variant="destructive">0</Badge> : p.stock}
              </TableCell>
              <TableCell className="pr-4 text-right">
                <div className="flex justify-end">
                  <Button asChild variant="ghost" size="icon" aria-label={`Editar ${p.name}`}>
                    <Link href={`/admin/products/${p.id}/edit`}>
                      <PencilIcon />
                    </Link>
                  </Button>
                  <DeleteProductButton productId={p.id} name={p.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
