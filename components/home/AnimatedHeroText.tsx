"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedHeroText() {
  const [wordIndex, setWordIndex] = useState(0);
  const animatedWords = ["Dream Job", "Career Move", "Next Big Role", "Remote Work", "Perfect Match"];

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % animatedWords.length);
    }, 2500);
    return () => clearInterval(wordTimer);
  }, [animatedWords.length]);

  return (
    <motion.span 
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="inline-grid align-bottom min-w-[220px] sm:min-w-[340px] md:min-w-[420px] text-center md:text-left cursor-pointer origin-center md:origin-left"
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={wordIndex}
          initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -30, opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="col-start-1 row-start-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 animate-gradient-x whitespace-nowrap" style={{ backgroundSize: '200% 200%' }}
        >
          {animatedWords[wordIndex]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
