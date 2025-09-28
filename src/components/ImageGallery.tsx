"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!galleryRef.current) return;

    const ctx = gsap.context(() => {
      // Gallery entrance animation
      gsap.fromTo(galleryRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      // Thumbnails stagger animation
      const thumbnails = thumbnailsRef.current?.querySelectorAll(".thumbnail");
      gsap.fromTo(thumbnails,
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.4, 
          ease: "back.out(1.7)",
          stagger: 0.1,
          delay: 0.3
        }
      );
    }, galleryRef);

    return () => ctx.revert();
  }, []);

  const handleImageChange = (index: number) => {
    if (!mainImageRef.current) return;
    
    setSelectedImage(index);
    
    // Animate main image change
    gsap.to(mainImageRef.current, {
      scale: 0.95,
      opacity: 0.7,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(mainImageRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });

    // Animate thumbnail selection
    const thumbnails = thumbnailsRef.current?.querySelectorAll(".thumbnail");
    thumbnails?.forEach((thumb, i) => {
      gsap.to(thumb, {
        scale: i === index ? 1.05 : 1,
        borderColor: i === index ? "#8BC34A" : "#000000",
        duration: 0.3,
        ease: "power2.out"
      });
    });
  };

  const handleImageZoom = () => {
    if (!mainImageRef.current) return;
    
    setIsZoomed(!isZoomed);
    
    gsap.to(mainImageRef.current, {
      scale: isZoomed ? 1 : 1.5,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (images.length <= 1) return;
    
    const newIndex = direction === 'next' 
      ? (selectedImage + 1) % images.length
      : selectedImage === 0 ? images.length - 1 : selectedImage - 1;
    
    handleImageChange(newIndex);
  };

  const currentImage = images[selectedImage] || "";

  return (
    <div ref={galleryRef} className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-200 overflow-hidden border-6 shadow-brutal group">
        <div
          ref={mainImageRef}
          className="w-full h-full cursor-zoom-in flex items-center justify-center"
          onClick={handleImageZoom}
          style={{
            backgroundImage: currentImage ? `url(${currentImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {!currentImage && (
            <div className="text-gray-400 text-6xl font-display">
              {productName.charAt(0)}
            </div>
          )}
        </div>
        
        {/* Navigation Arrows - Only show if multiple images */}
        {images.length > 1 && (
          <>
            {/* Previous Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black text-white border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200 flex items-center justify-center group-hover:opacity-100 opacity-0 z-10"
            >
              <svg
                className="w-5 h-5 transform -translate-x-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>

            {/* Next Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-green text-black border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200 flex items-center justify-center group-hover:opacity-100 opacity-0 z-10"
            >
              <svg
                className="w-5 h-5 transform translate-x-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </button>
          </>
        )}
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm font-bold uppercase tracking-wider border-2 shadow-brutal">
            {selectedImage + 1} / {images.length}
          </div>
        )}
        
        {/* Zoom indicator */}
        <div className="absolute top-4 right-4 bg-black text-white px-2 py-1 text-xs font-bold uppercase tracking-wider">
          {isZoomed ? "Click to zoom out" : "Click to zoom"}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div ref={thumbnailsRef} className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`thumbnail flex-shrink-0 w-16 h-16 border-3 cursor-pointer transition-all duration-300 ${
                index === selectedImage ? "border-brand-green" : "border-black"
              }`}
              onClick={() => handleImageChange(index)}
              style={{
                backgroundImage: image ? `url(${image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!image && (
                <div className="w-full h-full flex items-center justify-center text-xs font-display bg-gray-200">
                  {index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
