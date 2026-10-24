"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Project } from "@/repositories/projects.repository";

const capabilities = [
  { number: "01", name: "DIGITAL EXPERIENCES", title: "Web Design & Development", description: "Designing polished digital experiences and building responsive full-stack websites with modern frontend technologies.", visual: "design", className: "capability-design-dev" },
  { number: "02", name: "BUSINESS PLATFORMS", title: "E-commerce & Management Systems", description: "Building online stores, inventory tools, operational dashboards, and software that simplifies business workflows.", visual: "management", className: "capability-commerce-management" },
  { number: "03", name: "INTELLIGENCE & FLOW", title: "AI, RAG & Workflow Automation", description: "Creating knowledge-retrieval systems, vector-search workflows, and practical automations that connect applications and data.", visual: "rag", className: "capability-ai-automation" },
  { number: "04", name: "APPLICATION FOUNDATIONS", title: "Backend & Data Systems", description: "Developing APIs, authentication, database integrations, and reliable data flows for web applications.", visual: "backend", className: "capability-backend-data" },
] as const;

export function CapabilityShowcase() {
  return <section className="story-section capability-section" id="capabilities" aria-labelledby="capability-heading">
    <div className="capability-intro story-inner">
      <div className="story-index"><span>03</span><i/> WHAT I BUILD</div>
      <h2 id="capability-heading">From first sketch<br/>to <em>living system.</em></h2>
      <p>Design-led interfaces and the systems behind them, shaped into one clear experience.</p>
    </div>
    <div className="capability-grid story-inner">
      {capabilities.map((capability) => <article className={`capability-card ${capability.className}`} key={capability.number}>
        <div className={`cap-visual cap-visual-${capability.visual}`} aria-hidden="true"><CapabilityVisual type={capability.visual}/></div>
        <div className="capability-copy"><div className="capability-label"><span>{capability.number}</span><i/>{capability.name}</div><h3>{capability.title}</h3><p>{capability.description}</p></div>
        <span className="capability-arrow" aria-hidden="true">↗</span>
      </article>)}
    </div>
  </section>;
}

type CapabilityVisualType = "design" | "fullstack" | "commerce" | "management" | "rag" | "automation" | "backend";

function CapabilityVisual({ type }: { type: CapabilityVisualType }) {
  if (type === "design") return <>
    <div className="design-window cap-visual-layer"><div className="window-chrome"><i/><i/><i/><span>studio / home</span></div><div className="design-preview"><div className="design-preview-nav"><b>FORME</b><span>SPACE · OBJECT · LIGHT</span></div><div className="design-preview-heading">A softer<br/><em>kind of living.</em></div><div className="design-preview-foot"><span>EXPLORE THE COLLECTION</span><i>↗</i></div><div className="design-preview-sun"/></div></div>
    <div className="design-side-panel cap-visual-layer"><span>LAYOUT STUDY</span><i/><i/><b/><small>01 — 03</small></div>
        <div className="design-orbit cap-visual-detail"/>
  </>;
  if (type === "fullstack") return <div className="fullstack-stack cap-visual-layer"><div className="mini-app"><span>APPLICATION</span><i/><i/><b/></div><div className="connect-path"><i/><i/><i/></div><div className="mini-service"><b>API</b><i/><i/></div><div className="mini-data"><i/><i/><i/></div></div>;
  if (type === "commerce") return <div className="commerce-stack cap-visual-layer"><div className="shop-window"><span>OBJECTS / 04</span><div className="shop-products"><i/><i/><i/></div><b>THE DAILY EDIT <small>↗</small></b></div><div className="shop-detail"><span>01 / SELECTED</span><i/><b/><small>ADD TO BAG</small></div></div>;
  if (type === "management") return <div className="manage-panel cap-visual-layer"><div className="manage-top"><span>OVERVIEW</span><i/></div><div className="manage-bars"><i/><i/><i/><i/><i/><i/><i/></div><svg viewBox="0 0 220 70" aria-hidden="true"><path d="M3 56 C36 48 38 23 72 35 S112 54 137 30 S179 21 217 7"/></svg><div className="manage-rows"><i/><i/><i/></div></div>;
  if (type === "rag") return <div className="rag-flow cap-visual-layer"><div className="rag-doc"><i/><i/><i/><i/><b>PDF</b></div><div className="rag-nodes"><i/><i/><i/><i/></div><div className="rag-answer"><b>CONTEXT</b><i/><i/><small>grounded response</small></div></div>;
  if (type === "automation") return <div className="automation-flow cap-visual-layer"><div><i>01</i><b>TRIGGER</b></div><span/><div><i>02</i><b>FILTER</b></div><span/><div><i>03</i><b>SYNC</b></div><span/><div><i>04</i><b>DONE</b></div></div>;
  return <div className="backend-flow cap-visual-layer"><div className="db-cylinder"><i/><i/><i/><b>DATA</b></div><span/><div className="backend-api"><b>API</b><i/><i/></div><span/><div className="backend-ui"><i/><i/><b/></div></div>;
}

