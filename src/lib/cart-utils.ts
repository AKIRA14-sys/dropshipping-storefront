import type { CartLine } from "@/types/cart";

export function linePrice(line: CartLine): number {
  const variant = line.variantId
    ? line.product.variants.find((item) => item.id === line.variantId)
    : undefined;
  return variant?.price_ngn ?? line.product.price_ngn;
}

export function lineAvailableStock(line: CartLine): number {
  const variant = line.variantId
    ? line.product.variants.find((item) => item.id === line.variantId)
    : undefined;
  return variant?.stock_quantity ?? line.product.stock_quantity;
}
