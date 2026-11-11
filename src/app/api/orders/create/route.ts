import { NextResponse } from "next/server";

export const runtime = "nodejs";
export async function POST() {
  return NextResponse.json(
    { error: "Checkout is not open yet. No order was created and no payment was taken." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
