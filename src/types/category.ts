export type CategorySlug = string;

export interface Subcategory {
  id?: string;
  slug: string;
  name: string;
  display_order?: number;
}

export interface Category {
  id?: string;
  slug: CategorySlug;
  name: string;
  description: string;
  /** Category discovery artwork only; never a product listing image. */
  image_url: string | null;
  icon_key?: string;
  display_order: number;
  subcategories: Subcategory[];
  product_count?: number;
}
