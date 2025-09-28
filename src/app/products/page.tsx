"use client";
import { ProductShowcase } from "@/components/ProductShowcase";
import { BrutalistLoader } from "@/components/ui/BrutalistLoader";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: Array<{
    original: string;
    thumbnail: string;
    medium: string;
    large: string;
  }>;
  sizes: string[];
  category?: string;
  isCustomizable: boolean;
  customPrice?: number;
  isActive: boolean;
  stock?: number;
  tags?: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.products) {
            setProducts(data.data.products);
          } else if (data.products) {
            // Fallback for old format
            setProducts(data.products);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <BrutalistLoader size="lg" text="Loading Products..." variant="blocks" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ProductShowcase products={products} />
    </div>
  );
}
