import Link from "next/link";
import { PackageXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function AdminNotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageXIcon />
        </EmptyMedia>
        <EmptyTitle>Produto não encontrado</EmptyTitle>
        <EmptyDescription>O produto que você procura não existe ou foi excluído.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href="/admin">Voltar para produtos</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
