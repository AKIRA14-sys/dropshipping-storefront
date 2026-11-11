export type CategorySlug = "fashion" | "anime" | "school-supplies" | "home-appliances";

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
  image_url: string;
  display_order: number;
  subcategories: Subcategory[];
}
