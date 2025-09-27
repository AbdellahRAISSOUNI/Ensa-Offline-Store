import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { createResponse, createErrorResponse, requireAuth } from '@/lib/api-utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/orders/[id] - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    await connectToDatabase();
    
    const order = await Order.findById(params.id)
      .populate('productDetails.productId', 'name images price')
      .select('-__v');
    
    if (!order) {
      return createErrorResponse('Order not found', 404, 'Not Found');
    }
    
    return createResponse(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return createErrorResponse('Failed to fetch order', 500, 'Internal Server Error');
  }
}

// PUT /api/orders/[id] - Update order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validate status if provided
    const validStatuses = ['pending', 'contacted', 'printed', 'delivering', 'delivered', 'finished'];
    if (body.status && !validStatuses.includes(body.status)) {
      return createErrorResponse('Invalid order status', 400, 'Validation Error');
    }
    
    const order = await Order.findById(params.id);
    
    if (!order) {
      return createErrorResponse('Order not found', 404, 'Not Found');
    }
    
    // Update order fields
    if (body.status) {
      order.status = body.status;
    }
    
    // Update other fields if provided
    if (body.customerInfo) {
      if (body.customerInfo.fullName) {
        order.customerInfo.fullName = body.customerInfo.fullName.trim();
      }
      if (body.customerInfo.whatsappNumber) {
        order.customerInfo.whatsappNumber = body.customerInfo.whatsappNumber.trim();
      }
      if (body.customerInfo.city) {
        order.customerInfo.city = body.customerInfo.city.trim();
        order.customerInfo.isTetouan = body.customerInfo.city.toLowerCase() === 'tetouan';
      }
    }
    
    if (body.productDetails) {
      if (body.productDetails.size) {
        order.productDetails.size = body.productDetails.size;
      }
      if (body.productDetails.customText !== undefined) {
        order.productDetails.customText = body.productDetails.customText?.trim();
      }
    }
    
    const updatedOrder = await order.save();
    
    // Populate product details for response
    await updatedOrder.populate('productDetails.productId', 'name images');
    
    return createResponse(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return createErrorResponse('Failed to update order', 500, 'Internal Server Error');
  }
}

// DELETE /api/orders/[id] - Delete order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    await connectToDatabase();
    
    const order = await Order.findById(params.id);
    
    if (!order) {
      return createErrorResponse('Order not found', 404, 'Not Found');
    }
    
    await Order.findByIdAndDelete(params.id);
    
    return createResponse({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return createErrorResponse('Failed to delete order', 500, 'Internal Server Error');
  }
}