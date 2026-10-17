import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { adminRequired, readJsonObject } from "@/lib/http";
import { skillsService } from "@/services/skills.service";
import { PUBLIC_SKILLS_TAG } from "@/services/public-portfolio-cache";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminRequired(); if (denied) return denied;
  try {
    const { id } = await params; const body = await readJsonObject(request); const patch: Record<string, unknown> = {};
    for (const key of ["name", "category"] as const) if (key in body) { if (typeof body[key] !== "string") throw new Error(`${key} must be a string`); patch[key] = body[key]; }
    if ("icon" in body) { if (body.icon !== null && typeof body.icon !== "string") throw new Error("icon must be a string or null"); patch.icon = body.icon; }
    if ("sort_order" in body) { if (typeof body.sort_order !== "number" || !Number.isInteger(body.sort_order)) throw new Error("sort_order must be an integer"); patch.sort_order = body.sort_order; }
    if (!Object.keys(patch).length) throw new Error("At least one skill field is required");
    const data = await skillsService.updateSkill(id, patch as Parameters<typeof skillsService.updateSkill>[1]);
    revalidateTag(PUBLIC_SKILLS_TAG, { expire: 0 });
    return NextResponse.json({ success: true, data });
  } catch (error) { return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Could not update skill" }, { status: 400 }); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminRequired(); if (denied) return denied;
  try { const { id } = await params; await skillsService.deleteSkill(id); revalidateTag(PUBLIC_SKILLS_TAG, { expire: 0 }); return NextResponse.json({ success: true }); }
  catch (error) { return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Could not delete skill" }, { status: 400 }); }
}
