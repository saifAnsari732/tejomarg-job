"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const animatedWords = ["Dream Job", "Career Move", "Next Big Role", "Remote Work", "Perfect Match"];

export default function AnimatedHeroTextGSAP() {
  const [wordIndex, setWordIndex] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  // On mount: entrance animation
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.out" }
      );
    }
  }, []);

  // Word swap every 2.5s with GSAP transition
  useEffect(() => {
    const interval = setInterval(() => {
      if (!textRef.current) return;

      // Exit animation
      gsap.to(textRef.current, {
        opacity: 0,
        y: -28,
        filter: "blur(8px)",
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setWordIndex((prev) => (prev + 1) % animatedWords.length);
          // Enter animation for next word
          gsap.fromTo(
            textRef.current,
            { opacity: 0, y: 28, filter: "blur(8px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power3.out" }
          );
        },
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Hover interaction
  const handleMouseEnter = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, { scale: 1.06, rotate: -1, duration: 0.25, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, { scale: 1, rotate: 0, duration: 0.3, ease: "elastic.out(1, 0.5)" });
    }
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-grid align-bottom min-w-[220px] sm:min-w-[340px] md:min-w-[420px] text-center md:text-left cursor-pointer origin-center md:origin-left"
      style={{ willChange: "transform" }}
    >
      <span
        ref={textRef}
        className="col-start-1 row-start-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 whitespace-nowrap"
        style={{ backgroundSize: "200% 200%" }}
      >
        {animatedWords[wordIndex]}
      </span>
    </span>
  );
}
