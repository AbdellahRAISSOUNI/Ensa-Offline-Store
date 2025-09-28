"use client";
import { useEffect, useRef, useState } from "react";
import { BrutalistLoader } from "@/components/ui/BrutalistLoader";
import { OrderForm } from "@/components/OrderForm";

interface Product {
  _id: string;
  name: string;
  price: number;
  sizes: string[];
  isCustomizable: boolean;
  customPrice?: number;
  category: string;
  stock?: number;
}

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default function OrderPage({ params }: OrderPageProps) {
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

  return (
    <div ref={pageRef} className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight text-black mb-4">
            Place Your Order
          </h1>
          <p className="text-lg sm:text-xl text-brand-accent font-bold">
            grace under pressure
          </p>
        </div>

        {/* Order Form */}
        <OrderForm product={product} />

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border-6 shadow-brutal p-6">
            <h3 className="text-lg font-display font-bold uppercase tracking-tight text-black mb-4">
              Payment Information
            </h3>
            <div className="space-y-2 text-sm text-brand-accent">
              <p>• Payment via WhatsApp after order confirmation</p>
              <p>• Bank transfer or cash on delivery</p>
              <p>• No advance payment required</p>
            </div>
          </div>

          <div className="bg-white border-6 shadow-brutal p-6">
            <h3 className="text-lg font-display font-bold uppercase tracking-tight text-black mb-4">
              Delivery Information
            </h3>
            <div className="space-y-2 text-sm text-brand-accent">
              <p>• Free delivery in Tetouan</p>
              <p>• 2-3 days processing time</p>
              <p>• Tracking number provided</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}