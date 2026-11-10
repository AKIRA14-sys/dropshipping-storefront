import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, PackageCheck } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { formatNaira } from "@/lib/utils";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ProductGallery } from "@/components/products/ProductGallery";
import { productJsonLd } from "@/lib/seo";
import { isUsingDemoCatalog } from "@/lib/products";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const jsonLd = productJsonLd(product);
  return (
    <div className="section-wrap product-detail-page">
      <Link href={`/categories/${product.category_slug}`} className="back-link">
        <ArrowLeft size={15} /> Back to {product.category_name}
      </Link>
      <div className="product-detail">
        <ProductGallery product={product} />
        <div className="detail-copy">
          <span className="eyebrow">{product.category_name.toUpperCase()} · AKIRA EDIT</span>
          <h1>{product.name}</h1>
          <span className="detail-badge">A considered everyday find</span>
          <div className="detail-price">
            <strong>{formatNaira(product.price_ngn)}</strong>
            {product.compare_at_price_ngn && <del>{formatNaira(product.compare_at_price_ngn)}</del>}
          </div>
          <div className="demo-price-note">
            Illustrative demo price · confirm your real product and price before launch
          </div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-bullets">
            <span>
              <Check size={16} /> Demo catalog listing
            </span>
            <span>
              <PackageCheck size={16} /> Delivery details at checkout
            </span>
          </div>
          <AddToCartButton product={product} />
          <p className="checkout-disclaimer">
            No payment is collected. If Supabase is configured, orders are saved as awaiting payment;
            otherwise, this browser uses demo-only order tracking.
          </p>
          <Link className="text-link detail-track" href="/track">
            Already placed an order? Track it
          </Link>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {isUsingDemoCatalog() && (
        <p className="demo-inline-note">
          Demo mode is active: products and prices are samples, not a live offer.
        </p>
      )}
    </div>
  );
}
