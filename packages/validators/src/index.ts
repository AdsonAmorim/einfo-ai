import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Converte "1.299,90", "1299,90" ou "1299.90" em centavos. Retorna NaN se inválido. */
export function parseBRL(value: string): number {
  const cleaned = value.replace(/[R$\s]/g, "");
  if (!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+([.,]\d{1,2})?$/.test(cleaned)) return NaN;
  const normalized = cleaned.includes(",") ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned;
  return Math.round(Number(normalized) * 100);
}

const name = z.string({ error: "Informe o nome" }).trim().min(2, "Nome deve ter ao menos 2 caracteres").max(120, "Nome muito longo");
const slug = z
  .string({ error: "Informe o slug" })
  .trim()
  .min(2, "Slug deve ter ao menos 2 caracteres")
  .max(140, "Slug muito longo")
  .regex(slugRegex, "Use apenas letras minúsculas, números e hífens");
const description = z.string({ error: "Descrição inválida" }).trim().max(2000, "Descrição muito longa");
const stock = z
  .number({ error: "Informe o estoque" })
  .int("Estoque deve ser um número inteiro")
  .min(0, "Estoque não pode ser negativo")
  .max(100_000, "Estoque muito alto");
const categoryId = z.string({ error: "Selecione uma categoria" }).min(1, "Selecione uma categoria");
const imageUrl = z.url("URL inválida").nullable().optional();

/** Contrato da API (POST /api/products) */
export const productInputSchema = z.object({
  name,
  slug,
  description: description.default(""),
  priceCents: z
    .number({ error: "Informe o preço" })
    .int("Preço inválido")
    .positive("Preço deve ser maior que zero")
    .max(100_000_000, "Preço muito alto"),
  stock,
  categoryId,
  imageUrl,
});
export type ProductInput = z.infer<typeof productInputSchema>;

/** Contrato da API (PATCH /api/products/[id]) — sem defaults, para não sobrescrever campos omitidos */
export const productUpdateSchema = productInputSchema.extend({ description }).partial();
export type ProductUpdate = z.infer<typeof productUpdateSchema>;

/** Contrato do formulário do admin: preço digitado em BRL, imagem como texto */
export const productFormSchema = z.object({
  name,
  slug,
  description,
  price: z
    .string()
    .trim()
    .min(1, "Informe o preço")
    .refine((v) => parseBRL(v) > 0, "Preço inválido (ex.: 1.299,90)"),
  stock,
  categoryId,
  imageUrl: z.union([z.literal(""), z.url("URL inválida")]),
});
export type ProductFormValues = z.infer<typeof productFormSchema>;

export function productFormToInput(values: ProductFormValues): ProductInput {
  return {
    name: values.name,
    slug: values.slug,
    description: values.description,
    priceCents: parseBRL(values.price),
    stock: values.stock,
    categoryId: values.categoryId,
    imageUrl: values.imageUrl === "" ? null : values.imageUrl,
  };
}

/** Query de GET /api/products */
export const productQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  category: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  ids: z
    .string()
    .optional()
    .transform((v) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : undefined)),
});
export type ProductQuery = Partial<z.infer<typeof productQuerySchema>>;

/** Quantidade de um item do carrinho, limitada ao estoque disponível */
export function cartItemQtySchema(max: number) {
  return z.object({
    qty: z
      .number({ error: "Informe a quantidade" })
      .int("Quantidade deve ser um número inteiro")
      .min(1, "Quantidade mínima é 1")
      .max(max, `Apenas ${max} em estoque`),
  });
}
export type CartItemQtyValues = z.infer<ReturnType<typeof cartItemQtySchema>>;
