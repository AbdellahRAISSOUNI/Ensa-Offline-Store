"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { OrderForm } from "@/components/OrderForm";

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default function OrderPage({ params }: OrderPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const productId = params.id;

  // Mock product data - in real app, this would come from API
  const getProductById = (id: string) => {
    const mockProducts = [
      {
        id: "1",
        name: "ENSA Hoodie",
        price: 89,
        sizes: ["S", "M", "L", "XL", "XXL"],
        isCustomizable: true,
        customPrice: 15
      },
      {
        id: "2",
        name: "OFFLINE Tee",
        price: 45,
        sizes: ["S", "M", "L", "XL", "XXL"],
        isCustomizable: true,
        customPrice: 10
      },
      {
        id: "3",
        name: "Grace Cap",
        price: 35,
        sizes: ["One Size"],
        isCustomizable: false
      },
      {
        id: "4",
        name: "Pressure Tank",
        price: 65,
        sizes: ["S", "M", "L", "XL"],
        isCustomizable: true,
        customPrice: 12
      },
      {
        id: "5",
        name: "ENSA Sticker Pack",
        price: 12,
        sizes: ["One Size"],
        isCustomizable: false
      },
      {
        id: "6",
        name: "OFFLINE Longsleeve",
        price: 55,
        sizes: ["S", "M", "L", "XL"],
        isCustomizable: true,
        customPrice: 8
      }
    ];
    
    return mockProducts.find(product => product.id === id) || mockProducts[0];
  };

  const mockProduct = getProductById(productId);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      // Page entrance animation
      gsap.fromTo(pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

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
        <OrderForm product={mockProduct} />

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