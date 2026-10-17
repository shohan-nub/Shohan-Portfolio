"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ContactForm } from "@/components/contact-form";
import { CapabilityShowcase, ImmersiveProjectRail, ProjectGallery } from "@/components/portfolio-experiences";
import type { Project } from "@/repositories/projects.repository";
import type { Skill } from "@/repositories/skills.repository";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const cvSkillGroups = {
  frontend: ["Next.js", "React.js", "TypeScript", "JavaScript", "Tailwind CSS", "GSAP & ScrollTrigger"],
  frontendConcepts: ["App Router", "Server Components"],
  backend: ["Node.js", "Next.js Full-Stack Development", "REST API Development", "Server Actions & Route Handlers", "Authentication (JWT & Supabase)"],
  database: ["PostgreSQL", "SQL", "Supabase", "Drizzle ORM"],
  ai: ["n8n Workflow Automation", "Retrieval-Augmented Generation (RAG)", "Text Embeddings", "pgvector", "Vector Search", "Ollama", "AI API Integration", "Knowledge Retrieval Workflows"],
  seo: ["SEMrush & Keyword Research", "On-Page & Technical SEO", "Metadata & Sitemap Optimization"],
  environment: ["Linux Development Environment"],
  versionControl: ["Git", "GitHub"],
  testing: ["Docker", "Postman"],
  design: ["Figma"],
  aiTools: ["OpenAI Codex", "Claude"],
} as const;

const consolidatedSkillNames = [
  "GSAP", "GSAP ScrollTrigger", "Responsive UI Development", "Component-Based Architecture", "UI/UX Implementation with Figma",
  "JavaScript (ES6+)", "React Server Components", "Client Components", "Server-Side Rendering (SSR)", "Static Site Generation (SSG)", "Incremental Static Regeneration (ISR)", "Data Fetching", "Caching & Revalidation", "SEO", "SEO and Metadata",
  "Next.js Route Handlers", "Next.js Server Actions", "Server Components and Server-Side Logic", "API Integration", "JWT Authentication", "Supabase Authentication", "Authentication and Authorization Fundamentals",
  "Relational Database Design", "Database Queries and CRUD Operations", "Database Integration with Next.js Applications",
  "n8n", "Embeddings", "Application and API Integrations", "Figma (UI/UX Design)", "Codex", "SEMrush-Based SEO Research", "Keyword Research Fundamentals", "Search Intent Analysis", "On-Page SEO", "Metadata Optimization", "Technical SEO Fundamentals", "Sitemap and robots.txt Configuration", "Search Engine Indexing Fundamentals", "Website Structure and Crawlability", "Next.js Metadata and SEO Configuration", "Performance-Aware Rendering and Caching",
];
const curatedSkillNames = new Set([...Object.values(cvSkillGroups).flat(), ...consolidatedSkillNames].map((name) => name.toLowerCase()));

