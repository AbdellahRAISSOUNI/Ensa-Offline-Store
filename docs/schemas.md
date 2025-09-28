# Database Schema Documentation

## Overview

The ENSA OFFLINE application uses MongoDB with Mongoose ODM. All schemas include automatic timestamps and validation.

## Product Schema

### Fields
```typescript
{
  name: string;              // Required - Product name
  description: string;       // Optional - Product description
  price: number;            // Required - Base price in USD
  images: string[];         // Array of image URLs
  sizes: string[];          // Available sizes
  category: string;         // Product category
  isCustomizable: boolean;  // Can add custom text
  customPrice: number;      // Additional fee for custom text
  isActive: boolean;       // Default: true
  createdAt: Date;         // Auto-generated
  updatedAt: Date;         // Auto-generated
}
```

### Validation Rules
- `name`: Required, min 2 characters, max 100 characters
- `price`: Required, minimum 0, maximum 1000
- `customPrice`: Minimum 0, maximum 100
- `images`: Array of valid URLs
- `sizes`: Non-empty array
- `category`: Must be one of predefined categories

### Example Document
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "ENSA Hoodie",
  "description": "Premium quality hoodie with brutalist design",
  "price": 89,
  "images": [
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop"
  ],
  "sizes": ["S", "M", "L", "XL", "XXL"],
  "category": "Hoodies",
  "isCustomizable": true,
  "customPrice": 15,
  "isActive": true,
  "createdAt": "2024-12-01T10:30:00.000Z",
  "updatedAt": "2024-12-01T10:30:00.000Z"
}
```

## Order Schema

### Fields
```typescript
{
  orderId: string;          // Auto-generated unique ID
  customerInfo: {
    fullName: string;       // Required
    whatsappNumber: string; // Required - Moroccan format
    city: string;          // Required
    isTetouan: boolean;    // For shipping calculation
  };
  productDetails: {
    productId: string;     // Reference to Product
    size: string;          // Selected size
    isCustom: boolean;    // Has custom text
    customText?: string;  // Custom text content
  };
  pricing: {
    basePrice: number;     // Product base price
    customFee: number;     // Custom text fee
    shippingFee: number;  // City-based shipping
    totalPrice: number;   // Total calculated price
  };
  status: OrderStatus;    // Order lifecycle status
  createdAt: Date;        // Auto-generated
  updatedAt: Date;        // Auto-generated
}
```

### Order Status Enum
```typescript
type OrderStatus = 
  | 'pending'      // Order received, awaiting contact
  | 'contacted'   // Customer contacted
  | 'printed'     // Product printed/manufactured
  | 'delivering'  // Order shipped
  | 'delivered'   // Order delivered
  | 'finished'    // Order completed and closed
```

### Validation Rules
- `orderId`: Auto-generated format: `ENSA-YYYYMMDD-XXXXXX`
- `customerInfo.fullName`: Required, min 2 characters
- `customerInfo.whatsappNumber`: Required, Moroccan format validation
- `customerInfo.city`: Required, must be supported city
- `productDetails.productId`: Required, must reference existing product
- `productDetails.size`: Required, must be available for product
- `pricing.totalPrice`: Must equal sum of base + custom + shipping

### Example Document
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "orderId": "ENSA-20241201-ABC123",
  "customerInfo": {
    "fullName": "Ahmed Benali",
    "whatsappNumber": "+212 6XX XXX XXX",
    "city": "Tetouan",
    "isTetouan": true
  },
  "productDetails": {
    "productId": "507f1f77bcf86cd799439011",
    "size": "L",
    "isCustom": true,
    "customText": "Grace Under Pressure"
  },
  "pricing": {
    "basePrice": 89,
    "customFee": 15,
    "shippingFee": 0,
    "totalPrice": 104
  },
  "status": "pending",
  "createdAt": "2024-12-01T10:30:00.000Z",
  "updatedAt": "2024-12-01T10:30:00.000Z"
}
```

## Settings Schema

