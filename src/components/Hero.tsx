"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { BrutalistRippleEffect } from "@/components/ui/brutalist-ripple-effect";
import { BrutalistTextFlip } from "@/components/ui/BrutalistTextFlip";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const accentShapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Enhanced background shapes with more sophisticated movement
      const shapes = shapesRef.current?.querySelectorAll(".floating-shape");
      if (shapes) {
        shapes.forEach((shape, index) => {
          gsap.set(shape, { 
            rotation: Math.random() * 360,
            scale: 0.8 + Math.random() * 0.4,
            opacity: 0
          });
          
          // Staggered entrance
          gsap.to(shape, {
            opacity: 0.8,
            duration: 1.5,
            ease: "power2.out",
            delay: 0.5 + index * 0.15
          });
          
          // Floating animation with more natural movement
          gsap.to(shape, {
            y: "random(-30, 30)",
            x: "random(-20, 20)",
            rotation: "+=random(-45, 45)",
            duration: "random(6, 12)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.3
          });
        });
      }

      // Enhanced accent shapes with different movement patterns
      const accentShapes = accentShapesRef.current?.querySelectorAll(".accent-shape");
      if (accentShapes) {
        accentShapes.forEach((shape, index) => {
          gsap.set(shape, { 
            rotation: Math.random() * 360,
            scale: 0.6 + Math.random() * 0.3,
            opacity: 0
          });
          
          // Different entrance timing
          gsap.to(shape, {
            opacity: 0.6,
            duration: 1,
            ease: "power2.out",
            delay: 1 + index * 0.2
          });
          
          // Slower, more subtle movement
          gsap.to(shape, {
            y: "random(-15, 15)",
            x: "random(-10, 10)",
            rotation: "+=random(-20, 20)",
            duration: "random(8, 16)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.4
          });
        });
      }

      // Enhanced background lines with staggered reveal
      const lines = linesRef.current?.querySelectorAll(".line");
      if (lines) {
        lines.forEach((line, index) => {
          gsap.fromTo(line, 
            { scaleX: 0, opacity: 0, transformOrigin: index % 2 === 0 ? "left center" : "right center" },
            { 
              scaleX: 1, 
              opacity: 0.15,
              duration: 2,
              ease: "power3.out",
              delay: 0.8 + index * 0.2
            }
          );
        });
      }

      // Enhanced title animation with more dramatic entrance
      const titleLetters = titleRef.current?.querySelectorAll(".title-letter");
      if (titleLetters) {
        gsap.fromTo(titleLetters,
          { 
            y: 150, 
            rotation: "random(-15, 15)",
            opacity: 0,
            scale: 0.5,
            transformOrigin: "center center"
          },
          { 
            y: 0, 
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power4.out",
            stagger: {
              amount: 0.8,
              from: "center"
            },
            delay: 0.4
          }
        );
      }

      // Enhanced tagline with skew animation
      if (taglineRef.current) {
        gsap.fromTo(taglineRef.current,
          { 
            y: 50, 
            opacity: 0,
            skewX: -8,
            scale: 0.95
          },
          { 
            y: 0, 
            opacity: 1,
            skewX: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            delay: 1.5
          }
        );
      }

      // Enhanced button with bounce and anticipation
      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          { 
            y: 80, 
            opacity: 0,
            scale: 0.7,
            rotation: -5
          },
          { 
            y: 0, 
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(2.5)",
            delay: 2
          }
        );
      }

      // Enhanced video section entrance
      if (videoSectionRef.current) {
        gsap.fromTo(videoSectionRef.current,
          { 
            y: 120,
            opacity: 0,
            scale: 0.9
          },
          { 
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: 2.5
          }
        );
      }

      // Enhanced parallax with multiple layers
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Multi-layer parallax for depth
          if (shapes) {
            gsap.set(shapes, {
              y: progress * -80,
              rotation: `+=${progress * 30}`
            });
          }
          
          if (accentShapes) {
            gsap.set(accentShapes, {
              y: progress * -40,
              rotation: `+=${progress * -20}`
            });
          }
          
          if (lines) {
            gsap.set(lines, {
              y: progress * -30
            });
          }
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleButtonHover = (isHover: boolean) => {
    if (!buttonRef.current) return;
    
    gsap.to(buttonRef.current, {
      scale: isHover ? 1.08 : 1,
      rotation: isHover ? 2 : 0,
      y: isHover ? -3 : 0,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  return (
    <>
      {/* Enhanced Main Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
      >
        {/* Full Hero Brutalist Ripple Effect Background */}
        <div className="absolute inset-0 z-10">
          <BrutalistRippleEffect rows={8} cols={20} cellSize={80} />
        </div>

        {/* Enhanced Background Geometric Shapes */}
        <div ref={shapesRef} className="absolute inset-0 pointer-events-none z-5">
          <div className="floating-shape absolute top-16 left-8 w-24 h-24 bg-brand-green border-6 shadow-brutalLg rotate-12"></div>
          <div className="floating-shape absolute top-28 right-16 w-20 h-20 bg-black border-6 shadow-brutalLg -rotate-6"></div>
          <div className="floating-shape absolute bottom-36 left-16 w-28 h-16 bg-brand-accent border-6 shadow-brutalLg rotate-45"></div>
          <div className="floating-shape absolute bottom-16 right-8 w-22 h-22 bg-brand-green border-6 shadow-brutalLg -rotate-12"></div>
          <div className="floating-shape absolute top-1/2 left-4 w-18 h-18 bg-black border-6 shadow-brutalLg rotate-90"></div>
          <div className="floating-shape absolute top-1/3 right-4 w-16 h-24 bg-brand-accent border-6 shadow-brutalLg -rotate-45"></div>
          <div className="floating-shape absolute bottom-1/3 left-1/4 w-20 h-20 bg-brand-green border-6 shadow-brutal rotate-30"></div>
          <div className="floating-shape absolute top-2/3 right-1/4 w-18 h-18 bg-black border-6 shadow-brutal -rotate-30"></div>
        </div>

        {/* New Accent Shapes Layer */}
        <div ref={accentShapesRef} className="absolute inset-0 pointer-events-none">
          <div className="accent-shape absolute top-1/4 left-1/3 w-12 h-12 bg-brand-green border-4 shadow-brutal rotate-60"></div>
          <div className="accent-shape absolute top-3/4 right-1/3 w-10 h-16 bg-black border-4 shadow-brutal -rotate-30"></div>
          <div className="accent-shape absolute top-1/2 right-1/4 w-14 h-14 bg-brand-accent border-4 shadow-brutal rotate-120"></div>
          <div className="accent-shape absolute bottom-1/4 left-1/4 w-16 h-10 bg-brand-green border-4 shadow-brutal -rotate-60"></div>
        </div>

        {/* Enhanced Background Lines */}
        <div ref={linesRef} className="absolute inset-0 pointer-events-none z-5">
          <div className="line absolute top-1/4 left-0 w-full h-3 bg-black transform -skew-y-1 opacity-15"></div>
          <div className="line absolute top-1/2 right-0 w-4/5 h-3 bg-brand-green transform skew-y-1 opacity-15"></div>
          <div className="line absolute bottom-1/3 left-0 w-3/5 h-3 bg-brand-accent transform -skew-y-2 opacity-15"></div>
          <div className="line absolute bottom-1/4 right-0 w-2/3 h-3 bg-black transform skew-y-1 opacity-15"></div>
          <div className="line absolute top-3/4 left-1/3 w-1/2 h-2 bg-brand-green transform -skew-y-1 opacity-10"></div>
        </div>

        {/* Enhanced Main Content */}
        <div className="relative z-20 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-none">
          {/* Enhanced Main Title */}
          <div ref={titleRef} className="mb-12">
            <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-10xl font-display font-black leading-none tracking-tight">
              {/* ENSA - Single word on mobile, individual letters on larger screens */}
              <div className="block mb-6">
                {/* Mobile: ENSA as single word */}
                <div className="sm:hidden">
                  <span className="title-letter inline-block px-6 py-3 bg-black text-white border-6 shadow-brutalLg mx-2 transform hover:scale-105 transition-transform duration-300 cursor-default">
                    ENSA
                  </span>
                </div>
                {/* Desktop: ENSA as individual letters */}
                <div className="hidden sm:block">
                  {"ENSA".split("").map((char, index) => (
                    <span 
                      key={`ensa-${index}`}
                      className="title-letter inline-block px-6 py-3 bg-black text-white border-6 shadow-brutalLg mx-2 transform hover:scale-105 transition-transform duration-300 cursor-default"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
              <div className="block">
                {/* OFFLINE - Split into OFF and LINE on mobile, individual letters on larger screens */}
                <div className="sm:hidden">
                  {/* Mobile: OFF */}
                  <div className="mb-2">
                    <span className="title-letter inline-block px-6 py-3 bg-brand-green text-black border-6 shadow-brutalLg mx-2 transform hover:scale-105 transition-transform duration-300 cursor-default">
                      OFF
                    </span>
                  </div>
                  {/* Mobile: LINE */}
                  <div>
                    <span className="title-letter inline-block px-6 py-3 bg-brand-green text-black border-6 shadow-brutalLg mx-2 transform hover:scale-105 transition-transform duration-300 cursor-default">
                      LINE
                    </span>
                  </div>
                </div>
                {/* Desktop: OFFLINE as individual letters */}
                <div className="hidden sm:block">
                  {"OFFLINE".split("").map((char, index) => (
                    <span 
                      key={`offline-${index}`}
                      className="title-letter inline-block px-6 py-3 bg-brand-green text-black border-6 shadow-brutalLg mx-2 transform hover:scale-105 transition-transform duration-300 cursor-default"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </h1>
          </div>

          {/* Enhanced Tagline with Text Flip Animation */}
          <div ref={taglineRef} className="mb-16">
            <div className="inline-block bg-black text-white px-12 py-6 border-6 shadow-brutalLg transform -skew-x-2">
              <div className="skew-x-2">
                <BrutalistTextFlip
                  text="grace under"
                  words={["pressure", "chaos", "fire", "battle", "storm", "war"]}
                  duration={2500}
                  textColor="text-white"
                />
              </div>
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <div ref={buttonRef} className="pointer-events-auto">
            <Link href="/products">
              <button
                onMouseEnter={() => handleButtonHover(true)}
                onMouseLeave={() => handleButtonHover(false)}
                className="group relative inline-flex items-center justify-center px-12 py-6 bg-brand-green text-black border-6 shadow-brutalLg hover:shadow-brutalMd transition-all duration-300 font-display font-bold text-2xl sm:text-3xl uppercase tracking-wider transform"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Shop Now
                </span>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>

        {/* Enhanced Corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-brand-green border-b-6 border-r-6 border-black"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-black border-b-6 border-l-6 border-brand-green"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-black border-t-6 border-r-6 border-brand-green"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-brand-green border-t-6 border-l-6 border-black"></div>
      </section>

      {/* Enhanced Video Section */}
      <section 
        ref={videoSectionRef}
        className="relative py-20 sm:py-28 bg-black"
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-display font-black text-white mb-6 uppercase tracking-tight">
              <span className="inline-block bg-brand-green text-black px-6 py-3 border-6 shadow-brutalLg transform -skew-x-2">
                FEELINGS
              </span>
              <span className="inline-block bg-white text-black px-6 py-3 border-6 shadow-brutalLg transform skew-x-2 ml-3">
                MAY BE HURT
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-brand-green font-bold uppercase tracking-wider">
              RAW. UNFILTERED. BRUTAL.
            </p>
          </div>

          {/* Enhanced Video Container */}
          <div className="relative">
            {/* Enhanced brutal border frame */}
            <div className="absolute -inset-6 bg-brand-green border-6 shadow-brutalLg"></div>
            <div className="absolute -inset-3 bg-white border-6 shadow-brutal"></div>
            
            {/* Enhanced video placeholder */}
            <div className="relative bg-black border-6 shadow-brutal aspect-video overflow-hidden">
              <img
                src="/DSC_0154.jpg"
                alt="ENSA OFFLINE Team - Manifesto of Chaos"
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
              />
              
              {/* Enhanced play button overlay - circular with subtle pulse */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 group hover:bg-opacity-40 transition-all duration-300 cursor-pointer">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-brand-green border-6 shadow-brutalLg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  {/* pulse rings */}
                  <div className="absolute inset-0 rounded-full border-4 border-black/40 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-brand-green/60 animate-pulse"></div>
                  {/* play triangle */}
                  <div className="relative w-0 h-0 border-l-10 sm:border-l-14 border-l-black border-y-8 sm:border-y-10 border-y-transparent ml-2"></div>
                </div>
              </div>
              
              {/* Enhanced corner decorations */}
              <div className="absolute top-3 left-3 w-10 h-10 bg-brand-green border-4 shadow-brutal"></div>
              <div className="absolute top-3 right-3 w-10 h-10 bg-white border-4 shadow-brutal"></div>
              <div className="absolute bottom-3 left-3 w-10 h-10 bg-white border-4 shadow-brutal"></div>
              <div className="absolute bottom-3 right-3 w-10 h-10 bg-brand-green border-4 shadow-brutal"></div>
            </div>
          </div>

          {/* Enhanced video description */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-white px-8 py-4 border-6 shadow-brutal transform -skew-x-2">
              <p className="text-black font-bold uppercase tracking-wider skew-x-2 text-lg">
                WHERE CHAOS MEETS CREATION - THE ENSA OFFLINE PHILOSOPHY
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced background brutal elements */}
        <div className="absolute top-12 left-12 w-16 h-16 bg-brand-green border-6 shadow-brutal transform rotate-45"></div>
        <div className="absolute top-24 right-20 w-12 h-24 bg-white border-6 shadow-brutal transform -rotate-12"></div>
        <div className="absolute bottom-20 left-24 w-20 h-12 bg-brand-green border-6 shadow-brutal transform rotate-12"></div>
        <div className="absolute bottom-12 right-16 w-16 h-16 bg-white border-6 shadow-brutal transform -rotate-45"></div>
      </section>
    </>
  );
}