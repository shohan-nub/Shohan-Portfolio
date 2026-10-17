"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const INTRO_SESSION_KEY = "portfolio-intro-complete";

export function PortfolioIntroLoader() {
  const root = useRef<HTMLDivElement>(null);
  const completed = useRef(false);
  const [visible, setVisible] = useState(true);

  useGSAP(() => {
    const finish = () => {
      if (completed.current) return;
      completed.current = true;
      try {
        window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
      } catch {
        // Storage may be unavailable; the loader still completes normally.
      }
      setVisible(false);
    };

    const hardStop = window.setTimeout(finish, 2_300);
    try {
      if (window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1") {
        window.clearTimeout(hardStop);
        setVisible(false);
        return;
      }
      // Mark as in progress so a Strict Mode effect replay can safely animate
      // again instead of mistaking its own first setup for a completed visit.
      window.sessionStorage.setItem(INTRO_SESSION_KEY, "playing");
    } catch {
      // Continue without session persistence when browser storage is blocked.
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.clearTimeout(hardStop);
      finish();
      return;
    }

    const identity = root.current?.querySelector<HTMLElement>(".portfolio-intro-identity");
    const caption = root.current?.querySelector<HTMLElement>(".portfolio-intro-caption");
    const progress = root.current?.querySelector<HTMLElement>(".portfolio-intro-progress-fill");
    const panel = root.current;

    if (!identity || !caption || !progress || !panel) {
      window.clearTimeout(hardStop);
      finish();
      return;
    }

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: finish,
    });

    timeline
      .fromTo(caption, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.34 }, 0)
      .fromTo(identity, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.48 }, 0.08)
      .fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 0.34)
      .to(identity, { autoAlpha: 0, y: -7, duration: 0.22, ease: "power2.in" }, 1.48)
      .to(caption, { autoAlpha: 0, duration: 0.18 }, 1.48)
      .to(panel, { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" }, 1.58);

    return () => {
      window.clearTimeout(hardStop);
      timeline.kill();
    };
  }, { scope: root });

  if (!visible) return null;

  return <div className="portfolio-intro-overlay" ref={root} role="status" aria-label="Loading portfolio">
    <div className="portfolio-intro-glow" aria-hidden="true" />
    <div className="portfolio-intro-content">
      <p className="portfolio-intro-caption">INDEPENDENT DEVELOPER <i /> DHAKA, BD</p>
      <p className="portfolio-intro-identity">Fazle Rabby Shohan</p>
      <div className="portfolio-intro-progress" aria-hidden="true"><span className="portfolio-intro-progress-fill" /></div>
    </div>
    <span className="portfolio-intro-index" aria-hidden="true">PORTFOLIO <i /> 2026</span>
  </div>;
}
