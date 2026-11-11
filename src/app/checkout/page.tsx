import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

export const metadata: Metadata = { title: "Checkout preview", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <section className="section-wrap checkout-page app-checkout-page">
      <Link href="/cart" className="back-link">
        <ArrowLeft size={15} /> Back to cart
      </Link>
      <span className="eyebrow">
        <ShieldCheck size={14} /> CHECKOUT PREVIEW
      </span>
      <h1>Review your cart.</h1>
      <p>This store is not yet accepting orders or payments. No delivery details will be collected here.</p>
      <CheckoutForm />
    </section>
  );
}
