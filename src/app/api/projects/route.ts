import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { projectsService } from "@/services/projects.service";
import { PUBLIC_PROJECTS_TAG } from "@/services/public-portfolio-cache";
import { adminRequired, readJsonObject } from "@/lib/http";
import { parseCreateProject, ProjectInputError, requireFreshProjectStorageReceipt } from "@/lib/project-api-validation";

export async function GET() {
  try {
    const projects = await projectsService.getAllProjects();

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error
          ? error.message
          : "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await adminRequired();
  if (unauthorized) return unauthorized;
  let input;
  try {
    const body = await readJsonObject(request);
    input = parseCreateProject(body);
    if (input.image_url) requireFreshProjectStorageReceipt(input.image_url, body);
  } catch (error) {
    const status = error instanceof ProjectInputError ? error.status : 400;
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Invalid project details." }, { status });
  }

  try {
    const project = await projectsService.createProject(input);
    revalidateTag(PUBLIC_PROJECTS_TAG, { expire: 0 });
    return NextResponse.json({ success: true, data: project }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save the project to Supabase.";
    const duplicate = /duplicate key|already exists|unique constraint/i.test(message);
    return NextResponse.json({ success: false, error: duplicate ? "A project with this slug already exists." : `Supabase could not save the project. ${message}` }, { status: duplicate ? 409 : 500 });
  }
}
