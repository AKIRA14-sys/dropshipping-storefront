import type { CategorySlug } from "@/types/category";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_ngn: number;
  compare_at_price_ngn?: number | null;
  category_slug: CategorySlug;
  category_name: string;
  image_url: string;
  featured?: boolean;
  stock_quantity?: number;
}
