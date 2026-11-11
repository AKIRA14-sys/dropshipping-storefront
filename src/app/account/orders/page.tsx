import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { OrderHistory } from "@/components/account/OrderHistory";
export const metadata: Metadata = { title: "Order history", robots: { index: false, follow: false } };
export default function OrdersPage() {
  return (
    <AccountShell active="/account/orders">
      <OrderHistory />
    </AccountShell>
  );
}
