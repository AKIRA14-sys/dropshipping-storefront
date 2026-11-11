import { getCategories } from "@/lib/categories";
import {
  getBestSellers,
  getCatalog,
  getFeaturedProducts,
  getNewArrivals,
  getPromotions,
} from "@/lib/products";
import { Hero } from "@/components/home/Hero";
import { Benefits } from "@/components/home/Benefits";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ProductCollectionSection } from "@/components/home/ProductCollectionSection";
import { Promotions } from "@/components/home/Promotions";
import { DepartmentSpotlight } from "@/components/home/DepartmentSpotlight";

export default async function HomePage() {
  const [catalog, categories, promotions, featured, bestsellers, arrivals] = await Promise.all([
    getCatalog(),
    getCategories(),
    getPromotions(),
    getFeaturedProducts(8),
    getBestSellers(8),
    getNewArrivals(8),
  ]);
  return (
    <>
      <Hero />
      <Benefits />
      <Categories categories={categories} />
      <FeaturedProducts products={featured} catalogState={catalog.state} />
      <ProductCollectionSection
        title="Just arrived."
        eyebrow="NEWLY PUBLISHED BY THE STORE"
        products={arrivals}
        href="/new-arrivals"
        linkLabel="View all new arrivals"
      />
      <Promotions promotions={promotions} />
      <ProductCollectionSection
        title="Popular with shoppers."
        eyebrow="PAID SALES ONLY"
        products={bestsellers}
        href="/shop?sort=popular"
        linkLabel="Shop products"
      />
      <DepartmentSpotlight categories={categories} />
    </>
  );
}
