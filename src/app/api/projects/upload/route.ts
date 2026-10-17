import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { adminRequired } from "@/lib/http";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  createProjectStorageReceipt,
  isProjectImagePath,
  isSupabaseProjectImageUrl,
  PROJECT_IMAGE_BUCKET,
} from "@/lib/project-storage";

export const maxDuration = 60;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const fileExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function detectImageType(bytes: Buffer) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "image/png";
  if (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  if (bytes.length >= 12 && bytes.toString("ascii", 4, 8) === "ftyp") {
    const boxLength = Math.min(bytes.readUInt32BE(0), bytes.length);
    const brands = bytes.toString("ascii", 8, Math.max(8, boxLength));
    if (/(avif|avis)/.test(brands)) return "image/avif";
  }
  return null;
}

export async function POST(request: NextRequest) {
  const unauthorized = await adminRequired();
  if (unauthorized) return unauthorized;

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_FILE_SIZE + 128 * 1024) {
    return NextResponse.json({ success: false, error: "Images must be 5 MB or smaller." }, { status: 413 });
  }

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return NextResponse.json({ success: false, error: "Send an image file using multipart form data." }, { status: 400 });
  }

  if (!(file instanceof File)) return NextResponse.json({ success: false, error: "Choose an image to upload." }, { status: 400 });
  if (file.size === 0) return NextResponse.json({ success: false, error: "The selected file is empty." }, { status: 400 });
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ success: false, error: "Images must be 5 MB or smaller." }, { status: 413 });
  if (!allowedTypes.has(file.type)) return NextResponse.json({ success: false, error: "Use a JPEG, PNG, WebP, or AVIF image." }, { status: 415 });

  const buffer = Buffer.from(await file.arrayBuffer());
  if (detectImageType(buffer) !== file.type) {
    return NextResponse.json({ success: false, error: "The file contents do not match the selected image format." }, { status: 415 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const objectPath = `projects/${randomUUID()}.${fileExtensions[file.type]}`;
    if (!isProjectImagePath(objectPath)) throw new Error("Could not generate a valid image path.");

    const { error } = await supabase.storage.from(PROJECT_IMAGE_BUCKET).upload(objectPath, buffer, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) {
      console.error("[Supabase Storage upload] Upload failed", {
        statusCode: error.statusCode,
        name: error.name,
        message: error.message.slice(0, 300),
      });
      const status = Number(error.statusCode) === 413 ? 413 : Number(error.statusCode) === 415 ? 415 : 502;
      return NextResponse.json({
        success: false,
        error: status === 413
          ? "Images must be 5 MB or smaller."
          : "Supabase Storage could not accept this image. Check the portfolio-projects bucket configuration and server access.",
      }, { status });
    }

    const publicUrl = supabase.storage.from(PROJECT_IMAGE_BUCKET).getPublicUrl(objectPath).data.publicUrl;
    if (!isSupabaseProjectImageUrl(publicUrl, objectPath)) {
      await supabase.storage.from(PROJECT_IMAGE_BUCKET).remove([objectPath]);
      return NextResponse.json({ success: false, error: "Supabase returned an unexpected public image URL." }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      data: {
        public_url: publicUrl,
        object_path: objectPath,
        upload_receipt: createProjectStorageReceipt(publicUrl, objectPath),
      },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Supabase Storage upload failed.";
    const status = /admin configuration is missing/i.test(message) ? 503 : 502;
    console.error("[Supabase Storage upload] Server error", { message: message.slice(0, 300), status });
    return NextResponse.json({
      success: false,
      error: status === 503 ? "Supabase admin configuration is missing." : "The image upload could not be completed.",
    }, { status });
  }
}
