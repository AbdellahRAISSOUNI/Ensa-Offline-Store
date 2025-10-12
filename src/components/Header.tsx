"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";

gsap.registerPlugin(ScrollTrigger);

export function Header() {
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Subtle entrance for logo and header
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.05 }
      );
    }

    // Scroll effect: add subtle shadow + reduce padding
    if (headerRef.current) {
      const el = headerRef.current;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 0px)", () => {
        gsap.to(el, {
          boxShadow: "0 2px 0 0 rgba(0,0,0,0.1)",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "+=1",
            onUpdate: (self) => {
              const scrolled = self.scroll() > 4;
              gsap.to(el, {
                boxShadow: scrolled ? "0 3px 0 0 rgba(0,0,0,0.12)" : "0 0 0 0 rgba(0,0,0,0)",
                backgroundColor: scrolled ? "#FFFFFF" : "#FFFFFF",
                duration: 0.2,
                overwrite: "auto",
              });
            },
          },
        });
      });
      return () => mm.revert();
    }
  }, []);

  // Toggle mobile menu with height animation
  const toggleMenu = () => {
    const panel = menuRef.current;
    if (!panel) return;
    if (open) {
      gsap.to(panel, { height: 0, duration: 0.25, ease: "power2.inOut" });
      setOpen(false);
    } else {
      gsap.fromTo(panel, { height: 0 }, { height: "auto", duration: 0.25, ease: "power2.inOut" });
      setOpen(true);
    }
  };

  return (
    <div ref={headerRef} className="w-full sticky top-0 z-50 bg-white border-b-6">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link ref={logoRef} href="/" className="font-display text-2xl md:text-3xl will-change-transform">
          <span className="px-2 py-1 bg-black text-white shadow-brutal">ENSA</span>{" "}
          <span className="px-2 py-1 bg-[#8BC34A] text-black border-3 shadow-brutal">OFFLINE</span>
        </Link>
        <div className="flex items-center gap-3">
          <nav className="hidden sm:flex gap-4 text-sm font-body">
            <Link href="/" className="px-3 py-2 border-3 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">Home</Link>
            <Link href="/products" className="px-3 py-2 border-3 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">Products</Link>
            <Link href="/contact" className="px-3 py-2 border-3 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">Contact</Link>
          </nav>
          <CurrencyToggle size="sm" className="hidden sm:inline-flex" />
          <button aria-label="Cart" className="hidden sm:inline-flex p-2 border-3 shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6h15l-2 9H8L6 6Z" stroke="#000" strokeWidth="2"/>
              <circle cx="9" cy="20" r="1.5" fill="#000"/>
              <circle cx="18" cy="20" r="1.5" fill="#000"/>
            </svg>
          </button>
          <button onClick={toggleMenu} aria-label="Menu" className="sm:hidden p-2 border-3 shadow-brutal">
            <div className="w-5 h-0.5 bg-black mb-1" />
            <div className="w-5 h-0.5 bg-black mb-1" />
            <div className="w-5 h-0.5 bg-black" />
          </button>
        </div>
      </div>
      <div ref={menuRef} className="sm:hidden overflow-hidden h-0 bg-white border-t-6">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
          <Link href="/" onClick={() => open && toggleMenu()} className="px-3 py-2 border-3">Home</Link>
          <Link href="/products" onClick={() => open && toggleMenu()} className="px-3 py-2 border-3">Products</Link>
          <Link href="/contact" onClick={() => open && toggleMenu()} className="px-3 py-2 border-3">Contact</Link>
          <div className="mt-2 flex items-center justify-between">
            <button aria-label="Cart" className="inline-flex items-center gap-2 px-3 py-2 border-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6h15l-2 9H8L6 6Z" stroke="#000" strokeWidth="2"/>
                <circle cx="9" cy="20" r="1.5" fill="#000"/>
                <circle cx="18" cy="20" r="1.5" fill="#000"/>
              </svg>
              Cart
            </button>
            <CurrencyToggle size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}


