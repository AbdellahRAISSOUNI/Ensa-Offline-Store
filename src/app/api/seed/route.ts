import { NextRequest } from 'next/server';
import { seedDatabase, isDatabaseEmpty, getDatabaseStats } from '@/lib/database-seeder';
import { requireAuth, createResponse, createErrorResponse } from '@/lib/api-utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST /api/seed - Seed database with sample data
export async function POST(request: NextRequest) {
  try {

    const { force } = await request.json().catch(() => ({}));
    
    // Check if database is empty (unless force is true)
    if (!force) {
      const isEmpty = await isDatabaseEmpty();
      if (!isEmpty) {
        return createErrorResponse(
          'Database is not empty. Use force=true to override.',
          400,
          'Database Not Empty'
        );
      }
    }

    // Seed the database
    const result = await seedDatabase();

    return createResponse({
      success: true,
      message: 'Database seeded successfully',
      data: result,
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    return createErrorResponse('Failed to seed database', 500, 'Internal Server Error');
  }
}

// GET /api/seed - Get database status
export async function GET(request: NextRequest) {
  try {

    const isEmpty = await isDatabaseEmpty();
    const stats = await getDatabaseStats();

    return createResponse({
      isEmpty,
      stats,
    });

  } catch (error) {
    console.error('Error getting database status:', error);
    return createErrorResponse('Failed to get database status', 500, 'Internal Server Error');
  }
}
