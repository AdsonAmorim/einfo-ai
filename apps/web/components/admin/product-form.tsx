"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm, useWatch, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Category } from "@einfo/db";
import { productFormSchema, productFormToInput, slugify, type ProductFormValues } from "@einfo/validators";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ApiError = { message?: string; errors?: Record<string, string[] | undefined> };

// Campos da API que têm nome diferente no formulário
const apiFieldToFormField: Record<string, Path<ProductFormValues>> = { priceCents: "price" };

const emptyValues: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  price: "",
  stock: 0,
  categoryId: "",
  imageUrl: "",
};

export function ProductForm({
  categories,
  productId,
  defaultValues,
}: {
  categories: Category[];
  /** Presente no modo edição */
  productId?: string;
  defaultValues?: ProductFormValues;
}) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues ?? emptyValues,
  });
  const { errors, isSubmitting } = form.formState;
  const slug = useWatch({ control: form.control, name: "slug" });

  async function onSubmit(values: ProductFormValues) {
    const res = await fetch(isEdit ? `/api/products/${productId}` : "/api/products", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productFormToInput(values)),
    }).catch(() => null);

    if (!res) {
      toast.error("Não foi possível conectar à API");
      return;
    }

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as ApiError;
      for (const [field, messages] of Object.entries(body.errors ?? {})) {
        const name = apiFieldToFormField[field] ?? (field as Path<ProductFormValues>);
        if (messages?.[0]) form.setError(name, { message: messages[0] }, { shouldFocus: true });
      }
      toast.error(body.message ?? "Erro ao salvar produto");
      return;
    }

    toast.success(isEdit ? "Produto atualizado" : "Produto cadastrado", { description: values.name });
    router.push("/admin");
    router.refresh();
  }

  const nameField = form.register("name", {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      // No cadastro o slug acompanha o nome até ser editado manualmente (setValue não marca como dirty)
      if (isEdit || form.getFieldState("slug").isDirty) return;
      form.setValue("slug", slugify(e.target.value), { shouldValidate: form.formState.isSubmitted });
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <Input id="name" aria-invalid={!!errors.name} placeholder="Ex.: AMD Ryzen 5 7600" {...nameField} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field data-invalid={!!errors.slug}>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input id="slug" aria-invalid={!!errors.slug} placeholder="amd-ryzen-5-7600" {...form.register("slug")} />
          <FieldDescription>Usado na URL do produto: /products/{slug || "slug"}</FieldDescription>
          <FieldError errors={[errors.slug]} />
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="description">Descrição</FieldLabel>
          <Textarea id="description" rows={4} aria-invalid={!!errors.description} {...form.register("description")} />
          <FieldError errors={[errors.description]} />
        </Field>

        <div className="grid gap-6 sm:grid-cols-3">
          <Field data-invalid={!!errors.price}>
            <FieldLabel htmlFor="price">Preço</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>R$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="price"
                inputMode="decimal"
                placeholder="1.299,90"
                aria-invalid={!!errors.price}
                {...form.register("price")}
              />
            </InputGroup>
            <FieldError errors={[errors.price]} />
          </Field>

          <Field data-invalid={!!errors.stock}>
            <FieldLabel htmlFor="stock">Estoque</FieldLabel>
            <Input
              id="stock"
              type="number"
              inputMode="numeric"
              min={0}
              aria-invalid={!!errors.stock}
              {...form.register("stock", { valueAsNumber: true })}
            />
            <FieldError errors={[errors.stock]} />
          </Field>

          <Controller
            control={form.control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="categoryId">Categoria</FieldLabel>
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="categoryId" aria-invalid={fieldState.invalid} onBlur={field.onBlur} ref={field.ref}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <Field data-invalid={!!errors.imageUrl}>
          <FieldLabel htmlFor="imageUrl">URL da imagem (opcional)</FieldLabel>
          <Input
            id="imageUrl"
            type="url"
            placeholder="https://…"
            aria-invalid={!!errors.imageUrl}
            {...form.register("imageUrl")}
          />
          <FieldDescription>Sem imagem, a loja exibe um ícone da categoria.</FieldDescription>
          <FieldError errors={[errors.imageUrl]} />
        </Field>
      </FieldGroup>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando…" : isEdit ? "Salvar alterações" : "Cadastrar produto"}
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin">Cancelar</Link>
        </Button>
      </div>
    </form>
  );
}
