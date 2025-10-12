"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function NavBar() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  // Scroll detection for header hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) { // Only hide after scrolling down 100px
        if (currentScrollY > lastScrollY && isHeaderVisible) {
          // Scrolling down - hide header
          setIsHeaderVisible(false);
          if (headerRef.current) {
            gsap.to(headerRef.current, {
              y: -100,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        } else if (currentScrollY < lastScrollY && !isHeaderVisible) {
          // Scrolling up - show header
          setIsHeaderVisible(true);
          if (headerRef.current) {
            gsap.to(headerRef.current, {
              y: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        }
      } else if (!isHeaderVisible) {
        // Always show header when near top
        setIsHeaderVisible(true);
        if (headerRef.current) {
          gsap.to(headerRef.current, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isHeaderVisible]);

  useEffect(() => {
    if (!headerRef.current || !logoRef.current || !navRef.current) return;

    const ctx = gsap.context(() => {
      // Logo entrance animation
      gsap.fromTo(
        logoRef.current,
        { 
          scale: 0.8, 
          rotation: -2, 
          opacity: 0,
          y: -20
        },
        { 
          scale: 1, 
          rotation: 0, 
          opacity: 1,
          y: 0,
          duration: 0.8, 
          ease: "back.out(1.7)",
          delay: 0.2
        }
      );

      // Navigation items stagger animation
      const navItems = navRef.current?.querySelectorAll(".nav-item");
      if (navItems) {
        gsap.fromTo(
          navItems,
        { 
          opacity: 0, 
          y: -15,
          rotation: 1
        },
        { 
          opacity: 1, 
          y: 0,
          rotation: 0,
          duration: 0.6, 
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.4
        }
      );
      }

      // Scroll-triggered header effects (background blur)
      ScrollTrigger.create({
        trigger: "body",
        start: "top -100px",
        end: "bottom bottom",
        onEnter: () => {
          gsap.to(headerRef.current, {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            duration: 0.3,
            ease: "power2.out"
          });
        },
        onLeaveBack: () => {
          gsap.to(headerRef.current, {
            backgroundColor: "rgba(255, 255, 255, 1)",
            backdropFilter: "blur(0px)",
            boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    }, headerRef);

    return () => ctx.revert();
  }, []);

  const toggleMobileMenu = () => {
    if (!mobileMenuRef.current || !hamburgerRef.current) return;

    // Add immediate click feedback
    gsap.to(hamburgerRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });

    const tl = gsap.timeline();
    
    if (!isMobileMenuOpen) {
      // Open menu - Start hamburger animation immediately
      setIsMobileMenuOpen(true);
      
      // Immediate hamburger transformation - smooth and modern
      tl.to(hamburgerRef.current.querySelector(".hamburger-line:nth-child(1)"), {
        rotation: 45,
        y: 6,
        duration: 0.4,
        ease: "power3.out"
      })
      .to(hamburgerRef.current.querySelector(".hamburger-line:nth-child(2)"), {
        opacity: 0,
        scaleX: 0,
        duration: 0.3,
        ease: "power2.inOut",
        transformOrigin: "center"
      }, "-=0.4")
      .to(hamburgerRef.current.querySelector(".hamburger-line:nth-child(3)"), {
        rotation: -45,
        y: -6,
        duration: 0.4,
        ease: "power3.out"
      }, "-=0.4")
      // Menu panel reveal - smooth and clean
      .to(mobileMenuRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.2")
      // Menu items stagger reveal - subtle and elegant
      .fromTo(
        mobileMenuRef.current.querySelectorAll(".mobile-nav-item"),
        { opacity: 0, y: 15, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.3,
          stagger: 0.08,
          ease: "back.out(1.2)"
        },
        "-=0.2"
      );
    } else {
      // Close menu - Start hamburger animation immediately
      tl.to(mobileMenuRef.current.querySelectorAll(".mobile-nav-item"), {
        opacity: 0,
        y: -15,
        scale: 0.95,
        duration: 0.2,
        stagger: 0.04,
        ease: "power2.in"
      })
      .to(mobileMenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      }, "-=0.1")
      // Hamburger return to original state - smooth and clean
      .to(hamburgerRef.current.querySelector(".hamburger-line:nth-child(1)"), {
        rotation: 0,
        y: 0,
        duration: 0.4,
        ease: "power3.out"
      }, "-=0.2")
      .to(hamburgerRef.current.querySelector(".hamburger-line:nth-child(2)"), {
        opacity: 1,
        scaleX: 1,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.4")
      .to(hamburgerRef.current.querySelector(".hamburger-line:nth-child(3)"), {
        rotation: 0,
        y: 0,
        duration: 0.4,
        ease: "power3.out"
      }, "-=0.4")
      .call(() => setIsMobileMenuOpen(false));
    }
  };

  const handleNavClick = (e: React.MouseEvent) => {
    const link = e.currentTarget as HTMLAnchorElement;
    gsap.to(link, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });
  };

  return (
    <header 
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b-3 xs:border-b-4 sm:border-b-6 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo - Mobile Optimized */}
          <div ref={logoRef} className="flex-shrink-0">
            <Link href="/" className="group">
              <div className="flex items-center space-x-1 xs:space-x-2">
                <span className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-display font-black tracking-tight">
                  <span className="px-1.5 py-0.5 xs:px-2 xs:py-1 bg-black text-white shadow-brutal group-hover:shadow-brutalMd transition-all duration-200">
                    ENSA
                  </span>
                  <span className="px-1.5 py-0.5 xs:px-2 xs:py-1 bg-brand-green text-black border-2 xs:border-3 shadow-brutal group-hover:shadow-brutalMd transition-all duration-200 ml-0.5 xs:ml-1">
                    OFFLINE
                  </span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="nav-item text-sm font-bold uppercase tracking-wider text-black hover:text-brand-green transition-colors duration-200 relative group"
              onClick={handleNavClick}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-green transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/products" 
              className="nav-item text-sm font-bold uppercase tracking-wider text-black hover:text-brand-green transition-colors duration-200 relative group"
              onClick={handleNavClick}
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-green transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/contact" 
              className="nav-item text-sm font-bold uppercase tracking-wider text-black hover:text-brand-green transition-colors duration-200 relative group"
              onClick={handleNavClick}
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-green transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <CurrencyToggle size="sm" />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              ref={hamburgerRef}
              onClick={toggleMobileMenu}
              className="relative w-8 h-8 flex flex-col justify-center items-center group"
              aria-label="Toggle mobile menu"
            >
              <span className="hamburger-line w-6 h-0.5 bg-black"></span>
              <span className="hamburger-line w-6 h-0.5 bg-black mt-1"></span>
              <span className="hamburger-line w-6 h-0.5 bg-black mt-1"></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          ref={mobileMenuRef}
          className="md:hidden overflow-hidden h-0 opacity-0"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t-3">
            <Link 
              href="/" 
              className="mobile-nav-item block px-3 py-2 text-base font-bold uppercase tracking-wider text-black hover:text-brand-green hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="mobile-nav-item block px-3 py-2 text-base font-bold uppercase tracking-wider text-black hover:text-brand-green hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/contact" 
              className="mobile-nav-item block px-3 py-2 text-base font-bold uppercase tracking-wider text-black hover:text-brand-green hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="mobile-nav-item px-3 py-2">
              <CurrencyToggle size="sm" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


