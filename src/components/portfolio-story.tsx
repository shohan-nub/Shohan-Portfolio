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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const about = root.current?.querySelector<HTMLElement>(".story-about");
    if (about) {
      const label = about.querySelector<HTMLElement>(".story-index");
      const heading = about.querySelector<HTMLElement>(".about-heading");
      const intro = about.querySelector<HTMLElement>(".about-foot p");
      const details = about.querySelectorAll<HTMLElement>(".about-details article");
      const portrait = about.querySelector<HTMLElement>(".about-portrait-card");
      const textTargets = [label, heading, intro, ...Array.from(details)]
        .filter((target): target is HTMLElement => target !== null);
      const entrance = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: about, start: "top 76%", once: true },
      });
      if (portrait) entrance.fromTo(portrait, { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, duration: .7, clearProps: "opacity,visibility,transform", immediateRender: false,
      }, 0);
      if (textTargets.length) entrance.fromTo(textTargets, { autoAlpha: 0, y: 16 }, {
        autoAlpha: 1, y: 0, duration: .62, stagger: .07, clearProps: "opacity,visibility,transform", immediateRender: false,
      }, .12);
    }

    const skills = root.current?.querySelector<HTMLElement>(".skills-story");
    if (skills) {
      const heading = skills.querySelector<HTMLElement>(".skills-story-heading");
      const intro = skills.querySelector<HTMLElement>(".skills-story-intro");
      const cards = skills.querySelectorAll<HTMLElement>(".skill-editorial-card");
      const skillEntrance = gsap.timeline({ scrollTrigger: { trigger: skills, start: "top 72%", once: true } });
      if (heading) skillEntrance.fromTo(heading, { autoAlpha: 0, y: 18 }, {
        autoAlpha: 1, y: 0, duration: .52, ease: "power2.out", clearProps: "opacity,visibility,transform", immediateRender: false,
      }, 0);
      if (intro) skillEntrance.fromTo(intro, { autoAlpha: 0, y: 10 }, {
        autoAlpha: 1, y: 0, duration: .42, ease: "power2.out", clearProps: "opacity,visibility,transform", immediateRender: false,
      }, .12);
      if (cards.length) skillEntrance.fromTo(cards, { autoAlpha: 0, y: 20 }, {
        autoAlpha: 1, y: 0, duration: .5, stagger: .07, ease: "power2.out",
        clearProps: "opacity,visibility,transform", immediateRender: false,
      }, .24);
    }

    const contact = root.current?.querySelector<HTMLElement>(".story-contact");
    if (contact) {
      const copy = contact.querySelector<HTMLElement>(".contact-copy-block");
      const form = contact.querySelector<HTMLElement>(".contact-form");
      const endnote = contact.querySelector<HTMLElement>(".contact-endnote");
      const contactEntrance = gsap.timeline({ defaults: { ease: "power2.out" }, scrollTrigger: { trigger: contact, start: "top 78%", once: true } });
      if (copy) contactEntrance.fromTo(copy, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .62, clearProps: "opacity,visibility,transform", immediateRender: false }, 0);
      if (form) contactEntrance.fromTo(form, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .62, clearProps: "opacity,visibility,transform", immediateRender: false }, .12);
      if (endnote) contactEntrance.fromTo(endnote, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .42, clearProps: "opacity,visibility,transform", immediateRender: false }, .24);
    }

    const footer = root.current?.querySelector<HTMLElement>(".portfolio-footer");
    if (footer) gsap.fromTo(footer, { autoAlpha: 0, y: 8 }, {
      autoAlpha: 1, y: 0, duration: .38, ease: "power2.out", clearProps: "opacity,visibility,transform",
      immediateRender: false, scrollTrigger: { trigger: footer, start: "top 94%", once: true },
    });
  }, { scope: root });

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
            <Image className="about-portrait-image" src="/me2.png" alt="Fazle Rabby Shohan" fill sizes="(max-width: 650px) 84vw, (max-width: 999px) 38vw, 34vw" />
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
