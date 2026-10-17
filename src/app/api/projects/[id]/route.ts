import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { adminRequired, readJsonObject } from "@/lib/http";
import { projectsService } from "@/services/projects.service";
import { PUBLIC_PROJECTS_TAG } from "@/services/public-portfolio-cache";
import { parseUpdateProject, ProjectInputError, requireFreshProjectStorageReceipt } from "@/lib/project-api-validation";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminRequired(); if (denied) return denied;
  try {
    const { id } = await params; const body = await readJsonObject(request);
    const patch = parseUpdateProject(body);
    if (typeof patch.image_url === "string") {
      const current = await projectsService.getProjectById(id);
      if (patch.image_url !== current.image_url) requireFreshProjectStorageReceipt(patch.image_url, body);
    }
    const data = await projectsService.updateProject(id, patch);
    revalidateTag(PUBLIC_PROJECTS_TAG, { expire: 0 });
    return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { const status = error instanceof ProjectInputError ? error.status : error instanceof Error && error.message === "Project not found" ? 404 : 500; return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Could not update project" }, { status }); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminRequired(); if (denied) return denied;
  try { const { id } = await params; await projectsService.deleteProject(id); revalidateTag(PUBLIC_PROJECTS_TAG, { expire: 0 }); return NextResponse.json({ success: true }); }
  catch (error) { return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Could not delete project" }, { status: 400 }); }
}
