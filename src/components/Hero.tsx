"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

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

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Background shapes floating animation
      const shapes = shapesRef.current?.querySelectorAll(".floating-shape");
      if (shapes) {
        shapes.forEach((shape, index) => {
          gsap.set(shape, { 
            rotation: Math.random() * 360,
            scale: 0.8 + Math.random() * 0.4 
          });
          
          gsap.to(shape, {
            y: "random(-20, 20)",
            x: "random(-15, 15)",
            rotation: "+=random(-30, 30)",
            duration: "random(4, 8)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.2
          });
        });
      }

      // Background lines animation
      const lines = linesRef.current?.querySelectorAll(".line");
      if (lines) {
        lines.forEach((line, index) => {
          gsap.fromTo(line, 
            { scaleX: 0, opacity: 0 },
            { 
              scaleX: 1, 
              opacity: 0.2,
              duration: 1.5,
              ease: "power2.out",
              delay: 0.5 + index * 0.1
            }
          );
        });
      }

      // Main title staggered entrance
      const titleLetters = titleRef.current?.querySelectorAll(".title-letter");
      if (titleLetters) {
        gsap.fromTo(titleLetters,
          { 
            y: 100, 
            rotation: "random(-10, 10)",
            opacity: 0,
            scale: 0.8
          },
          { 
            y: 0, 
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            stagger: 0.05,
            delay: 0.3
          }
        );
      }

      // Tagline entrance
      if (taglineRef.current) {
        gsap.fromTo(taglineRef.current,
          { 
            y: 30, 
            opacity: 0,
            skewY: 2
          },
          { 
            y: 0, 
            opacity: 1,
            skewY: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 1.2
          }
        );
      }

      // Button entrance with bounce
      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          { 
            y: 50, 
            opacity: 0,
            scale: 0.8
          },
          { 
            y: 0, 
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "back.out(2)",
            delay: 1.6
          }
        );
      }

      // Video section entrance
      if (videoSectionRef.current) {
        gsap.fromTo(videoSectionRef.current,
          { 
            y: 100,
            opacity: 0,
            scale: 0.95
          },
          { 
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            delay: 2
          }
        );
      }

      // Parallax scroll effects
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Parallax background elements
          if (shapes) {
            gsap.set(shapes, {
              y: progress * -100,
              rotation: `+=${progress * 50}`
            });
          }
          
          if (lines) {
            gsap.set(lines, {
              y: progress * -50
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
      scale: isHover ? 1.05 : 1,
      rotation: isHover ? 1 : 0,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <>
      {/* Main Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
      >
        {/* Background Geometric Shapes */}
        <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
          <div className="floating-shape absolute top-20 left-10 w-20 h-20 bg-brand-green border-6 shadow-brutalLg rotate-12"></div>
          <div className="floating-shape absolute top-32 right-20 w-16 h-16 bg-black border-6 shadow-brutalLg -rotate-6"></div>
          <div className="floating-shape absolute bottom-40 left-20 w-24 h-12 bg-brand-accent border-6 shadow-brutalLg rotate-45"></div>
          <div className="floating-shape absolute bottom-20 right-10 w-18 h-18 bg-brand-green border-6 shadow-brutalLg -rotate-12"></div>
          <div className="floating-shape absolute top-1/2 left-5 w-14 h-14 bg-black border-6 shadow-brutalLg rotate-90"></div>
          <div className="floating-shape absolute top-1/3 right-5 w-12 h-20 bg-brand-accent border-6 shadow-brutalLg -rotate-45"></div>
          <div className="floating-shape absolute bottom-1/3 left-1/3 w-16 h-16 bg-brand-green border-6 shadow-brutal rotate-30"></div>
          <div className="floating-shape absolute top-2/3 right-1/3 w-14 h-14 bg-black border-6 shadow-brutal -rotate-30"></div>
        </div>

        {/* Background Lines */}
        <div ref={linesRef} className="absolute inset-0 pointer-events-none">
          <div className="line absolute top-1/4 left-0 w-full h-2 bg-black transform -skew-y-1 opacity-20"></div>
          <div className="line absolute top-1/2 right-0 w-3/4 h-2 bg-brand-green transform skew-y-1 opacity-20"></div>
          <div className="line absolute bottom-1/3 left-0 w-1/2 h-2 bg-brand-accent transform -skew-y-2 opacity-20"></div>
          <div className="line absolute bottom-1/4 right-0 w-2/3 h-2 bg-black transform skew-y-1 opacity-20"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Title */}
          <div ref={titleRef} className="mb-8">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black leading-none tracking-tight">
              <div className="block mb-4">
                {"ENSA".split("").map((char, index) => (
                  <span 
                    key={`ensa-${index}`}
                    className="title-letter inline-block px-4 py-2 bg-black text-white border-6 shadow-brutalLg mx-1 transform hover:scale-110 transition-transform duration-200"
                  >
                    {char}
                  </span>
                ))}
              </div>
              <div className="block">
                {"OFFLINE".split("").map((char, index) => (
                  <span 
                    key={`offline-${index}`}
                    className="title-letter inline-block px-4 py-2 bg-brand-green text-black border-6 shadow-brutalLg mx-1 transform hover:scale-110 transition-transform duration-200"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </h1>
          </div>

          {/* Tagline */}
          <div ref={taglineRef} className="mb-12">
            <div className="inline-block bg-black text-white px-8 py-4 border-6 shadow-brutalLg transform -skew-x-1">
              <p className="text-xl sm:text-2xl md:text-3xl font-body font-bold tracking-wider uppercase skew-x-1">
                grace under pressure
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div ref={buttonRef}>
            <Link href="/products">
              <button
                onMouseEnter={() => handleButtonHover(true)}
                onMouseLeave={() => handleButtonHover(false)}
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-brand-green text-black border-6 shadow-brutalLg hover:shadow-brutalMd transition-all duration-300 font-display font-bold text-xl sm:text-2xl uppercase tracking-wider transform hover:-translate-y-1"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Shop Now
                </span>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-brand-green border-b-6 border-r-6 border-black"></div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-black border-b-6 border-l-6 border-brand-green"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-black border-t-6 border-r-6 border-brand-green"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-brand-green border-t-6 border-l-6 border-black"></div>
      </section>

      {/* Video Section */}
      <section 
        ref={videoSectionRef}
        className="relative py-16 sm:py-24 bg-black"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white mb-4 uppercase tracking-tight">
              <span className="inline-block bg-brand-green text-black px-4 py-2 border-6 shadow-brutalLg transform -skew-x-1">
                BEHIND
              </span>
              <span className="inline-block bg-white text-black px-4 py-2 border-6 shadow-brutalLg transform skew-x-1 ml-2">
                THE SCENES
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-brand-green font-bold uppercase tracking-wider">
              THE MAKING OF BRUTALIST MERCH
            </p>
          </div>

          {/* Video Container */}
          <div className="relative">
            {/* Brutal border frame */}
            <div className="absolute -inset-4 bg-brand-green border-6 shadow-brutalLg"></div>
            <div className="absolute -inset-2 bg-white border-6 shadow-brutal"></div>
            
            {/* Video placeholder */}
            <div className="relative bg-black border-6 shadow-brutal aspect-video overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=675&fit=crop&crop=center"
                alt="Behind the scenes - Merch production"
                className="w-full h-full object-cover filter grayscale"
              />
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 group hover:bg-opacity-30 transition-all duration-300 cursor-pointer">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-brand-green border-6 shadow-brutalLg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                  <div className="w-0 h-0 border-l-8 sm:border-l-12 border-l-black border-y-6 sm:border-y-8 border-y-transparent ml-1"></div>
                </div>
              </div>
              
              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-8 h-8 bg-brand-green border-3 shadow-brutal"></div>
              <div className="absolute top-2 right-2 w-8 h-8 bg-white border-3 shadow-brutal"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 bg-white border-3 shadow-brutal"></div>
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-brand-green border-3 shadow-brutal"></div>
            </div>
          </div>

          {/* Video description */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-white px-6 py-3 border-6 shadow-brutal transform -skew-x-1">
              <p className="text-black font-bold uppercase tracking-wider skew-x-1">
                FROM CONCEPT TO CREATION - THE ENSA OFFLINE PROCESS
              </p>
            </div>
          </div>
        </div>

        {/* Background brutal elements */}
        <div className="absolute top-10 left-10 w-12 h-12 bg-brand-green border-6 shadow-brutal transform rotate-45"></div>
        <div className="absolute top-20 right-16 w-8 h-16 bg-white border-6 shadow-brutal transform -rotate-12"></div>
        <div className="absolute bottom-16 left-20 w-16 h-8 bg-brand-green border-6 shadow-brutal transform rotate-12"></div>
        <div className="absolute bottom-10 right-12 w-12 h-12 bg-white border-6 shadow-brutal transform -rotate-45"></div>
      </section>
    </>
  );
}