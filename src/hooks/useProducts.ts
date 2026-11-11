import { useMemo } from "react";
import type { Product } from "@/types/product";

export interface ProductFilters {
  query: string;
  category: string;
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  currencyCode: string;
  saleOnly: boolean;
  availability: "all" | "in-stock" | "out-of-stock";
  brand: string;
  attributes: Record<string, string>;
  sortBy: string;
}
function hasStock(product: Product) {
  return product.variants.length
    ? product.variants.some((variant) => variant.stock_quantity > 0)
    : product.stock_quantity > 0;
}
function actualPrices(product: Product) {
  return product.variants.length
    ? product.variants.map((variant) => variant.price_ngn ?? product.price_ngn)
    : [product.price_ngn];
}
function attributeValues(product: Product, key: string): string[] {
  const values: string[] = [];
  const productValue = product.attributes[key];
  if (Array.isArray(productValue)) values.push(...productValue.map(String));
  else if (productValue !== undefined && productValue !== null) values.push(String(productValue));
  for (const variant of product.variants) if (variant.options[key]) values.push(variant.options[key]);
  return values;
}
function fromPrice(product: Product) {
  return Math.min(...actualPrices(product));
}

export function useProducts(products: Product[], filters: ProductFilters): Product[] {
  return useMemo(() => {
    const normalizedQuery = filters.query.trim().toLocaleLowerCase();
    const result = products.filter((product) => {
      const attributeSearch = Object.values(product.attributes).flatMap((value) =>
        Array.isArray(value) ? value : [value],
      );
      const variantSearch = product.variants.flatMap((variant) => Object.values(variant.options));
      const searchable = [
        product.name,
        product.description,
        product.brand,
        product.category_name,
        product.subcategory_name,
        ...product.search_terms,
        ...attributeSearch,
        ...variantSearch,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      const matchesText = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesCategory = filters.category === "all" || product.category_slug === filters.category;
      const matchesSubcategory = !filters.subcategory || product.subcategory_slug === filters.subcategory;
      const matchesCurrency =
        filters.currencyCode === "all" || product.currency_code.toUpperCase() === filters.currencyCode;
      const prices = actualPrices(product);
      const matchesPrice =
        filters.currencyCode === "all" ||
        prices.some((price) => price >= filters.minPrice && price <= filters.maxPrice);
      const actualSale =
        product.variants.length === 0 &&
        product.compare_at_price_ngn !== null &&
        product.compare_at_price_ngn > product.price_ngn;
      const matchesSale = !filters.saleOnly || actualSale;
      const stock = hasStock(product);
      const matchesAvailability =
        filters.availability === "all" || (filters.availability === "in-stock" ? stock : !stock);
      const matchesBrand = !filters.brand || product.brand === filters.brand;
      const matchesAttributes = Object.entries(filters.attributes).every(([key, value]) =>
        attributeValues(product, key).includes(value),
      );
      return (
        matchesText &&
        matchesCategory &&
        matchesSubcategory &&
        matchesCurrency &&
        matchesPrice &&
        matchesSale &&
        matchesAvailability &&
        matchesBrand &&
        matchesAttributes
      );
    });
    if (filters.sortBy === "price-low" && filters.currencyCode !== "all")
      result.sort((a, b) => fromPrice(a) - fromPrice(b));
    else if (filters.sortBy === "price-high" && filters.currencyCode !== "all")
      result.sort((a, b) => fromPrice(b) - fromPrice(a));
    else if (filters.sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    else if (filters.sortBy === "popular")
      result.sort((a, b) => (b.paid_units_sold ?? 0) - (a.paid_units_sold ?? 0));
    else if (filters.sortBy === "newest")
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else result.sort((a, b) => Number(b.featured) - Number(a.featured));
    return result;
  }, [products, filters]);
}
