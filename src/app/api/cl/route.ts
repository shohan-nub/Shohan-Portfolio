import { NextResponse } from "next/server";
import { adminRequired } from "@/lib/http";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { PROJECT_IMAGE_BUCKET } from "@/lib/project-storage";

// Preserve the legacy endpoint path while using the same protected Storage flow.
export { POST } from "@/app/api/projects/upload/route";

export async function GET() {
  const unauthorized = await adminRequired();
  if (unauthorized) return unauthorized;

  const { data, error } = await getSupabaseAdmin().storage.getBucket(PROJECT_IMAGE_BUCKET);
  if (error) {
    console.error("[Supabase Storage check] Bucket lookup failed", {
      statusCode: error.statusCode,
      message: error.message.slice(0, 240),
    });
    return NextResponse.json({ success: false, error: "Supabase Storage bucket is unavailable." }, { status: 502 });
  }

  return NextResponse.json({
    success: true,
    message: "Supabase Storage connection successful",
    bucket: data.name,
  }, { headers: { "Cache-Control": "no-store" } });
}
