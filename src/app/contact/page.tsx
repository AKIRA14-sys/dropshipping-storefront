import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { InfoPageCta } from "@/components/ui/InfoPageCta";
import { supportEmail } from "@/config/store";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the store using its published support address.",
};
export default function ContactPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">CUSTOMER SUPPORT</span>
      <h1>Let’s talk.</h1>
      <p className="lead">
        For store questions, use the support contact shown here. No message form is presented unless a real
        contact channel is configured.
      </p>
      {supportEmail ? (
        <div className="contact-card">
          <span className="contact-icon">
            <Mail size={20} />
          </span>
          <div>
            <strong>Email the store</strong>
            <p>For help with catalog information or your account, write to the store support inbox.</p>
            <a className="button button-dark" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </div>
        </div>
      ) : (
        <div className="content-callout">
          <strong>Customer support email has not been set up.</strong> Please do not submit personal details
          here. The store owner must configure a support address before opening the shop to customers.
        </div>
      )}
      <InfoPageCta />
    </article>
  );
}
