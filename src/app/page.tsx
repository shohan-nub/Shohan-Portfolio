import { CinematicIntro } from "@/components/cinematic-intro";
import { PortfolioStory } from "@/components/portfolio-story";
import { getCachedPortfolioYear, getCachedPublicProjects, getCachedPublicSkills } from "@/services/public-portfolio-cache";

export const instant = false;

export default async function Home() {
  const [[projectResult, skillResult], currentYear] = await Promise.all([
    Promise.allSettled([getCachedPublicProjects(), getCachedPublicSkills()]),
    getCachedPortfolioYear(),
  ]);
  const projects = projectResult.status === "fulfilled" ? projectResult.value : [];
  const skills = skillResult.status === "fulfilled" ? skillResult.value : [];

  return <main>
    <CinematicIntro />
    <PortfolioStory projects={projects} skills={skills} currentYear={currentYear} projectUnavailable={projectResult.status === "rejected"} skillsUnavailable={skillResult.status === "rejected"} />
  </main>;
}
