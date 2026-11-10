"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Search, PackageCheck } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { LocalOrder } from "@/lib/types";

const DEMO_ORDERS_KEY = "akira-store-demo-orders-v1";
interface OrderResult {
  tracking_code: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: Array<{ product_name: string; quantity: number; unit_price_ngn: number; line_total_ngn: number }>;
  demo?: boolean;
}

export function TrackingForm({
  defaultCode = "",
  autoLookup = false,
}: {
  defaultCode?: string;
  autoLookup?: boolean;
}) {
  const [code, setCode] = useState(defaultCode);
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function lookup(lookupCode: string, lookupEmail: string) {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const normalizedCode = lookupCode.trim().toUpperCase();
      const normalizedEmail = lookupEmail.trim().toLowerCase();
      const demoOrders = JSON.parse(window.localStorage.getItem(DEMO_ORDERS_KEY) || "[]") as LocalOrder[];
      const localOrder = demoOrders.find(
        (order) =>
          order.trackingCode.toUpperCase() === normalizedCode &&
          order.email.toLowerCase() === normalizedEmail,
      );
      if (localOrder) {
        setResult({
          tracking_code: localOrder.trackingCode,
          created_at: localOrder.createdAt,
          status: "demo · awaiting payment",
          total_amount: localOrder.total,
          items: localOrder.items.map((item) => ({
            product_name: item.name,
            quantity: item.quantity,
            unit_price_ngn: item.price,
            line_total_ngn: item.price * item.quantity,
          })),
          demo: true,
        });
        return;
      }
      if (!isSupabaseConfigured())
        throw new Error(
          "No matching demo order was found on this device. Demo orders can only be tracked in the browser where they were placed.",
        );
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingCode: normalizedCode, email: normalizedEmail }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No order matched those details.");
      setResult(payload.order as OrderResult);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not look up that order.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!autoLookup || !defaultCode) return;
    const savedEmail = window.sessionStorage.getItem("akira-store-order-email");
    if (savedEmail) {
      setEmail(savedEmail);
      void lookup(defaultCode, savedEmail);
    }
    // Only runs once for the just-created order landing page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void lookup(code, email);
  }

  return (
    <div className="track-card">
      <form className="track-form" onSubmit={submit}>
        <div className="form-field">
          <label htmlFor="trackingCode">Tracking code</label>
          <input
            id="trackingCode"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="AK-…"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="trackEmail">Checkout email</label>
          <input
            id="trackEmail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="The email used at checkout"
            required
          />
        </div>
        <button className="button button-dark" type="submit" disabled={busy}>
          {busy ? (
            "Looking it up…"
          ) : (
            <>
              <Search size={15} /> Find my order
            </>
          )}
        </button>
      </form>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {result && (
        <div className="tracking-result" aria-live="polite">
          <span className="success-icon">
            <PackageCheck size={25} />
          </span>
          <h2>Order found</h2>
          <div className="tracking-meta">
            <span>
              Code: <strong>{result.tracking_code}</strong>
            </span>
            <span>
              Placed: {new Date(result.created_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}
            </span>
          </div>
          <span className="tracking-status">{result.status.replaceAll("_", " ")}</span>
          <p>
            Estimated order total: <strong>{formatNaira(Number(result.total_amount))}</strong>
          </p>
          <ul>
            {result.items?.map((item, index) => (
              <li key={`${item.product_name}-${index}`}>
                {item.product_name} × {item.quantity} — {formatNaira(Number(item.line_total_ngn))}
              </li>
            ))}
          </ul>
          {result.demo && (
            <div className="tracking-local-note">
              This is a browser-only demo record. No payment was taken and the order is not confirmed for
              fulfilment.
            </div>
          )}
          {result.status === "awaiting_payment" && (
            <div className="tracking-local-note">
              Awaiting payment arrangement. This demo has no payment gateway; this is not a paid or confirmed
              order.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
