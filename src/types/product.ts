import type { CategorySlug } from "@/types/category";

export type ProductAttributes = Record<string, string | number | boolean | string[]>;

export interface ProductImage {
  id: string;
  image_url: string;
  card_image_url?: string | null;
  alt_text: string;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  label: string;
  sku: string | null;
  options: Record<string, string>;
  price_ngn: number | null;
  stock_quantity: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  brand: string | null;
  price_ngn: number;
  compare_at_price_ngn: number | null;
  currency_code: string;
  category_id: string;
  category_slug: CategorySlug;
  category_name: string;
  subcategory_id: string | null;
  subcategory_slug: string | null;
  subcategory_name: string | null;
  image_url: string | null;
  card_image_url?: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  attributes: ProductAttributes;
  search_terms: string[];
  featured: boolean;
  is_new_arrival: boolean;
  stock_quantity: number;
  created_at: string;
  paid_units_sold?: number;
}
