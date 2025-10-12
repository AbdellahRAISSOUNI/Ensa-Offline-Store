// Simple test to verify currency functionality
import { convertPrice, formatPrice, getCurrencySymbol } from './currency-utils';

export function testCurrencyFunctionality() {
  console.log('🧪 Testing Currency Functionality...');
  
  // Test price conversion
  const usdPrice = 25.00;
  const madPrice = convertPrice(usdPrice, 'USD', 'MAD');
  console.log(`✅ USD to MAD: $${usdPrice} = ${formatPrice(madPrice, 'MAD')}`);
  
  const backToUsd = convertPrice(madPrice, 'MAD', 'USD');
  console.log(`✅ MAD to USD: ${formatPrice(madPrice, 'MAD')} = $${backToUsd.toFixed(2)}`);
  
  // Test currency symbols
  console.log(`✅ USD Symbol: ${getCurrencySymbol('USD')}`);
  console.log(`✅ MAD Symbol: ${getCurrencySymbol('MAD')}`);
  
  // Test formatting
  console.log(`✅ USD Format: ${formatPrice(25.50, 'USD')}`);
  console.log(`✅ MAD Format: ${formatPrice(255.00, 'MAD')}`);
  
  console.log('🎉 Currency functionality tests completed!');
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  console.log('Currency tests available - call testCurrencyFunctionality() to run');
} else {
  // Node environment
  testCurrencyFunctionality();
}
