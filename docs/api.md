# API Documentation

Base URL: `/api`

## Overview

The ENSA OFFLINE API provides endpoints for managing products, orders, and application settings. All endpoints return JSON responses and support standard HTTP methods.

## Authentication

Admin endpoints require authentication via session cookies. Customer-facing endpoints are public.

## Products API

### GET `/products`
Get all active products.

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "images": ["string"],
    "sizes": ["string"],
    "category": "string",
    "isCustomizable": "boolean",
    "customPrice": "number",
    "isActive": "boolean",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
]
```

### POST `/products` (Admin)
Create a new product.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "images": ["string"],
  "sizes": ["string"],
  "category": "string",
  "isCustomizable": "boolean",
  "customPrice": "number"
}
```

### GET `/products/[id]`
Get a single product by ID.

### PATCH `/products/[id]` (Admin)
Update a product.

### DELETE `/products/[id]` (Admin)
Delete a product.

## Orders API

### GET `/orders`
Get all orders with optional filtering.

**Query Parameters:**
- `status` - Filter by order status
- `limit` - Number of orders to return (max 100)
- `page` - Page number for pagination

**Response:**
```json
[
  {
    "_id": "string",
    "orderId": "string",
    "customerInfo": {
      "fullName": "string",
      "whatsappNumber": "string",
      "city": "string",
      "isTetouan": "boolean"
    },
    "productDetails": {
      "productId": "string",
      "size": "string",
      "isCustom": "boolean",
      "customText": "string"
    },
    "pricing": {
      "basePrice": "number",
      "customFee": "number",
      "shippingFee": "number",
      "totalPrice": "number"
    },
    "status": "string",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
]
```

### POST `/orders`
Create a new order.

**Request Body:**
```json
{
  "customerInfo": {
    "fullName": "string",
    "whatsappNumber": "string",
    "city": "string",
    "isTetouan": "boolean"
  },
  "productDetails": {
    "productId": "string",
    "size": "string",
    "isCustom": "boolean",
    "customText": "string"
  }
}
```

### GET `/orders/[id]`
Get a single order by ID.

### PATCH `/orders/[id]` (Admin)
Update an order (typically status updates).

**Request Body:**
```json
{
  "status": "pending | contacted | printed | delivering | delivered | finished"
}
```

### DELETE `/orders/[id]` (Admin)
Delete an order.

## Settings API

### GET `/settings`
Get application settings.

**Response:**
```json
{
  "_id": "string",
  "shippingFees": {
    "Tetouan": "number",
    "Casablanca": "number",
    "Rabat": "number"
  },
  "customTextPrice": "number",
  "isOrderingEnabled": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### POST `/settings` (Admin)
Update application settings.

**Request Body:**
```json
{
  "shippingFees": {
    "Tetouan": "number",
    "Casablanca": "number"
  },
  "customTextPrice": "number",
  "isOrderingEnabled": "boolean"
}
```

### DELETE `/settings/reset` (Admin)
Reset settings to default values.

## Admin Authentication API

### POST `/admin/login`
Authenticate admin user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": "boolean",
  "user": {
    "id": "string",
    "username": "string",
    "role": "admin"
  }
}
```

### POST `/admin/logout`
Logout admin user.

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "string",
  "message": "string",
  "statusCode": "number"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Data Models

### Order Status Enum
```typescript
type OrderStatus = 
  | 'pending'      // Order received, awaiting contact
  | 'contacted'    // Customer contacted
  | 'printed'      // Product printed/manufactured
  | 'delivering'   // Order shipped
  | 'delivered'    // Order delivered
  | 'finished'     // Order completed and closed
```

### Product Categories
- `Hoodies`
- `T-Shirts`
- `Tank Tops`
- `Long Sleeves`
- `Accessories`

### Supported Cities
- Tetouan (Free shipping)
- Casablanca
- Rabat
- Marrakech
- Fez
- Agadir
- Tangier
- Meknes
- Oujda
- Kenitra
- Safi
- Mohammedia
- Khouribga
- Beni Mellal
- El Jadida
- Taza
- Nador
- Settat
- Larache
- Ksar El Kebir

## Rate Limiting

- **Public endpoints**: 100 requests per minute per IP
- **Admin endpoints**: 200 requests per minute per authenticated user

## CORS

API supports CORS for cross-origin requests from the frontend application.

## Error Handling

### Error Response Format
All API errors return a consistent JSON format:

```json
{
  "error": "string",
  "message": "string",
  "statusCode": "number",
  "timestamp": "string"
}
```

### Common Error Codes

#### 400 Bad Request
- **Cause**: Invalid request data or missing required fields
- **Example**: Missing product name or invalid price format
- **Solution**: Check request body format and required fields

#### 401 Unauthorized
- **Cause**: Missing or invalid authentication
- **Example**: Accessing admin endpoints without login
- **Solution**: Ensure proper authentication headers or session cookies

#### 404 Not Found
- **Cause**: Resource not found
- **Example**: Product or order ID doesn't exist
- **Solution**: Verify resource ID exists in database

#### 500 Internal Server Error
- **Cause**: Server-side error or database connection issues
- **Example**: MongoDB connection timeout
- **Solution**: Check server logs and database connectivity

### Validation Errors
Form validation errors include detailed field information:

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "statusCode": 400,
  "details": {
    "field": "error message",
    "anotherField": "another error message"
  }
}
```

## Troubleshooting

### Common Issues

#### API Endpoints Not Responding
- **Check**: Server is running on correct port (3000)
- **Verify**: API routes are properly configured
- **Test**: Use browser developer tools Network tab

#### Database Connection Errors
- **Check**: MongoDB URI in environment variables
- **Verify**: MongoDB service is running
- **Test**: Connection string format and credentials

#### Authentication Issues
- **Check**: Session cookies are set correctly
- **Verify**: Login credentials are valid
- **Test**: Clear browser cache and try again

#### CORS Errors
- **Check**: Frontend and backend are on same domain
- **Verify**: CORS configuration allows frontend origin
- **Test**: Use same port for development

### Development Tips

- **Use Postman/Insomnia**: Test API endpoints directly
- **Check Network Tab**: Monitor API requests and responses
- **Enable Debugging**: Use console.log for debugging
- **Test Edge Cases**: Verify error handling works correctly

## Support

For technical support and questions about the API, contact:
- **Email**: abdellahraissouni@gmail.com
- **Response Time**: Within 24 hours