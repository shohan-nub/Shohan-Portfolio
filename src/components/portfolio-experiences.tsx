"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Ref } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/repositories/projects.repository";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const capabilities = [
  { number: "01", name: "DIGITAL EXPERIENCES", title: "Web Design & Development", description: "Designing polished digital experiences and building responsive full-stack websites with modern frontend technologies.", visual: "design", className: "capability-design-dev" },
  { number: "02", name: "BUSINESS PLATFORMS", title: "E-commerce & Management Systems", description: "Building online stores, inventory tools, operational dashboards, and software that simplifies business workflows.", visual: "management", className: "capability-commerce-management" },
  { number: "03", name: "INTELLIGENCE & FLOW", title: "AI, RAG & Workflow Automation", description: "Creating knowledge-retrieval systems, vector-search workflows, and practical automations that connect applications and data.", visual: "rag", className: "capability-ai-automation" },
  { number: "04", name: "APPLICATION FOUNDATIONS", title: "Backend & Data Systems", description: "Developing APIs, authentication, database integrations, and reliable data flows for web applications.", visual: "backend", className: "capability-backend-data" },
] as const;

export function CapabilityShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const section = root.current;
    if (!section) return;
    const heading = section.querySelector<HTMLElement>(".capability-intro h2");
    const intro = section.querySelector<HTMLElement>(".capability-intro > p");
    const cards = section.querySelectorAll<HTMLElement>(".capability-card");
    const entrance = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 72%", once: true } });
    if (heading) entrance.fromTo(heading, { autoAlpha: 0, y: 18 }, {
      autoAlpha: 1, y: 0, duration: .52, ease: "power2.out", clearProps: "opacity,visibility,transform", immediateRender: false,
    }, .08);
    if (intro) entrance.fromTo(intro, { autoAlpha: 0, y: 10 }, {
      autoAlpha: 1, y: 0, duration: .42, ease: "power2.out", clearProps: "opacity,visibility,transform", immediateRender: false,
    }, .16);
    if (cards.length) entrance.fromTo(cards, { autoAlpha: 0, y: 20 }, {
      autoAlpha: 1, y: 0, duration: .5, stagger: .07, ease: "power2.out", clearProps: "opacity,visibility,transform", immediateRender: false,
    }, .28);
  }, { scope: root });

  return <section className="story-section capability-section" id="capabilities" ref={root} aria-labelledby="capability-heading">
    <div className="capability-intro story-inner">
      <div className="story-index" data-reveal><span>03</span><i/> WHAT I BUILD</div>
      <h2 id="capability-heading" data-reveal>From first sketch<br/>to <em>living system.</em></h2>
      <p data-reveal>Design-led interfaces and the systems behind them, shaped into one clear experience.</p>
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
    <span className="artwork-shine" aria-hidden="true"/>
  </div>;
}

