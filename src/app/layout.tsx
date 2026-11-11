import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SiteHeader } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { canIndexSite, storeDescription, storeName } from "@/config/store";
import { getSiteUrl } from "@/lib/supabase/client";
import { getCategories } from "@/lib/categories";
import "./globals.css";

const indexingEnabled = canIndexSite();
const baseUrl = getSiteUrl();

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { default: `${storeName} — Find your next favourite`, template: `%s | ${storeName}` },
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
    title: `${storeName} — Find your next favourite`,
    description: storeDescription,
  },
  robots: { index: indexingEnabled, follow: indexingEnabled },
};

export const viewport: Viewport = { themeColor: "#f4f6f2", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const categories = await getCategories();
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <a className="skip-link" href="#main-content">
                Skip to content
              </a>
              <SiteHeader categories={categories} />
              <main id="main-content">{children}</main>
              <SiteFooter />
              <MobileBottomNav />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
