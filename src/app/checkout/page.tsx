import type { Metadata } from "next";
import { AccountGate } from "@/components/auth/AuthForms";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };
export default function CheckoutPage() {
  return (
    <section className="section-wrap checkout-page">
      <span className="eyebrow">SECURE CHECKOUT</span>
      <h1>Review your bag.</h1>
      <p>Sign in is required before purchase; this store is not yet accepting orders.</p>
      <AccountGate returnTo="/checkout">
        <CheckoutForm />
      </AccountGate>
    </section>
  );
}
