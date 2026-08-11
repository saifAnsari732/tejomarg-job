"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { Sparkles, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function HeroGSAPClient() {
  const matchBadgeRef = useRef<HTMLDivElement>(null);
  const responseBadgeRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating badges entrance
      gsap.fromTo(
        matchBadgeRef.current,
        { opacity: 0, x: -60, y: 20 },
        { opacity: 1, x: 0, y: 0, duration: 0.7, ease: "back.out(1.7)", delay: 0.4 }
      );

      gsap.fromTo(
        responseBadgeRef.current,
        { opacity: 0, x: 60, y: 20 },
        { opacity: 1, x: 0, y: 0, duration: 0.7, ease: "back.out(1.7)", delay: 0.6 }
      );

      // Continuous float for badges
      gsap.to(matchBadgeRef.current, {
        y: -14,
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1,
      });

      gsap.to(responseBadgeRef.current, {
        y: -18,
        duration: 4.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.5,
      });

      // Background orbs animation
      gsap.to(orb1Ref.current, {
        scale: 1.15,
        opacity: 0.5,
        duration: 7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(orb2Ref.current, {
        scale: 1.2,
        opacity: 0.4,
        duration: 9,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Background Animated Orbs */}
      <div
        ref={orb1Ref}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-300/30 rounded-full blur-[120px] mix-blend-multiply pointer-events-none"
        style={{ opacity: 0.3 }}
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-300/30 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"
        style={{ opacity: 0.2 }}
      />

      {/* Floating Badge Left */}
      <div
        ref={matchBadgeRef}
        className="hidden lg:flex absolute left-[5%] top-[25%] bg-white/90 backdrop-blur-xl px-5 py-4 rounded-2xl items-center gap-4 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] z-20"
        style={{ opacity: 0 }}
      >
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <p className="text-slate-900 text-sm font-bold">Match Found</p>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Senior UI Designer</p>
        </div>
      </div>

      {/* Floating Badge Right */}
      <div
        ref={responseBadgeRef}
        className="hidden lg:flex absolute right-[5%] top-[40%] bg-white/90 backdrop-blur-xl px-5 py-4 rounded-2xl items-center gap-4 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] z-20"
        style={{ opacity: 0 }}
      >
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Zap className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="text-slate-900 text-sm font-bold">Fast Response</p>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Usually replies in 2h</p>
        </div>
      </div>
    </>
  );
}
