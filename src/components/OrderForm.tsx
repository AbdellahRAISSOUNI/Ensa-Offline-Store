"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface OrderFormProps {
  product: {
    _id?: string;
    id?: string;
    name: string;
    price: number;
    sizes: string[];
    isCustomizable: boolean;
    customPrice?: number;
    category?: string;
    stock?: number;
  };
}

interface FormData {
  fullName: string;
  whatsappNumber: string;
  size: string;
  city: string;
  customText: string;
}

interface FormErrors {
  fullName?: string;
  whatsappNumber?: string;
  size?: string;
  city?: string;
  customText?: string;
}

export function OrderForm({ product }: OrderFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    whatsappNumber: "",
    size: "",
    city: "",
    customText: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCustomTextEnabled, setIsCustomTextEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form with URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const size = urlParams.get('size');
    const city = urlParams.get('city');
    const custom = urlParams.get('custom');
    const customText = urlParams.get('customText');

    if (size || city || custom || customText) {
      setFormData(prev => ({
        ...prev,
        size: size || prev.size,
        city: city || prev.city,
        customText: customText || prev.customText
      }));

      if (custom === 'true') {
        setIsCustomTextEnabled(true);
      }
    }
  }, []);

  // Moroccan cities with shipping fees
  const cities = [
    { name: "Tetouan", fee: 0, isTetouan: true },
    { name: "Tangier", fee: 15 },
    { name: "Casablanca", fee: 25 },
    { name: "Rabat", fee: 20 },
    { name: "Fez", fee: 18 },
    { name: "Meknes", fee: 16 },
    { name: "Agadir", fee: 30 },
    { name: "Marrakech", fee: 28 },
    { name: "Oujda", fee: 22 },
    { name: "Kenitra", fee: 18 },
    { name: "Tetouan Province", fee: 5 },
    { name: "Other", fee: 35 }
  ];

  // Calculate shipping fee based on city
  const calculateShippingFee = (cityName: string) => {
    const city = cities.find(c => c.name === cityName);
    return city ? city.fee : 35; // Default to "Other" fee if city not found
  };


  const generateOrderId = () => {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ENSA-${y}${m}${d}-${rand}`;
  };

  useEffect(() => {
    if (!formRef.current) return;

    const initAnimation = async () => {
      const { gsap } = await import("gsap");
      
      const ctx = gsap.context(() => {
        // Form entrance animation
        gsap.fromTo(formRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );

        // Form fields stagger animation
        const formFields = formRef.current?.querySelectorAll(".form-field");
        if (formFields) {
          gsap.fromTo(formFields,
          { opacity: 0, x: -20 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.6, 
            ease: "power2.out",
            stagger: 0.1,
            delay: 0.2
          }
        );
        }
      }, formRef);

      return () => ctx.revert();
    };

    initAnimation();
  }, []);

  const validateWhatsApp = (number: string): boolean => {
    // Moroccan WhatsApp number validation
    const cleanNumber = number.replace(/\s+/g, "");
    const moroccanPattern = /^(\+212|0)[5-7][0-9]{8}$/;
    return moroccanPattern.test(cleanNumber);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp number is required";
    } else if (!validateWhatsApp(formData.whatsappNumber)) {
      newErrors.whatsappNumber = "Please enter a valid Moroccan WhatsApp number";
    }

    if (!formData.size) {
      newErrors.size = "Please select a size";
    }

    if (!formData.city) {
      newErrors.city = "Please select your city";
    }

    if (isCustomTextEnabled && !formData.customText.trim()) {
      newErrors.customText = "Custom text is required when enabled";
    } else if (formData.customText.length > 50) {
      newErrors.customText = "Custom text must be 50 characters or less";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotalPrice = (): number => {
    let total = product.price;
    
    // Add custom text fee
    if (isCustomTextEnabled && product.customPrice) {
      total += product.customPrice;
    }
    
    // Add city shipping fee
    const selectedCity = cities.find(city => city.name === formData.city);
    if (selectedCity) {
      total += selectedCity.fee;
    }
    
    
    return total;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCustomTextToggle = async () => {
    setIsCustomTextEnabled(!isCustomTextEnabled);
    
    // Animate custom text section
    const customSection = formRef.current?.querySelector(".custom-text-section");
    if (customSection) {
      const { gsap } = await import("gsap");
      gsap.to(customSection, {
        height: !isCustomTextEnabled ? "auto" : 0,
        opacity: !isCustomTextEnabled ? 1 : 0,
        duration: 0.4,
        ease: "power2.out"
      });
    }
    
    // Clear custom text when disabled
    if (isCustomTextEnabled) {
      setFormData(prev => ({ ...prev, customText: "" }));
    }
  };

  const animateError = async (fieldName: string) => {
    const field = formRef.current?.querySelector(`[name="${fieldName}"]`);
    if (field) {
      const { gsap } = await import("gsap");
      gsap.to(field, {
        x: -10,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 2
      });
    }
  };

  const animatePriceUpdate = async () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Animate errors
      Object.keys(errors).forEach(fieldName => {
        animateError(fieldName);
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order data
      const orderData = {
        productDetails: {
          productId: product._id || product.id,
          name: product.name,
          price: product.price,
          size: formData.size,
          customText: isCustomTextEnabled ? formData.customText : undefined,
          customPrice: isCustomTextEnabled && product.customPrice ? product.customPrice : 0
        },
        customerInfo: {
          fullName: formData.fullName,
          whatsappNumber: formData.whatsappNumber,
          city: formData.city
        },
        pricing: {
          basePrice: product.price,
          customPrice: isCustomTextEnabled && product.customPrice ? product.customPrice : 0,
          shippingFee: calculateShippingFee(formData.city),
          totalPrice: calculateTotalPrice()
        }
      };

      // Submit order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create order');
      }

      // Success animation
      const { gsap } = await import("gsap");
      gsap.to(formRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          // Redirect to confirmation page with order data
          const confirmationData = {
            orderId: result.data._id,
            customerName: formData.fullName,
            whatsappNumber: formData.whatsappNumber,
            productName: product.name,
            size: formData.size,
            city: formData.city,
            customText: isCustomTextEnabled ? formData.customText : undefined,
            totalPrice: calculateTotalPrice()
          };
        
          // Store order data in sessionStorage for confirmation page
          sessionStorage.setItem('orderData', JSON.stringify(confirmationData));
          
          // Redirect to confirmation page
          router.push('/confirmation');
        }
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      setIsSubmitting(false);
      
      // Show error message
      setFormData(prev => ({ ...prev, fullName: '' })); // Reset form
      alert('Failed to submit order. Please try again.');
    }
  };

  const handleFieldFocus = async (fieldRef: React.RefObject<HTMLInputElement | HTMLSelectElement>) => {
    if (fieldRef.current) {
      const { gsap } = await import("gsap");
      gsap.to(fieldRef.current, {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handleFieldBlur = async (fieldRef: React.RefObject<HTMLInputElement | HTMLSelectElement>) => {
    if (fieldRef.current) {
      const { gsap } = await import("gsap");
      gsap.to(fieldRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  // Refs for form fields
  const fullNameRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);
  const sizeRef = useRef<HTMLSelectElement>(null);
  const cityRef = useRef<HTMLSelectElement>(null);
  const customTextRef = useRef<HTMLInputElement>(null);

  // Update price when relevant fields change
  useEffect(() => {
    animatePriceUpdate();
  }, [formData.city, isCustomTextEnabled]);

  return (
    <div className="max-w-2xl mx-auto">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info */}
        <div className="bg-white border-6 shadow-brutal p-6">
          <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black mb-2">
            {product.name}
          </h2>
          <div className="text-xl font-bold text-black">
            Base Price: ${product.price}
          </div>
        </div>

        {/* Full Name */}
        <div className="form-field">
          <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
            Full Name *
          </label>
          <input
            ref={fullNameRef}
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            onFocus={() => handleFieldFocus(fullNameRef)}
            onBlur={() => handleFieldBlur(fullNameRef)}
            className={`w-full px-4 py-3 border-3 shadow-brutal focus:shadow-brutalMd transition-all duration-200 font-body text-black placeholder-gray-500 ${
              errors.fullName ? "border-red-500" : "border-black"
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <div className="text-red-500 text-sm font-bold mt-1 animate-pulse">
              {errors.fullName}
            </div>
          )}
        </div>

        {/* WhatsApp Number */}
        <div className="form-field">
          <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
            WhatsApp Number *
          </label>
          <input
            ref={whatsappRef}
            type="tel"
            name="whatsappNumber"
            value={formData.whatsappNumber}
            onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
            onFocus={() => handleFieldFocus(whatsappRef)}
            onBlur={() => handleFieldBlur(whatsappRef)}
            className={`w-full px-4 py-3 border-3 shadow-brutal focus:shadow-brutalMd transition-all duration-200 font-body text-black placeholder-gray-500 ${
              errors.whatsappNumber ? "border-red-500" : "border-black"
            }`}
            placeholder="+212 6XX XXX XXX or 06XX XXX XXX"
          />
          {errors.whatsappNumber && (
            <div className="text-red-500 text-sm font-bold mt-1 animate-pulse">
              {errors.whatsappNumber}
            </div>
          )}
        </div>

        {/* Size Selection */}
        <div className="form-field">
          <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
            Size *
          </label>
          <select
            ref={sizeRef}
            name="size"
            value={formData.size}
            onChange={(e) => handleInputChange("size", e.target.value)}
            onFocus={() => handleFieldFocus(sizeRef)}
            onBlur={() => handleFieldBlur(sizeRef)}
            className={`w-full px-4 py-3 border-3 shadow-brutal focus:shadow-brutalMd transition-all duration-200 font-body text-black ${
              errors.size ? "border-red-500" : "border-black"
            }`}
          >
            <option value="">Select Size</option>
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          {errors.size && (
            <div className="text-red-500 text-sm font-bold mt-1 animate-pulse">
              {errors.size}
            </div>
          )}
        </div>

        {/* City Selection */}
        <div className="form-field">
          <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
            City *
          </label>
          <select
            ref={cityRef}
            name="city"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            onFocus={() => handleFieldFocus(cityRef)}
            onBlur={() => handleFieldBlur(cityRef)}
            className={`w-full px-4 py-3 border-3 shadow-brutal focus:shadow-brutalMd transition-all duration-200 font-body text-black ${
              errors.city ? "border-red-500" : "border-black"
            }`}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name} {city.fee > 0 ? `(+$${city.fee})` : city.isTetouan ? "(FREE)" : ""}
              </option>
            ))}
          </select>
          {errors.city && (
            <div className="text-red-500 text-sm font-bold mt-1 animate-pulse">
              {errors.city}
            </div>
          )}
        </div>

        {/* Custom Text Option */}
        {product.isCustomizable && (
          <div className="form-field">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isCustomTextEnabled}
                onChange={handleCustomTextToggle}
                className="w-5 h-5 text-brand-green border-3 focus:ring-brand-green"
              />
              <span className="text-sm font-bold uppercase tracking-wider text-black">
                Add Custom Text (+${product.customPrice || 0})
              </span>
            </label>
            
            <div className={`custom-text-section overflow-hidden ${isCustomTextEnabled ? 'mt-4' : ''}`}>
              <input
                ref={customTextRef}
                type="text"
                name="customText"
                value={formData.customText}
                onChange={(e) => handleInputChange("customText", e.target.value)}
                onFocus={() => handleFieldFocus(customTextRef)}
                onBlur={() => handleFieldBlur(customTextRef)}
                className={`w-full px-4 py-3 border-3 shadow-brutal focus:shadow-brutalMd transition-all duration-200 font-body text-black placeholder-gray-500 ${
                  errors.customText ? "border-red-500" : "border-black"
                }`}
                placeholder="Enter your custom text (max 50 characters)"
                maxLength={50}
              />
              <div className="text-xs text-brand-accent font-bold mt-1">
                {formData.customText.length}/50 characters
              </div>
              {errors.customText && (
                <div className="text-red-500 text-sm font-bold mt-1 animate-pulse">
                  {errors.customText}
                </div>
              )}
            </div>
          </div>
        )}


        {/* Price Summary */}
        <div ref={priceRef} className="bg-black text-white p-6 border-6 shadow-brutal">
          <h3 className="text-lg font-display font-bold uppercase tracking-tight mb-4">
            Order Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base Price:</span>
              <span>${product.price}</span>
            </div>
            {isCustomTextEnabled && product.customPrice && (
              <div className="flex justify-between">
                <span>Custom Text:</span>
                <span>+${product.customPrice}</span>
              </div>
            )}
            {formData.city && (
              <div className="flex justify-between">
                <span>Shipping to {formData.city}:</span>
                <span>
                  +${cities.find(city => city.name === formData.city)?.fee || 0}
                </span>
              </div>
            )}
            <div className="border-t border-white pt-2 mt-4">
              <div className="flex justify-between font-bold text-brand-green text-lg">
                <span>Total:</span>
                <span>${calculateTotalPrice()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-green text-black border-6 shadow-brutalLg hover:shadow-brutalMd transition-all duration-300 font-display font-bold text-lg uppercase tracking-wider py-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting Order..." : `Place Order - $${calculateTotalPrice()}`}
        </button>
      </form>
    </div>
  );
}
