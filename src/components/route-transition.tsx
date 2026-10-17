"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function RouteTransition({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.current, { autoAlpha: 0, y: 8 }, {
      autoAlpha: 1,
      y: 0,
      duration: .38,
      ease: "power2.out",
      clearProps: "transform,opacity,visibility",
    });
  }, { scope: root });

  return <div ref={root} className="route-transition">{children}</div>;
}
