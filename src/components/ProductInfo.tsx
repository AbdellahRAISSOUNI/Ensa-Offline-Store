"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ProductInfoProps {
  product: {
    _id?: string;
    id?: string;
    name: string;
    price: number;
    description?: string;
    sizes: string[];
    isCustomizable: boolean;
    customPrice?: number;
    category?: string;
    stock?: number;
    tags?: string[];
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const infoRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { formatPrice, convertPrice } = useCurrency();
  
  const [selectedSize, setSelectedSize] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  
  const cities = [
    { name: "Tetouan", fee: 0, isTetouan: true },
    { name: "Tangier", fee: 15 },
    { name: "Casablanca", fee: 25 },
    { name: "Rabat", fee: 20 },
    { name: "Fez", fee: 18 },
    { name: "Other", fee: 30 }
  ];

  const calculateTotalPrice = () => {
    let total = product.price;
    if (isCustom && product.customPrice) {
      total += product.customPrice;
    }
    total += shippingFee;
    return total;
  };

  // Handle URL parameters for pre-filled values
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const custom = urlParams.get('custom');
    const customTextParam = urlParams.get('customText');
    
    if (custom === 'true' && product.isCustomizable) {
      setIsCustom(true);
    }
    
    if (customTextParam) {
      setCustomText(decodeURIComponent(customTextParam));
    }
  }, [product.isCustomizable]);

  useEffect(() => {
    if (!infoRef.current) return;

    const initAnimation = async () => {
      const { gsap } = await import("gsap");
      
      const ctx = gsap.context(() => {
        // Info section entrance
        gsap.fromTo(infoRef.current,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", delay: 0.2 }
        );

        // Form elements stagger
        const formElements = formRef.current?.querySelectorAll(".form-element");
        if (formElements) {
          gsap.fromTo(formElements,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.5, 
            ease: "power2.out",
            stagger: 0.1,
            delay: 0.5
          }
        );
        }
      }, infoRef);

      return () => ctx.revert();
    };

    initAnimation();
  }, []);

  const handleSizeSelect = async (size: string) => {
    setSelectedSize(size);
    
    // Animate size selection
    const sizeButtons = formRef.current?.querySelectorAll(".size-btn");
    if (sizeButtons?.length) {
      const { gsap } = await import("gsap");
      sizeButtons.forEach((btn) => {
        const isSelected = btn.getAttribute("data-size") === size;
        gsap.to(btn, {
          backgroundColor: isSelected ? "#8BC34A" : "#FFFFFF",
          color: isSelected ? "#000000" : "#000000",
          scale: isSelected ? 1.05 : 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }
  };

  const handleCustomToggle = async () => {
    setIsCustom(!isCustom);
    
    // Animate custom toggle
    const customSection = formRef.current?.querySelector(".custom-section");
    if (customSection) {
      const { gsap } = await import("gsap");
      gsap.to(customSection, {
        height: !isCustom ? "auto" : 0,
        opacity: !isCustom ? 1 : 0,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const handleCitySelect = async (city: typeof cities[0]) => {
    setSelectedCity(city.name);
    setShippingFee(city.fee);
    
    // Animate city selection
    const cityButtons = formRef.current?.querySelectorAll(".city-btn");
    if (cityButtons?.length) {
      const { gsap } = await import("gsap");
      cityButtons.forEach((btn) => {
        const isSelected = btn.getAttribute("data-city") === city.name;
        gsap.to(btn, {
          backgroundColor: isSelected ? "#8BC34A" : "#FFFFFF",
          color: isSelected ? "#000000" : "#000000",
          scale: isSelected ? 1.02 : 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }

    // Animate price update
    if (priceRef.current) {
      const { gsap } = await import("gsap");
      gsap.to(priceRef.current, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    }
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSize) {
      // Animate error state
      const sizeSection = formRef.current?.querySelector(".size-section");
      if (sizeSection) {
        import("gsap").then(({ gsap }) => {
          gsap.to(sizeSection, {
            x: -10,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 2
          });
        });
      }
      return;
    }

    if (!selectedCity) {
      // Animate error state
      const citySection = formRef.current?.querySelector(".city-section");
      if (citySection) {
        import("gsap").then(({ gsap }) => {
          gsap.to(citySection, {
            x: -10,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 2
          });
        });
      }
      return;
    }

    // Success animation
    const button = e.currentTarget.querySelector("button[type='submit']");
    if (button) {
      import("gsap").then(({ gsap }) => {
        gsap.to(button, {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            // Here you would typically add to cart logic
            console.log("Added to cart:", {
              product: product.name,
              size: selectedSize,
              customText: isCustom ? customText : null,
              city: selectedCity,
              totalPrice: calculateTotalPrice()
            });
          }
        });
      });
    }
  };

  const handleFieldFocus = async (fieldRef: React.RefObject<HTMLInputElement>) => {
    if (fieldRef.current) {
      const { gsap } = await import("gsap");
      gsap.to(fieldRef.current, {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handleFieldBlur = async (fieldRef: React.RefObject<HTMLInputElement>) => {
    if (fieldRef.current) {
      const { gsap } = await import("gsap");
      gsap.to(fieldRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const customTextRef = useRef<HTMLInputElement>(null);

  return (
    <div ref={infoRef} className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-black mb-2">
          {product.name}
        </h1>
        <div ref={priceRef} className="text-2xl sm:text-3xl font-bold text-black">
          {formatPrice(product.price)}
          {isCustom && product.customPrice && (
            <span className="text-lg text-brand-accent ml-2">
              + {formatPrice(product.customPrice)} custom
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="text-gray-700 font-body leading-relaxed">
          {product.description}
        </div>
      )}

      {/* Product Form */}
      <form ref={formRef} onSubmit={handleAddToCart} className="space-y-6">
        {/* Size Selection */}
        <div className="form-element size-section">
          <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
            Size *
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                className="size-btn px-4 py-2 border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-display font-bold text-sm uppercase tracking-wider bg-white text-black"
                data-size={size}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Text Toggle */}
        {product.isCustomizable && (
          <div className="form-element">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isCustom}
                onChange={handleCustomToggle}
                className="w-5 h-5 text-brand-green border-3 focus:ring-brand-green"
              />
              <span className="text-sm font-bold uppercase tracking-wider text-black">
                Add Custom Text (+{formatPrice(product.customPrice || 0)})
              </span>
            </label>
            
            <div className={`custom-section overflow-hidden ${isCustom ? 'mt-4' : ''}`}>
              <input
                ref={customTextRef}
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter your custom text..."
                className="w-full px-4 py-3 border-3 shadow-brutal focus:shadow-brutalMd transition-all duration-200 font-body text-black placeholder-gray-500"
                onFocus={() => handleFieldFocus(customTextRef)}
                onBlur={() => handleFieldBlur(customTextRef)}
              />
            </div>
          </div>
        )}

        {/* City Selection */}
        <div className="form-element city-section">
          <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
            Delivery City *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cities.map((city) => (
              <button
                key={city.name}
                type="button"
                className="city-btn px-3 py-2 border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-display font-bold text-xs uppercase tracking-wider bg-white text-black"
                data-city={city.name}
                onClick={() => handleCitySelect(city)}
              >
                {city.name}
                {city.fee > 0 && (
                  <div className="text-xs text-brand-accent mt-1">
                    +{formatPrice(city.fee)}
                  </div>
                )}
                {city.isTetouan && (
                  <div className="text-xs text-brand-green mt-1 font-bold">
                    FREE
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Total Price */}
        <div className="form-element">
          <div className="bg-black text-white p-4 border-3 shadow-brutal">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold uppercase tracking-wider">
                Total Price:
              </span>
              <span className="text-xl font-bold">
                {formatPrice(calculateTotalPrice())}
              </span>
            </div>
            {shippingFee > 0 && (
              <div className="text-xs text-gray-300 mt-1">
                Includes {formatPrice(shippingFee)} shipping to {selectedCity}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-element">
          <div className="flex gap-2">
            <Link 
              href={`/order/${product._id || product.id}?size=${selectedSize}&city=${selectedCity}&custom=${isCustom ? 'true' : 'false'}${isCustom && customText ? `&customText=${encodeURIComponent(customText)}` : ''}`} 
              className="flex-1"
            >
              <button
                type="button"
                className="w-full bg-brand-green text-black border-6 shadow-brutalLg hover:shadow-brutalMd transition-all duration-300 font-display font-bold text-lg uppercase tracking-wider py-4 px-6"
              >
                Order Now - {formatPrice(calculateTotalPrice())}
              </button>
            </Link>
            
          </div>
        </div>
      </form>
    </div>
  );
}
