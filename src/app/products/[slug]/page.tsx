import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getCatalog } from "@/lib/products";
import { getStaticCategory } from "@/data/categories";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductPurchasePanel } from "@/components/products/ProductPurchasePanel";
import { RecentlyViewed } from "@/components/products/RecentlyViewed";
import { ProductGrid } from "@/components/products/ProductGrid";
import { productJsonLd } from "@/lib/seo";
import type { Product, ProductAttributeValue } from "@/types/product";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await getCatalog();
  const product = products.find((item) => item.slug === slug);
  return product
    ? {
        title: product.name,
        description: product.description,
        openGraph: {
          title: product.name,
          description: product.description,
          images: product.image_url ? [product.image_url] : [],
        },
      }
    : {};
}

function attributeLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

const structuredAttributeKeys = new Set(["short_description", "key_features", "specifications"]);

function renderAttributeValue(value: ProductAttributeValue): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const items = value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
    return items.length ? items.join(", ") : null;
  }
  if (typeof value === "object" && "value" in value && "unit" in value) {
    const measurement = value as { value?: unknown; unit?: unknown };
    if (typeof measurement.value === "number" && typeof measurement.unit === "string" && measurement.unit.trim()) {
      return `${measurement.value} ${measurement.unit.trim()}`;
    }
  }
  return null;
}

function AttributeList({ product }: { product: Product }) {
  const attributes = product.attributes ?? {};
  const specs = attributes.specifications && typeof attributes.specifications === "object" && !Array.isArray(attributes.specifications)
    ? Object.entries(attributes.specifications).flatMap(([key, value]) => {
        const rendered = renderAttributeValue(value);
        return rendered ? [[key, rendered] as const] : [];
      })
    : [];
  const entries = Object.entries(attributes).filter(([key]) => !structuredAttributeKeys.has(key)).flatMap(([key, value]) => {
    const rendered = renderAttributeValue(value);
    return rendered ? [[key, rendered] as const] : [];
  });
  if (!specs.length && !entries.length) return null;
  return (
    <section className="product-specifications">
      <h2>Product details</h2>
      <dl>
        {[...specs, ...entries].map(([key, value]) => (
          <div key={key}>
            <dt>{attributeLabel(key)}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const product = catalog.products.find((item) => item.slug === slug);
  if (!product) notFound();
  const category = getStaticCategory(product.category_slug);
  const related = catalog.products
    .filter((item) => item.category_slug === product.category_slug && item.id !== product.id)
    .slice(0, 4);
  const jsonLd = productJsonLd(product);
  return (
    <>
      <div className="section-wrap product-detail-page">
        <div className="product-breadcrumbs">
          <Link href="/shop">
            <ArrowLeft size={15} /> Shop
          </Link>
          <ChevronRight size={14} />
          <Link href={`/categories/${product.category_slug}`}>{product.category_name}</Link>
          {product.subcategory_name && (
            <>
              <ChevronRight size={14} />
              <span>{product.subcategory_name}</span>
            </>
          )}
        </div>
        <div className="product-detail">
          <ProductGallery product={product} />
          <div className="detail-copy">
            <span className="eyebrow">
              {product.category_name.toUpperCase()}
              {product.subcategory_name ? ` · ${product.subcategory_name.toUpperCase()}` : ""}
            </span>
            {product.brand && <p className="detail-brand">{product.brand}</p>}
            <h1>{product.name}</h1>
            <p className="detail-description">{product.description}</p>
            {typeof product.attributes?.short_description === "string" && product.attributes.short_description.trim() && (
              <p className="detail-description">{product.attributes.short_description.trim()}</p>
            )}
            {Array.isArray(product.attributes?.key_features) && product.attributes.key_features.some((feature) => typeof feature === "string" && feature.trim()) && (
              <ul className="product-key-features">
                {product.attributes.key_features
                  .filter((feature): feature is string => typeof feature === "string" && Boolean(feature.trim()))
                  .map((feature, index) => <li key={`${index}-${feature}`}>{feature.trim()}</li>)}
              </ul>
            )}
            <ProductPurchasePanel product={product} />
            {category && (
              <p className="detail-category-link">
                More from <Link href={`/categories/${category.slug}`}>{category.name}</Link>
              </p>
            )}
          </div>
        </div>
        <AttributeList product={product} />
        {related.length > 0 && (
          <section className="related-products">
            <div className="section-heading">
              <div>
                <span className="eyebrow">SAME DEPARTMENT</span>
                <h2>More to explore.</h2>
              </div>
            </div>
            <ProductGrid products={related} />
          </section>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </div>
      <RecentlyViewed currentProduct={product} />
    </>
  );
}