export function ProjectGallery({ projects, unavailable }: { projects: Project[]; unavailable: boolean }) {
  const root = useRef<HTMLElement>(null);
  const transitioning = useRef(false);
  const transitionTimeline = useRef<gsap.core.Timeline | null>(null);
  const transitionDelay = useRef<gsap.core.Tween | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const transitionRef = useRef<(direction: -1 | 1) => void>(() => {});
  useGSAP(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    if (!projects.length) {
      const emptySection = root.current;
      const emptyContent = emptySection?.querySelectorAll<HTMLElement>(".story-inner > .story-index, .story-inner > h2, .story-inner > p, .story-inner > .empty-orbit");
      if (emptySection && emptyContent?.length) gsap.fromTo(emptyContent, { autoAlpha: 0, y: 14 }, {
        autoAlpha: 1, y: 0, duration: .48, stagger: .06, ease: "power2.out", immediateRender: false,
        scrollTrigger: { trigger: emptySection, start: "top 82%", once: true },
      });
      return;
    }
    const galleryHeading = root.current?.querySelector<HTMLElement>(".gallery-head");
    const galleryBackdrop = root.current?.querySelector<HTMLElement>(".gallery-backdrop");
    if (galleryHeading) gsap.fromTo(galleryHeading, { autoAlpha: 0, y: 14 }, {
      autoAlpha: 1, y: 0, duration: .58, ease: "power2.out", clearProps: "opacity,visibility,transform", immediateRender: false,
      scrollTrigger: { trigger: galleryHeading, start: "top 82%", once: true },
    });
    if (galleryBackdrop) gsap.fromTo(galleryBackdrop, { autoAlpha: 0, y: 14 }, {
      autoAlpha: 1, y: 0, duration: .58, ease: "power2.out", clearProps: "opacity,visibility,transform", immediateRender: false,
      scrollTrigger: { trigger: galleryBackdrop, start: "top 78%", once: true },
    });
    return () => {
      transitionTimeline.current?.kill();
      transitionDelay.current?.kill();
    };
  }, { scope: root });

  function transition(direction: -1 | 1) {
    if (projects.length < 2 || transitioning.current) return;
    const nextIndex = (activeIndex + direction + projects.length) % projects.length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveIndex(nextIndex);
      return;
    }
    const stage = root.current?.querySelector<HTMLElement>(".gallery-stage");
    if (!stage) return;
    transitioning.current = true;
    setIsTransitioning(true);
    const details = root.current?.querySelector<HTMLElement>(".gallery-details");
    transitionTimeline.current = gsap.timeline({ onComplete: () => {
      setActiveIndex(nextIndex);
      transitionDelay.current = gsap.delayedCall(.08, () => {
        const nextStage = root.current?.querySelector<HTMLElement>(".gallery-stage");
        if (!nextStage) { transitioning.current = false; setIsTransitioning(false); return; }
        const nextDetails = root.current?.querySelector<HTMLElement>(".gallery-details");
        const enter = gsap.timeline({ onComplete: () => { transitioning.current = false; setIsTransitioning(false); } });
        transitionTimeline.current = enter;
        if (nextDetails) enter.set(nextDetails, { autoAlpha: 1, y: 0, clearProps: "opacity,visibility,transform" }, 0);
        enter.fromTo(nextStage, { autoAlpha: 0, xPercent: direction * 2.5 }, {
          autoAlpha: 1, xPercent: 0, duration: .42, ease: "power2.out", clearProps: "transform",
        }).fromTo(nextStage.parentElement?.querySelectorAll<HTMLElement>(".gallery-project-copy, .gallery-project-links") ?? [], { autoAlpha: 0, y: 8 }, {
          autoAlpha: 1, y: 0, duration: .34, stagger: .04, ease: "power2.out",
        }, "-=.3");
      });
    } });
    transitionTimeline.current.to(stage, { autoAlpha: 0, xPercent: -direction * 2.5, duration: .24, ease: "power2.in" }, 0);
    if (details) transitionTimeline.current.to(details, { autoAlpha: 0, y: 6, duration: .2, ease: "power2.in" }, 0);
  }

  useEffect(() => {
    transitionRef.current = transition;
  });

  useEffect(() => {
    const section = root.current;
    if (!section || !projects.length) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.08 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [projects.length]);

  useEffect(() => {
    if (projects.length < 2 || !isInView || isHovered || isInteracting) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const clearTimer = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };
    const syncTimer = () => {
      clearTimer();
      if (document.visibilityState === "visible" && !reducedMotion.matches) {
        timer = setInterval(() => transitionRef.current(1), 3500);
      }
    };

    syncTimer();
    document.addEventListener("visibilitychange", syncTimer);
    reducedMotion.addEventListener("change", syncTimer);
    return () => {
      clearTimer();
      document.removeEventListener("visibilitychange", syncTimer);
      reducedMotion.removeEventListener("change", syncTimer);
    };
  }, [projects.length, isInView, isHovered, isInteracting]);

  if (!projects.length) return <ProjectEmptyState unavailable={unavailable} root={root} />;
  const project = projects[activeIndex];
  const hasSidePreviews = projects.length > 2;
  const previous = hasSidePreviews ? projects[(activeIndex - 1 + projects.length) % projects.length] : null;
  const next = projects.length > 1 ? projects[(activeIndex + 1) % projects.length] : null;

  return <section className="story-section project-gallery" id="web-design" ref={root} aria-labelledby="gallery-heading">
    <div className="gallery-head story-inner"><div><div className="story-index"><span>05</span><i/> WEB DESIGN</div><h2 id="gallery-heading">Designed to <em>feel.</em></h2></div><p>Website concepts, visual experiments, and digital experiences.</p></div>
    <div className="gallery-backdrop" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onPointerDownCapture={() => setIsInteracting(true)} onPointerUpCapture={() => setIsInteracting(false)} onPointerCancelCapture={() => setIsInteracting(false)} onFocusCapture={() => setIsInteracting(true)} onKeyDownCapture={() => setIsInteracting(true)} onKeyUpCapture={(event) => { if (!event.currentTarget.contains(document.activeElement)) setIsInteracting(false); }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsInteracting(false); }}>
      <SidePreview project={previous} index={activeIndex} side="left" onSelect={() => transition(-1)}/>
      <div className="gallery-stage" key={project.id}>
        <div className="website-browser"><div className="website-browser-bar"><span/><span/><span/><small>{project.slug}</small><b>DESIGN CONCEPT</b></div>{project.live_url ? <a className="gallery-image-link" href={project.live_url} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} design`}><ProjectArtwork project={project} index={activeIndex} className="gallery-main-art"/></a> : project.image_url ? <div className="gallery-image-link" role="button" tabIndex={0} onClick={() => setLightboxOpen(true)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setLightboxOpen(true); } }} aria-label={`Open ${project.title} design image`}><ProjectArtwork project={project} index={activeIndex} className="gallery-main-art"/></div> : <ProjectArtwork project={project} index={activeIndex} className="gallery-main-art"/>}</div>
        <div className="gallery-stage-note"><span>PROJECT / {String(activeIndex + 1).padStart(2, "0")}</span><i/> SELECTED FRAME</div>
      </div>
      <SidePreview project={next} index={(activeIndex + 1) % projects.length} side="right" onSelect={() => transition(1)}/>
      <div className="gallery-details" aria-live="polite">
        <div className="gallery-project-copy"><div className="gallery-project-index">{String(activeIndex + 1).padStart(2, "0")} <i/> {project.tech_stack?.slice(0, 2).join(" · ") || "DIGITAL EXPERIENCE"}</div><h3>{project.title}</h3><p>{project.description}</p></div>
        <div className="gallery-project-links">{project.live_url ? <a href={project.live_url} target="_blank" rel="noopener noreferrer">VIEW DESIGN</a> : project.image_url ? <button type="button" className="gallery-link-button" onClick={() => setLightboxOpen(true)}>VIEW DESIGN</button> : <span className="gallery-link-unavailable">DESIGN PREVIEW UNAVAILABLE</span>}{project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer">SOURCE</a>}<Link href={`/projects/${encodeURIComponent(project.slug)}`}>PROJECT NOTES</Link></div>
      </div>
      <div className="gallery-controls"><span className="gallery-progress-label">{String(activeIndex + 1).padStart(2, "0")} <i/> {String(projects.length).padStart(2, "0")}</span><div className="gallery-progress" role="progressbar" aria-label="Project gallery position" aria-valuemin={1} aria-valuemax={projects.length} aria-valuenow={activeIndex + 1}><span style={{ transform: `scaleX(${(activeIndex + 1) / projects.length})` }}/></div><div className="gallery-buttons"><button type="button" onClick={() => transition(-1)} disabled={projects.length < 2 || isTransitioning} aria-label="Previous project">←</button><button type="button" onClick={() => transition(1)} disabled={projects.length < 2 || isTransitioning} aria-label="Next project">→</button></div></div>
    </div>
    {lightboxOpen && project.image_url && <div className="project-lightbox" role="dialog" aria-modal="true" aria-label={`${project.title} design preview`} tabIndex={-1} autoFocus onKeyDown={(event) => { if (event.key === "Escape") setLightboxOpen(false); }} onClick={(event) => { if (event.target === event.currentTarget) setLightboxOpen(false); }}><button type="button" className="project-lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Close design preview">×</button><Image src={project.image_url} alt={`${project.title} full design preview`} fill sizes="100vw"/></div>}
  </section>;
}

function SidePreview({ project, index, side, onSelect }: { project: Project | null; index: number; side: "left" | "right"; onSelect: () => void }) {
  return <button type="button" className={`gallery-side gallery-side-${side}`} onClick={onSelect} disabled={!project} aria-label={project ? `View ${project.title}` : "More project previews coming soon"}>
    {project ? <><ProjectArtwork project={project} index={index}/><span>{project.title}</span></> : <><span className="gallery-side-empty">MORE<br/>STORIES<br/>SOON</span><i>+</i></>}
  </button>;
}

function ProjectEmptyState({ unavailable, root }: { unavailable: boolean; root: Ref<HTMLElement> }) {
  return <section ref={root} className="story-section project-empty project-empty-gallery" id="web-design"><div className="story-inner"><div className="story-index"><span>05</span><i/> WEB DESIGN</div><h2>{unavailable ? <>Sites are<br/><em>reloading.</em></> : <>Designed to<br/><em>feel.</em></>}</h2><p>{unavailable ? "Website projects are temporarily unavailable. Please check back in a little while." : "No featured Web Design projects yet. Assign a project to Web Design in admin to show it here. Each item will be clearly marked as a design concept or demo."}</p><span className="empty-orbit" aria-hidden="true">✳</span></div></section>;
}
export function ImmersiveProjectRail({ projects, unavailable }: { projects: Project[]; unavailable: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!projects.length) {
      const emptySection = root.current;
      const emptyContent = emptySection?.querySelectorAll<HTMLElement>(".immersive-heading .story-index, .immersive-heading h2, .immersive-heading > p, .project-category-empty > span, .project-category-empty > p");
      if (emptySection && emptyContent?.length) gsap.fromTo(emptyContent, { autoAlpha: 0, y: 14 }, {
        autoAlpha: 1, y: 0, duration: .48, stagger: .06, ease: "power2.out", immediateRender: false,
        scrollTrigger: { trigger: emptySection, start: "top 82%", once: true },
      });
      return;
    }
    const section = root.current;
    if (!section) return;
    const heading = section.querySelector<HTMLElement>(".immersive-heading");
    const headingContent = heading?.querySelectorAll<HTMLElement>(".story-index, h2, p");
    if (heading && headingContent?.length) gsap.fromTo(headingContent, { autoAlpha: 0, y: 16 }, {
      autoAlpha: 1, y: 0, duration: .48, stagger: .07, ease: "power2.out", immediateRender: false,
      scrollTrigger: { trigger: heading, start: "top 78%", once: true },
    });
    const responsiveLayout = gsap.matchMedia();
    responsiveLayout.add("(min-width: 1000px)", () => {
      const viewport = section.querySelector<HTMLElement>(".immersive-viewport");
      const track = section.querySelector<HTMLElement>(".immersive-track");
      if (!viewport || !track) return;

      const scrollPositionBeforePin = window.scrollY;
      section.classList.remove("immersive-projects--stacked");
      section.classList.add("immersive-projects--horizontal");
      const measureTravelDistance = () => Math.max(
        0,
        track.getBoundingClientRect().width - viewport.getBoundingClientRect().width,
      );
      let travelDistance = measureTravelDistance();
      const refreshTravelDistance = () => {
        travelDistance = measureTravelDistance();
      };
      if (travelDistance < 1) {
        section.classList.remove("immersive-projects--horizontal");
        section.classList.add("immersive-projects--stacked");
        return;
      }

      const gallery = section.parentElement?.querySelector<HTMLElement>("#web-design");
      const originalGalleryMarginTop = gallery?.style.marginTop ?? "";
      const originalGalleryMarginBottom = gallery?.style.marginBottom ?? "";
      if (gallery) {
        const handoffGap = Math.max(0, gallery.getBoundingClientRect().top - viewport.getBoundingClientRect().bottom);
        gallery.style.marginTop = `${-handoffGap}px`;
        gallery.style.marginBottom = `${handoffGap}px`;
      }

      // Re-measure once before ScrollTrigger refreshes, not during each scroll frame.
      ScrollTrigger.addEventListener("refreshInit", refreshTravelDistance);
      gsap.to(track, {
        x: () => -travelDistance,
        force3D: true,
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: "top top+=104",
          end: () => `+=${travelDistance}`,
          pin: viewport,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      let scrollRestoreFrame = 0;
      if (scrollPositionBeforePin > 0) {
        scrollRestoreFrame = window.requestAnimationFrame(() => {
          if (window.scrollY === 0) {
            window.scrollTo({ top: scrollPositionBeforePin, behavior: "instant" });
            ScrollTrigger.update();
          }
        });
      }

      return () => {
        window.cancelAnimationFrame(scrollRestoreFrame);
        ScrollTrigger.removeEventListener("refreshInit", refreshTravelDistance);
        section.classList.remove("immersive-projects--horizontal");
        section.classList.add("immersive-projects--stacked");
        if (gallery) {
          gallery.style.marginTop = originalGalleryMarginTop;
          gallery.style.marginBottom = originalGalleryMarginBottom;
        }
      };
    });
    return () => responsiveLayout.revert();
  }, { scope: root, dependencies: [projects.length], revertOnUpdate: true });

  if (!projects.length) return <section ref={root} className="story-section immersive-projects project-empty-apps" id="work" aria-labelledby="immersive-heading"><div className="immersive-heading story-inner"><div><div className="story-index"><span>04</span><i/> WEBSITE / WEB APP</div><h2 id="immersive-heading">Built to <em>work.</em></h2></div><p>Web applications and digital products built to solve real problems.</p></div><div className="story-inner project-category-empty"><span>{unavailable ? "PROJECTS TEMPORARILY UNAVAILABLE" : "NO FEATURED WEB APPS YET"}</span><p>{unavailable ? "Project data could not be loaded. Please try again later." : "Assign a project to Website / Web App in admin and feature it to add it to this section."}</p></div></section>;
  return <section className="story-section immersive-projects immersive-projects--stacked" id="work" ref={root} aria-labelledby="immersive-heading">
    <div className="immersive-heading story-inner"><div><div className="story-index"><span>04</span><i/> WEBSITE / WEB APP</div><h2 id="immersive-heading">Built to <em>work.</em></h2></div><p>Web applications and digital products built to solve real problems.</p></div>
    <div className="immersive-viewport"><div className="immersive-track">
      {projects.map((project, index) => <article className="immersive-panel" key={project.id}>
        <div className="immersive-panel-top"><span>FIELD NOTE / {String(index + 1).padStart(2, "0")}</span><span>{project.tech_stack?.slice(0, 2).join(" · ") || "SELECTED PROJECT"}</span></div>
        <div className="immersive-ambient" aria-hidden="true"/>
        <Link className="immersive-artwork-link" href={project.live_url || `/projects/${encodeURIComponent(project.slug)}`} target={project.live_url ? "_blank" : undefined} rel={project.live_url ? "noopener noreferrer" : undefined} aria-label={`View ${project.title}${project.live_url ? " live project" : " project details"}`}><ProjectArtwork project={project} index={index} className="immersive-artwork"/></Link>
        <div className="immersive-panel-copy"><span>{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span><h3>{project.title}</h3><p>{project.description}</p><div className="immersive-project-actions">{project.live_url ? <a className="immersive-view-project" href={project.live_url} target="_blank" rel="noopener noreferrer">VIEW PROJECT <b aria-hidden="true">↗</b></a> : <Link className="immersive-view-project" href={`/projects/${encodeURIComponent(project.slug)}`}>VIEW PROJECT <b aria-hidden="true">↗</b></Link>}{project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer">GITHUB</a>}<Link href={`/projects/${encodeURIComponent(project.slug)}`}>PROJECT NOTES</Link></div></div>
      </article>)}
    </div></div>
    <div className="immersive-foot story-inner"><span>SCROLL TO EXPLORE THE STORIES</span><span>A VERTICAL PROJECT JOURNEY</span></div>
  </section>;
}
