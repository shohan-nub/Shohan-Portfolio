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
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    let timer: number | undefined;
    let loaderObserver: MutationObserver | undefined;
    const startRotation = () => {
      if (timer !== undefined) return;
      timer = window.setInterval(() => {
        setRoleIndex((current) => (current + 1) % roles.length);
      }, 2_500);
    };

    if (document.querySelector(".portfolio-intro-overlay")) {
      loaderObserver = new MutationObserver(() => {
        if (document.querySelector(".portfolio-intro-overlay")) return;
        loaderObserver?.disconnect();
        startRotation();
      });
      loaderObserver.observe(document.body, { childList: true, subtree: true });
    } else {
      startRotation();
    }

    return () => {
      if (timer !== undefined) window.clearInterval(timer);
      loaderObserver?.disconnect();
    };
  }, []);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = root.current?.querySelector<HTMLElement>(".hero");
    if (!hero) return;

    const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
    entrance
      .fromTo(".hero-kicker", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .55 }, 0)
      .fromTo(".hero-title .title-line", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: .72, stagger: .12 }, .08)
      .fromTo(".hero-introduction", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .55 }, .38)
      .fromTo(".role-block", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .48 }, .48)
      .fromTo(".hero-actions .button", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .48, stagger: .08 }, .55)
      .fromTo(".hero-art", { scale: .97 }, { scale: 1, duration: .9, ease: "power2.out" }, .12)
      .fromTo(".hero-portrait", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .72, ease: "power2.out" }, .25)
      .fromTo(".hero-clock", { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: .48 }, .58)
      .fromTo(".scroll-cue, .hero-coordinate", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .42, stagger: .08 }, .72);

    if (!window.matchMedia("(max-width: 700px)").matches) {
      gsap.to(".hero-art", {
        yPercent: 5,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .5 },
      });
      gsap.to(".hero-portrait", {
        yPercent: -2,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .5 },
      });
    }
  }, { scope: root });

  return <section className="intro-shell" ref={root}>
    <header className="site-header">
      <Link className="wordmark" href="#top" aria-label="Fazle Rabby Shohan portfolio home"><span className="brand-mark"><PortfolioMark /></span><span className="brand-name">FAZLE RABBY SHOHAN <small>PORTFOLIO / DEVELOPER</small></span></Link>
      <nav aria-label="Main navigation"><a href="#about">About</a><a href="#capabilities">Expertise</a><a href="#work">Work</a><a href="#contact" className="nav-contact">Let&apos;s Talk <span>&#8599;</span></a></nav>
    </header>
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-visual"><div className="hero-art" aria-hidden="true"><div className="art-ring ring-one"/><div className="art-ring ring-two"/><div className="art-orb"/><div className="art-cross">&#10033;</div></div><div className="hero-portrait" aria-hidden="true"><Image src="/me.png" alt="" fill priority sizes="(max-width: 600px) 62vw, (max-width: 900px) 36vw, 44vw" /></div><DhakaClock /></div>
      <div className="hero-content">
        <p className="eyebrow hero-kicker"><span className="status-dot"/> INDEPENDENT DEVELOPER <span className="kicker-divider">/</span> DHAKA, BD</p>
        <h1 id="hero-title" className="hero-title" aria-label={headline.join(" ")}>{headline.map((line) => <span className="title-line" key={line}>{line}</span>)}</h1>
        <p className="hero-introduction">I build digital experiences, full-stack applications, and AI-powered automation systems.</p>
        <div className="hero-lower"><div className="role-block"><span className="role-label">CURRENTLY BUILDING</span><span className="role-text"><span className="role-option" key={roles[roleIndex]}>{roles[roleIndex]}</span></span></div>
          <div className="hero-actions"><a className="button button-primary" href="/cv.pdf" download="cv.pdf">DOWNLOAD CV <span>&#8595;</span></a><a className="button button-quiet" href="#contact">GET IN TOUCH <span>&#8599;</span></a></div>
        </div>
      </div>
      <a href="#work" className="scroll-cue" aria-label="Scroll to selected work"><span className="scroll-line"/><span>SCROLL TO EXPLORE</span><span className="scroll-index">01 &#8212; 04</span></a>
      <div className="hero-coordinate" aria-hidden="true">23&#176;48&apos; N<br/>90&#176;24&apos; E</div>
    </section>
  </section>;
}
