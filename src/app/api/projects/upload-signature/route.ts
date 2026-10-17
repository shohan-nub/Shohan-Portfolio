import { NextResponse } from "next/server";
import { adminRequired } from "@/lib/http";

// Retained for older clients. Uploads pass through the protected server endpoint.
export async function POST() {
  const unauthorized = await adminRequired();
  if (unauthorized) return unauthorized;
  return NextResponse.json({
    success: false,
    error: "This endpoint is retired. Send the image to /api/projects/upload instead.",
  }, { status: 410, headers: { "Cache-Control": "no-store" } });
}
