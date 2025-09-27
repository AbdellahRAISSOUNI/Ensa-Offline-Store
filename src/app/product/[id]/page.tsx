"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ImageGallery } from "@/components/ImageGallery";
import { ProductInfo } from "@/components/ProductInfo";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const productId = params.id;

  // Mock product data - in real app, this would come from API
  const getProductById = (id: string) => {
    const mockProducts = [
      {
        id: "1",
        name: "ENSA Hoodie",
        price: 89,
        description: "Premium quality hoodie with brutalist design. Made from 100% cotton with reinforced stitching. Features our signature ENSA logo and 'grace under pressure' tagline.",
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        isCustomizable: true,
        customPrice: 15
      },
      {
        id: "2",
        name: "OFFLINE Tee",
        price: 45,
        description: "Classic cotton t-shirt with bold OFFLINE branding. Perfect for everyday wear with our signature brutalist aesthetic.",
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        isCustomizable: true,
        customPrice: 10
      },
      {
        id: "3",
        name: "Grace Cap",
        price: 35,
        description: "Premium baseball cap with embroidered ENSA logo. One size fits all with adjustable strap.",
        images: [
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop"
        ],
        sizes: ["One Size"],
        isCustomizable: false
      },
      {
        id: "4",
        name: "Pressure Tank",
        price: 65,
        description: "Sleeveless tank top perfect for warm weather. Features bold ENSA branding and comfortable fit.",
        images: [
          "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop"
        ],
        sizes: ["S", "M", "L", "XL"],
        isCustomizable: true,
        customPrice: 12
      },
      {
        id: "5",
        name: "ENSA Sticker Pack",
        price: 12,
        description: "Set of 5 vinyl stickers featuring ENSA designs. Perfect for laptops, phones, and other surfaces.",
        images: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop"
        ],
        sizes: ["One Size"],
        isCustomizable: false
      },
      {
        id: "6",
        name: "OFFLINE Longsleeve",
        price: 55,
        description: "Long sleeve t-shirt with OFFLINE branding. Made from premium cotton blend for comfort and durability.",
        images: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop"
        ],
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
            <span className="text-black font-bold">{mockProduct.name}</span>
          </div>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="order-2 lg:order-1">
            <ImageGallery 
              images={mockProduct.images} 
              productName={mockProduct.name}
            />
          </div>

          {/* Product Info */}
          <div className="order-1 lg:order-2">
            <ProductInfo product={mockProduct} />
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