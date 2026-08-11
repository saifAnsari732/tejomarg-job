"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  scrollTrigger?: boolean;
  from?: "bottom" | "left" | "right" | "fade";
}

/**
 * Wraps any element with GSAP entrance animation.
 * On mount: fade+slide in from bottom (or custom direction).
 * If scrollTrigger=true: animates when element enters viewport.
 */
export default function GSAPReveal({ children, className = "", delay = 0, scrollTrigger = false, from = "bottom" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      ...(from === "bottom" ? { y: 48 } : {}),
      ...(from === "left" ? { x: -60 } : {}),
      ...(from === "right" ? { x: 60 } : {}),
      filter: "blur(6px)",
    };

    const toVars: gsap.TweenVars = {
      opacity: 1,
      y: 0,
      x: 0,
      filter: "blur(0px)",
      duration: 0.65,
      ease: "power3.out",
      delay,
    };

    if (scrollTrigger) {
      toVars.scrollTrigger = {
        trigger: ref.current,
        start: "top 88%",
        toggleActions: "play none none none",
      };
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, fromVars, toVars);
    });

    return () => ctx.revert();
  }, [delay, from, scrollTrigger]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0, willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
