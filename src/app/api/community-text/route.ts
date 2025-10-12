import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CommunityText } from '@/models/CommunityText';
import { createResponse, createErrorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

// GET /api/community-text - Get approved community texts
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    
    const query: any = { isApproved: true };
    if (category) {
      query.category = category;
    }
    
    // Get random selection of approved texts (limit to 6 for performance)
    const texts = await CommunityText.aggregate([
      { $match: query },
      { $sample: { size: 6 } },
      { $project: { text: 1, category: 1, usageCount: 1 } }
    ]);
    
    return createResponse(texts);
  } catch (error) {
    console.error('Error fetching community texts:', error);
    return createErrorResponse('Failed to fetch community texts', 500);
  }
}

// POST /api/community-text - Submit new community text (for future admin approval)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { text, category } = body;
    
    // Simple validation
    if (!text || !category || text.length > 50) {
      return createErrorResponse('Invalid text or category', 400);
    }
    
    // Generate anonymous ID based on timestamp and random
    const anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    const communityText = new CommunityText({
      text: text.trim(),
      category,
      submittedBy: anonymousId,
      isApproved: false // Requires admin approval
    });
    
    await communityText.save();
    
    return createResponse({ 
      message: 'Text submitted for review!',
      id: communityText._id 
    });
  } catch (error) {
    console.error('Error submitting community text:', error);
    return createErrorResponse('Failed to submit text', 500);
  }
}



