import { connection } from "next/server";
import { prisma, type Prisma } from "@einfo/db";
import type { ProductQuery } from "@einfo/validators";

// better-sqlite3 é síncrono: connection() impede que as consultas rodem no prerender
// e garante dados frescos a cada requisição.

const withCategory = { category: true } satisfies Prisma.ProductInclude;

export type ProductWithCategory = Prisma.ProductGetPayload<{ include: typeof withCategory }>;

export async function getProducts({ q, category, ids }: ProductQuery = {}) {
  await connection();
  return prisma.product.findMany({
    where: {
      ...(q && { name: { contains: q } }),
      ...(category && { category: { slug: category } }),
      ...(ids && { id: { in: ids } }),
    },
    include: withCategory,
    orderBy: { name: "asc" },
  });
}

export async function getProductBySlug(slug: string) {
  await connection();
  return prisma.product.findUnique({ where: { slug }, include: withCategory });
}

export async function getProductById(id: string) {
  await connection();
  return prisma.product.findUnique({ where: { id }, include: withCategory });
}

export async function getCategories() {
  await connection();
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}
