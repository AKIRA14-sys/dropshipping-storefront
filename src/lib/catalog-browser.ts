import type { Product } from "@/types/product";

export async function verifyProducts(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  const response = await fetch("/api/catalog/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: Array.from(new Set(ids)).slice(0, 100) }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Current product details could not be verified.");
  const payload = (await response.json()) as { products?: Product[] };
  if (!Array.isArray(payload.products)) throw new Error("The catalog response was invalid.");
  return payload.products;
}
