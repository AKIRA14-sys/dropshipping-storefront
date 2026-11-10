import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const declaredSize = Number(request.headers.get("content-length") || 0);
  if (declaredSize > 16_000)
    return NextResponse.json({ error: "Your request is too large." }, { status: 413 });
  if (!isSupabaseConfigured())
    return NextResponse.json(
      { error: "Order storage is not configured yet. This demo checkout is local-only." },
      { status: 503 },
    );

  try {
    const body = await request.json();
    const delivery = body?.delivery;
    const items = body?.items;
    if (
      !delivery ||
      typeof delivery !== "object" ||
      !Array.isArray(items) ||
      items.length < 1 ||
      items.length > 25
    ) {
      return NextResponse.json(
        { error: "Please check the delivery details and bag contents." },
        { status: 400 },
      );
    }
    const bounded = [
      delivery.fullName,
      delivery.email,
      delivery.phone,
      delivery.address,
      delivery.city,
      delivery.state,
    ].every((value) => typeof value === "string" && value.trim().length > 0 && value.length <= 254);
    if (
      !bounded ||
      typeof delivery.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delivery.email) ||
      (delivery.note && (typeof delivery.note !== "string" || delivery.note.length > 500))
    ) {
      return NextResponse.json(
        { error: "Please check your name, email, phone and delivery address." },
        { status: 400 },
      );
    }
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (
      items.some(
        (item: { product_id?: unknown; quantity?: unknown }) =>
          typeof item?.product_id !== "string" ||
          !uuid.test(item.product_id) ||
          !Number.isInteger(item.quantity) ||
          Number(item.quantity) < 1 ||
          Number(item.quantity) > 20,
      )
    ) {
      return NextResponse.json(
        { error: "A product in your bag is no longer available. Refresh the shop and try again." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    if (!supabase)
      return NextResponse.json({ error: "Order storage is not configured yet." }, { status: 503 });
    const { data, error } = await supabase.rpc("create_public_order", {
      p_customer: {
        fullName: delivery.fullName.trim(),
        email: delivery.email.trim().toLowerCase(),
        phone: delivery.phone.trim(),
        address: delivery.address.trim(),
        city: delivery.city.trim(),
        state: delivery.state.trim(),
        note: typeof delivery.note === "string" ? delivery.note.trim() : "",
      },
      p_items: items,
    });
    if (error) {
      // Do not log or return customer data. Keep detailed diagnostics in the DB dashboard.
      console.error("Order RPC failed", error.code || "unknown");
      return NextResponse.json(
        {
          error:
            "We could not save this order. Confirm the Supabase migration is installed and the demo products are available.",
        },
        { status: 400 },
      );
    }
    const created = data as {
      tracking_code?: string;
      created_at?: string;
      status?: string;
      total_amount?: number;
    } | null;
    if (!created?.tracking_code)
      return NextResponse.json(
        { error: "The store did not return an order reference. Please try again." },
        { status: 500 },
      );
    return NextResponse.json(
      {
        trackingCode: created.tracking_code,
        createdAt: created.created_at,
        status: created.status,
        totalAmount: created.total_amount,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "We could not read that request. Please check the form and try again." },
      { status: 400 },
    );
  }
}
