import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { STORE_CATEGORIES } from "@/data/categories";
import { StoreLogo } from "@/components/layout/Logo";
import { socialLinks, storeName, supportEmail } from "@/config/store";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <StoreLogo variant="light" />
          <p>Useful finds across four everyday departments.</p>
          {supportEmail && (
            <a className="footer-contact" href={`mailto:${supportEmail}`}>
              <Mail size={15} />
              {supportEmail}
            </a>
          )}
        </div>
        <div className="footer-column">
          <h2>Shop</h2>
          <Link href="/shop">All products</Link>
          {STORE_CATEGORIES.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              {category.name}
            </Link>
          ))}
          <Link href="/new-arrivals">New arrivals</Link>
          <Link href="/offers">Deals & offers</Link>
        </div>
        <div className="footer-column">
          <h2>Your account</h2>
          <Link href="/account">Account overview</Link>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/account/addresses">Saved addresses</Link>
          <Link href="/account/orders">Order history</Link>
        </div>
        <div className="footer-column">
          <h2>Information</h2>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/faq">FAQs</Link>
          <Link href="/shipping">Shipping</Link>
          <Link href="/returns">Returns</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        {socialLinks.length > 0 && (
          <div className="footer-column">
            <h2>Follow</h2>
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        )}
        <div className="footer-note">
          <span className="eyebrow">SHOPPING, WITHOUT SURPRISES</span>
          <p>
            Product pages show current published catalog information. Checkout will open only after verified
            payments and order handling are connected.
          </p>
          <Link href="/policies" className="text-link">
            Read store information <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {storeName}
        </span>
        <span>Four departments, one easy-to-browse shop.</span>
        <Link href="/privacy">Privacy & terms</Link>
      </div>
    </footer>
  );
}
