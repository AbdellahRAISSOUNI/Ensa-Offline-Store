"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ContactPage() {
  const contactRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!contactRef.current) return;

    const ctx = gsap.context(() => {
      // Main container entrance
      gsap.fromTo(contactRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      // Cards staggered entrance
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.6, 
          ease: "back.out(1.7)",
          stagger: 0.2,
          delay: 0.3
        }
      );
    }, contactRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div ref={contactRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-black uppercase tracking-tight text-black mb-6">
            <span className="inline-block bg-black text-white px-6 py-3 border-6 shadow-brutalLg transform -skew-x-2">
              CONTACT
            </span>
            <span className="inline-block bg-brand-green text-black px-6 py-3 border-6 shadow-brutalLg transform skew-x-2 ml-3">
              US
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-brand-accent font-bold uppercase tracking-wider">
            CONNECT WITH ENSA OFFLINE
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* WhatsApp Card */}
          <div 
            ref={(el) => { if (el) cardsRef.current[0] = el; }}
            className="group relative bg-white border-6 shadow-brutal hover:shadow-brutalLg transition-all duration-300 overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              <div className="absolute top-2 left-2 w-8 h-8 bg-brand-green border-2 border-black rotate-45"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-black border-2 border-brand-green -rotate-45"></div>
            </div>
            
            <div className="relative z-10 p-8 text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-brand-green border-4 border-black shadow-brutal mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </div>
              
              <h3 className="text-xl font-display font-black uppercase tracking-tight text-black mb-3">
                WHATSAPP
              </h3>
              <p className="text-sm text-brand-accent font-bold mb-6">
                Direct messaging for instant support
              </p>
              
              <a
                href="https://wa.me/212689541661"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-green text-black border-4 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-display font-bold text-sm uppercase tracking-wider py-3 px-6 w-full"
              >
                Chat Now
              </a>
            </div>
            
            {/* Hover Accent Line */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-brand-green group-hover:w-full transition-all duration-500"></div>
          </div>

          {/* Email Card */}
          <div 
            ref={(el) => { if (el) cardsRef.current[1] = el; }}
            className="group relative bg-white border-6 shadow-brutal hover:shadow-brutalLg transition-all duration-300 overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              <div className="absolute top-3 right-3 w-6 h-10 bg-black border-2 border-brand-green rotate-12"></div>
              <div className="absolute bottom-3 left-3 w-8 h-6 bg-brand-green border-2 border-black -rotate-12"></div>
            </div>
            
            <div className="relative z-10 p-8 text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-black border-4 border-brand-green shadow-brutal mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-10 h-10 text-brand-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              
              <h3 className="text-xl font-display font-black uppercase tracking-tight text-black mb-3">
                EMAIL
              </h3>
              <p className="text-sm text-brand-accent font-bold mb-6">
                Professional inquiries and support
              </p>
              
              <a
                href="mailto:abdellahraissouni@gmail.com"
                className="inline-block bg-black text-brand-green border-4 border-brand-green shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-display font-bold text-sm uppercase tracking-wider py-3 px-6 w-full"
              >
                Send Email
              </a>
            </div>
            
            {/* Hover Accent Line */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-brand-green group-hover:w-full transition-all duration-500"></div>
          </div>

          {/* Instagram Card */}
          <div 
            ref={(el) => { if (el) cardsRef.current[2] = el; }}
            className="group relative bg-white border-6 shadow-brutal hover:shadow-brutalLg transition-all duration-300 overflow-hidden md:col-span-2 lg:col-span-1"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              <div className="absolute top-2 right-2 w-10 h-6 bg-brand-green border-2 border-black -rotate-12"></div>
              <div className="absolute bottom-2 left-2 w-6 h-8 bg-black border-2 border-brand-green rotate-12"></div>
            </div>
            
            <div className="relative z-10 p-8 text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-brand-green border-4 border-black shadow-brutal mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              
              <h3 className="text-xl font-display font-black uppercase tracking-tight text-black mb-3">
                INSTAGRAM
              </h3>
              <p className="text-sm text-brand-accent font-bold mb-6">
                Follow our latest designs and updates
              </p>
              
              <a
                href="https://www.instagram.com/ensa.offline/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-green text-black border-4 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-display font-bold text-sm uppercase tracking-wider py-3 px-6 w-full"
              >
                Follow @ensa.offline
              </a>
            </div>
            
            {/* Hover Accent Line */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-brand-green group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>

        {/* LinkedIn Section */}
        <div className="mb-16">
          <div className="group relative bg-black text-white border-6 shadow-brutalLg overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-12 h-12 bg-brand-green border-2 border-white rotate-45"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 bg-white border-2 border-brand-green -rotate-45"></div>
              <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-brand-green border-2 border-white rotate-12 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            
            <div className="relative z-10 p-8 text-center">
              <div className="w-24 h-24 bg-white border-4 border-brand-green shadow-brutal mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              
              <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-3">
                LINKEDIN
              </h3>
              <p className="text-brand-green font-bold mb-6">
                Technical support and website development inquiries
              </p>
              
              <a
                href="https://www.linkedin.com/in/abdellah-raissouni-1419432a8/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-green text-black border-4 border-white shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-display font-bold text-lg uppercase tracking-wider py-4 px-8"
              >
                Contact Developer
              </a>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-block bg-brand-green text-black px-8 py-4 border-6 shadow-brutalLg transform -skew-x-2">
            <p className="text-black font-black uppercase tracking-wider skew-x-2 text-lg">
              READY TO CREATE SOMETHING BRUTAL?
            </p>
          </div>
          <div className="mt-6">
            <a 
              href="/products" 
              className="inline-block bg-black text-white border-6 shadow-brutalLg hover:shadow-brutalMd transition-all duration-300 font-display font-bold text-xl uppercase tracking-wider py-4 px-8 transform hover:-translate-y-1"
            >
              View Our Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}