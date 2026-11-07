const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPrice(cents: number) {
  return brl.format(cents / 100);
}

/** Centavos → texto editável no formulário ("1299,90") */
export function centsToInput(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}
