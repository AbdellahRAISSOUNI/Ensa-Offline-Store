import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth, createResponse, createErrorResponse } from '@/lib/api-utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Ensure Node.js runtime (required for Buffer and multipart handling in some hosts)
export const runtime = 'nodejs';

// Configure Cloudinary - Using hardcoded values for testing
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'df5we7yoo',
  api_key: process.env.CLOUDINARY_API_KEY || '498946988417326',
  api_secret: process.env.CLOUDINARY_API_SECRET || '6JX_3v0TJSxsDzwIb3jziUQheEI',
};

const isCloudinaryConfigured = cloudinaryConfig.cloud_name && 
                               cloudinaryConfig.api_key && 
                               cloudinaryConfig.api_secret;

// Debug logging
console.log('Cloudinary Environment Check:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'Using hardcoded');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'Using hardcoded');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'Using hardcoded');
console.log('isCloudinaryConfigured:', isCloudinaryConfigured);

if (isCloudinaryConfigured) {
  cloudinary.config(cloudinaryConfig);
  console.log('Cloudinary configured successfully');
} else {
  console.log('Cloudinary NOT configured - missing configuration');
}

// Image upload configuration
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Upload to Cloudinary and create multiple sizes
async function uploadToCloudinary(buffer: Buffer, filename: string) {
  try {
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;
    
    // Upload original image to Cloudinary
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: 'ensa-offline/products',
      public_id: `product-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    // Generate different sizes using Cloudinary transformations
    const baseUrl = result.secure_url.split('/upload/')[0] + '/upload/';
    const publicId = result.public_id;
    
    return {
      original: result.secure_url,
      thumbnail: `${baseUrl}w_300,h_300,c_fill,q_auto,f_auto/${publicId}`,
      medium: `${baseUrl}w_600,h_600,c_fill,q_auto,f_auto/${publicId}`,
      large: `${baseUrl}w_1200,h_1200,c_fill,q_auto,f_auto/${publicId}`,
      cloudinary_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

// POST /api/upload - Upload image to Cloudinary
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authError = requireAuth(request);
    if (authError) return authError;

    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured) {
      return createErrorResponse(
        'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.',
        500,
        'Configuration Error'
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return createErrorResponse('No image file provided', 400, 'Bad Request');
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return createErrorResponse(
        `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`,
        400,
        'Bad Request'
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return createErrorResponse(
        `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        413,
        'Request Entity Too Large'
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const images = await uploadToCloudinary(buffer, file.name);

    return createResponse({
      message: 'Image uploaded successfully',
      images: images
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return createErrorResponse('Failed to upload image', 500, 'Internal Server Error');
  }
}

// GET /api/upload - List uploaded images (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authError = requireAuth(request);
    if (authError) return authError;

    // Get images from Cloudinary
    const result = await cloudinary.search
      .expression('folder:ensa-offline/products')
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute();

    const images = result.resources.map((resource: any) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      created_at: resource.created_at,
      bytes: resource.bytes,
      format: resource.format,
    }));

    return createResponse({
      images: images,
      total: result.total_count
    });

  } catch (error) {
    console.error('Error fetching images:', error);
    return createErrorResponse('Failed to fetch images', 500, 'Internal Server Error');
  }
}

// DELETE /api/upload - Delete image from Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const authError = requireAuth(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('public_id');

    if (!publicId) {
      return createErrorResponse('Public ID is required', 400, 'Bad Request');
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return createResponse({
        message: 'Image deleted successfully',
        public_id: publicId
      });
    } else {
      return createErrorResponse('Failed to delete image', 400, 'Bad Request');
    }

  } catch (error) {
    console.error('Error deleting image:', error);
    return createErrorResponse('Failed to delete image', 500, 'Internal Server Error');
  }
}