import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountOverview } from "@/components/account/AccountOverview";
import { RecentlyViewed } from "@/components/products/RecentlyViewed";
export const metadata: Metadata = { title: "My account", robots: { index: false, follow: false } };
export default function AccountPage() {
  return (
    <AccountShell active="/account">
      <AccountOverview />
      <RecentlyViewed />
    </AccountShell>
  );
}
