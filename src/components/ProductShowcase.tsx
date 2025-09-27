"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ProductCard } from "./ProductCard";

interface ProductImage {
  original: string;
  thumbnail: string;
  medium: string;
  large: string;
}

interface Product {
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
  createdAt: string;
  updatedAt: string;
}

interface ProductShowcaseProps {
  products?: Product[];
}

export function ProductShowcase({ products: propProducts }: ProductShowcaseProps) {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>(propProducts || []);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(!propProducts);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success && data.data && data.data.products) {
        setProducts(data.data.products);
      } else if (data.products) {
        // Fallback for old format
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch products on mount if not provided as props
  useEffect(() => {
    if (!propProducts) {
      fetchProducts();
    }
  }, [propProducts]);

  const categories = ["all", "Hoodies", "T-Shirts", "Tank Tops", "Long Sleeves", "Accessories"];
  const sizes = ["all", "S", "M", "L", "XL", "XXL", "One Size"];

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;
    const sizeMatch = selectedSize === "all" || product.sizes.includes(selectedSize);
    return categoryMatch && sizeMatch;
  });

  useEffect(() => {
    if (!showcaseRef.current || !filterRef.current) return;

    const ctx = gsap.context(() => {
      // Filter section entrance
      gsap.fromTo(filterRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.2 }
      );
    }, showcaseRef);

    return () => ctx.revert();
  }, []);

  const handleFilterChange = (type: "category" | "size", value: string) => {
    setIsLoading(true);
    
    // Animate out current products
    const cards = showcaseRef.current?.querySelectorAll(".product-card");
    if (cards) {
      gsap.to(cards, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          // Update filter
          if (type === "category") {
            setSelectedCategory(value);
          } else {
            setSelectedSize(value);
          }
          
          // Animate in new products
          setTimeout(() => {
            const newCards = showcaseRef.current?.querySelectorAll(".product-card");
            if (newCards) {
              gsap.fromTo(newCards,
                { opacity: 0, y: 20 },
                { 
                  opacity: 1, 
                  y: 0, 
                  duration: 0.4, 
                  ease: "power2.out",
                  stagger: 0.1,
                  onComplete: () => setIsLoading(false)
                }
              );
            }
          }, 50);
        }
      });
    }
  };

  if (loadingProducts) {
    return (
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight text-black mb-4">
              Products
            </h2>
            <p className="text-lg sm:text-xl text-brand-accent font-bold">
              grace under pressure
            </p>
          </div>
          
          <div className="flex justify-center items-center py-20">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-brand-green animate-bounce"></div>
              <div className="w-3 h-3 bg-brand-green animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-brand-green animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight text-black mb-4">
            Products
          </h2>
          <p className="text-lg sm:text-xl text-brand-accent font-bold">
            grace under pressure
          </p>
        </div>

        {/* Filters */}
        <div ref={filterRef} className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Category Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="text-sm font-bold uppercase tracking-wider text-black">Category:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange("category", category)}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border-3 transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-brand-green text-black shadow-brutal"
                        : "bg-white text-black border-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="text-sm font-bold uppercase tracking-wider text-black">Size:</span>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFilterChange("size", size)}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border-3 transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-brand-green text-black shadow-brutal"
                        : "bg-white text-black border-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-brand-green animate-bounce"></div>
              <div className="w-3 h-3 bg-brand-green animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-brand-green animate-bounce delay-200"></div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div 
          ref={showcaseRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredProducts.map((product, index) => (
            <div key={product._id} className="product-card">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-display font-bold uppercase tracking-tight text-black mb-2">
              No Products Found
            </h3>
            <p className="text-brand-accent font-bold">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </section>
  );
}