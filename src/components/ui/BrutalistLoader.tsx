"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface BrutalistLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  variant?: "dots" | "blocks" | "bars";
}

export function BrutalistLoader({ 
  size = "md", 
  text = "Loading...", 
  variant = "blocks" 
}: BrutalistLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current || variant !== "blocks") return;

    const blocks = blocksRef.current;
    if (blocks.length === 0) return;

    const tl = gsap.timeline({ repeat: -1 });
    
    blocks.forEach((block, index) => {
      tl.to(block, {
        scaleY: 0.3,
        duration: 0.3,
        ease: "power2.inOut",
        delay: index * 0.1
      }, 0)
      .to(block, {
        scaleY: 1,
        duration: 0.3,
        ease: "power2.inOut",
        delay: index * 0.1
      }, 0.3);
    });
  }, [variant]);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl"
  };

  if (variant === "blocks") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div 
          ref={containerRef}
          className={`flex items-end space-x-1 ${sizeClasses[size]}`}
        >
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) blocksRef.current[index] = el;
              }}
              className="w-2 bg-brand-green border-2 border-black shadow-brutal"
              style={{ height: `${20 + index * 15}%` }}
            />
          ))}
        </div>
        {text && (
          <div className={`font-display font-bold uppercase tracking-wider text-black ${textSizeClasses[size]}`}>
            {text}
          </div>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex space-x-2">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className={`${sizeClasses[size]} bg-brand-green border-2 border-black shadow-brutal animate-pulse`}
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          ))}
        </div>
        {text && (
          <div className={`font-display font-bold uppercase tracking-wider text-black ${textSizeClasses[size]}`}>
            {text}
          </div>
        )}
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex space-x-1">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={`w-1 bg-brand-green border border-black shadow-brutal animate-pulse`}
              style={{ 
                height: `${30 + index * 10}px`,
                animationDelay: `${index * 0.15}s`
              }}
            />
          ))}
        </div>
        {text && (
          <div className={`font-display font-bold uppercase tracking-wider text-black ${textSizeClasses[size]}`}>
            {text}
          </div>
        )}
      </div>
    );
  }

  return null;
}
