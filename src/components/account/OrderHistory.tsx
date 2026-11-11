"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatPrice } from "@/lib/utils";

interface OrderSummary {
  id: string;
  tracking_code: string | null;
  status: string;
  payment_status: string;
  total_amount_ngn: number;
  created_at: string;
}
function humanize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function OrderHistory() {
  const { client, user } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!client || !user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    void client
      .from("orders")
      .select("id,tracking_code,status,payment_status,total_amount_ngn,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError)
          setError("Order history is unavailable. Confirm the latest account database migration is applied.");
        else setOrders((data ?? []) as OrderSummary[]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [client, user?.id]);
  if (loading) return <p role="status">Loading your orders…</p>;
  if (error)
    return (
      <p className="form-error" role="alert">
        {error}
      </p>
    );
  if (!orders.length)
    return (
      <div className="account-empty">
        <Package size={25} />
        <h2>No orders yet</h2>
        <p>Orders you place after checkout is enabled will appear here.</p>
        <Link className="button button-outline" href="/shop">
          Browse departments <ArrowRight size={15} />
        </Link>
      </div>
    );
  return (
    <div className="order-history-list">
      {orders.map((order) => (
        <article className="order-history-card" key={order.id}>
          <div className="order-history-main">
            <span className="order-date">{formatDate(order.created_at)}</span>
            <strong>{order.tracking_code || `Order ${order.id.slice(0, 8)}`}</strong>
            <div className="order-status-row">
              <span className={`order-status status-${order.status}`}>{humanize(order.status)}</span>
              <span className="payment-status">Payment: {humanize(order.payment_status)}</span>
            </div>
          </div>
          <div className="order-history-end">
            <strong>{formatPrice(Number(order.total_amount_ngn), "NGN")}</strong>
            <Link
              href={`/account/orders/${order.id}`}
              aria-label={`View order ${order.tracking_code || order.id}`}
              className="text-link"
            >
              View details <ArrowRight size={15} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
