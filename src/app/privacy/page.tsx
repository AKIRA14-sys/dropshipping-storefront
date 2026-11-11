import type { Metadata } from "next";
import { supportEmail } from "@/config/store";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How account, saved-shopping and contact information is intended to be handled.",
};
export default function PrivacyPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">YOUR DETAILS DESERVE CARE</span>
      <h1>Privacy information.</h1>
      <p className="lead">
        The store owner must review this notice for the final business, services, retention periods and
        countries served before customer accounts are opened.
      </p>
      <section className="policy-section">
        <h2>Browsing and saved shopping</h2>
        <p>
          Guest shopping bags and wishlists store product IDs, variant IDs and quantities in this browser.
          Recent searches and recently viewed products are also stored on this device. These records do not
          include product prices; when the catalog is connected, the site checks current listings before
          showing saved prices or availability.
        </p>
      </section>
      <section className="policy-section">
        <h2>Accounts and addresses</h2>
        <p>
          When the store's Supabase project is configured, sign-in uses your email address and password. The
          account may store your name, optional phone number, saved delivery addresses, bag items and wishlist
          items so they can be available across devices. Supabase authentication sessions are kept in browser
          session storage or persistent storage according to your Remember me choice.
        </p>
      </section>
      <section className="policy-section">
        <h2>Orders and payments</h2>
        <p>
          Checkout is currently closed. This website does not collect delivery details at checkout, create
          orders, or take payment. Payment card information is not requested. Order records and payment
          processing will require a separately implemented, verified checkout before the store accepts
          purchases.
        </p>
      </section>
      <section className="policy-section">
        <h2>Contact and your rights</h2>
        <p>
          The store owner must publish a privacy contact, purpose and lawful basis for processing, retention
          and deletion rules, and the applicable access/correction/deletion process before launch.
        </p>
        {supportEmail ? (
          <p>
            For privacy questions, email <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
          </p>
        ) : (
          <p>The privacy contact address has not been configured yet.</p>
        )}
      </section>
      <p className="policy-disclaimer">
        This notice describes the current software behavior; it is not legal advice or a substitute for a
        complete privacy policy written for the store's markets.
      </p>
    </article>
  );
}