### Fields
```typescript
{
  // Price Management
  productPrices: {
    [productId: string]: number;  // Dynamic product pricing
  };
  customTextPrice: number;        // Global custom text fee
  shippingFees: {
    [city: string]: number;       // City-based shipping fees
  };
  discountCodes: Array<{
    code: string;                 // Discount code
    type: 'percentage' | 'fixed'; // Discount type
    value: number;               // Discount value
    isActive: boolean;           // Code status
  }>;

  // Site Configuration
  isOrderingEnabled: boolean;    // Allow customer orders
  maintenanceMode: boolean;       // Show maintenance page
  contactInfo: {
    whatsappNumber: string;      // Contact WhatsApp
    email: string;              // Contact email
    address: string;            // Physical address
  };
  socialMedia: {
    instagram: string;          // Instagram handle
    facebook: string;           // Facebook page
    twitter: string;            // Twitter handle
  };
  
  createdAt: Date;             // Auto-generated
  updatedAt: Date;             // Auto-generated
}
```

### Validation Rules
- `customTextPrice`: Minimum 0, maximum 100
- `shippingFees`: All values must be non-negative
- `discountCodes.code`: Uppercase letters and numbers only
- `discountCodes.value`: Minimum 0, maximum 100 for percentage
- `contactInfo.whatsappNumber`: Moroccan format validation
- `contactInfo.email`: Valid email format

### Example Document
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "productPrices": {
    "507f1f77bcf86cd799439011": 89,
    "507f1f77bcf86cd799439014": 45
  },
  "customTextPrice": 15,
  "shippingFees": {
    "Tetouan": 0,
    "Casablanca": 25,
    "Rabat": 20,
    "Marrakech": 30
  },
  "discountCodes": [
    {
      "code": "ENSA10",
      "type": "percentage",
      "value": 10,
      "isActive": true
    }
  ],
  "isOrderingEnabled": true,
  "maintenanceMode": false,
  "contactInfo": {
    "whatsappNumber": "+212 6XX XXX XXX",
    "email": "contact@ensaoffline.com",
    "address": "Tetouan, Morocco"
  },
  "socialMedia": {
    "instagram": "@ensaoffline",
    "facebook": "ENSA OFFLINE",
    "twitter": "@ensaoffline"
  },
  "createdAt": "2024-12-01T10:30:00.000Z",
  "updatedAt": "2024-12-01T10:30:00.000Z"
}
```

## Indexes

### Product Collection
- `{ name: 1 }` - Unique index on product name
- `{ category: 1, isActive: 1 }` - Compound index for filtering
- `{ createdAt: -1 }` - Descending index for sorting

### Order Collection
- `{ orderId: 1 }` - Unique index on order ID
- `{ status: 1, createdAt: -1 }` - Compound index for filtering
- `{ "customerInfo.city": 1 }` - Index for city-based queries
- `{ createdAt: -1 }` - Descending index for sorting

### Settings Collection
- `{ _id: 1 }` - Single document collection

## Relationships

### Product → Order
- One-to-Many relationship
- `Order.productDetails.productId` references `Product._id`
- Cascade delete not implemented (orders preserved for history)

### Settings → Global Configuration
- Singleton pattern
- Single settings document per application instance
- Referenced by all order calculations

## Data Validation

### Custom Validators
- **WhatsApp Number**: Moroccan format `+212 XX XXX XXX`
- **Order ID**: Format `ENSA-YYYYMMDD-XXXXXX`
- **Email**: Standard email format validation
- **URL**: Valid URL format for images

### Pre-save Hooks
- **Order**: Auto-generate `orderId` and calculate `totalPrice`
- **Product**: Validate `sizes` array is non-empty
- **Settings**: Validate `shippingFees` values are non-negative

## Migration Notes

### Version 1.0 → 1.1
- Added `discountCodes` array to Settings schema
- Added `productPrices` object to Settings schema
- Extended `contactInfo` and `socialMedia` objects

### Future Considerations
- **Inventory Tracking**: Add `stock` field to Product schema
- **Order History**: Add `statusHistory` array to Order schema
- **User Accounts**: Add User schema for customer accounts
- **Payment Integration**: Add payment fields to Order schema