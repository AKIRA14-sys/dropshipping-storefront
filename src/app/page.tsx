import { getCategories } from "@/lib/categories";
import {
  getBestSellers,
  getCatalog,
  getFeaturedProducts,
  getNewArrivals,
  getPromotions,
} from "@/lib/products";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ProductCollectionSection } from "@/components/home/ProductCollectionSection";
import { Promotions } from "@/components/home/Promotions";
import { DepartmentSpotlight } from "@/components/home/DepartmentSpotlight";
import { ScrollReveal } from "@/components/layout/ScrollReveal";

function uniqueDepartmentSpotlight(
  bestSellers: Awaited<ReturnType<typeof getBestSellers>>,
  featured: Awaited<ReturnType<typeof getFeaturedProducts>>,
) {
  const source = bestSellers.length ? [...bestSellers, ...featured] : featured;
  const seenProducts = new Set<string>();
  const seenDepartments = new Set<string>();
  const diverse = source.filter((product) => {
    if (seenProducts.has(product.id)) return false;
    seenProducts.add(product.id);
    if (seenDepartments.has(product.category_slug)) return false;
    seenDepartments.add(product.category_slug);
    return true;
  });
  return [...diverse, ...source.filter((product) => !diverse.some((item) => item.id === product.id))].slice(
    0,
    8,
  );
}

export default async function HomePage() {
  const [catalog, categories, promotions, featured, bestSellers, arrivals] = await Promise.all([
    getCatalog(),
    getCategories(),
    getPromotions(),
    getFeaturedProducts(12),
    getBestSellers(12),
    getNewArrivals(8),
  ]);
  const spotlight = uniqueDepartmentSpotlight(bestSellers, featured);
  return (
    <>
      <ScrollReveal>
        <Hero
          products={spotlight}
          catalogState={catalog.state}
          spotlightLabel={bestSellers.length ? "POPULAR WITH SHOPPERS · PAID SALES" : "FEATURED BY THE STORE"}
        />
      </ScrollReveal>
      <ScrollReveal>
        <Categories categories={categories} products={catalog.products} catalogState={catalog.state} />
      </ScrollReveal>
      <ScrollReveal>
        <FeaturedProducts products={featured} />
      </ScrollReveal>
      <ScrollReveal>
        <Promotions promotions={promotions} />
      </ScrollReveal>
      <ScrollReveal>
        <ProductCollectionSection
          title="Newly listed."
          eyebrow="NEW ARRIVALS"
          products={arrivals}
          href="/new-arrivals"
          linkLabel="See all new arrivals"
        />
      </ScrollReveal>
      <ScrollReveal>
        <ProductCollectionSection
          title="Popular with shoppers."
          eyebrow="VERIFIED PAID SALES"
          products={bestSellers}
          href="/shop?sort=popular"
          linkLabel="See popular finds"
        />
      </ScrollReveal>
      <ScrollReveal>
        <DepartmentSpotlight categories={categories} products={catalog.products} />
      </ScrollReveal>
    </>
  );
}
