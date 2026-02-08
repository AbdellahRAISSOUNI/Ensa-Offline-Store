"use client";
import { useCurrency } from '@/contexts/CurrencyContext';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface CurrencyToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'admin';
}

export function CurrencyToggle({ 
  className = '', 
  size = 'sm',
  variant = 'default'
}: CurrencyToggleProps) {
  const { currency, setCurrency, getCurrencySymbol } = useCurrency();
  const toggleRef = useRef<HTMLDivElement>(null);

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  // Add entrance animation to match header components
  useEffect(() => {
    if (toggleRef.current) {
      gsap.fromTo(
        toggleRef.current,
        { y: -8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.1 }
      );
    }
  }, []);

  const handleCurrencyChange = () => {
    const newCurrency = currency === 'USD' ? 'MAD' : 'USD';
    setCurrency(newCurrency);
    
    // Add a subtle animation
    if (toggleRef.current) {
      gsap.to(toggleRef.current, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    }
  };

  const baseClasses = variant === 'admin' 
    ? 'bg-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-display font-bold uppercase tracking-wider'
    : 'bg-brand-green text-black border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-display font-bold uppercase tracking-wider';

  return (
    <div 
      ref={toggleRef}
      className={`${baseClasses} ${sizes[size]} ${className} cursor-pointer select-none`}
      onClick={handleCurrencyChange}
      title={`Switch to ${currency === 'USD' ? 'Moroccan Dirhams (MAD)' : 'US Dollars (USD)'}`}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={`fi ${currency === 'MAD' ? 'fi-ma' : 'fi-us'}`}
          style={{ width: '1.25em', height: '0.94em', fontSize: '1em' }}
          aria-hidden
        />
        <span className="text-xs font-bold">{currency}</span>
      </div>
    </div>
  );
}
