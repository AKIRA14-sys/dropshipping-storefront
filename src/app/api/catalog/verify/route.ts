import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/products";

export const runtime = "nodejs";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const size = Number(request.headers.get("content-length") || 0);
  if (size > 16_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  try {
    const body = await request.json();
    const ids = body?.ids;
    if (
      !Array.isArray(ids) ||
      ids.length > 100 ||
      ids.some((id: unknown) => typeof id !== "string" || !uuid.test(id))
    ) {
      return NextResponse.json({ error: "Provide up to 100 valid product IDs." }, { status: 400 });
    }
    const products = await getProductsByIds(ids);
    if (products === null) {
      return NextResponse.json({ error: "The live catalog is not available." }, { status: 503 });
    }
    return NextResponse.json({ products }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not read the catalog request." }, { status: 400 });
  }
}
