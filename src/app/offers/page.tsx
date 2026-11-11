import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getCatalog, getPromotions } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Promotions } from "@/components/home/Promotions";
import { CatalogEmptyState } from "@/components/products/CatalogEmptyState";

export const metadata: Metadata = {
  title: "Deals and offers",
  description: "See current store-managed product offers and campaigns.",
};
export default async function OffersPage() {
  const [catalog, promotions] = await Promise.all([getCatalog(), getPromotions()]);
  const offers = catalog.products.filter(
    (product) =>
      product.variants.length === 0 &&
      product.compare_at_price_ngn !== null &&
      product.compare_at_price_ngn > product.price_ngn,
  );
  return (
    <section className="section-wrap page-section collection-page">
      <div className="page-intro">
        <div>
          <span className="eyebrow">CURRENT STORE OFFERS</span>
          <h1>Deals & offers.</h1>
          <p>Discounts are shown only where the live catalog contains a higher original price.</p>
        </div>
      </div>
      <Promotions promotions={promotions} />
      {catalog.state !== "ready" ? (
        <CatalogEmptyState state={catalog.state} />
      ) : offers.length ? (
        <ProductGrid products={offers} />
      ) : (
        <div className="empty-state">
          <h2>No current offers are published.</h2>
          <p>We’ll show a price offer here once it has been configured in the catalog.</p>
          <Link href="/shop" className="button button-outline">
            Browse all products <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </section>
  );
}
