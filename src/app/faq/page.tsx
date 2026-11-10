import type { Metadata } from "next";
import { InfoPageCta } from "@/components/ui/InfoPageCta";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers about the AKIRA STORE demo catalogue, checkout and order tracking.",
};
const faqs = [
  [
    "Are these real products and prices?",
    "No. This version uses clearly labelled demo catalogue entries and illustrative naira prices. Confirm every product, image, specification, price and supplier before launch.",
  ],
  [
    "Can I place a real order here?",
    "Not yet. The delivery-information flow is built, but this phase has no payment gateway and is not accepting paid orders. If Supabase is configured, a submitted demo order is saved with an awaiting-payment status; without Supabase, the demo is stored only in this browser.",
  ],
  [
    "Will checkout charge my card?",
    "No. There are no card fields and no payment provider connected. No payment is taken.",
  ],
  [
    "How are delivery fees and timing decided?",
    "They are not configured yet. Delivery cost, coverage and timing need to be confirmed by the store owner before publishing purchase promises.",
  ],
  [
    "How can I track an order?",
    "Use the Track an order page with the tracking code and email used at checkout. Demo-only orders can be looked up only in the same browser where they were placed.",
  ],
  [
    "Why does the product photo not exactly match the listing?",
    "The included images are illustrative starter assets supplied for this build. They are not verified product photos. Replace them with accurate, licensed supplier or store photography before selling.",
  ],
];
export default function FaqPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">A FEW THINGS YOU MIGHT WONDER</span>
      <h1>Good to know.</h1>
      <p className="lead">Straightforward answers about this storefront demo.</p>
      <div className="faq-list">
        {faqs.map(([question, answer]) => (
          <section className="faq-item" key={question}>
            <h2>{question}</h2>
            <p>{answer}</p>
          </section>
        ))}
      </div>
      <InfoPageCta />
    </article>
  );
}
