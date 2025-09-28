"use client";
import { useEffect, useRef, useState } from "react";
import { ImageGallery } from "@/components/ImageGallery";
import { ProductInfo } from "@/components/ProductInfo";
import { BrutalistLoader } from "@/components/ui/BrutalistLoader";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: Array<{
    original: string;
    thumbnail: string;
    medium: string;
    large: string;
  }>;
  sizes: string[];
  isCustomizable: boolean;
  customPrice?: number;
  category: string;
  stock?: number;
  tags?: string[];
}

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const productId = params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setProduct(data.data);
        } else {
          throw new Error('Invalid product data');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error instanceof Error ? error.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (!pageRef.current) return;

    // Dynamic import of GSAP for client-side only
    const initAnimation = async () => {
      const { gsap } = await import("gsap");
      
      const ctx = gsap.context(() => {
        // Page entrance animation
        gsap.fromTo(pageRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.out" }
        );
      }, pageRef);

      return () => ctx.revert();
    };

    initAnimation();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <BrutalistLoader size="lg" text="Loading Product..." variant="blocks" />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-lg font-display font-bold uppercase tracking-tight text-black mb-2">
            Product Not Found
          </div>
          <div className="text-sm text-brand-accent font-bold">
            {error || 'The product you are looking for does not exist.'}
          </div>
          <a 
            href="/products" 
            className="inline-block mt-4 px-6 py-2 bg-brand-green text-black font-bold uppercase tracking-wider hover:bg-brand-accent transition-colors duration-200"
          >
            Back to Products
          </a>
        </div>
      </div>
    );
  }

  // Convert product images to the format expected by ImageGallery
  const galleryImages = product.images.map(img => img.original || img.medium || img.thumbnail);

  return (
    <div ref={pageRef} className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-brand-accent hover:text-brand-green transition-colors duration-200">
              Home
            </a>
            <span className="text-brand-accent">/</span>
            <a href="/products" className="text-brand-accent hover:text-brand-green transition-colors duration-200">
              Products
            </a>
            <span className="text-brand-accent">/</span>
            <span className="text-black font-bold">{product.name}</span>
          </div>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="order-2 lg:order-1">
            <ImageGallery 
              images={galleryImages} 
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="order-1 lg:order-2">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Enhanced Feature Cards Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Premium Materials Card */}
          <div className="group relative bg-white border-6 shadow-brutal hover:shadow-brutalLg transition-all duration-300 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              <div className="absolute top-2 left-2 w-8 h-8 bg-black border-2 border-brand-green rotate-45"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-brand-green border-2 border-black -rotate-45"></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-black border-2 border-brand-green rotate-12 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            
            {/* Icon */}
            <div className="relative z-10 flex justify-center mb-4 pt-6">
              <div className="w-16 h-16 bg-black border-4 border-brand-green shadow-brutal flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-brand-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            
            <div className="relative z-10 p-6 text-center">
              <h3 className="text-xl font-display font-black uppercase tracking-tight text-black mb-3 group-hover:text-brand-green transition-colors duration-300">
                PREMIUM MATERIALS
              </h3>
              <p className="text-sm text-brand-accent font-bold leading-relaxed">
                High-quality fabrics and printing techniques for lasting durability
              </p>
            </div>
            
            {/* Hover Accent Line */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-brand-green group-hover:w-full transition-all duration-500"></div>
          </div>

          {/* Custom Design Card */}
          <div className="group relative bg-white border-6 shadow-brutal hover:shadow-brutalLg transition-all duration-300 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              <div className="absolute top-3 right-3 w-6 h-10 bg-brand-green border-2 border-black rotate-12"></div>
              <div className="absolute bottom-3 left-3 w-8 h-6 bg-black border-2 border-brand-green -rotate-12"></div>
              <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-brand-green border-2 border-black rotate-45"></div>
            </div>
            
            {/* Icon */}
            <div className="relative z-10 flex justify-center mb-4 pt-6">
              <div className="w-16 h-16 bg-brand-green border-4 border-black shadow-brutal flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            
            <div className="relative z-10 p-6 text-center">
              <h3 className="text-xl font-display font-black uppercase tracking-tight text-black mb-3 group-hover:text-brand-green transition-colors duration-300">
                CUSTOM DESIGN
              </h3>
              <p className="text-sm text-brand-accent font-bold leading-relaxed">
                Personalize with your own text, graphics, and unique styling
              </p>
            </div>
            
            {/* Hover Accent Line */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-brand-green group-hover:w-full transition-all duration-500"></div>
          </div>

          {/* Quality Guarantee Card */}
          <div className="group relative bg-white border-6 shadow-brutal hover:shadow-brutalLg transition-all duration-300 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              <div className="absolute top-2 right-2 w-10 h-6 bg-black border-2 border-brand-green -rotate-12"></div>
              <div className="absolute bottom-2 left-2 w-6 h-8 bg-brand-green border-2 border-black rotate-12"></div>
              <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-black border-2 border-brand-green rotate-45"></div>
            </div>
            
            {/* Icon */}
            <div className="relative z-10 flex justify-center mb-4 pt-6">
              <div className="w-16 h-16 bg-black border-4 border-brand-green shadow-brutal flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-brand-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
              </div>
            </div>
            
            <div className="relative z-10 p-6 text-center">
              <h3 className="text-xl font-display font-black uppercase tracking-tight text-black mb-3 group-hover:text-brand-green transition-colors duration-300">
                QUALITY GUARANTEE
              </h3>
              <p className="text-sm text-brand-accent font-bold leading-relaxed">
                100% satisfaction guaranteed or full money back
              </p>
            </div>
            
            {/* Hover Accent Line */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-brand-green group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}