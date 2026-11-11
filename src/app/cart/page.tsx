import type { Metadata } from "next";
import { CartExperience } from "@/components/cart/CartExperience";

export const metadata: Metadata = { title: "Cart & wishlist", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ view?: string }>;
export default async function CartPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  return <CartExperience activeView={params.view === "saved" ? "saved" : "bag"} />;
}
