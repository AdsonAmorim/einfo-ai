"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { cartItemQtySchema, type CartItemQtyValues } from "@einfo/validators";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCartStore, type CartItem } from "@/lib/cart-store";

export function CartItemForm({ item }: { item: CartItem }) {
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  const form = useForm<CartItemQtyValues>({
    resolver: zodResolver(cartItemQtySchema(item.stock)),
    values: { qty: item.qty },
    mode: "onChange",
  });
  const error = form.formState.errors.qty;
  const inputId = `qty-${item.productId}`;

  const onSubmit = form.handleSubmit(({ qty }) => updateQty(item.productId, qty));

  function step(delta: number) {
    const next = item.qty + delta;
    if (next < 1 || next > item.stock) return;
    updateQty(item.productId, next);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-1">
      <Field data-invalid={!!error} orientation="horizontal" className="w-auto gap-1.5">
        <FieldLabel htmlFor={inputId} className="sr-only">
          Quantidade de {item.name}
        </FieldLabel>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Diminuir quantidade"
          disabled={item.qty <= 1}
          onClick={() => step(-1)}
        >
          <MinusIcon />
        </Button>
        <Input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={1}
          max={item.stock}
          aria-invalid={!!error}
          className="w-16 text-center tabular-nums"
          {...form.register("qty", { valueAsNumber: true, onBlur: () => onSubmit() })}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Aumentar quantidade"
          disabled={item.qty >= item.stock}
          onClick={() => step(1)}
        >
          <PlusIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Remover ${item.name}`}
          className="text-muted-foreground hover:text-destructive"
          onClick={() => removeItem(item.productId)}
        >
          <Trash2Icon />
        </Button>
      </Field>
      <FieldError errors={[error]} />
    </form>
  );
}
