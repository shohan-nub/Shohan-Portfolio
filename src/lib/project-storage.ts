import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const PROJECT_IMAGE_BUCKET = "portfolio-projects";
const RECEIPT_TTL_SECONDS = 30 * 60;
const PROJECT_IMAGE_PATH = /^projects\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpg|png|webp|avif)$/i;

function receiptSecret() {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Supabase admin configuration is missing");
  return secret;
}

function signature(imageUrl: string, objectPath: string, issuedAt: number, secret: string) {
  return createHmac("sha256", secret).update(`${imageUrl}\n${objectPath}\n${issuedAt}`).digest("base64url");
}

export function isProjectImagePath(value: string): boolean {
  return PROJECT_IMAGE_PATH.test(value);
}

export function isSupabaseProjectImageUrl(value: string, objectPath: string): boolean {
  if (!isProjectImagePath(objectPath)) return false;
  try {
    const url = new URL(value);
    const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "");
    return url.protocol === "https:" &&
      url.origin === supabaseUrl.origin &&
      url.pathname === `/storage/v1/object/public/${PROJECT_IMAGE_BUCKET}/${objectPath}` &&
      !url.search && !url.hash;
  } catch {
    return false;
  }
}

export function createProjectStorageReceipt(imageUrl: string, objectPath: string): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  return `${issuedAt}.${signature(imageUrl, objectPath, issuedAt, receiptSecret())}`;
}

export function isValidProjectStorageReceipt(imageUrl: string, objectPath: string, receipt: string): boolean {
  const [issuedAtText, suppliedSignature, ...rest] = receipt.split(".");
  if (rest.length || !/^\d+$/.test(issuedAtText || "") || !suppliedSignature) return false;
  const issuedAt = Number(issuedAtText);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(issuedAt) || issuedAt > now + 60 || now - issuedAt > RECEIPT_TTL_SECONDS) return false;

  let expected: Buffer;
  try {
    expected = Buffer.from(signature(imageUrl, objectPath, issuedAt, receiptSecret()));
  } catch {
    return false;
  }
  const actual = Buffer.from(suppliedSignature);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
