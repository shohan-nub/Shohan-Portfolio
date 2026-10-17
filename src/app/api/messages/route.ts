import { NextRequest, NextResponse } from "next/server";
import { MessageValidationError, messagesService } from "@/services/messages.service";
import { adminRequired, allowMessageSubmission, readJsonObject } from "@/lib/http";

export async function GET() {
  const unauthorized = await adminRequired();
  if (unauthorized) return unauthorized;
  try {
    const messages = await messagesService.getAllMessages();

    return NextResponse.json({
      success: true,
      data: messages,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error
          ? error.message
          : "Failed to fetch messages",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await readJsonObject(request);
    if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ success: true });
    if (typeof body.name !== "string" || typeof body.email !== "string" || typeof body.message !== "string") throw new MessageValidationError("Name, email, and message are required");
    if (body.subject !== undefined && body.subject !== null && typeof body.subject !== "string") throw new MessageValidationError("Subject must be a string");
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Invalid message details." }, { status: 400 });
  }

  if (!allowMessageSubmission(request)) return NextResponse.json({ success: false, error: "Too many messages. Try again later." }, { status: 429 });

  try {
    const message = await messagesService.createMessage({ name: body.name as string, email: body.email as string, subject: (body.subject as string | null | undefined) ?? null, message: body.message as string });
    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    const isValidationError = error instanceof MessageValidationError;
    if (!isValidationError) console.error("[Contact form] Message could not be saved", { message: error instanceof Error ? error.message.slice(0, 300) : "Unknown error" });
    return NextResponse.json({ success: false, error: isValidationError ? error.message : "Your message could not be saved. Please try again shortly." }, { status: isValidationError ? 400 : 500 });
  }
}
