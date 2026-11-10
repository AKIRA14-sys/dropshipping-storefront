"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const { items, subtotal, setQuantity, removeItem } = useCart();
  if (!items.length)
    return (
      <section className="section-wrap cart-page">
        <div className="empty-cart">
          <span className="empty-cart-mark">
            <ShoppingBag size={29} />
          </span>
          <h2>Your bag is taking a little breather.</h2>
          <p>Find something lovely to bring along. Your cart will stay saved on this device.</p>
          <Link href="/shop" className="button button-dark">
            Explore the shop <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  return (
    <section className="section-wrap cart-page">
      <span className="eyebrow">YOUR AKIRA BAG</span>
      <h1>Your bag, your finds.</h1>
      <p>{items.reduce((sum, line) => sum + line.quantity, 0)} item(s) tucked inside.</p>
      <div className="cart-layout">
        <div className="cart-list">
          {items.map(({ product, quantity }) => (
            <CartItem
              key={product.id}
              product={product}
              quantity={quantity}
              onChangeQuantity={(next) => setQuantity(product.id, next)}
              onRemove={() => removeItem(product.id)}
            />
          ))}
          <Link href="/shop" className="continue-shopping">
            ← Keep browsing
          </Link>
        </div>
        <CartSummary subtotal={subtotal} />
      </div>
    </section>
  );
}
