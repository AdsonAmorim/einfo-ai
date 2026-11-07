import Link from "next/link";
import { CpuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartBadge } from "@/components/cart-badge";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CpuIcon className="size-4" />
          </span>
          <span>
            einfo<span className="text-primary">.tech</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/">Catálogo</Link>
          </Button>
          <CartBadge />
        </nav>
      </div>
    </header>
  );
}
