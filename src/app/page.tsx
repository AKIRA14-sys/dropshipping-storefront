import { getCategories } from "@/lib/categories";
import { getProducts } from "@/lib/products";
import { Hero } from "@/components/home/Hero";
import { Benefits } from "@/components/home/Benefits";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Promotions } from "@/components/home/Promotions";

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const highlights = featured.length ? featured : products.slice(0, 4);
  return (
    <>
      <Hero />
      <Benefits />
      <Categories categories={categories} />
      <FeaturedProducts products={highlights} />
      <Promotions />
    </>
  );
}
