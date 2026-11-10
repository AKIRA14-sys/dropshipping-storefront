import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopBrowser } from "@/components/products/ProductFilters";
import { getCategories } from "@/lib/categories";
import { getProducts } from "@/lib/products";
import type { CategorySlug } from "@/types/category";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  return (
    <div className="section-wrap page-section">
      <div className="page-intro shop-intro">
        <div>
          <span className="eyebrow">
            THE AKIRA EDIT · 0{categories.findIndex((item) => item.slug === slug) + 1}
          </span>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </div>
        <div className="intro-note">
          <span className="demo-dot" /> Demo catalogue <span>Sample items and prices</span>
        </div>
      </div>
      <ShopBrowser products={products} categories={categories} initialCategory={slug as CategorySlug} />
    </div>
  );
}
