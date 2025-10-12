// Currency utility functions

export type Currency = 'MAD' | 'USD';

// Exchange rate: 1 USD = 10 MAD
export const EXCHANGE_RATE = 10;

/**
 * Convert USD price to MAD
 */
export function usdToMad(usdPrice: number): number {
  return usdPrice * EXCHANGE_RATE;
}

/**
 * Convert MAD price to USD
 */
export function madToUsd(madPrice: number): number {
  return madPrice / EXCHANGE_RATE;
}

/**
 * Convert price between currencies
 */
export function convertPrice(price: number, fromCurrency: Currency, toCurrency: Currency): number {
  if (fromCurrency === toCurrency) {
    return price;
  }
  
  if (fromCurrency === 'USD' && toCurrency === 'MAD') {
    return usdToMad(price);
  }
  
  if (fromCurrency === 'MAD' && toCurrency === 'USD') {
    return madToUsd(price);
  }
  
  return price;
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: Currency): string {
  const symbol = currency === 'MAD' ? 'DH' : '$';
  return currency === 'MAD' ? `${price.toFixed(2)}${symbol}` : `${symbol}${price.toFixed(2)}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
  return currency === 'MAD' ? 'DH' : '$';
}

/**
 * Get currency code
 */
export function getCurrencyCode(currency: Currency): string {
  return currency;
}
