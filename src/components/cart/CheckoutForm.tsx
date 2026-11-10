"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, LockKeyhole, MapPin, PackageCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { DeliveryDetails, LocalOrder } from "@/lib/types";

const DEMO_ORDERS_KEY = "akira-store-demo-orders-v1";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return;
    setBusy(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const details: DeliveryDetails = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "")
        .trim()
        .toLowerCase(),
      phone: String(formData.get("phone") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      state: String(formData.get("state") ?? "").trim(),
      note: String(formData.get("note") ?? "").trim(),
    };

    try {
      let trackingCode: string;
      if (isSupabaseConfigured()) {
        const response = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            delivery: details,
            items: items.map((line) => ({ product_id: line.product.id, quantity: line.quantity })),
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "We could not save that order. Please try again.");
        trackingCode = result.trackingCode;
      } else {
        trackingCode = `AK-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        const order: LocalOrder = {
          trackingCode,
          createdAt: new Date().toISOString(),
          email: details.email,
          customerName: details.fullName,
          total: subtotal,
          items: items.map(({ product, quantity }) => ({
            name: product.name,
            quantity,
            price: product.price_ngn,
          })),
          demo: true,
        };
        const stored = JSON.parse(window.localStorage.getItem(DEMO_ORDERS_KEY) || "[]") as LocalOrder[];
        window.localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify([...stored, order]));
      }
      window.sessionStorage.setItem("akira-store-order-email", details.email);
      clearCart();
      router.push(`/order/${encodeURIComponent(trackingCode)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!items.length)
    return (
      <div className="empty-cart">
        <span className="empty-cart-mark">
          <PackageCheck size={28} />
        </span>
        <h2>Your bag is empty.</h2>
        <p>Add a few finds before entering delivery details.</p>
        <Link href="/shop" className="button button-dark">
          Explore the shop <ArrowRight size={16} />
        </Link>
      </div>
    );

  return (
    <div className="checkout-layout">
      <form className="checkout-form" onSubmit={submitOrder}>
        <h2 className="form-section-title">
          <MapPin size={19} /> Where should it go?
        </h2>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="form-grid">
          <div className="form-field full">
            <label htmlFor="fullName">Full name *</label>
            <input id="fullName" name="fullName" autoComplete="name" maxLength={100} required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone number *</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} required />
          </div>
          <div className="form-field full">
            <label htmlFor="address">Delivery address *</label>
            <input id="address" name="address" autoComplete="street-address" maxLength={250} required />
          </div>
          <div className="form-field">
            <label htmlFor="city">City / town *</label>
            <input id="city" name="city" autoComplete="address-level2" maxLength={100} required />
          </div>
          <div className="form-field">
            <label htmlFor="state">State *</label>
            <input id="state" name="state" autoComplete="address-level1" maxLength={100} required />
          </div>
          <div className="form-field full">
            <label htmlFor="note">
              Delivery note <span>(optional)</span>
            </label>
            <textarea
              id="note"
              name="note"
              maxLength={500}
              placeholder="Helpful directions for finding you"
            />
          </div>
        </div>
        <p className="checkout-privacy">
          <strong>About your details.</strong> In demo mode, order details stay in this browser. When Supabase
          is configured, delivery details are sent to the store database to create an order. Read the{" "}
          <Link href="/policies">privacy and policy notes</Link>.
        </p>
        <button className="button button-dark" type="submit" disabled={busy}>
          {busy ? (
            "Saving your order…"
          ) : (
            <>
              Submit delivery details <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
      <aside className="checkout-summary">
        <h2>Your bag</h2>
        {items.map(({ product, quantity }) => (
          <div className="checkout-product-line" key={product.id}>
            <span>
              {product.name} × {quantity}
            </span>
            <strong>{formatNaira(product.price_ngn * quantity)}</strong>
          </div>
        ))}
        <div className="summary-line summary-total">
          <span>Estimated total</span>
          <span>{formatNaira(subtotal)}</span>
        </div>
        <div className="summary-note">Demo prices only. Delivery fee, if any, is confirmed separately.</div>
        <div className="payment-none">
          <LockKeyhole size={16} />
          <span>No payment gateway · no card details · no payment taken</span>
        </div>
      </aside>
    </div>
  );
}
