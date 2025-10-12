import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { Settings } from '@/models/Settings';
import { createResponse, createErrorResponse, requireAuth, validateOrderData } from '@/lib/api-utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST /api/orders - Create new order (public)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validate input data
    const validationErrors = validateOrderData(body);
    if (validationErrors.length > 0) {
      return createErrorResponse('Validation failed', 400, 'Validation Error', {
        details: validationErrors
      });
    }
    
    // Get product details
    const product = await Product.findById(body.productDetails.productId);
    if (!product) {
      return createErrorResponse('Product not found', 404, 'Not Found');
    }
    
    // Get settings for pricing
    const settings = await Settings.findOne();
    if (!settings) {
      return createErrorResponse('Settings not configured', 500, 'Internal Server Error');
    }
    
    // Calculate pricing
    const basePrice = product.price;
    const customFee = body.productDetails.isCustom ? (settings.customTextPrice || 0) : 0;
    const shippingFee = settings.shippingFees.get(body.customerInfo.city) || 0;
    const totalPrice = basePrice + customFee + shippingFee;
    
    // Create new order
    const order = new Order({
      customerInfo: {
        fullName: body.customerInfo.fullName.trim(),
        whatsappNumber: body.customerInfo.whatsappNumber.trim(),
        city: body.customerInfo.city.trim(),
        isTetouan: body.customerInfo.city.toLowerCase() === 'tetouan',
      },
      productDetails: {
        productId: body.productDetails.productId,
        size: body.productDetails.size,
        isCustom: body.productDetails.isCustom || false,
        customText: body.productDetails.customText?.trim(),
      },
      pricing: {
        basePrice,
        customFee,
        shippingFee,
        totalPrice,
        currency: body.pricing?.currency || 'MAD',
        exchangeRate: body.pricing?.exchangeRate || 10,
      },
      status: 'pending',
    });
    
    const savedOrder = await order.save();
    
    // Populate product details for response
    await savedOrder.populate('productDetails.productId', 'name images');
    
    return createResponse(savedOrder, 201);
  } catch (error) {
    console.error('Error creating order:', error);
    return createErrorResponse('Failed to create order', 500, 'Internal Server Error');
  }
}

// GET /api/orders - Get all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authError = requireAuth(request);
    if (authError) return authError;
    
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    if (status) {
      query.status = status;
    }
    
    // Get orders with pagination
    const orders = await Order.find(query)
      .populate('productDetails.productId', 'name images')
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.min(limit, 100));
    
    // Get total count for pagination
    const totalCount = await Order.countDocuments(query);
    
    return createResponse({
      orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return createErrorResponse('Failed to fetch orders', 500, 'Internal Server Error');
  }
}