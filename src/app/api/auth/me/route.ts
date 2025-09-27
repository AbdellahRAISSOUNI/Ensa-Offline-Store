import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, isAuthenticated } from '@/lib/api-utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/auth/me - Get current user
export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return createErrorResponse('Not authenticated', 401, 'Unauthorized');
    }
    
    return createResponse({
      user: {
        id: 'admin',
        username: 'admin',
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Error getting user info:', error);
    return createErrorResponse('Failed to get user info', 500, 'Internal Server Error');
  }
}
