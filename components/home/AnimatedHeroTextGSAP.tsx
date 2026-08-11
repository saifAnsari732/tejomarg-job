"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const animatedWords = [
  {
    text: "Dream Job",
    gradient: "from-violet-600 via-purple-500 to-pink-500",
    size: "text-5xl sm:text-8xl md:text-5xl lg:text-[6rem]",
  },
  {
    text: "Career Move",
    gradient: "from-blue-500 via-cyan-400 to-teal-400",
    size: "text-5xl sm:text-6xl md:text-7xl lg:text-6xl",
  },
  {
    text: "Next Big Role",
    gradient: "from-orange-500 via-amber-400 to-yellow-400",
    size: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl",
  },
  {
    text: "Remote Work",
    gradient: "from-emerald-500 via-green-400 to-lime-400",
    size: "text-5xl sm:text-8xl md:text-5xl lg:text-[6rem]",
  },
  {
    text: "Perfect Match",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    size: "text-5xl sm:text-3xl md:text-8xl lg:text-6xl",
  },
];

export default function AnimatedHeroTextGSAP() {
  const [wordIndex, setWordIndex] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  // On mount: entrance animation
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 40, filter: "blur(12px)", scale: 0.85 },
        { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, duration: 0.55, ease: "power3.out" }
      );
    }
  }, []);

  // Word swap every 2.5s with GSAP transition
  useEffect(() => {
    const interval = setInterval(() => {
      if (!textRef.current) return;

      // Exit
      gsap.to(textRef.current, {
        opacity: 0,
        y: -35,
        scale: 0.85,
        filter: "blur(10px)",
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setWordIndex((prev) => (prev + 1) % animatedWords.length);
          // Enter
          gsap.fromTo(
            textRef.current,
            { opacity: 0, y: 40, scale: 0.85, filter: "blur(10px)" },
            { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "power3.out" }
          );
        },
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, { scale: 1.07, rotate: -1.5, duration: 0.25, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, { scale: 1, rotate: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" });
    }
  };

  const word = animatedWords[wordIndex];

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-grid align-bottom min-w-[240px] sm:min-w-[360px] md:min-w-[460px] text-center md:text-left cursor-pointer origin-center md:origin-left"
      style={{ willChange: "transform" }}
    >
      <span
        ref={textRef}
        className={`col-start-1 row-start-1 text-transparent bg-clip-text bg-gradient-to-r ${word.gradient} ${word.size} font-extrabold whitespace-nowrap leading-tight transition-none`}
        style={{ willChange: "opacity, transform, filter" }}
      >
        {word.text}
      </span>
    </span>
  );
}
