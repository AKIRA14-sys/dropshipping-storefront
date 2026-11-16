import type { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";

export function ProductGrid({
  products,
  className = "",
  showPurchaseAction = true,
}: {
  products: Product[];
  className?: string;
  showPurchaseAction?: boolean;
}) {
  return (
    <div className={`product-grid ${className}`.trim()}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showPurchaseAction={showPurchaseAction} />
      ))}
    </div>
  );
}
