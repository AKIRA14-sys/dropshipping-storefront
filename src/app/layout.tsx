import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/context/CartContext";
import { SiteHeader } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/Footer";
import { DemoBanner } from "@/components/layout/DemoBanner";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const indexingEnabled = process.env.NEXT_PUBLIC_INDEXING_ENABLED === "true";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AKIRA STORE — Good finds for the everyday", template: "%s | AKIRA STORE" },
  description:
    "Explore beauty, fashion, useful tech and home finds at AKIRA STORE. A mobile-first storefront built for easy browsing.",
  applicationName: "AKIRA STORE",
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website",
    siteName: "AKIRA STORE",
    title: "AKIRA STORE — Good finds for the everyday",
    description: "Little things, lovely finds.",
  },
  robots: { index: indexingEnabled, follow: indexingEnabled },
};

export const viewport: Viewport = { themeColor: "#f8f4ed", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG">
      <body>
        <CartProvider>
          <DemoBanner />
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
