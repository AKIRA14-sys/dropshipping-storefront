import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSupabaseConfigured())
    return NextResponse.json({ error: "Server-backed order tracking is not configured." }, { status: 503 });
  try {
    const { trackingCode, email } = await request.json();
    if (
      typeof trackingCode !== "string" ||
      trackingCode.trim().length < 8 ||
      trackingCode.trim().length > 24 ||
      typeof email !== "string" ||
      email.trim().length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return NextResponse.json({ error: "Enter a valid tracking code and checkout email." }, { status: 400 });
    }
    const supabase = getSupabaseServerClient();
    if (!supabase)
      return NextResponse.json({ error: "Server-backed order tracking is not configured." }, { status: 503 });
    const { data, error } = await supabase.rpc("track_public_order", {
      p_tracking_code: trackingCode.trim().toUpperCase(),
      p_email: email.trim().toLowerCase(),
    });
    if (error) {
      console.error("Order tracking RPC failed", error.code || "unknown");
      return NextResponse.json({ error: "Order lookup is temporarily unavailable." }, { status: 500 });
    }
    if (!data) return NextResponse.json({ error: "No order matched those details." }, { status: 404 });
    return NextResponse.json({ order: data });
  } catch {
    return NextResponse.json({ error: "We could not read that request. Please try again." }, { status: 400 });
  }
}
