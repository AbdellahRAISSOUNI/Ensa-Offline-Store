"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  const showcaseImageRef = useRef<HTMLDivElement>(null);
  const showcaseContentRef = useRef<HTMLDivElement>(null);
  const showcaseHeadlineRef = useRef<HTMLDivElement>(null);
  const showcaseTaglineRef = useRef<HTMLDivElement>(null);
  const showcaseDecoRef = useRef<HTMLDivElement>(null);
  const accentSquareRef = useRef<HTMLDivElement>(null);
  const diagonalStripeRef = useRef<HTMLDivElement>(null);
  const accentShapesRef = useRef<HTMLDivElement>(null);

  const showcaseWords = ["CREATION.", "CHAOS.", "FIRE.", "PRESSURE.", "BATTLE."];
  const [showcaseWordIndex, setShowcaseWordIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setShowcaseWordIndex((i) => (i + 1) % showcaseWords.length);
    }, 2800);
    return () => clearInterval(t);
  }, [showcaseWords.length]);

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

      // Showcase section: scroll-triggered reveal (image + content)
      if (videoSectionRef.current) {
        const imageEl = showcaseImageRef.current;
        const contentEl = showcaseContentRef.current;
        const headlineEl = showcaseHeadlineRef.current;
        const taglineEl = showcaseTaglineRef.current;
        const decoEl = showcaseDecoRef.current;

        if (imageEl) {
          gsap.set(imageEl, { x: -80, opacity: 0 });
          ScrollTrigger.create({
            trigger: videoSectionRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
            onEnter: () => {
              gsap.to(imageEl, { x: 0, opacity: 1, duration: 1, ease: "power3.out" });
            },
          });
        }
        if (headlineEl) {
          gsap.set(headlineEl, { x: 50, opacity: 0 });
          ScrollTrigger.create({
            trigger: videoSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            onEnter: () => {
              gsap.to(headlineEl, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.15 });
            },
          });
        }
        if (taglineEl) {
          gsap.set(taglineEl, { x: 40, opacity: 0 });
          ScrollTrigger.create({
            trigger: videoSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            onEnter: () => {
              gsap.to(taglineEl, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.3 });
            },
          });
        }
        if (decoEl) {
          gsap.set(decoEl, { y: 30, opacity: 0 });
          ScrollTrigger.create({
            trigger: videoSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            onEnter: () => {
              gsap.to(decoEl, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.45 });
            },
          });
        }

        // Infinite “life” animations in showcase section
        const accentSquare = accentSquareRef.current;
        const diagonalStripe = diagonalStripeRef.current;
        const badges = videoSectionRef.current?.querySelectorAll(".showcase-badge");
        if (accentSquare) {
          gsap.to(accentSquare, {
            y: "+=6",
            duration: 2.2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
        if (diagonalStripe) {
          gsap.to(diagonalStripe, {
            scaleY: 0.82,
            duration: 2.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            transformOrigin: "bottom",
          });
        }
        if (badges?.length) {
          badges.forEach((badge, i) => {
            gsap.to(badge, {
              scale: 1.04,
              duration: 1.8 + i * 0.2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: i * 0.3,
            });
          });
        }
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

      {/* Showcase Section: portrait image + copy (replaces video block) */}
      <section
        ref={videoSectionRef}
        className="relative py-16 sm:py-24 lg:py-28 bg-black overflow-hidden"
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center min-h-0">
            {/* Left: portrait image - keeps natural ratio, no stretch */}
            <div
              ref={showcaseImageRef}
              className="lg:col-span-5 flex justify-center lg:justify-end order-2 lg:order-1"
            >
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-4 bg-brand-green border-6 shadow-brutalLg -z-10"></div>
                <div className="relative border-6 border-white shadow-brutal overflow-hidden bg-black">
                  <img
                    src="/allfour.jpg"
                    alt="ENSA OFFLINE — grace under pressure"
                    className="w-full h-auto block"
                  />
                  <div className="absolute top-3 left-3 w-10 h-10 bg-brand-green border-4 shadow-brutal"></div>
                  <div className="absolute top-3 right-3 w-10 h-10 bg-white border-4 shadow-brutal"></div>
                  <div className="absolute bottom-3 left-3 w-10 h-10 bg-white border-4 shadow-brutal"></div>
                  <div className="absolute bottom-3 right-3 w-10 h-10 bg-brand-green border-4 shadow-brutal"></div>
                </div>
              </div>
            </div>

            {/* Right: headline + tagline — brutalist, asymmetric */}
            <div
              ref={showcaseContentRef}
              className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2 text-center lg:text-left relative"
            >
              {/* Accent shape behind type — infinite float */}
              <div ref={accentSquareRef} className="hidden lg:block absolute -top-4 -right-4 w-24 h-24 bg-brand-green border-6 shadow-brutalLg transform rotate-12 z-0" aria-hidden />
              {/* Diagonal stripe — sporty motion accent, infinite pulse */}
              <div ref={diagonalStripeRef} className="hidden lg:block absolute bottom-8 right-0 w-2 lg:w-3 h-32 bg-brand-green transform rotate-[-8deg] origin-bottom z-0" aria-hidden />

              <div ref={showcaseHeadlineRef} className="relative z-10">
                <h2 className="font-display font-black uppercase tracking-tighter leading-none">
                  <span className="block w-fit text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-black bg-brand-green border-6 shadow-brutalLg px-4 py-2 sm:px-5 sm:py-3 -skew-x-3 mt-0 mb-1 sm:mb-2">
                    FEELINGS
                  </span>
                  <span className="block w-fit text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white bg-black border-6 shadow-brutalLg px-4 py-2 sm:px-5 sm:py-3 skew-x-2 mt-2 sm:mt-3 lg:ml-8">
                    MAY BE HURT
                  </span>
                </h2>
              </div>

              {/* Thick rule + three words */}
              <div ref={showcaseTaglineRef} className="relative z-10 mt-6 sm:mt-8">
                <div className="h-2 sm:h-3 bg-brand-green border-4 border-black shadow-brutal w-full max-w-xs lg:max-w-sm ml-0 lg:ml-12" />
                <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                <span className="showcase-badge inline-block bg-white text-black border-4 border-black px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-black uppercase tracking-widest shadow-brutal">
                  RAW
                </span>
                <span className="showcase-badge inline-block bg-white text-black border-4 border-black px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-black uppercase tracking-widest shadow-brutal rotate-1">
                  UNFILTERED
                </span>
                <span className="showcase-badge inline-block bg-white text-black border-4 border-black px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-black uppercase tracking-widest shadow-brutal -rotate-1">
                  BRUTAL
                </span>
                </div>
              </div>

              <div ref={showcaseDecoRef} className="relative z-10 mt-8 sm:mt-10 lg:mt-12">
                {/* Small wordmark — Nike/Adidas-style brand bar */}
                <p className="text-white/70 font-bold uppercase tracking-[0.35em] text-xs sm:text-sm mb-4 lg:mb-5">
                  ENSA OFFLINE
                </p>
                {/* Campaign line: big type, wide tracking */}
                <div className="relative">
                  <p className="text-white font-black uppercase tracking-[0.12em] sm:tracking-[0.18em] text-xl sm:text-2xl lg:text-3xl leading-tight max-w-md lg:max-w-lg">
                    NO APOLOGIES.
                  </p>
                  <p className="text-brand-green font-black uppercase tracking-[0.12em] sm:tracking-[0.18em] text-xl sm:text-2xl lg:text-3xl leading-tight mt-1 lg:mt-2 min-h-[1.2em]">
                    JUST{" "}
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={showcaseWordIndex}
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -12, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="inline-block"
                      >
                        {showcaseWords[showcaseWordIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </p>
                  {/* Dynamic underline — extends past text, sporty accent */}
                  <div className="mt-3 lg:mt-4 h-1 w-24 sm:w-32 bg-brand-green" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background brutal shapes */}
        <div className="absolute top-12 left-12 w-16 h-16 bg-brand-green border-6 shadow-brutal transform rotate-45 pointer-events-none"></div>
        <div className="absolute top-24 right-20 w-12 h-24 bg-white border-6 shadow-brutal transform -rotate-12 pointer-events-none"></div>
        <div className="absolute bottom-20 left-24 w-20 h-12 bg-brand-green border-6 shadow-brutal transform rotate-12 pointer-events-none"></div>
        <div className="absolute bottom-12 right-16 w-16 h-16 bg-white border-6 shadow-brutal transform -rotate-45 pointer-events-none"></div>
      </section>
    </>
  );
}