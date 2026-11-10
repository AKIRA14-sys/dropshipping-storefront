import { useMemo } from "react";
import type { Product } from "@/types/product";

export interface ProductFilters {
  query: string;
  category: string;
  saleOnly: boolean;
  maxPrice: number;
  sortBy: string;
}

export function useProducts(products: Product[], filters: ProductFilters): Product[] {
  return useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesText =
        !normalizedQuery ||
        `${product.name} ${product.description} ${product.category_name}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = filters.category === "all" || product.category_slug === filters.category;
      const matchesSale = !filters.saleOnly || Boolean(product.compare_at_price_ngn);
      return matchesText && matchesCategory && matchesSale && product.price_ngn <= filters.maxPrice;
    });
    if (filters.sortBy === "price-low") result.sort((a, b) => a.price_ngn - b.price_ngn);
    if (filters.sortBy === "price-high") result.sort((a, b) => b.price_ngn - a.price_ngn);
    if (filters.sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, filters.query, filters.category, filters.saleOnly, filters.maxPrice, filters.sortBy]);
}
