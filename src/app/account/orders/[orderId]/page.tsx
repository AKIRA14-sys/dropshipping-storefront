import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { OrderDetail } from "@/components/account/OrderDetail";
type Params = Promise<{ orderId: string }>;
export async function generateMetadata(): Promise<Metadata> {
  return { title: "Order details", robots: { index: false, follow: false } };
}
export default async function OrderDetailPage({ params }: { params: Params }) {
  const { orderId } = await params;
  return (
    <AccountShell active="/account/orders" returnTo={`/account/orders/${encodeURIComponent(orderId)}`}>
      <OrderDetail orderId={orderId} />
    </AccountShell>
  );
}
