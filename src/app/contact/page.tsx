"use client";
import { useEffect, useRef } from "react";

export default function ContactPage() {
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple entrance animation without GSAP issues
    if (contactRef.current) {
      contactRef.current.style.opacity = '0';
      contactRef.current.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        if (contactRef.current) {
          contactRef.current.style.transition = 'all 0.6s ease';
          contactRef.current.style.opacity = '1';
          contactRef.current.style.transform = 'translateY(0)';
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div ref={contactRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight text-black mb-4">
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl text-brand-accent font-bold">
            Get in touch with ENSA OFFLINE
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="bg-white border-6 shadow-brutal p-6">
            <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black mb-6">
              Get In Touch
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📱</div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-brand-accent">WhatsApp</div>
                  <div className="text-lg font-bold text-black">+212 6XX XXX XXX</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📧</div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-brand-accent">Email</div>
                  <div className="text-lg font-bold text-black">contact@ensaoffline.com</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📍</div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-brand-accent">Location</div>
                  <div className="text-lg font-bold text-black">Tetouan, Morocco</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white border-6 shadow-brutal p-6">
            <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black mb-6">
              Follow Us
            </h2>
            
            <div className="space-y-4">
              <a href="#" className="flex items-center space-x-3 p-3 border-3 border-black hover:bg-brand-green transition-colors duration-200">
                <div className="text-2xl">📸</div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-brand-accent">Instagram</div>
                  <div className="text-lg font-bold text-black">@ensaoffline</div>
                </div>
              </a>
              
              <a href="#" className="flex items-center space-x-3 p-3 border-3 border-black hover:bg-brand-green transition-colors duration-200">
                <div className="text-2xl">📘</div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-brand-accent">Facebook</div>
                  <div className="text-lg font-bold text-black">ENSA OFFLINE</div>
                </div>
              </a>
              
              <a href="#" className="flex items-center space-x-3 p-3 border-3 border-black hover:bg-brand-green transition-colors duration-200">
                <div className="text-2xl">🐦</div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-brand-accent">Twitter</div>
                  <div className="text-lg font-bold text-black">@ensaoffline</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Message */}
        <div className="mt-12 bg-black text-white border-6 shadow-brutal p-6 text-center">
          <h3 className="text-xl font-display font-bold uppercase tracking-tight mb-4">
            Ready to Order?
          </h3>
          <p className="text-brand-green font-bold mb-4">
            Check out our products and place your order today!
          </p>
          <a 
            href="/products" 
            className="inline-block bg-brand-green text-black border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-display font-bold text-sm uppercase tracking-wider py-2 px-6"
          >
            View Products
          </a>
        </div>
      </div>
    </div>
  );
}
