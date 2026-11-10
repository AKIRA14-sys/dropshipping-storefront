import type { Metadata } from "next";
import { TrackingForm } from "@/components/cart/TrackingForm";

type Params = Promise<{ trackingCode: string }>;
export async function generateMetadata(): Promise<Metadata> {
  return { title: "Order update", robots: { index: false, follow: false } };
}
export default async function OrderPage({ params }: { params: Params }) {
  const { trackingCode } = await params;
  const safeCode = decodeURIComponent(trackingCode);
  return (
    <section className="section-wrap track-page">
      <span className="eyebrow">THANK YOU · ORDER UPDATE</span>
      <h1>Order received.</h1>
      <p>
        Your tracking code is <strong>{safeCode}</strong>. No payment has been taken; this demo cannot confirm
        fulfilment.
      </p>
      <TrackingForm defaultCode={safeCode} autoLookup />
      <p className="contact-note">
        If this is a Supabase-backed order, its status starts as “awaiting payment”. The store needs a
        configured payment and fulfilment process before it can be treated as a real order.
      </p>
    </section>
  );
}
