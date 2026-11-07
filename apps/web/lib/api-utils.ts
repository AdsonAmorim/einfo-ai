import { Prisma } from "@einfo/db";
import { z } from "zod";

export function badRequest(error: z.ZodError) {
  return Response.json(
    { message: "Dados inválidos", errors: z.flattenError(error).fieldErrors },
    { status: 400 },
  );
}

export function notFound(message = "Produto não encontrado") {
  return Response.json({ message }, { status: 404 });
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

/** Converte erros conhecidos do Prisma em respostas HTTP; relança os demais. */
export function handlePrismaError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return Response.json(
        { message: "Slug já está em uso", errors: { slug: ["Já existe um produto com este slug"] } },
        { status: 409 },
      );
    }
    if (error.code === "P2003") {
      return Response.json(
        { message: "Categoria inválida", errors: { categoryId: ["Categoria não existe"] } },
        { status: 400 },
      );
    }
    if (error.code === "P2025") return notFound();
  }
  throw error;
}
