import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { createResponse, createErrorResponse, requireAuth, validateProductData } from '@/lib/api-utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/products/[id] - Get single product (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const product = await Product.findById(params.id).select('-__v');
    
    if (!product) {
      return createErrorResponse('Product not found', 404, 'Not Found');
    }
    
    return createResponse(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return createErrorResponse('Failed to fetch product', 500, 'Internal Server Error');
  }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authError = requireAuth(request);
    if (authError) return authError;
    
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validate input data
    const validationErrors = validateProductData(body);
    if (validationErrors.length > 0) {
      return createErrorResponse('Validation failed', 400, 'Validation Error', {
        details: validationErrors
      });
    }
    
    const product = await Product.findById(params.id);
    
    if (!product) {
      return createErrorResponse('Product not found', 404, 'Not Found');
    }
    
    // Update product fields
    product.name = body.name.trim();
    product.description = body.description?.trim();
    product.price = body.price;
    product.images = body.images || [];
    product.sizes = body.sizes;
    product.category = body.category?.trim();
    product.isCustomizable = body.isCustomizable || false;
    product.customPrice = body.customPrice || 0;
    product.isActive = body.isActive !== undefined ? body.isActive : product.isActive;
    
    const updatedProduct = await product.save();
    
    return createResponse(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return createErrorResponse('Failed to update product', 500, 'Internal Server Error');
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    await connectToDatabase();
    
    const product = await Product.findById(params.id);
    
    if (!product) {
      return createErrorResponse('Product not found', 404, 'Not Found');
    }
    
    await Product.findByIdAndDelete(params.id);
    
    return createResponse({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return createErrorResponse('Failed to delete product', 500, 'Internal Server Error');
  }
}
