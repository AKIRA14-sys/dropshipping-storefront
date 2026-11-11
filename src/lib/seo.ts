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
  const images = product.images.map((image) => canonicalUrl(image.image_url));
  const variantPrices = product.variants.map((variant) => variant.price_ngn ?? product.price_ngn);
  const prices = variantPrices.length ? variantPrices : [product.price_ngn];
  const availability = product.variants.length
    ? product.variants.some((variant) => variant.stock_quantity > 0)
    : product.stock_quantity > 0;
  const sharedOffer = {
    priceCurrency: product.currency_code,
    availability: availability ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
  };
  const offers = product.variants.length
    ? {
        "@type": "AggregateOffer",
        ...sharedOffer,
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: product.variants.length,
      }
    : { "@type": "Offer", ...sharedOffer, price: product.price_ngn };
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    ...(images.length ? { image: images } : {}),
    offers,
  };
}