export function PortfolioStory({ projects, skills, currentYear, projectUnavailable, skillsUnavailable }: { projects: Project[]; skills: Skill[]; currentYear: number; projectUnavailable: boolean; skillsUnavailable: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const desktopMotion = window.matchMedia("(min-width: 768px)").matches;
    const aboutMotion = gsap.matchMedia();
    gsap.utils.toArray<HTMLElement>(".story-section:not(.capability-section):not(.project-gallery):not(.immersive-projects)", root.current).forEach((section) => {
      if (section.classList.contains("story-about")) {
        const label = section.querySelector<HTMLElement>(".story-index");
        const card = section.querySelector<HTMLElement>(".about-portrait-card");
        const portrait = section.querySelector<HTMLElement>(".about-portrait-image");
        const heading = section.querySelector<HTMLElement>(".about-heading");
        const introduction = section.querySelector<HTMLElement>(".about-foot p");
        const details = section.querySelectorAll<HTMLElement>(".about-details article");
        const compactMotion = window.matchMedia("(max-width: 650px)").matches;
        const entranceX = compactMotion ? -24 : -54;
        const aboutTimeline = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 76%", once: true },
        });

        if (label) aboutTimeline.fromTo(label, { autoAlpha: 0, y: 10 }, {
          autoAlpha: 1, y: 0, duration: .45, ease: "power2.out", immediateRender: false,
        });
        if (card) aboutTimeline.fromTo(card, { autoAlpha: 0, x: entranceX, y: 16, rotation: -2.2 }, {
          autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: 1.05, ease: "power3.out", immediateRender: false,
        }, "-=.12");
        if (heading) aboutTimeline.fromTo(heading, { autoAlpha: 0, y: 18, clipPath: "inset(0 0 100% 0)" }, {
          autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: .82, ease: "power3.out", immediateRender: false,
        }, "-=.76");
        if (portrait) aboutTimeline.fromTo(portrait, { autoAlpha: 0, y: 16 }, {
          autoAlpha: 1, y: 0, duration: .88, ease: "power3.out", immediateRender: false,
        }, "-=.52");
        if (introduction) aboutTimeline.fromTo(introduction, { autoAlpha: 0, x: 24, y: 8 }, {
          autoAlpha: 1, x: 0, y: 0, duration: .68, ease: "power3.out", immediateRender: false,
        }, "-=.4");
        if (details.length) aboutTimeline.fromTo(details, { autoAlpha: 0, x: 14, y: 14 }, {
          autoAlpha: 1, x: 0, y: 0, duration: .66, stagger: .12, ease: "power3.out", immediateRender: false,
        }, "-=.28");

        aboutMotion.add("(min-width: 1000px)", () => {
          const portraitColumn = section.querySelector<HTMLElement>(".about-portrait-column");
          const copyColumn = section.querySelector<HTMLElement>(".about-copy");
          if (!portraitColumn || !copyColumn) return;

          const scene = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${Math.round(Math.max(420, window.innerHeight * .55))}`,
              pin: section,
              pinSpacing: true,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          scene.fromTo(portraitColumn, { y: 0 }, { y: 64, duration: .62, ease: "none", immediateRender: false }, 0)
            .fromTo(copyColumn, { y: 0 }, { y: 64, duration: .62, ease: "none", immediateRender: false }, .42)
            .to([portraitColumn, copyColumn], { y: 0, duration: .28, ease: "power2.inOut" }, 1.04);

          return () => {
            scene.scrollTrigger?.kill();
            scene.kill();
          };
        });
        return;
      }

      if (section.classList.contains("skills-story")) {
        const heading = section.querySelector<HTMLElement>(".skills-story-heading");
        const intro = section.querySelector<HTMLElement>(".skills-story-intro");
        if (heading) gsap.fromTo(heading, { y: 20, clipPath: "inset(0 0 100% 0)" }, {
          y: 0, clipPath: "inset(0 0 0% 0)", duration: .68, ease: "power3.out", immediateRender: false,
          scrollTrigger: { trigger: section, start: "top 74%", once: true },
        });
        if (intro) gsap.fromTo(intro, { y: 14, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: .52, ease: "power2.out", immediateRender: false,
          scrollTrigger: { trigger: section, start: "top 74%", once: true },
        });
        gsap.utils.toArray<HTMLElement>(".skill-editorial-card", section).forEach((card, index) => {
          const x = index % 2 === 0 ? -14 : 14;
          const panelReveal = gsap.timeline({
            delay: (index % 3) * .055,
            scrollTrigger: { trigger: card, start: "top 86%", once: true },
          });
          panelReveal.fromTo(card, { x, y: 20, autoAlpha: 0 }, {
            x: 0, y: 0, autoAlpha: 1, duration: .58,
            ease: "power2.out", clearProps: "opacity,visibility,transform", immediateRender: false,
          });
          const pipeline = card.querySelector<SVGPathElement>(".skill-network-illustration path:last-child");
          if (pipeline) panelReveal.fromTo(pipeline, { strokeDashoffset: 620 }, {
            strokeDashoffset: 0, duration: .68, ease: "power2.out", immediateRender: false,
          }, .12);
          const architecture = card.querySelector<HTMLElement>(".skill-architecture-visual");
          if (architecture) panelReveal.fromTo(architecture.children, { y: 7, autoAlpha: 0 }, {
            y: 0, autoAlpha: 1, duration: .35, stagger: .06, ease: "power2.out", immediateRender: false,
          }, .18);
        });
        return;
      }

      if (section.classList.contains("story-contact")) {
        const label = section.querySelector<HTMLElement>(".story-index");
        const heading = section.querySelector<HTMLElement>("h2");
        const description = section.querySelector<HTMLElement>(".contact-copy");
        const cta = section.querySelector<HTMLElement>(".contact-email");
        const form = section.querySelector<HTMLElement>(".contact-form");
        const compactMotion = window.matchMedia("(max-width: 650px)").matches;
        const contactEntrance = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        });
        if (label) contactEntrance.fromTo(label, { autoAlpha: 0, y: 9 }, {
          autoAlpha: 1, y: 0, duration: .36, ease: "power2.out", immediateRender: false,
        });
        if (heading) contactEntrance.fromTo(heading, { autoAlpha: 0, y: 18, clipPath: "inset(0 0 100% 0)" }, {
          autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: .56, ease: "power3.out", immediateRender: false,
        }, "-=.12");
        if (description) contactEntrance.fromTo(description, { autoAlpha: 0, y: 12 }, {
          autoAlpha: 1, y: 0, duration: .42, ease: "power2.out", immediateRender: false,
        }, "-=.22");
        if (cta) contactEntrance.fromTo(cta, { autoAlpha: 0, y: 9 }, {
          autoAlpha: 1, y: 0, duration: .38, ease: "power2.out", immediateRender: false,
        }, "-=.2");
        if (form) contactEntrance.fromTo(form, { autoAlpha: 0, x: compactMotion ? 0 : 16, y: 14 }, {
          autoAlpha: 1, x: 0, y: 0, duration: .62, ease: "power3.out", immediateRender: false,
        }, .12);
        return;
      }

      const headingChars = section.querySelectorAll<HTMLElement>(".reveal-char");
      const headings = section.querySelectorAll<HTMLElement>("h2, h3");
      const copy = section.querySelectorAll<HTMLElement>("[data-reveal]");
      const targets: HTMLElement[] = desktopMotion && headingChars.length ? Array.from(headingChars) : Array.from(headings);
      if (targets.length) {
        const charReveal = desktopMotion && headingChars.length > 0;
        gsap.fromTo(targets, charReveal ? { yPercent: 110, autoAlpha: 0, rotate: 2 } : { y: 22, autoAlpha: 0 }, {
          ...(charReveal ? { yPercent: 0, rotate: 0 } : { y: 0 }), autoAlpha: 1,
          duration: .65, stagger: charReveal ? .012 : .06, ease: "power3.out", immediateRender: false,
          scrollTrigger: { trigger: section, start: "top 76%", once: true },
        });
      }
      if (copy.length) gsap.fromTo(copy, { y: 24, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: .65, stagger: .1, ease: "power2.out", immediateRender: false,
        scrollTrigger: { trigger: section, start: "top 74%", once: true },
      });
    });

    const footer = root.current?.querySelector<HTMLElement>(".portfolio-footer");
    const footerLines = footer?.querySelectorAll<HTMLElement>("p");
    if (footer && footerLines?.length) gsap.fromTo(footerLines, { autoAlpha: 0, y: 9 }, {
      autoAlpha: 1, y: 0, duration: .48, stagger: .08, ease: "power2.out", immediateRender: false,
      scrollTrigger: { trigger: footer, start: "top 94%", once: true },
    });

    return () => aboutMotion.revert();

  }, { scope: root, dependencies: [projects.length, skills.length], revertOnUpdate: true });

  const displayProjects = projects;
  const webAppProjects = displayProjects.filter((project) => (project.project_section ?? "web_app") === "web_app");
  const webDesignProjects = displayProjects.filter((project) => (project.project_section ?? "web_app") === "web_design");
  const additionalSkills = skillsUnavailable ? [] : skills.filter((skill) => !curatedSkillNames.has(skill.name.trim().toLowerCase()));
  const skillIcons = new Map(skills.map((skill) => [skill.name.trim().toLowerCase(), skill.icon]));
  const renderSkillChips = (items: readonly string[], secondary = false) => <div className={`skill-chip-list${secondary ? " skill-chip-list-secondary" : ""}`}>
    {items.map((name) => <span className="skill-chip" key={name}>{name}{skillIcons.get(name.toLowerCase()) && <small>{skillIcons.get(name.toLowerCase())}</small>}</span>)}
  </div>;

  return <div ref={root} className="story-world">
    <section className="story-section story-about" id="about">
      <div className="story-inner about-layout">
        <aside className="about-portrait-column" aria-label="Portrait of Fazle Rabby Shohan">
          <div className="about-portrait-card">
            <span className="about-portrait-orbit" aria-hidden="true" />
            <Image className="about-portrait-image" src="/me2.png" alt="Fazle Rabby Shohan" fill sizes="(max-width: 650px) 84vw, (max-width: 999px) 38vw, 34vw" onLoad={() => ScrollTrigger.refresh()} />
            <span className="about-portrait-label">DEVELOPER <i /> DHAKA, BD</span>
          </div>
        </aside>
        <div className="about-copy">
          <div className="story-index"><span>01</span><i/> ABOUT ME</div>
          <h2 className="about-heading">Building digital<br/>experiences with<br/><em>purpose.</em></h2>
          <div className="about-foot"><p>I&apos;m Fazle Rabby Shohan, a developer interested in creating digital products, full-stack applications, and AI-powered automation systems.</p></div>
          <div className="about-details">
            <article><span>PROFESSIONAL EXPERIENCE</span><p>Currently working at DeltaDev since March.</p></article>
            <article><span>EDUCATION</span><p>Studying Computer Science and Engineering at Northern University.</p></article>
          </div>
        </div>
      </div>
      <div className="about-orbit" aria-hidden="true"><span/><span/><b>↗</b></div>
    </section>

    <section className="story-section skills-story" id="skills" aria-labelledby="skills-heading">
      <div className="story-inner skills-story-layout">
        <header className="skills-story-header">
          <div className="story-index"><span>02</span><i/> TECHNICAL EXPERTISE</div>
          <h2 className="skills-story-heading" id="skills-heading">Technologies I<br/><em>Work With.</em></h2>
          <p className="skills-story-intro">From modern web interfaces and full-stack engineering to AI-powered systems, automation, and technical SEO, these are the technologies and tools I use to turn ideas into practical digital products.</p>
        </header>
        <div className="skills-editorial-grid">
          <section className="skill-editorial-card skill-card-frontend" aria-labelledby="skills-frontend">
            <div className="skill-card-heading"><span>01 / INTERFACES</span><h3 id="skills-frontend">Frontend Development &amp; Interactive Experiences</h3></div>
            <div className="skill-frontend-visual" aria-hidden="true"><div className="skill-preview-browser"><div><i/><i/><i/><span>INTERACTIVE EXPERIENCE</span></div><section><b/><i/><i/><span/></section></div><div className="skill-preview-orbit"/></div>
            <span className="skill-subheading">CORE TECHNOLOGIES</span>
            {renderSkillChips(cvSkillGroups.frontend)}
            <div className="skill-concepts"><span className="skill-subheading">NEXT.JS FRONTEND CAPABILITIES</span>{renderSkillChips(cvSkillGroups.frontendConcepts, true)}</div>
          </section>

          <section className="skill-editorial-card skill-card-ai" aria-labelledby="skills-ai">
            <div className="skill-card-heading"><span>04 / INTELLIGENCE &amp; FLOW</span><h3 id="skills-ai">AI, RAG &amp; Workflow Automation</h3></div>
            <svg className="skill-network-illustration" viewBox="0 0 460 132" fill="none" aria-hidden="true">
              <path d="M52 66h92m0 0h86m0 0h88m0 0h90M144 66V30h86m0 0h88m-88 72h88v-36" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.5"/>
              <circle cx="52" cy="66" r="8"/><circle cx="144" cy="66" r="8"/><circle cx="230" cy="30" r="8"/><circle cx="230" cy="66" r="11"/><circle cx="318" cy="30" r="8"/><circle cx="318" cy="66" r="8"/><circle cx="318" cy="102" r="8"/><circle cx="408" cy="66" r="8"/>
              <path d="M52 66h92m86-36v36h88m0-36v36m0 36V66" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div className="skill-ai-pipeline" aria-label="Knowledge retrieval pipeline"><span>DOCUMENTS</span><i>&rarr;</i><span>EMBEDDINGS</span><i>&rarr;</i><span>VECTOR SEARCH</span><i>&rarr;</i><span>CONTEXT</span><i>&rarr;</i><span>AI RESPONSE</span></div>
            {renderSkillChips(cvSkillGroups.ai)}
            <span className="skill-card-note">RETRIEVE <i/> CONNECT <i/> AUTOMATE</span>
          </section>

          <section className="skill-editorial-card skill-card-backend" aria-labelledby="skills-backend">
            <div className="skill-card-heading"><span>02 / APPLICATIONS &amp; SERVICES</span><h3 id="skills-backend">Backend Engineering &amp; Full-Stack Development</h3></div>
            <div className="skill-architecture-visual" aria-hidden="true"><span>FRONTEND<br/>INTERFACE</span><i/><span>API / SERVER<br/>LOGIC</span><i/><span>DATABASE</span></div>
            {renderSkillChips(cvSkillGroups.backend)}
          </section>

          <section className="skill-editorial-card skill-card-database" aria-labelledby="skills-database">
            <div className="skill-card-heading"><span>03 / DATA</span><h3 id="skills-database">Databases, SQL &amp; Data Modeling</h3></div>
            {renderSkillChips(cvSkillGroups.database)}
            <div className="skill-database-lines" aria-hidden="true"><i/><i/><i/></div>
          </section>

          <section className="skill-editorial-card skill-card-seo" aria-labelledby="skills-seo">
            <div className="skill-card-heading"><span>05 / SEARCH &amp; PERFORMANCE</span><h3 id="skills-seo">SEO, Search Optimization &amp; Website Performance</h3></div>
            <p className="skill-learning-note">Building practical SEO knowledge with SEMrush and applying it to website optimization.</p>
            <div className="skill-seo-preview"><div className="skill-seo-search"><i aria-hidden="true"/> SEARCH PREVIEW</div><b>Page title &amp; metadata</b><i/><i/><small>CRAWL &rarr; INDEX &rarr; DISCOVER</small></div>
            {renderSkillChips(cvSkillGroups.seo, true)}
          </section>

          <section className="skill-editorial-card skill-card-tools" aria-labelledby="skills-tools">
            <div className="skill-card-heading"><span>06 / ENVIRONMENT &amp; TOOLS</span><h3 id="skills-tools">Developer Tools &amp; Linux Environment</h3></div>
            <div className="skill-tools-groups">
              <div><span className="skill-subheading">DEVELOPMENT ENVIRONMENT</span>{renderSkillChips(cvSkillGroups.environment)}</div>
              <div><span className="skill-subheading">VERSION CONTROL</span>{renderSkillChips(cvSkillGroups.versionControl)}</div>
              <div><span className="skill-subheading">CONTAINERS &amp; API TESTING</span>{renderSkillChips(cvSkillGroups.testing)}</div>
              <div><span className="skill-subheading">DESIGN &amp; AI-ASSISTED DEVELOPMENT</span>{renderSkillChips([...cvSkillGroups.design, ...cvSkillGroups.aiTools])}</div>
              {additionalSkills.length > 0 && <div className="skill-admin-additions"><span className="skill-subheading">ALSO IN MY TOOLKIT</span><div className="skill-chip-list">{additionalSkills.map((skill) => <span className="skill-chip" key={skill.id}>{skill.name}{skill.icon && <small>{skill.icon}</small>}</span>)}</div></div>}
            </div>
          </section>
        </div>
      </div>
    </section>

    <CapabilityShowcase />
    <ImmersiveProjectRail projects={webAppProjects} unavailable={projectUnavailable}/>
    <ProjectGallery projects={webDesignProjects} unavailable={projectUnavailable}/>

    <section className="contact-section story-contact" id="contact"><div className="contact-inner"><div className="contact-copy-block"><div className="story-index" data-reveal><span>06</span><i/> THE NEXT CHAPTER</div><h2 data-reveal>Let’s make<br/><em>something matter.</em></h2><p className="contact-copy" data-reveal>Have a good one in mind? Tell me about it. I’ll get back to you soon.</p><a className="contact-email" href="#contact-form" data-reveal>OPEN A CONVERSATION <span>↗</span></a></div><ContactForm /></div><div className="contact-endnote">BASED IN DHAKA · BUILDING FOR EVERYWHERE <span>© {currentYear}</span></div></section>
    <footer className="portfolio-footer">
      <p>Designed and built with care in Dhaka, Bangladesh.</p>
      <p>© {currentYear} Fazle Rabby Shohan. All rights reserved.</p>
    </footer>
  </div>;
}
