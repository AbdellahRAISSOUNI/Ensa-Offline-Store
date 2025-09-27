import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, validateAdminCredentials, createSessionToken, setAuthCookie, isAuthenticated } from '@/lib/api-utils';

// POST /api/auth/login - Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    if (!username || !password) {
      return createErrorResponse('Username and password are required', 400, 'Validation Error');
    }
    
    // Validate credentials
    if (!validateAdminCredentials(username, password)) {
      return createErrorResponse('Invalid credentials', 401, 'Unauthorized');
    }
    
    // Create session token
    const token = createSessionToken();
    
    // Create response with user data
    const response = createResponse({
      success: true,
      user: {
        id: 'admin',
        username: 'admin',
        role: 'admin',
      },
    });
    
    // Set authentication cookie
    setAuthCookie(response, token);
    
    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return createErrorResponse('Login failed', 500, 'Internal Server Error');
  }
}


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
