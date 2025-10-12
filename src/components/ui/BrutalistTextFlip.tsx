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
    <div className={cn("flex items-center gap-1 xs:gap-2", className)}>
      <motion.span
        layoutId="brutalist-text"
        className={cn("text-lg xs:text-xl sm:text-2xl md:text-3xl font-display font-black tracking-tight uppercase", textColor)}
      >
        {text}
      </motion.span>

      <motion.div
        layout
        className="relative overflow-hidden border-2 xs:border-3 sm:border-4 border-white bg-brand-green shadow-brutal px-2 py-1 xs:px-3 xs:py-1"
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
              "inline-block whitespace-nowrap text-lg xs:text-xl sm:text-2xl md:text-3xl font-display font-black tracking-tight text-black uppercase"
            )}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
