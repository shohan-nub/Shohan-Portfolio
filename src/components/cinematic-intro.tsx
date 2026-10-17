"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PortfolioMark } from "@/components/portfolio-mark";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const headline = ["Fazle Rabby", "Shohan"];
const roles = ["Fullstack Developer", "AI Automation Engineer", "RAG System Builder"];

function DhakaClock() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    let timer: number;
    const update = () => {
      const now = new Date();
      setTime(formatter.format(now));
      timer = window.setTimeout(update, 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()));
    };
    update();
    return () => window.clearTimeout(timer);
  }, []);

  return <aside className="hero-clock" aria-label="Current local time in Dhaka, Bangladesh">
    <span className="hero-clock-location">DHAKA <i/> BD</span>
    <time className="hero-clock-time">{time}</time>
    <span className="hero-clock-zone">UTC+6</span>
  </aside>;
}

export function CinematicIntro() {
  const root = useRef<HTMLElement>(null);
  const role = useRef<HTMLSpanElement>(null);
  const { contextSafe } = useGSAP(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let refreshFrame = 0;
    let disposed = false;
    const refreshScrollTriggers = () => {
      if (disposed) return;
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
    };
    window.addEventListener("load", refreshScrollTriggers);
    document.fonts?.ready.then(refreshScrollTriggers).catch(() => undefined);
    if (document.readyState === "complete") refreshScrollTriggers();

    const smoothScroll = gsap.matchMedia();
    if (!reducedMotion) smoothScroll.add("(min-width: 768px) and (hover: hover) and (pointer: fine)", () => {
      const lenis = new Lenis({ duration: .82, smoothWheel: true, touchMultiplier: 1.2, anchors: { offset: -100, duration: .82 } });
      const ticker = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);
      gsap.ticker.add(ticker);
      return () => {
        lenis.destroy();
        gsap.ticker.remove(ticker);
        gsap.ticker.lagSmoothing(500, 33);
      };
    });

    const titleChars = gsap.utils.toArray<HTMLElement>(".hero-char", root.current);
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (!reducedMotion) {
      const header = root.current?.querySelector<HTMLElement>(".site-header");
      if (header) {
        ScrollTrigger.create({
          start: 40,
          onToggle: (trigger) => header.classList.toggle("is-scrolled", trigger.isActive),
        });
      }
      const nav = root.current?.querySelector(".site-header nav");
      nav?.querySelectorAll<HTMLAnchorElement>("a[href^='#']").forEach((link) => {
        const target = document.querySelector<HTMLElement>(link.hash);
        if (!target) return;
        ScrollTrigger.create({
          trigger: target,
          start: "top 38%",
          end: "bottom 38%",
          toggleClass: { targets: link, className: "is-active" },
        });
      });
      intro.fromTo(".hero-kicker", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .45 })
        .fromTo(titleChars, { yPercent: 115, rotate: 4, autoAlpha: 0 }, { yPercent: 0, rotate: 0, autoAlpha: 1, duration: .72, stagger: .018 }, "-=.2")
        .fromTo(".hero-introduction", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .42 }, "-=.14")
        .fromTo(".hero-lower", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .55 }, "-=.16")
        .fromTo(".hero-art", { scale: .92, autoAlpha: 0 }, { scale: 1, autoAlpha: .8, duration: 1.1 }, "<")
        .fromTo(".hero-portrait", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out" }, "<");

    }

    const node = role.current;
    if (node) {
      const options = gsap.utils.toArray<HTMLElement>(".role-option", node);
      options.forEach((option, optionIndex) => gsap.set(option, { autoAlpha: optionIndex === 0 ? 1 : 0 }));
      if (!reducedMotion) {
        const typeLoop = gsap.timeline({ repeat: -1, repeatDelay: .75, delay: .65 });
        options.forEach((option, optionIndex) => {
          const next = options[(optionIndex + 1) % options.length];
          typeLoop.to(option, { autoAlpha: 0, y: -5, duration: .2, ease: "power1.in", delay: 1.25 })
            .set(next, { autoAlpha: 1, y: 0 })
            .fromTo(next.querySelectorAll(".role-char"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .25, stagger: .025, ease: "power2.out" });
        });
      }
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(refreshFrame);
      window.removeEventListener("load", refreshScrollTriggers);
      smoothScroll.revert();
    };
  }, { scope: root });

  const hoverLink = contextSafe((event: MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(event.currentTarget, { y: -2, duration: .2, ease: "power2.out" });
  });
  const moveLink = contextSafe((event: MouseEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * .1;
    const y = (event.clientY - bounds.top - bounds.height / 2) * .12 - 2;
    gsap.to(event.currentTarget, { x, y, duration: .28, ease: "power3.out" });
  });
  const resetLink = contextSafe((event: MouseEvent<HTMLAnchorElement>) => {
    gsap.to(event.currentTarget, { x: 0, y: 0, duration: .35, ease: "power3.out" });
  });

  return <section className="intro-shell" ref={root}>
    <header className="site-header">
      <Link className="wordmark" href="#top" aria-label="Fazle Rabby Shohan portfolio home"><span className="brand-mark"><PortfolioMark /></span><span className="brand-name">FAZLE RABBY SHOHAN <small>PORTFOLIO / DEVELOPER</small></span></Link>
      <nav aria-label="Main navigation"><a href="#about" onMouseEnter={hoverLink} onMouseLeave={resetLink}>About</a><a href="#capabilities" onMouseEnter={hoverLink} onMouseLeave={resetLink}>Expertise</a><a href="#work" onMouseEnter={hoverLink} onMouseLeave={resetLink}>Work</a><a href="#contact" className="nav-contact" onMouseEnter={hoverLink} onMouseLeave={resetLink}>Let&apos;s Talk <span>&#8599;</span></a></nav>
    </header>
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grain" aria-hidden="true"/><div className="hero-visual"><div className="hero-art" aria-hidden="true"><div className="art-ring ring-one"/><div className="art-ring ring-two"/><div className="art-orb"/><div className="art-cross">&#10033;</div></div><div className="hero-portrait" aria-hidden="true"><Image src="/me.png" alt="" fill priority sizes="(max-width: 600px) 62vw, (max-width: 900px) 36vw, 44vw" /></div><DhakaClock /></div>
      <div className="hero-content">
        <p className="eyebrow hero-kicker"><span className="status-dot"/> INDEPENDENT DEVELOPER <span className="kicker-divider">/</span> DHAKA, BD</p>
        <h1 id="hero-title" className="hero-title" aria-label={headline.join(" ")}>{headline.map((line) => <span className="title-line" key={line} aria-hidden="true">{Array.from(line).map((char, index) => <span className="char-window" key={`${line}-${index}`}><span className="hero-char">{char === " " ? "\u00a0" : char}</span></span>)}</span>)}</h1>
        <p className="hero-introduction">I build digital experiences, full-stack applications, and AI-powered automation systems.</p>
        <div className="hero-lower"><div className="role-block"><span className="role-label">CURRENTLY BUILDING</span><span className="role-text" ref={role} aria-hidden="true">{roles.map((item) => <span className="role-option" key={item}>{Array.from(item).map((char, index) => <span className="role-char" key={`${item}-${index}`}>{char === " " ? "\u00a0" : char}</span>)}</span>)}</span><span className="sr-only">Full-Stack Developer, AI Automation Engineer, and RAG System Builder</span></div>
          <div className="hero-actions"><a className="button button-primary" href="/cv.pdf" download="cv.pdf" onMouseEnter={hoverLink} onMouseMove={moveLink} onMouseLeave={resetLink}>DOWNLOAD CV <span>&#8595;</span></a><a className="button button-quiet" href="#contact" onMouseEnter={hoverLink} onMouseMove={moveLink} onMouseLeave={resetLink}>GET IN TOUCH <span>&#8599;</span></a></div>
        </div>
      </div>
      <a href="#work" className="scroll-cue" aria-label="Scroll to selected work"><span className="scroll-line"/><span>SCROLL TO EXPLORE</span><span className="scroll-index">01 â€” 04</span></a>
      <div className="hero-coordinate" aria-hidden="true">23Â°48&apos; N<br/>90Â°24&apos; E</div>
    </section>
  </section>;
}
