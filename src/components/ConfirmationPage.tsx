"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";

interface ConfirmationPageProps {
  orderData?: {
    orderId: string;
    customerName: string;
    whatsappNumber: string;
    productName: string;
    size: string;
    city: string;
    customText?: string;
    totalPrice: number;
  };
}

export function ConfirmationPage({ orderData }: ConfirmationPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const celebrationRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  // Generate unique order ID if not provided
  const generateOrderId = () => {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ENSA-${y}${m}${d}-${rand}`;
  };

  // Get order data from sessionStorage if not provided
  const getOrderData = () => {
    if (orderData) return orderData;
    
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem('orderData');
      if (stored) {
        return JSON.parse(stored);
      }
    }
    
    // Fallback data
    return {
      orderId: generateOrderId(),
      customerName: "John Doe",
      whatsappNumber: "+212 6XX XXX XXX",
      productName: "ENSA Hoodie",
      size: "L",
      city: "Tetouan",
      customText: "Grace Under Pressure",
      totalPrice: 104
    };
  };

  const order = getOrderData();

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      // Celebration elements entrance
      const celebrationElements = celebrationRef.current?.querySelectorAll(".celebration-element");
      celebrationElements?.forEach((element, index) => {
        gsap.fromTo(element,
          { 
            scale: 0, 
            rotation: "random(-180, 180)",
            opacity: 0
          },
          { 
            scale: 1, 
            rotation: 0,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: index * 0.1
          }
        );
      });

      // Order summary reveal
      gsap.fromTo(orderRef.current,
        { 
          y: 50, 
          opacity: 0,
          scale: 0.95
        },
        { 
          y: 0, 
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.5
        }
      );

      // Timeline stagger animation
      const timelineItems = timelineRef.current?.querySelectorAll(".timeline-item");
      gsap.fromTo(timelineItems,
        { 
          x: -30, 
          opacity: 0
        },
        { 
          x: 0, 
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.2,
          delay: 1.0
        }
      );

      // Social links animation
      const socialItems = socialRef.current?.querySelectorAll(".social-item");
      gsap.fromTo(socialItems,
        { 
          y: 20, 
          opacity: 0,
          scale: 0.8
        },
        { 
          y: 0, 
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.1,
          delay: 1.5
        }
      );

      // Floating animation for celebration elements
      celebrationElements?.forEach((element) => {
        gsap.to(element, {
          y: "random(-10, 10)",
          rotation: "random(-5, 5)",
          duration: "random(2, 4)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        });
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleButtonHover = (buttonRef: React.RefObject<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    gsap.to(buttonRef.current, {
      scale: 1.05,
      rotation: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleButtonLeave = (buttonRef: React.RefObject<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    gsap.to(buttonRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const trackOrderRef = useRef<HTMLButtonElement>(null);
  const shopMoreRef = useRef<HTMLButtonElement>(null);
  const contactRef = useRef<HTMLButtonElement>(null);

  const getExpectedDelivery = () => {
    const today = new Date();
    const deliveryDays = 4; // Standard delivery time
    
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Celebration Header */}
        <div ref={celebrationRef} className="text-center mb-12">
          <div className="celebration-element text-8xl mb-6">🎉</div>
          <h1 className="celebration-element text-4xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight text-black mb-4">
            Order Confirmed!
          </h1>
          <p className="celebration-element text-xl sm:text-2xl text-brand-accent font-bold mb-6">
            Thank you for choosing ENSA OFFLINE
          </p>
          <div className="celebration-element text-lg text-black font-body">
            grace under pressure
          </div>
        </div>

        {/* Order Summary */}
        <div ref={orderRef} className="bg-white border-6 shadow-brutalLg p-6 sm:p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-black mb-2">
              Order Summary
            </h2>
            <div className="text-lg font-bold text-brand-green">
              Order ID: {order.orderId}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-display font-bold uppercase tracking-tight text-black border-b-3 pb-2">
                Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-bold text-brand-accent">Name:</span>
                  <span className="text-black">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-brand-accent">WhatsApp:</span>
                  <span className="text-black">{order.whatsappNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-brand-accent">City:</span>
                  <span className="text-black">{order.city}</span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-display font-bold uppercase tracking-tight text-black border-b-3 pb-2">
                Order Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-bold text-brand-accent">Product:</span>
                  <span className="text-black">{order.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-brand-accent">Size:</span>
                  <span className="text-black">{order.size}</span>
                </div>
                {order.customText && (
                  <div className="flex justify-between">
                    <span className="font-bold text-brand-accent">Custom Text:</span>
                    <span className="text-black">"{order.customText}"</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg text-brand-green border-t-3 pt-2 mt-4">
                  <span>Total:</span>
                  <span>${order.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-black mb-6 text-center">
            What Happens Next?
          </h2>
          
          <div className="space-y-4">
            <div className="timeline-item bg-white border-6 shadow-brutal p-4 sm:p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-green text-black font-bold text-sm flex items-center justify-center border-3">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold uppercase tracking-tight text-black mb-2">
                    Order Confirmation
                  </h3>
                  <p className="text-sm text-brand-accent font-bold">
                    We'll contact you on WhatsApp within 2 hours to confirm your order details and payment method.
                  </p>
                </div>
              </div>
            </div>

            <div className="timeline-item bg-white border-6 shadow-brutal p-4 sm:p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-green text-black font-bold text-sm flex items-center justify-center border-3">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold uppercase tracking-tight text-black mb-2">
                    Production
                  </h3>
                  <p className="text-sm text-brand-accent font-bold">
                    Your order will be processed and {order.customText ? "customized" : "prepared"} within 1-2 business days.
                  </p>
                </div>
              </div>
            </div>

            <div className="timeline-item bg-white border-6 shadow-brutal p-4 sm:p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-green text-black font-bold text-sm flex items-center justify-center border-3">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold uppercase tracking-tight text-black mb-2">
                    Shipping
                  </h3>
                  <p className="text-sm text-brand-accent font-bold">
                    Your order will be shipped to {order.city}. Expected delivery: <strong>{getExpectedDelivery()}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="timeline-item bg-white border-6 shadow-brutal p-4 sm:p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-green text-black font-bold text-sm flex items-center justify-center border-3">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold uppercase tracking-tight text-black mb-2">
                    Delivery
                  </h3>
                  <p className="text-sm text-brand-accent font-bold">
                    You'll receive a tracking number and delivery confirmation. Enjoy your ENSA OFFLINE gear!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            ref={trackOrderRef}
            onMouseEnter={() => handleButtonHover(trackOrderRef)}
            onMouseLeave={() => handleButtonLeave(trackOrderRef)}
            className="flex-1 bg-brand-green text-black border-6 shadow-brutalLg hover:shadow-brutalMd transition-all duration-300 font-display font-bold text-lg uppercase tracking-wider py-4 px-6"
          >
            Track Order
          </button>
          
          <Link href="/products" className="flex-1">
            <button
              ref={shopMoreRef}
              onMouseEnter={() => handleButtonHover(shopMoreRef)}
              onMouseLeave={() => handleButtonLeave(shopMoreRef)}
              className="w-full bg-black text-white border-6 shadow-brutalLg hover:shadow-brutalMd transition-all duration-300 font-display font-bold text-lg uppercase tracking-wider py-4 px-6"
            >
              Shop More
            </button>
          </Link>
          
          <button
            ref={contactRef}
            onMouseEnter={() => handleButtonHover(contactRef)}
            onMouseLeave={() => handleButtonLeave(contactRef)}
            className="flex-1 bg-white text-black border-6 shadow-brutalLg hover:shadow-brutalMd transition-all duration-300 font-display font-bold text-lg uppercase tracking-wider py-4 px-6"
          >
            Contact Us
          </button>
        </div>

        {/* Contact Information */}
        <div className="bg-black text-white border-6 shadow-brutal p-6 mb-8">
          <h3 className="text-lg font-display font-bold uppercase tracking-tight mb-4">
            Need Help?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-bold text-brand-green mb-2">WhatsApp Support:</div>
              <div>+212 6XX XXX XXX</div>
              <div className="text-xs text-gray-300 mt-1">Available 9 AM - 9 PM</div>
            </div>
            <div>
              <div className="font-bold text-brand-green mb-2">Email:</div>
              <div>support@ensaoffline.com</div>
              <div className="text-xs text-gray-300 mt-1">Response within 24 hours</div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div ref={socialRef} className="text-center">
          <h3 className="text-lg font-display font-bold uppercase tracking-tight text-black mb-4">
            Follow Us
          </h3>
          <div className="flex justify-center space-x-4">
            <a href="#" className="social-item bg-brand-green text-black w-12 h-12 flex items-center justify-center border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200">
              <span className="text-xl">📱</span>
            </a>
            <a href="#" className="social-item bg-black text-white w-12 h-12 flex items-center justify-center border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200">
              <span className="text-xl">📸</span>
            </a>
            <a href="#" className="social-item bg-brand-accent text-white w-12 h-12 flex items-center justify-center border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200">
              <span className="text-xl">🐦</span>
            </a>
          </div>
          <p className="text-sm text-brand-accent font-bold mt-4">
            Tag us in your photos! #ENSAOFFLINE #GraceUnderPressure
          </p>
        </div>
      </div>
    </div>
  );
}
