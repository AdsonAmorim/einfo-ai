import { prisma } from "@einfo/db";
import { productUpdateSchema } from "@einfo/validators";
import { badRequest, handlePrismaError, notFound, readJson } from "@/lib/api-utils";
import { getProductById } from "@/lib/queries";

export async function GET(_request: Request, ctx: RouteContext<"/api/products/[id]">) {
  const { id } = await ctx.params;
  const product = await getProductById(id);
  return product ? Response.json(product) : notFound();
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/products/[id]">) {
  const { id } = await ctx.params;
  const parsed = productUpdateSchema.safeParse(await readJson(request));
  if (!parsed.success) return badRequest(parsed.error);

  try {
    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
      include: { category: true },
    });
    return Response.json(product);
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/products/[id]">) {
  const { id } = await ctx.params;
  try {
    await prisma.product.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    return handlePrismaError(error);
  }
}
