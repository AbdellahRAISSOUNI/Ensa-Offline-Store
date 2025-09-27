import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { Settings } from '@/models/Settings';

// Utility function for API responses
export function createResponse(data: any, status: number = 200) {
  return NextResponse.json({
    success: true,
    data: data
  }, { status });
}

export function createErrorResponse(message: string, status: number = 400, error?: string, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error: error || 'Bad Request',
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      ...(details && { details }),
    },
    { status }
  );
}

// Validation utilities
export function validateProductData(data: any) {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Product name is required and must be at least 2 characters');
  }

  if (typeof data.price !== 'number' || data.price < 0) {
    errors.push('Price must be a non-negative number');
  }

  if (!Array.isArray(data.sizes) || data.sizes.length === 0) {
    errors.push('At least one size must be provided');
  }

  if (data.isCustomizable && (typeof data.customPrice !== 'number' || data.customPrice < 0)) {
    errors.push('Custom price must be a non-negative number when customization is enabled');
  }

  if (data.stock !== undefined && (typeof data.stock !== 'number' || data.stock < 0)) {
    errors.push('Stock must be a non-negative number');
  }

  if (data.images && Array.isArray(data.images)) {
    data.images.forEach((image: any, index: number) => {
      if (!image.original || !image.thumbnail || !image.medium || !image.large) {
        errors.push(`Image ${index + 1} must have all size variants (original, thumbnail, medium, large)`);
      }
    });
  }

  return errors;
}

export function validateOrderData(data: any) {
  const errors: string[] = [];

  if (!data.customerInfo?.fullName || typeof data.customerInfo.fullName !== 'string') {
    errors.push('Customer full name is required');
  }

  if (!data.customerInfo?.whatsappNumber || typeof data.customerInfo.whatsappNumber !== 'string') {
    errors.push('WhatsApp number is required');
  }

  if (!data.customerInfo?.city || typeof data.customerInfo.city !== 'string') {
    errors.push('City is required');
  }

  if (!data.productDetails?.productId) {
    errors.push('Product ID is required');
  }

  if (!data.productDetails?.size || typeof data.productDetails.size !== 'string') {
    errors.push('Product size is required');
  }

  return errors;
}

export function validateSettingsData(data: any) {
  const errors: string[] = [];

  if (typeof data.customTextPrice !== 'number' || data.customTextPrice < 0) {
    errors.push('Custom text price must be a non-negative number');
  }

  if (typeof data.isOrderingEnabled !== 'boolean') {
    errors.push('Ordering enabled must be a boolean value');
  }

  if (data.shippingFees && typeof data.shippingFees === 'object') {
    for (const [city, fee] of Object.entries(data.shippingFees)) {
      if (typeof fee !== 'number' || fee < 0) {
        errors.push(`Shipping fee for ${city} must be a non-negative number`);
      }
    }
  }

  return errors;
}

// Authentication utilities
export function validateAdminCredentials(username: string, password: string): boolean {
  return username === 'admin' && password === 'ensa2024';
}

export function createSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set('admin-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete('admin-session');
}

// Check if user is authenticated (simplified - in production, use proper session management)
export function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin-session')?.value;
  return !!token; // Simplified check - in production, validate token properly
}

// Middleware for admin routes
export function requireAuth(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return createErrorResponse('Authentication required', 401, 'Unauthorized');
  }
  return null;
}