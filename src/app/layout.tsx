import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SiteHeader } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/Footer";
import { canIndexSite, storeDescription, storeName } from "@/config/store";
import { getSiteUrl } from "@/lib/supabase/client";
import "./globals.css";

const indexingEnabled = canIndexSite();
const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { default: `${storeName} — Everyday finds`, template: `%s | ${storeName}` },
  description: storeDescription,
  applicationName: storeName,
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website",
    siteName: storeName,
    title: `${storeName} — Everyday finds`,
    description: storeDescription,
  },
  robots: { index: indexingEnabled, follow: indexingEnabled },
};

export const viewport: Viewport = { themeColor: "#f5f1e9", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <a className="skip-link" href="#main-content">
                Skip to content
              </a>
              <SiteHeader />
              <main id="main-content">{children}</main>
              <SiteFooter />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
