import { cacheLife, cacheTag } from "next/cache";
import { projectsService } from "@/services/projects.service";
import { skillsService } from "@/services/skills.service";

export const PUBLIC_PROJECTS_TAG = "public-portfolio-projects";
export const PUBLIC_SKILLS_TAG = "public-portfolio-skills";

export async function getCachedPublicProjects() {
  "use cache";
  cacheLife({ revalidate: 86_400 });
  cacheTag(PUBLIC_PROJECTS_TAG);
  return projectsService.getAllProjects();
}

export async function getCachedPublicSkills() {
  "use cache";
  cacheLife({ revalidate: 86_400 });
  cacheTag(PUBLIC_SKILLS_TAG);
  return skillsService.getAllSkills();
}

export async function getCachedPortfolioYear() {
  "use cache";
  cacheLife({ revalidate: 86_400 });
  return new Date().getFullYear();
}
