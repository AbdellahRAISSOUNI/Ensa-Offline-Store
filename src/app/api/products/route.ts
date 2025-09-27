import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { createResponse, createErrorResponse, requireAuth, validateProductData } from '@/lib/api-utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/products - Get all active products (public)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Get products with pagination
    const products = await Product.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.min(limit, 100));

    // Get total count for pagination
    const totalCount = await Product.countDocuments(query);

    return createResponse({
      products,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return createErrorResponse('Failed to fetch products', 500, 'Internal Server Error');
  }
}

// POST /api/products - Create new product (admin only)
export async function POST(request: NextRequest) {
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
    
    // Create new product
    const product = new Product({
      name: body.name.trim(),
      description: body.description?.trim(),
      price: body.price,
      images: body.images || [],
      sizes: body.sizes,
      category: body.category?.trim(),
      isCustomizable: body.isCustomizable || false,
      customPrice: body.customPrice || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      stock: body.stock || 0,
      tags: body.tags || [],
    });
    
    const savedProduct = await product.save();
    
    return createResponse(savedProduct, 201);
  } catch (error) {
    console.error('Error creating product:', error);
    return createErrorResponse('Failed to create product', 500, 'Internal Server Error');
  }
}