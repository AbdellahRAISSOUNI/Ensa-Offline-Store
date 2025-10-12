import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Settings } from '@/models/Settings';
import { createResponse, createErrorResponse, requireAuth, validateSettingsData } from '@/lib/api-utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/settings - Get application settings (public)
export async function GET() {
  try {
    await connectToDatabase();
    
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings({
        productPrices: new Map(),
        shippingFees: new Map([
          ['Tetouan', 0],
          ['Casablanca', 25],
          ['Rabat', 20],
          ['Marrakech', 30],
          ['Fez', 25],
          ['Agadir', 35],
          ['Tangier', 15],
          ['Meknes', 25],
          ['Oujda', 30],
          ['Kenitra', 20],
          ['Safi', 30],
          ['Mohammedia', 25],
          ['Khouribga', 25],
          ['Beni Mellal', 30],
          ['El Jadida', 30],
          ['Taza', 25],
          ['Nador', 30],
          ['Settat', 25],
          ['Larache', 20],
          ['Ksar El Kebir', 20],
        ]),
        customTextPrice: 15,
        discountCodes: [
          {
            code: 'ENSA10',
            type: 'percentage',
            value: 10,
            isActive: true,
          },
          {
            code: 'OFFLINE5',
            type: 'fixed',
            value: 5,
            isActive: true,
          },
        ],
        defaultCurrency: 'MAD',
        exchangeRate: 10,
        isOrderingEnabled: true,
        maintenanceMode: false,
        contactInfo: {
          whatsappNumber: '+212 6XX XXX XXX',
          email: 'contact@ensaoffline.com',
          address: 'Tetouan, Morocco',
        },
        socialMedia: {
          instagram: '@ensaoffline',
          facebook: 'ENSA OFFLINE',
          twitter: '@ensaoffline',
        },
      });
      
      await settings.save();
    }
    
    // Convert Map to Object for JSON response
    const settingsObj = settings.toObject();
    settingsObj.shippingFees = Object.fromEntries(settingsObj.shippingFees);
    settingsObj.productPrices = Object.fromEntries(settingsObj.productPrices || new Map());
    
    return createResponse(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return createErrorResponse('Failed to fetch settings', 500, 'Internal Server Error');
  }
}

// PUT /api/settings - Update application settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const authError = requireAuth(request);
    if (authError) return authError;
    
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validate input data
    const validationErrors = validateSettingsData(body);
    if (validationErrors.length > 0) {
      return createErrorResponse('Validation failed', 400, 'Validation Error', {
        details: validationErrors
      });
    }
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create new settings if none exist
      settings = new Settings();
    }
    
    // Update settings fields
    if (body.customTextPrice !== undefined) {
      settings.customTextPrice = body.customTextPrice;
    }
    
    if (body.isOrderingEnabled !== undefined) {
      settings.isOrderingEnabled = body.isOrderingEnabled;
    }
    
    if (body.shippingFees) {
      // Convert object to Map
      const shippingFeesMap = new Map(Object.entries(body.shippingFees));
      settings.shippingFees = shippingFeesMap;
    }
    
    if (body.productPrices) {
      // Convert object to Map
      const productPricesMap = new Map(Object.entries(body.productPrices));
      settings.productPrices = productPricesMap;
    }
    
    if (body.discountCodes) {
      settings.discountCodes = body.discountCodes;
    }
    
    if (body.contactInfo) {
      settings.contactInfo = body.contactInfo;
    }
    
    if (body.socialMedia) {
      settings.socialMedia = body.socialMedia;
    }
    
    const updatedSettings = await settings.save();
    
    // Convert Map to Object for JSON response
    const settingsObj = updatedSettings.toObject();
    settingsObj.shippingFees = Object.fromEntries(settingsObj.shippingFees);
    settingsObj.productPrices = Object.fromEntries(settingsObj.productPrices || new Map());
    
    return createResponse(settingsObj);
  } catch (error) {
    console.error('Error updating settings:', error);
    return createErrorResponse('Failed to update settings', 500, 'Internal Server Error');
  }
}