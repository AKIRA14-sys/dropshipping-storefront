import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Store information",
  description: "Current store information and customer policy pages.",
};
const links = [
  {
    href: "/shipping",
    title: "Shipping & delivery",
    text: "Current coverage, fees and timing have not yet been confirmed.",
  },
  {
    href: "/returns",
    title: "Returns & refunds",
    text: "The store owner has not yet published a complete returns policy.",
  },
  {
    href: "/privacy",
    title: "Privacy",
    text: "How account and saved-shopping information is intended to be handled.",
  },
  {
    href: "/terms",
    title: "Terms & conditions",
    text: "The seller and final sales terms must be supplied before orders open.",
  },
];
export default function PoliciesPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">STORE INFORMATION</span>
      <h1>Clear information matters.</h1>
      <p className="lead">
        The store is not currently accepting orders. These pages show which customer policies are available
        and which store terms still need to be confirmed.
      </p>
      <div className="policy-link-grid">
        {links.map((item) => (
          <Link className="policy-link-card" href={item.href} key={item.href}>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </Link>
        ))}
      </div>
    </article>
  );
}
