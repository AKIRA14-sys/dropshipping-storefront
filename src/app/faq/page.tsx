import type { Metadata } from "next";
import { InfoPageCta } from "@/components/ui/InfoPageCta";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers about browsing, accounts, checkout and delivery information.",
};
const faqs = [
  [
    "Are products available to browse?",
    "Only products the store owner publishes to the connected live catalog appear. If the catalog is not connected or has no published listings, the shop shows an honest empty/setup state instead of sample items.",
  ],
  [
    "Can I place a real order?",
    "Not yet. Checkout is paused while payment and order handling are prepared. No order is created, no delivery details are collected, and no payment is taken.",
  ],
  [
    "Do I need an account to browse or save a bag?",
    "No. You can browse the catalog, use your device's shopping bag and save a wishlist without signing in. Sign-in is required before checkout can be opened.",
  ],
  [
    "How do I create an account?",
    "Enter your name and email, request the six-digit email code, verify it, and then create a password. Ordinary sign-in uses your email and password; remember-me controls the session on this device.",
  ],
  [
    "Where are shipping costs and delivery times shown?",
    "Delivery coverage, delivery fees, dispatch timing and returns terms have not been confirmed by the store. No delivery estimate or charge is currently promised.",
  ],
  [
    "How can I track an order?",
    "When real orders are enabled, signed-in customers will see their own order and fulfilment updates under Account → Order history. Public order lookup is not available.",
  ],
  [
    "How are prices and product availability checked?",
    "Saved bag and wishlist items are refreshed against the active catalog before current prices and stock are shown. If the catalog cannot be verified, saved prices are hidden rather than presented as current.",
  ],
];
export default function FaqPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">A FEW THINGS YOU MIGHT WONDER</span>
      <h1>Good to know.</h1>
      <p className="lead">Straight answers about browsing and the current store setup.</p>
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
