"use client";

import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { linePrice } from "@/lib/cart-utils";

export function CheckoutForm() {
  const { items, currencySubtotals, verification } = useCart();
  if (verification === "checking")
    return (
      <p className="checkout-status" role="status">
        Verifying your bag…
      </p>
    );
  if (verification === "unavailable")
    return (
      <div className="checkout-paused" role="alert">
        <h2>Current prices and availability could not be checked.</h2>
        <p>Nothing has been submitted. Try again later when the catalog is available.</p>
        <Link href="/cart" className="button button-outline">
          <ArrowLeft size={15} /> Return to your bag
        </Link>
      </div>
    );
  if (!items.length)
    return (
      <div className="checkout-paused">
        <h2>Your bag is empty.</h2>
        <p>Browse the catalog and save products to your bag. No order has been placed.</p>
        <Link href="/shop" className="button button-dark">
          Browse the catalog
        </Link>
      </div>
    );
  return (
    <div className="checkout-paused">
      <span className="checkout-lock">
        <LockKeyhole size={20} />
      </span>
      <span className="eyebrow">CHECKOUT IS NOT OPEN</span>
      <h2>Your bag is saved, but orders aren't being accepted yet.</h2>
      <p>
        No delivery details are collected, no order is created, and no payment is taken. The checkout will be
        enabled only after a verified payment gateway and server-side order flow are connected.
      </p>
      <div className="checkout-review">
        <h3>Current bag · live catalog values</h3>
        {items.map((line) => (
          <div key={`${line.product.id}:${line.variantKey}`}>
            <span>
              {line.product.name}
              {line.variantLabel ? ` · ${line.variantLabel}` : ""} × {line.quantity}
            </span>
            <strong>{formatPrice(linePrice(line) * line.quantity, line.product.currency_code)}</strong>
          </div>
        ))}
        {currencySubtotals.map((total) => (
          <div className="checkout-review-total" key={total.currencyCode}>
            <span>{currencySubtotals.length > 1 ? `Subtotal (${total.currencyCode})` : "Subtotal"}</span>
            <strong>{formatPrice(total.amount, total.currencyCode)}</strong>
          </div>
        ))}
        {currencySubtotals.length > 1 && (
          <p className="summary-currency-note">No exchange conversion is applied.</p>
        )}
      </div>
      <div className="checkout-actions">
        <Link href="/cart" className="button button-outline">
          <ArrowLeft size={15} /> Back to bag
        </Link>
        <button className="button button-dark" type="button" disabled>
          Place order · unavailable
        </button>
      </div>
    </div>
  );
}
