import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

export const metadata: Metadata = { title: "Delivery details", robots: { index: false, follow: false } };
export default function CheckoutPage() {
  return (
    <section className="section-wrap checkout-page">
      <span className="eyebrow">ONE LAST LITTLE DETAIL</span>
      <h1>Where should it go?</h1>
      <p>Share delivery details to create a demo order. No payment is collected.</p>
      <CheckoutForm />
    </section>
  );
}
