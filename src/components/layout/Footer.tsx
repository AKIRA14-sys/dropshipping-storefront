import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { StoreLogo } from "@/components/layout/Logo";
import { storeName, supportEmail } from "@/config/store";

export function SiteFooter() {
  return (
    <footer className="site-footer app-footer">
      <div className="app-footer-inner">
        <div className="app-footer-brand">
          <StoreLogo variant="light" />
          <p>Discover useful finds across a growing range of departments.</p>
          {supportEmail && (
            <a className="footer-contact" href={`mailto:${supportEmail}`}>
              <Mail size={14} />
              {supportEmail}
            </a>
          )}
        </div>
        <div className="app-footer-links" aria-label="Store information">
          <Link href="/contact">Contact</Link>
          <Link href="/faq">FAQs</Link>
          <Link href="/shipping">Shipping</Link>
          <Link href="/returns">Returns</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/policies">
            Store information <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="app-footer-bottom">
          <span>
            © {new Date().getFullYear()} {storeName}
          </span>
          <span>Checkout opens only when verified payment and order handling are ready.</span>
        </div>
      </div>
    </footer>
  );
}
