import Link from "next/link";
import { CpuIcon, StoreIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CpuIcon className="size-4" />
            </span>
            <span>
              einfo<span className="text-primary">.tech</span>
            </span>
          </Link>
          <Badge variant="secondary">Admin</Badge>
        </div>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/admin">Produtos</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin/products/new">Novo produto</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">
              <StoreIcon />
              Ver loja
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
