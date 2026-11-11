"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price_ngn: number;
  line_total_ngn: number;
}
interface Order {
  id: string;
  tracking_code: string | null;
  status: string;
  payment_status: string;
  total_amount_ngn: number;
  created_at: string;
  order_items: OrderItem[];
}
function humanize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function OrderDetail({ orderId }: { orderId: string }) {
  const { client, user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
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
      .select(
        "id,tracking_code,status,payment_status,total_amount_ngn,created_at,order_items(id,product_name,quantity,unit_price_ngn,line_total_ngn)",
      )
      .eq("id", orderId)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError) setError("Order details could not be loaded.");
        else setOrder(data as Order | null);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [client, user?.id, orderId]);
  if (loading) return <p role="status">Loading order…</p>;
  if (error)
    return (
      <p className="form-error" role="alert">
        {error}
      </p>
    );
  if (!order)
    return (
      <div className="account-empty">
        <Package size={24} />
        <h2>Order not found</h2>
        <p>This order isn't available in your account.</p>
        <Link href="/account/orders">Back to order history</Link>
      </div>
    );
  return (
    <article className="order-detail-card">
      <Link href="/account/orders" className="back-link">
        <ArrowLeft size={15} /> Order history
      </Link>
      <span className="eyebrow">ORDER DETAILS</span>
      <h2>{order.tracking_code || `Order ${order.id.slice(0, 8)}`}</h2>
      <p>Placed {formatDate(order.created_at)}</p>
      <div className="order-status-row">
        <span className={`order-status status-${order.status}`}>{humanize(order.status)}</span>
        <span className="payment-status">Payment: {humanize(order.payment_status)}</span>
      </div>
      <h3>Items</h3>
      <ul className="order-line-list">
        {order.order_items.map((item) => (
          <li key={item.id}>
            <span>
              {item.product_name} × {item.quantity}
              <small>{formatPrice(Number(item.unit_price_ngn), "NGN")} each</small>
            </span>
            <strong>{formatPrice(Number(item.line_total_ngn), "NGN")}</strong>
          </li>
        ))}
      </ul>
      <div className="order-detail-total">
        <span>Order total</span>
        <strong>{formatPrice(Number(order.total_amount_ngn), "NGN")}</strong>
      </div>
    </article>
  );
}
