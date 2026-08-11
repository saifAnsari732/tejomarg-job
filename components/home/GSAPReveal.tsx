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

export default function GSAPReveal({ children, className = "", delay = 0, scrollTrigger = false, from = "bottom" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      ...(from === "bottom" ? { y: 36 } : {}),
      ...(from === "left" ? { x: -50 } : {}),
      ...(from === "right" ? { x: 50 } : {}),
    };

    const toVars: gsap.TweenVars = {
      opacity: 1,
      y: 0,
      x: 0,
      duration: 0.5,
      ease: "power3.out",
      delay,
      clearProps: "transform",
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
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
