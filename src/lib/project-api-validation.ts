import type { CreateProjectInput, UpdateProjectInput } from "@/repositories/projects.repository";
import { isSupabaseProjectImageUrl, isValidProjectStorageReceipt } from "@/lib/project-storage";

export class ProjectInputError extends Error {
  constructor(message: string, readonly status = 400) { super(message); }
}

function requiredText(value: unknown, label: string, maxLength: number) {
  if (typeof value !== "string" || !value.trim()) throw new ProjectInputError(`${label} is required.`);
  const normalized = value.trim();
  if (normalized.length > maxLength) throw new ProjectInputError(`${label} must be ${maxLength} characters or fewer.`);
  return normalized;
}

function parseHttpsUrl(value: unknown, label: string) {
  if (value === null || value === "") return null;
  if (typeof value !== "string") throw new ProjectInputError(`${label} must be an HTTPS URL.`);
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") throw new Error();
    return parsed.toString();
  } catch {
    throw new ProjectInputError(`${label} must be a valid HTTPS URL.`);
  }
}

function parseTechStack(value: unknown): string[] {
  if (!Array.isArray(value) || value.some(item => typeof item !== "string")) {
    throw new ProjectInputError("tech_stack must be an array of strings.");
  }
  if (value.length > 30) throw new ProjectInputError("tech_stack cannot contain more than 30 items.");
  return value.map(item => item.trim()).filter(Boolean).map(item => {
    if (item.length > 80) throw new ProjectInputError("Each technology must be 80 characters or fewer.");
    return item;
  });
}

function parseProjectSection(value: unknown): "web_app" | "web_design" {
  if (value !== "web_app" && value !== "web_design") {
    throw new ProjectInputError("Display Section must be Website / Web App or Web Design (Demo Only).");
  }
  return value;
}

export function parseCreateProject(body: Record<string, unknown>): CreateProjectInput {
  const title = requiredText(body.title, "Title", 120);
  const slug = requiredText(body.slug, "Slug", 120);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new ProjectInputError("Slug may contain lowercase letters, numbers, and single hyphens.");
  const description = requiredText(body.description, "Description", 5000);
  const project_section = parseProjectSection(body.project_section);
  const tech_stack = body.tech_stack === undefined ? [] : parseTechStack(body.tech_stack);
  if (body.featured !== undefined && typeof body.featured !== "boolean") throw new ProjectInputError("featured must be a boolean.");
  const image_url = body.image_url === undefined ? null : parseHttpsUrl(body.image_url, "Image URL");
  const live_url = body.live_url === undefined ? null : parseHttpsUrl(body.live_url, "Live URL");
  const github_url = body.github_url === undefined ? null : parseHttpsUrl(body.github_url, "GitHub URL");
  return { title, slug, description, project_section, tech_stack, image_url, live_url, github_url, featured: (body.featured as boolean | undefined) ?? false };
}

export function parseUpdateProject(body: Record<string, unknown>): UpdateProjectInput {
  const update: UpdateProjectInput = {};
  if ("title" in body) update.title = requiredText(body.title, "Title", 120);
  if ("slug" in body) {
    update.slug = requiredText(body.slug, "Slug", 120);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(update.slug)) throw new ProjectInputError("Slug may contain lowercase letters, numbers, and single hyphens.");
  }
  if ("description" in body) update.description = requiredText(body.description, "Description", 5000);
  if ("project_section" in body) update.project_section = parseProjectSection(body.project_section);
  if ("tech_stack" in body) update.tech_stack = parseTechStack(body.tech_stack);
  if ("featured" in body) {
    if (typeof body.featured !== "boolean") throw new ProjectInputError("featured must be a boolean.");
    update.featured = body.featured;
  }
  for (const [field, label] of [["image_url", "Image URL"], ["live_url", "Live URL"], ["github_url", "GitHub URL"]] as const) {
    if (field in body) update[field] = parseHttpsUrl(body[field], label);
  }
  if (!Object.keys(update).length) throw new ProjectInputError("At least one project field is required.");
  return update;
}

export function requireFreshProjectStorageReceipt(imageUrl: string, body: Record<string, unknown>) {
  if (typeof body.image_storage_path !== "string" || !body.image_storage_path.trim() || typeof body.image_upload_receipt !== "string") {
    throw new ProjectInputError("Upload the project image through the admin uploader before saving it.");
  }
  if (!isSupabaseProjectImageUrl(imageUrl, body.image_storage_path)) {
    throw new ProjectInputError("Project images must use the portfolio-projects Supabase Storage bucket.");
  }
  if (!isValidProjectStorageReceipt(imageUrl, body.image_storage_path, body.image_upload_receipt)) {
    throw new ProjectInputError("The project image upload could not be verified. Upload the image again before saving.");
  }
}
