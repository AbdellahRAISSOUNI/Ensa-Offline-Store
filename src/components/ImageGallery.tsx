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

  const currentImage = images[selectedImage] || "";

  return (
    <div ref={galleryRef} className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-200 overflow-hidden border-6 shadow-brutal">
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
