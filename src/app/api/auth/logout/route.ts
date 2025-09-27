import { createResponse, clearAuthCookie } from '@/lib/api-utils';

// POST /api/auth/logout - Admin logout
export async function POST() {
  try {
    const response = createResponse({
      success: true,
      message: 'Logged out successfully',
    });
    
    // Clear authentication cookie
    clearAuthCookie(response);
    
    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return createResponse({
      success: false,
      message: 'Logout failed',
    }, 500);
  }
}