"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'MAD' | 'USD';

export interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInUSD: number) => number;
  formatPrice: (priceInUSD: number) => string;
  getCurrencySymbol: () => string;
  getCurrencyCode: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rate: 1 USD = 10 MAD
const EXCHANGE_RATE = 10;

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Default to MAD as requested
  const [currency, setCurrencyState] = useState<Currency>('MAD');

  // Load currency preference from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency') as Currency;
    if (savedCurrency && (savedCurrency === 'MAD' || savedCurrency === 'USD')) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  // Save currency preference to localStorage
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('preferred-currency', newCurrency);
  };

  // Convert USD price to selected currency
  const convertPrice = (priceInUSD: number): number => {
    if (currency === 'MAD') {
      return priceInUSD * EXCHANGE_RATE;
    }
    return priceInUSD;
  };

  // Format price with currency symbol
  const formatPrice = (priceInUSD: number): string => {
    const convertedPrice = convertPrice(priceInUSD);
    const symbol = getCurrencySymbol();
    return currency === 'MAD' ? `${convertedPrice.toFixed(2)}${symbol}` : `${symbol}${convertedPrice.toFixed(2)}`;
  };

  // Get currency symbol
  const getCurrencySymbol = (): string => {
    return currency === 'MAD' ? 'DH' : '$';
  };

  // Get currency code
  const getCurrencyCode = (): string => {
    return currency;
  };

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    convertPrice,
    formatPrice,
    getCurrencySymbol,
    getCurrencyCode,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
