import { NextResponse } from "next/server";

export const runtime = "nodejs";
export async function POST() {
  return NextResponse.json(
    { error: "Public tracking is unavailable. Sign in to view orders saved to your account." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
