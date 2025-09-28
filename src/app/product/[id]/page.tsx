"use client";
import { useEffect, useRef, useState } from "react";
import { ImageGallery } from "@/components/ImageGallery";
import { ProductInfo } from "@/components/ProductInfo";

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
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-lg font-display font-bold uppercase tracking-tight text-black">
            Loading Product...
          </div>
        </div>
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

        {/* Additional Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-6 shadow-brutal p-6 text-center">
            <div className="text-3xl mb-3">🚚</div>
            <h3 className="text-lg font-display font-bold uppercase tracking-tight text-black mb-2">
              Fast Delivery
            </h3>
            <p className="text-sm text-brand-accent font-bold">
              2-3 days in Tetouan, 3-5 days nationwide
            </p>
          </div>

          <div className="bg-white border-6 shadow-brutal p-6 text-center">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-display font-bold uppercase tracking-tight text-black mb-2">
              Custom Design
            </h3>
            <p className="text-sm text-brand-accent font-bold">
              Add your own text or design
            </p>
          </div>

          <div className="bg-white border-6 shadow-brutal p-6 text-center">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-lg font-display font-bold uppercase tracking-tight text-black mb-2">
              Quality Guarantee
            </h3>
            <p className="text-sm text-brand-accent font-bold">
              100% satisfaction or money back
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}