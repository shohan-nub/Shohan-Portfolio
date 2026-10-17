import { NextRequest, NextResponse } from "next/server";
import { adminRequired, readJsonObject } from "@/lib/http";
import { messagesService } from "@/services/messages.service";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminRequired(); if (denied) return denied;
  try { const { id } = await params; const body = await readJsonObject(request); if (typeof body.is_read !== "boolean") throw new Error("is_read must be a boolean");
    const data = body.is_read ? await messagesService.markMessageAsRead(id) : await messagesService.setMessageReadStatus(id, false);
    return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Could not update message" }, { status: 400 }); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminRequired(); if (denied) return denied;
  try { const { id } = await params; await messagesService.deleteMessage(id); return NextResponse.json({ success: true }); }
  catch (error) { return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Could not delete message" }, { status: 400 }); }
}
