import type { Metadata } from "next";
import { TrackingForm } from "@/components/cart/TrackingForm";

export const metadata: Metadata = { title: "Track an order", robots: { index: false, follow: false } };
export default function TrackPage() {
  return (
    <section className="section-wrap track-page">
      <span className="eyebrow">A LITTLE ORDER UPDATE</span>
      <h1>Where’s my order?</h1>
      <p>
        Enter the tracking code and checkout email. Demo-only orders are available in the browser that placed
        them.
      </p>
      <TrackingForm />
    </section>
  );
}
