"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PortfolioMark } from "@/components/portfolio-mark";

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
  const roleText = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const header = root.current?.querySelector<HTMLElement>(".site-header");
    if (header) ScrollTrigger.create({
      trigger: document.documentElement,
      start: 40,
      toggleClass: { targets: header, className: "is-scrolled" },
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scope = root.current;
    if (!scope) return;
    const titleLines = scope.querySelectorAll<HTMLElement>(".title-line");
    const introduction = scope.querySelector<HTMLElement>(".hero-introduction");
    const role = scope.querySelector<HTMLElement>(".role-block");
    const actions = scope.querySelector<HTMLElement>(".hero-actions");
    const portrait = scope.querySelector<HTMLElement>(".hero-portrait");
    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

    if (titleLines.length) timeline.fromTo(titleLines, { autoAlpha: 0, y: 22 }, {
      autoAlpha: 1, y: 0, duration: .62, stagger: .08, clearProps: "opacity,visibility,transform",
    }, 0);
    if (introduction) timeline.fromTo(introduction, { autoAlpha: 0, y: 12 }, {
      autoAlpha: 1, y: 0, duration: .48, clearProps: "opacity,visibility,transform",
    }, .3);
    if (role) timeline.fromTo(role, { autoAlpha: 0, y: 10 }, {
      autoAlpha: 1, y: 0, duration: .42, clearProps: "opacity,visibility,transform",
    }, .48);
    if (actions) timeline.fromTo(actions, { autoAlpha: 0, y: 10 }, {
      autoAlpha: 1, y: 0, duration: .42, clearProps: "opacity,visibility,transform",
    }, .58);
    if (portrait) timeline.fromTo(portrait, { autoAlpha: 0, y: 18 }, {
      autoAlpha: 1, y: 0, duration: .76, ease: "power2.out", clearProps: "opacity,visibility,transform",
    }, .14);

    const roleOptions = roleText.current?.querySelectorAll<HTMLElement>(".role-option");
    if (roleOptions?.length) {
      roleOptions.forEach((option, index) => gsap.set(option, {
        autoAlpha: index === 0 ? 1 : 0,
        y: 0,
      }));

      const roleTimeline = gsap.timeline({ repeat: -1, repeatDelay: .75, delay: .65 });
      roleOptions.forEach((option, index) => {
        const next = roleOptions[(index + 1) % roleOptions.length];
        roleTimeline
          .to(option, { autoAlpha: 0, y: -5, duration: .2, ease: "power1.in", delay: 1.25 })
          .set(next, { autoAlpha: 1, y: 0 })
          .fromTo(
            next.querySelectorAll<HTMLElement>(".role-char"),
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: .25, stagger: .025, ease: "power2.out" },
          );
      });
    }

  }, { scope: root });

  return <section className="intro-shell" ref={root}>
    <header className="site-header">
      <Link className="wordmark" href="#top" aria-label="Fazle Rabby Shohan portfolio home"><span className="brand-mark"><PortfolioMark /></span><span className="brand-name">FAZLE RABBY SHOHAN <small>PORTFOLIO / DEVELOPER</small></span></Link>
      <nav aria-label="Main navigation"><a href="#about">About</a><a href="#capabilities">Expertise</a><a href="#work">Work</a><a href="#contact" className="nav-contact">Let&apos;s Talk <span>&#8599;</span></a></nav>
    </header>
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grain" aria-hidden="true"/><div className="hero-visual"><div className="hero-art" aria-hidden="true"><div className="art-ring ring-one"/><div className="art-ring ring-two"/><div className="art-orb"/><div className="art-cross">&#10033;</div></div><div className="hero-portrait" aria-hidden="true"><Image src="/me.png" alt="" fill priority sizes="(max-width: 600px) 62vw, (max-width: 900px) 36vw, 44vw" /></div><DhakaClock /></div>
      <div className="hero-content">
        <p className="eyebrow hero-kicker"><span className="status-dot"/> INDEPENDENT DEVELOPER <span className="kicker-divider">/</span> DHAKA, BD</p>
        <h1 id="hero-title" className="hero-title" aria-label={headline.join(" ")}>{headline.map((line) => <span className="title-line" key={line}>{line}</span>)}</h1>
        <p className="hero-introduction">I build digital experiences, full-stack applications, and AI-powered automation systems.</p>
        <div className="hero-lower"><div className="role-block"><span className="role-label">CURRENTLY BUILDING</span><span className="role-text" ref={roleText} aria-hidden="true">{roles.map((item) => <span className="role-option" key={item}>{Array.from(item).map((char, index) => <span className="role-char" key={`${item}-${index}`}>{char === " " ? "\u00a0" : char}</span>)}</span>)}</span><span className="sr-only">Full-Stack Developer, AI Automation Engineer, and RAG System Builder</span></div>
          <div className="hero-actions"><a className="button button-primary" href="/cv.pdf" download="cv.pdf">DOWNLOAD CV <span>&#8595;</span></a><a className="button button-quiet" href="#contact">GET IN TOUCH <span>&#8599;</span></a></div>
        </div>
      </div>
      <a href="#work" className="scroll-cue" aria-label="Scroll to selected work"><span className="scroll-line"/><span>SCROLL TO EXPLORE</span><span className="scroll-index">01 &#8212; 04</span></a>
      <div className="hero-coordinate" aria-hidden="true">23&#176;48&apos; N<br/>90&#176;24&apos; E</div>
    </section>
  </section>;
}
