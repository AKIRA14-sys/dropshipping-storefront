import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section-wrap not-found-page">
      <span className="not-found-mark">404</span>
      <span className="eyebrow">THIS LITTLE PAGE ISN’T HERE</span>
      <h1>
        Looks like that find
        <br />
        has moved on.
      </h1>
      <p>The link may be old, or the page may have changed. Let’s find another way.</p>
      <div>
        <Link href="/shop" className="button button-dark">
          <Search size={15} /> Explore the shop
        </Link>
        <Link href="/" className="text-link">
          <ArrowLeft size={14} /> Go home
        </Link>
      </div>
    </section>
  );
}
