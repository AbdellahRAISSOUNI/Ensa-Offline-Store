"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const BrutalistTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
  className = "",
  textColor = "text-black",
}: {
  text: string;
  words: string[];
  duration?: number;
  className?: string;
  textColor?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <motion.span
        layoutId="brutalist-text"
        className={cn("text-2xl sm:text-3xl font-display font-black tracking-tight uppercase", textColor)}
      >
        {text}
      </motion.span>

      <motion.div
        layout
        className="relative overflow-hidden border-4 border-white bg-brand-green shadow-brutal px-3 py-1"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -30, opacity: 0, filter: "blur(8px)" }}
            animate={{
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
            }}
            exit={{ y: 30, opacity: 0, filter: "blur(8px)" }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            className={cn(
              "inline-block whitespace-nowrap text-2xl sm:text-3xl font-display font-black tracking-tight text-black uppercase"
            )}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
