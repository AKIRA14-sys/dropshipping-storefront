import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { ShopBrowser } from "@/components/products/ProductFilters";
import { getCategories, getCategoryBySlug } from "@/lib/categories";
import { getBestSellers, getCatalog } from "@/lib/products";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ subcategory?: string; q?: string; sort?: string }>;
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  return category ? { title: category.name, description: category.description } : {};
}
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const [{ slug }, query, categories, catalog, bestsellerRows] = await Promise.all([
    params,
    searchParams,
    getCategories(),
    getCatalog(),
    getBestSellers(50),
  ]);
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const sales = new Map(bestsellerRows.map((product) => [product.id, product.paid_units_sold ?? 0]));
  const products = catalog.products.map((product) => ({
    ...product,
    paid_units_sold: sales.get(product.id) ?? 0,
  }));
  const initialSort =
    query.sort === "popular" && bestsellerRows.length ? "popular" : query.sort || "featured";
  return (
    <div className="section-wrap page-section">
      <nav className="product-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={14} />
        <Link href="/shop">Shop all</Link>
        <ChevronRight size={14} />
        <span aria-current="page">{category.name}</span>
      </nav>
      <header className="category-page-hero">
        <div>
          <span className="eyebrow">DEPARTMENT · {String(category.display_order).padStart(2, "0")}</span>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
          <div className="category-subcategory-pills">
            {category.subcategories.map((item) => (
              <Link
                key={item.slug}
                href={`/categories/${category.slug}?subcategory=${encodeURIComponent(item.slug)}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="category-page-art">
          <Image src={category.image_url} alt="" fill sizes="(max-width: 760px) 100vw, 40vw" priority />
        </div>
      </header>
      <ShopBrowser
        products={products}
        catalogState={catalog.state}
        categories={categories}
        initialCategory={category.slug}
        initialSubcategory={query.subcategory || ""}
        initialQuery={query.q || ""}
        initialSort={initialSort}
      />
    </div>
  );
}
