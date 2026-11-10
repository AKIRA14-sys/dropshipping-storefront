import type { Product } from "@/types/product";
import { getSiteUrl } from "@/lib/supabase/client";

export function canonicalUrl(path: string): string {
  try {
    return new URL(path).toString();
  } catch {
    return new URL(path.startsWith("/") ? path : `/${path}`, getSiteUrl()).toString();
  }
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [canonicalUrl(product.image_url)],
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.price_ngn,
      availability: "https://schema.org/InStock",
    },
  };
}
