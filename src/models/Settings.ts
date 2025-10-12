import mongoose, { Schema, model, models } from "mongoose";

export interface SettingsDocument extends mongoose.Document {
  // Price Management
  productPrices: Record<string, number>; // Dynamic product pricing
  customTextPrice: number;
  shippingFees: Record<string, number>; // by city
  discountCodes: Array<{
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    isActive: boolean;
  }>;
  
  // Currency Settings
  defaultCurrency: 'MAD' | 'USD';
  exchangeRate: number; // 1 USD = X MAD
  
  // Site Configuration
  isOrderingEnabled: boolean;
  maintenanceMode: boolean;
  contactInfo: {
    whatsappNumber: string;
    email: string;
    address: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<SettingsDocument>(
  {
    // Price Management
    productPrices: { type: Map, of: Number, default: {} },
    customTextPrice: { type: Number, required: true, min: 0, default: 0 },
    shippingFees: { type: Map, of: Number, default: {} },
    discountCodes: [{
      code: { type: String, required: true, uppercase: true },
      type: { type: String, enum: ['percentage', 'fixed'], required: true },
      value: { type: Number, required: true, min: 0 },
      isActive: { type: Boolean, default: true },
    }],
    
    // Currency Settings
    defaultCurrency: { type: String, enum: ['MAD', 'USD'], default: 'MAD' },
    exchangeRate: { type: Number, default: 10, min: 0.1 },
    
    // Site Configuration
    isOrderingEnabled: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    contactInfo: {
      whatsappNumber: { type: String, trim: true },
      email: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    socialMedia: {
      instagram: { type: String, trim: true },
      facebook: { type: String, trim: true },
      twitter: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

export const Settings = models.Settings || model<SettingsDocument>("Settings", SettingsSchema);


