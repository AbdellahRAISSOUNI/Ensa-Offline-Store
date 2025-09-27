"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";

interface ProductImage {
  original: string;
  thumbnail: string;
  medium: string;
  large: string;
}

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description?: string;
    price: number;
    images: ProductImage[];
    sizes: string[];
    category?: string;
    isCustomizable: boolean;
    customPrice?: number;
    isActive: boolean;
    stock?: number;
    tags?: string[];
  };
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Initial entrance animation
      gsap.fromTo(cardRef.current,
        { 
          y: 60, 
          opacity: 0,
          scale: 0.9,
          rotation: "random(-2, 2)"
        },
        { 
          y: 0, 
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: index * 0.1
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  const handleMouseEnter = () => {
    if (!cardRef.current || !imageRef.current || !overlayRef.current) return;
    
    setIsHovered(true);
    
    const tl = gsap.timeline();
    
    tl.to(cardRef.current, {
      scale: 1.02,
      y: -8,
      duration: 0.3,
      ease: "power2.out"
    })
    .to(imageRef.current, {
      scale: 1.1,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.2")
    .to(overlayRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    }, "-=0.3");
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !imageRef.current || !overlayRef.current) return;
    
    setIsHovered(false);
    
    const tl = gsap.timeline();
    
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in"
    })
    .to(imageRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    }, "-=0.1")
    .to(cardRef.current, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.out"
    }, "-=0.2");
  };

  const handleButtonClick = (action: string) => {
    const button = cardRef.current?.querySelector(`[data-action="${action}"]`);
    if (!button) return;
    
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });
  };

  // Get the best image for display
  const displayImage = product.images[0]?.medium || product.images[0]?.original || '';

  return (
    <div
      ref={cardRef}
      className="group relative bg-white border-6 shadow-brutal hover:shadow-brutalLg transition-all duration-300 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Product Image */}
      <Link href={`/product/${product._id}`} className="block">
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <div
            ref={imageRef}
            className="w-full h-full bg-gray-200 flex items-center justify-center"
            style={{
              backgroundImage: displayImage ? `url(${displayImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!displayImage && (
              <div className="text-gray-400 text-4xl font-display">
                {product.name.charAt(0)}
              </div>
            )}
          </div>
          
          {/* Hover Overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black bg-opacity-60 opacity-0 flex items-center justify-center"
          >
            <div className="text-center text-white">
              <div className="text-sm font-bold uppercase tracking-wider mb-2">
                Available Sizes
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="px-2 py-1 bg-white text-black text-xs font-bold border"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 sm:p-6">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg sm:text-xl font-display font-bold uppercase tracking-tight text-black mb-2 hover:text-brand-green transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl sm:text-3xl font-bold text-black">
            ${product.price}
          </div>
          {product.isCustomizable && (
            <div className="text-sm text-brand-accent font-bold">
              +${product.customPrice || 0} custom
            </div>
          )}
        </div>

        {/* Stock indicator */}
        {product.stock !== undefined && (
          <div className="text-xs text-gray-500 mb-2">
            Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/product/${product._id}`}>
            <button
              data-action="view-details"
              onClick={() => handleButtonClick('view-details')}
              className="flex-1 bg-brand-green text-black border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-display font-bold text-sm uppercase tracking-wider py-2 px-3"
            >
              View Details
            </button>
          </Link>
          
          {product.isCustomizable && (
            <button
              data-action="customize"
              onClick={() => handleButtonClick('customize')}
              className="flex-1 bg-black text-white border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-display font-bold text-sm uppercase tracking-wider py-2 px-3"
            >
              Customize
            </button>
          )}
        </div>
      </div>

      {/* Loading Animation Overlay */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 right-2 w-2 h-2 bg-brand-green animate-pulse"></div>
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-black animate-pulse delay-1000"></div>
        </div>
      )}
    </div>
  );
}
