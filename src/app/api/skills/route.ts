import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { skillsService } from "@/services/skills.service";
import { adminRequired, readJsonObject } from "@/lib/http";
import { PUBLIC_SKILLS_TAG } from "@/services/public-portfolio-cache";

export async function GET() {
  try {
    const skills = await skillsService.getAllSkills();

    return NextResponse.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error
          ? error.message
          : "Failed to fetch skills",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await adminRequired();
  if (unauthorized) return unauthorized;
  try {
    const body = await readJsonObject(request);
    if (typeof body.name !== "string" || typeof body.category !== "string") throw new Error("Name and category are required");
    if (body.icon !== undefined && body.icon !== null && typeof body.icon !== "string") throw new Error("icon must be a string or null");
    if (body.sort_order !== undefined && (!Number.isInteger(body.sort_order) || typeof body.sort_order !== "number")) throw new Error("sort_order must be an integer");
    const skill = await skillsService.createSkill({ name: body.name, category: body.category, icon: (body.icon as string | null | undefined) ?? null, sort_order: (body.sort_order as number | undefined) ?? 0 });
    revalidateTag(PUBLIC_SKILLS_TAG, { expire: 0 });

    return NextResponse.json(
      {
        success: true,
        data: skill,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error
          ? error.message
          : "Failed to create skill",
      },
      { status: 400 }
    );
  }
}
