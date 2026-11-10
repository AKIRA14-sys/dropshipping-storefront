import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <span className="brand-mark">A</span>
            <span className="brand-copy">
              <strong>AKIRA</strong>
              <small>STORE</small>
            </span>
          </Link>
          <p>Good finds for the everyday.</p>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          <Link href="/shop">Shop all</Link>
          <Link href="/categories/beauty">Beauty & care</Link>
          <Link href="/categories/fashion">Fashion</Link>
          <Link href="/categories/electronics">Electronics</Link>
          <Link href="/categories/home-living">Home & living</Link>
        </div>
        <div className="footer-column">
          <h2>Here to help</h2>
          <Link href="/about">About us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/faq">FAQs</Link>
          <Link href="/shipping">Shipping</Link>
          <Link href="/returns">Returns</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/track">Track an order</Link>
        </div>
        <div className="footer-note">
          <span className="eyebrow">A NOTE BEFORE YOU SHOP</span>
          <p>
            This is a working demo storefront. Product names, images and naira prices are sample content—not a
            live offer. Checkout does not collect payment.
          </p>
          <Link href="/policies" className="text-link">
            Read the demo policies <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} AKIRA STORE</span>
        <span>Made for the little things that make a day.</span>
        <Link href="/privacy">Privacy & terms</Link>
      </div>
    </footer>
  );
}
