export type CategorySlug = "beauty" | "fashion" | "electronics" | "home-living";

export interface Category {
  id?: string;
  slug: CategorySlug;
  name: string;
  description: string;
}
