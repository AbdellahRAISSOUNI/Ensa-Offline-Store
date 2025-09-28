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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Navigation functions
  const navigateImage = (direction: 'prev' | 'next') => {
    if (product.images.length <= 1) return;
    
    setCurrentImageIndex(prev => {
      if (direction === 'next') {
        return prev === product.images.length - 1 ? 0 : prev + 1;
      } else {
        return prev === 0 ? product.images.length - 1 : prev - 1;
      }
    });
  };

  // Get the current image for display
  const currentImage = product.images[currentImageIndex];
  const displayImage = currentImage?.medium || currentImage?.original || '';

  return (
    <div
      ref={cardRef}
      className="group relative bg-white border-6 shadow-brutal hover:shadow-brutalLg transition-all duration-300 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Product Image */}
      <div className="relative">
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

        {/* Image Navigation Arrows - Only show if multiple images */}
        {product.images.length > 1 && (
          <>
            {/* Previous Arrow */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200 flex items-center justify-center group opacity-0 group-hover:opacity-100 z-10"
            >
              <svg
                className="w-4 h-4 transform -translate-x-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>

            {/* Next Arrow */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-green text-black border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200 flex items-center justify-center group opacity-0 group-hover:opacity-100 z-10"
            >
              <svg
                className="w-4 h-4 transform translate-x-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-bold uppercase tracking-wider border-2 shadow-brutal opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {currentImageIndex + 1} / {product.images.length}
            </div>
          </>
        )}
      </div>

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
