"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ChevronRight, LogOut, MapPin, Package, UserRound } from "lucide-react";
import { AccountGate } from "@/components/auth/AuthForms";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/account", label: "Overview", icon: UserRound },
  { href: "/account/orders", label: "Order history", icon: Package },
  { href: "/account/addresses", label: "Saved addresses", icon: MapPin },
];

export function AccountShell({
  children,
  active = "/account",
  returnTo,
}: {
  children: ReactNode;
  active?: string;
  returnTo?: string;
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function logout() {
    setBusy(true);
    setError("");
    try {
      await signOut();
      router.replace("/");
      router.refresh();
    } catch {
      setError("We could not sign you out. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  const path = returnTo || active;
  return (
    <section className="section-wrap account-page">
      <div className="account-heading">
        <span className="eyebrow">ME & MY ACCOUNT</span>
        <div className="account-profile-heading">
          <span className="account-avatar" aria-hidden="true">
            {String(user?.user_metadata?.full_name || user?.email || "M")
              .trim()
              .charAt(0)
              .toUpperCase()}
          </span>
          <div>
            <h1>{user?.user_metadata?.full_name || "Your account"}</h1>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>
      <AccountGate returnTo={path}>
        <div className="account-layout">
          <nav className="account-nav" aria-label="Account navigation">
            <div className="account-nav-group">
              <span className="account-nav-heading">Your account</span>
              <div className="account-nav-links">
                {links.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.href;
                  return (
                    <Link
                      key={item.href}
                      className={isActive ? "active" : ""}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="account-nav-item-main">
                        <Icon size={17} aria-hidden="true" />
                        <span>{item.label}</span>
                      </span>
                      <ChevronRight size={16} aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="account-nav-group account-nav-session">
              <span className="account-nav-heading">Session</span>
              <button type="button" onClick={logout} disabled={busy}>
                <span className="account-nav-item-main">
                  <LogOut size={17} aria-hidden="true" />
                  <span>{busy ? "Signing out…" : "Sign out"}</span>
                </span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
          </nav>
          <div className="account-content">{children}</div>
        </div>
      </AccountGate>
    </section>
  );
}
