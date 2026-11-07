import Form from "next/form";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import type { Category } from "@einfo/db";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

function hrefFor(category?: string, q?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export function CatalogFilters({
  categories,
  category,
  q,
}: {
  categories: Category[];
  category?: string;
  q?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Form action="/" className="flex gap-2" key={`${category}-${q}`}>
        {category && <input type="hidden" name="category" value={category} />}
        <InputGroup className="max-w-md">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput name="q" defaultValue={q} placeholder="Buscar produtos…" aria-label="Buscar produtos" />
        </InputGroup>
        <Button type="submit" variant="secondary">
          Buscar
        </Button>
      </Form>
      <div className="flex flex-wrap gap-2" role="list" aria-label="Categorias">
        <CategoryPill href={hrefFor(undefined, q)} active={!category}>
          Todos
        </CategoryPill>
        {categories.map((c) => (
          <CategoryPill key={c.id} href={hrefFor(c.slug, q)} active={category === c.slug}>
            {c.name}
          </CategoryPill>
        ))}
      </div>
    </div>
  );
}

function CategoryPill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="listitem"
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
