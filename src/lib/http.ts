import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabase-server";

export async function isAdmin() {
  return Boolean(await getAdminUser());
}

export async function adminRequired() {
  return await isAdmin() ? null : NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}

export async function readJsonObject(request: NextRequest): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) throw new Error("Content-Type must be application/json");
  const raw = await request.text();
  if (raw.length > 32_000) throw new Error("Request body is too large");
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Request body must be an object");
  return value as Record<string, unknown>;
}

const submissions = new Map<string, number[]>();
export function allowMessageSubmission(request: NextRequest) {
  // Use the single client IP injected by a trusted reverse proxy. Do not let
  // callers rotate an x-forwarded-for list to bypass the in-process limit.
  const address = request.headers.get("x-real-ip")?.trim() || "unknown";
  const now = Date.now();
  const recent = (submissions.get(address) || []).filter(time => now - time < 10 * 60_000);
  if (recent.length >= 5) { submissions.set(address, recent); return false; }
  recent.push(now); submissions.set(address, recent);
  if (submissions.size > 5000) for (const [ip, times] of submissions) if (!times.some(time => now - time < 10 * 60_000)) submissions.delete(ip);
  return true;
}
