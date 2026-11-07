import { prisma } from "@einfo/db";
import { productInputSchema, productQuerySchema } from "@einfo/validators";
import type { NextRequest } from "next/server";
import { badRequest, handlePrismaError, readJson } from "@/lib/api-utils";
import { getProducts } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const parsed = productQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return badRequest(parsed.error);

  return Response.json(await getProducts(parsed.data));
}

export async function POST(request: Request) {
  const parsed = productInputSchema.safeParse(await readJson(request));
  if (!parsed.success) return badRequest(parsed.error);

  try {
    const product = await prisma.product.create({ data: parsed.data, include: { category: true } });
    return Response.json(product, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}