function ProjectArtwork({ project, index, className = "", priority = false }: { project: Project; index: number; className?: string; priority?: boolean }) {
  return <div className={`project-artwork ${className} ${project.image_url ? "has-project-image" : `project-art-fallback project-art-fallback-${index % 4}`}`}>
    {project.image_url ? <Image src={project.image_url} alt={`${project.title} project preview`} fill sizes="(max-width: 700px) 92vw, (max-width: 1100px) 75vw, 65vw" priority={priority}/> : <div className="project-art-placeholder"><span>IMAGE STUDY / {String(index + 1).padStart(2, "0")}</span><b>{project.title}</b><i/><small>PROJECT VISUAL TO FOLLOW</small></div>}
  </div>;
}

export function ProjectGallery({ projects, unavailable }: { projects: Project[]; unavailable: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  useEffect(() => {
    if (projects.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % projects.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [projects.length]);
  function transition(direction: -1 | 1) {
    if (projects.length < 2) return;
    const nextIndex = (activeIndex + direction + projects.length) % projects.length;
    setActiveIndex(nextIndex);
  }
  if (!projects.length) return <ProjectEmptyState unavailable={unavailable} />;
  const project = projects[activeIndex];
  const hasSidePreviews = projects.length > 2;
  const previous = hasSidePreviews ? projects[(activeIndex - 1 + projects.length) % projects.length] : null;
  const next = projects.length > 1 ? projects[(activeIndex + 1) % projects.length] : null;

  return <section className="story-section project-gallery" id="web-design" aria-labelledby="gallery-heading">
    <div className="gallery-head story-inner"><div><div className="story-index"><span>05</span><i/> WEB DESIGN</div><h2 id="gallery-heading">Designed to <em>feel.</em></h2></div><p>Website concepts, visual experiments, and digital experiences.</p></div>
    <div className="gallery-backdrop">
      <SidePreview project={previous} index={activeIndex} side="left" onSelect={() => transition(-1)}/>
      <div className="gallery-stage">
        <div className="website-browser"><div className="website-browser-bar"><span/><span/><span/><small>{project.slug}</small><b>DESIGN CONCEPT</b></div><div className="gallery-slide-media" key={activeIndex}>{project.live_url ? <a className="gallery-image-link" href={project.live_url} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} design`}><ProjectArtwork project={project} index={activeIndex} className="gallery-main-art"/></a> : project.image_url ? <div className="gallery-image-link" role="button" tabIndex={0} onClick={() => setLightboxOpen(true)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setLightboxOpen(true); } }} aria-label={`Open ${project.title} design image`}><ProjectArtwork project={project} index={activeIndex} className="gallery-main-art"/></div> : <ProjectArtwork project={project} index={activeIndex} className="gallery-main-art"/>}</div></div>
        <div className="gallery-stage-note"><span>PROJECT / {String(activeIndex + 1).padStart(2, "0")}</span><i/> SELECTED FRAME</div>
      </div>
      <SidePreview project={next} index={(activeIndex + 1) % projects.length} side="right" onSelect={() => transition(1)}/>
      <div className="gallery-details" aria-live="polite">
        <div className="gallery-details-content" key={activeIndex}>
          <div className="gallery-project-copy"><div className="gallery-project-index">{String(activeIndex + 1).padStart(2, "0")} <i/> {project.tech_stack?.slice(0, 2).join(" · ") || "DIGITAL EXPERIENCE"}</div><h3>{project.title}</h3><p>{project.description}</p></div>
          <div className="gallery-project-links">{project.live_url ? <a href={project.live_url} target="_blank" rel="noopener noreferrer">VIEW DESIGN</a> : project.image_url ? <button type="button" className="gallery-link-button" onClick={() => setLightboxOpen(true)}>VIEW DESIGN</button> : <span className="gallery-link-unavailable">DESIGN PREVIEW UNAVAILABLE</span>}{project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer">SOURCE</a>}</div>
        </div>
      </div>
      <div className="gallery-controls"><span className="gallery-progress-label">{String(activeIndex + 1).padStart(2, "0")} <i/> {String(projects.length).padStart(2, "0")}</span><div className="gallery-progress" role="progressbar" aria-label="Project gallery position" aria-valuemin={1} aria-valuemax={projects.length} aria-valuenow={activeIndex + 1}><span style={{ transform: `scaleX(${(activeIndex + 1) / projects.length})` }}/></div><div className="gallery-buttons"><button type="button" onClick={() => transition(-1)} disabled={projects.length < 2} aria-label="Previous project">←</button><button type="button" onClick={() => transition(1)} disabled={projects.length < 2} aria-label="Next project">→</button></div></div>
    </div>
    {lightboxOpen && project.image_url && <div className="project-lightbox" role="dialog" aria-modal="true" aria-label={`${project.title} design preview`} tabIndex={-1} autoFocus onKeyDown={(event) => { if (event.key === "Escape") setLightboxOpen(false); }} onClick={(event) => { if (event.target === event.currentTarget) setLightboxOpen(false); }}><button type="button" className="project-lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Close design preview">×</button><Image src={project.image_url} alt={`${project.title} full design preview`} fill sizes="100vw"/></div>}
  </section>;
}

function SidePreview({ project, index, side, onSelect }: { project: Project | null; index: number; side: "left" | "right"; onSelect: () => void }) {
  return <button type="button" className={`gallery-side gallery-side-${side}`} onClick={onSelect} disabled={!project} aria-label={project ? `View ${project.title}` : "More project previews coming soon"}>
    {project ? <><ProjectArtwork project={project} index={index}/><span>{project.title}</span></> : <><span className="gallery-side-empty">MORE<br/>STORIES<br/>SOON</span><i>+</i></>}
  </button>;
}

function ProjectEmptyState({ unavailable }: { unavailable: boolean }) {
  return <section className="story-section project-empty project-empty-gallery" id="web-design"><div className="story-inner"><div className="story-index"><span>05</span><i/> WEB DESIGN</div><h2>{unavailable ? <>Sites are<br/><em>reloading.</em></> : <>Designed to<br/><em>feel.</em></>}</h2><p>{unavailable ? "Website projects are temporarily unavailable. Please check back in a little while." : "No featured Web Design projects yet. Assign a project to Web Design in admin to show it here. Each item will be clearly marked as a design concept or demo."}</p><span className="empty-orbit" aria-hidden="true">✳</span></div></section>;
}
export function WebAppProjects({ projects, unavailable }: { projects: Project[]; unavailable: boolean }) {
  return <section className="story-section featured-apps" id="work" aria-labelledby="web-applications-heading">
    <header className="featured-apps-heading">
      <div className="story-index"><span>04</span><i/> WEBSITE / WEB APP</div>
      <h2 id="web-applications-heading">Web Applications</h2>
      <p>Selected projects exploring web development, intelligent systems, and practical digital experiences.</p>
    </header>
    {projects.length ? <div className="featured-apps-grid">
      {projects.map((project, index) => {
        let liveUrl: string | null = null;
        try {
          const parsedUrl = new URL(project.live_url || "");
          if (parsedUrl.protocol === "https:") liveUrl = parsedUrl.toString();
        } catch {
          liveUrl = null;
        }
        const previewContent = project.image_url
          ? <Image src={project.image_url} alt={`${project.title} project preview`} fill sizes="(max-width: 700px) 92vw, (max-width: 1100px) 44vw, 29vw" priority={index < 3}/>
          : <span className="featured-app-no-preview">Preview unavailable</span>;
        const preview = liveUrl
          ? <a className="featured-app-preview" href={liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} live project in a new tab`}>{previewContent}</a>
          : <div className="featured-app-preview">{previewContent}</div>;
        return <article className="featured-app-card" key={project.id}>
          {preview}
          <div className="featured-app-content">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {project.tech_stack?.length > 0 && <ul className="featured-app-tags" aria-label={`${project.title} technologies`}>{project.tech_stack.map((technology) => <li key={technology}>{technology}</li>)}</ul>}
            <div className="featured-app-actions">
              {liveUrl && <a className="featured-app-primary" href={liveUrl} target="_blank" rel="noopener noreferrer">View Project <span aria-hidden="true">↗</span></a>}
              {project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer">GitHub</a>}
            </div>
          </div>
        </article>;
      })}
    </div> : <div className="featured-apps-empty"><span>{unavailable ? "PROJECTS TEMPORARILY UNAVAILABLE" : "NO FEATURED WEB APPS YET"}</span><p>{unavailable ? "Project data could not be loaded. Please try again later." : "Assign a project to Website / Web App in admin and feature it to add it here."}</p></div>}
  </section>;
}
