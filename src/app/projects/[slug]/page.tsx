import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projectsService } from "@/services/projects.service";

export const instant = false;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let projects;
  try {
    projects = await projectsService.getAllProjects();
  } catch {
    return <main className="detail-page"><header className="site-header"><Link className="wordmark" href="/">â† BACK TO PORTFOLIO</Link><span className="eyebrow">PROJECT / TEMPORARILY UNAVAILABLE</span></header><article><p className="eyebrow">PLEASE TRY AGAIN</p><h1>Project stories are reloading.</h1><p className="detail-description">The portfolio database could not be reached just now. Please return to the landing page and try again shortly.</p></article></main>;
  }
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  return <main className="detail-page"><header className="site-header"><Link className="wordmark" href="/">← BACK TO PORTFOLIO</Link><span className="eyebrow">PROJECT / {project.slug.toUpperCase()}</span></header><article><p className="eyebrow">{project.project_section === "web_design" ? "DESIGN CONCEPT / DEMO DESIGN" : "SELECTED WEB APP"}</p><h1>{project.title}</h1><p className="detail-description">{project.description}</p>{project.image_url && <Image className="detail-image" src={project.image_url} alt={project.title} width={1600} height={1000}/>}<div className="detail-bottom"><div><p className="eyebrow">BUILT WITH</p><p>{project.tech_stack?.join(" · ") || "—"}</p></div><div className="detail-links">{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">LIVE PROJECT ↗</a>}{project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer">SOURCE CODE ↗</a>}</div></div></article></main>;
}
