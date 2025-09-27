#!/usr/bin/env node

/**
 * Database Setup Script for ENSA OFFLINE
 * 
 * This script helps set up the database with initial data
 * Run with: npm run setup-db
 */

const mongoose = require('mongoose');
const path = require('path');

// Set environment variables directly (fixing the MongoDB URI issues)
console.log('Setting environment variables...');
process.env.MONGODB_URI = 'mongodb+srv://abdellah:abdellah123@ensaoffline.k6ywb9v.mongodb.net/ensaoffline';
process.env.MONGODB_DB = 'ensaoffline';
process.env.ADMIN_USERNAME = 'admin';
process.env.ADMIN_PASSWORD = 'ensa2024';

// Debug: Log environment variables
console.log('Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('MONGODB_DB:', process.env.MONGODB_DB || 'Not set');

// Additional debugging
console.log('All env vars starting with MONGODB:');
Object.keys(process.env).forEach(key => {
  if (key.startsWith('MONGODB')) {
    console.log(`${key}: ${process.env[key]}`);
  }
});

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  images: [{
    original: { type: String, required: true },
    thumbnail: { type: String, required: true },
    medium: { type: String, required: true },
    large: { type: String, required: true },
  }],
  sizes: { type: [String], default: [] },
  category: { type: String, trim: true },
  isCustomizable: { type: Boolean, default: false },
  customPrice: { type: Number, min: 0 },
  isActive: { type: Boolean, default: true, index: true },
  stock: { type: Number, default: 0, min: 0 },
  tags: { type: [String], default: [] },
}, { timestamps: true });

// Settings Schema
const SettingsSchema = new mongoose.Schema({
  productPrices: { type: Map, of: Number, default: {} },
  customTextPrice: { type: Number, required: true, min: 0, default: 0 },
  shippingFees: { type: Map, of: Number, default: {} },
  discountCodes: [{
    code: { type: String, required: true, uppercase: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  }],
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
}, { timestamps: true });

// Sample product data
const sampleProducts = [
  {
    name: "ENSA OFFLINE Hoodie",
    description: "Premium quality hoodie with brutalist design. Made from 100% cotton blend for maximum comfort and durability.",
    price: 89,
    images: [
      {
        original: "/images/products/offline-shirt-001/main.jpg",
        thumbnail: "/images/products/offline-shirt-001/main.jpg",
        medium: "/images/products/offline-shirt-001/main.jpg",
        large: "/images/products/offline-shirt-001/main.jpg",
      }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "Hoodies",
    isCustomizable: true,
    customPrice: 15,
    isActive: true,
    stock: 50,
    tags: ["brutalist", "streetwear", "premium", "cotton"],
  },
  {
    name: "ENSA OFFLINE T-Shirt",
    description: "Classic brutalist t-shirt with bold graphics. Perfect for everyday wear with a statement.",
    price: 45,
    images: [
      {
        original: "/images/products/offline-shirt-001/detail-1.jpg",
        thumbnail: "/images/products/offline-shirt-001/detail-1.jpg",
        medium: "/images/products/offline-shirt-001/detail-1.jpg",
        large: "/images/products/offline-shirt-001/detail-1.jpg",
      }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "T-Shirts",
    isCustomizable: true,
    customPrice: 10,
    isActive: true,
    stock: 100,
    tags: ["brutalist", "graphic", "cotton", "unisex"],
  },
  {
    name: "ENSA OFFLINE Tank Top",
    description: "Sleek tank top with minimalist brutalist design. Ideal for summer and layering.",
    price: 35,
    images: [
      {
        original: "/images/products/offline-shirt-001/detail-2.png",
        thumbnail: "/images/products/offline-shirt-001/detail-2.png",
        medium: "/images/products/offline-shirt-001/detail-2.png",
        large: "/images/products/offline-shirt-001/detail-2.png",
      }
    ],
    sizes: ["S", "M", "L", "XL"],
    category: "Tank Tops",
    isCustomizable: true,
    customPrice: 8,
    isActive: true,
    stock: 75,
    tags: ["brutalist", "tank", "summer", "minimalist"],
  },
  {
    name: "ENSA OFFLINE Long Sleeve",
    description: "Long sleeve shirt with geometric brutalist patterns. Perfect for layering and cooler weather.",
    price: 55,
    images: [
      {
        original: "/images/products/offline-shirt-001/detail-3.jpg",
        thumbnail: "/images/products/offline-shirt-001/detail-3.jpg",
        medium: "/images/products/offline-shirt-001/detail-3.jpg",
        large: "/images/products/offline-shirt-001/detail-3.jpg",
      }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "Long Sleeves",
    isCustomizable: true,
    customPrice: 12,
    isActive: true,
    stock: 60,
    tags: ["brutalist", "long-sleeve", "geometric", "layering"],
  },
  {
    name: "ENSA OFFLINE Cap",
    description: "Brutalist baseball cap with bold logo. Made from premium materials for durability.",
    price: 25,
    images: [
      {
        original: "/images/products/offline-shirt-001/detail-4.jpg",
        thumbnail: "/images/products/offline-shirt-001/detail-4.jpg",
        medium: "/images/products/offline-shirt-001/detail-4.jpg",
        large: "/images/products/offline-shirt-001/detail-4.jpg",
      }
    ],
    sizes: ["One Size"],
    category: "Accessories",
    isCustomizable: false,
    customPrice: 0,
    isActive: true,
    stock: 30,
    tags: ["brutalist", "cap", "accessory", "logo"],
  },
  {
    name: "ENSA OFFLINE Beanie",
    description: "Warm beanie with brutalist design. Perfect for cold weather and street style.",
    price: 20,
    images: [
      {
        original: "/images/products/offline-shirt-001/detail-5.jpg",
        thumbnail: "/images/products/offline-shirt-001/detail-5.jpg",
        medium: "/images/products/offline-shirt-001/detail-5.jpg",
        large: "/images/products/offline-shirt-001/detail-5.jpg",
      }
    ],
    sizes: ["One Size"],
    category: "Accessories",
    isCustomizable: false,
    customPrice: 0,
    isActive: true,
    stock: 40,
    tags: ["brutalist", "beanie", "winter", "streetwear"],
  },
];

// Sample settings data
const sampleSettings = {
  productPrices: new Map([
    ["ENSA OFFLINE Hoodie", 89],
    ["ENSA OFFLINE T-Shirt", 45],
    ["ENSA OFFLINE Tank Top", 35],
    ["ENSA OFFLINE Long Sleeve", 55],
    ["ENSA OFFLINE Cap", 25],
    ["ENSA OFFLINE Beanie", 20],
  ]),
  customTextPrice: 15,
  shippingFees: new Map([
    ["Tetouan", 0],
    ["Casablanca", 25],
    ["Rabat", 20],
    ["Marrakech", 30],
    ["Fez", 25],
    ["Agadir", 35],
    ["Tangier", 15],
    ["Meknes", 25],
    ["Oujda", 30],
    ["Kenitra", 20],
    ["Safi", 30],
    ["Mohammedia", 25],
    ["Khouribga", 25],
    ["Beni Mellal", 30],
    ["El Jadida", 30],
    ["Taza", 25],
    ["Nador", 30],
    ["Settat", 25],
    ["Larache", 20],
    ["Ksar El Kebir", 20],
  ]),
  discountCodes: [
    {
      code: "ENSA10",
      type: "percentage",
      value: 10,
      isActive: true,
    },
    {
      code: "OFFLINE5",
      type: "fixed",
      value: 5,
      isActive: true,
    },
    {
      code: "WELCOME15",
      type: "percentage",
      value: 15,
      isActive: true,
    },
  ],
  isOrderingEnabled: true,
  maintenanceMode: false,
  contactInfo: {
    whatsappNumber: "+212 6XX XXX XXX",
    email: "contact@ensaoffline.com",
    address: "Tetouan, Morocco",
  },
  socialMedia: {
    instagram: "@ensaoffline",
    facebook: "ENSA OFFLINE",
    twitter: "@ensaoffline",
  },
};

// Database seeder function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not set in environment variables');
    }
    
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB || 'ensaoffline',
    });
    console.log('✅ Connected to database');

    // Clear existing data
    await mongoose.connection.db.collection('products').deleteMany({});
    await mongoose.connection.db.collection('settings').deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create models
    const Product = mongoose.model('Product', ProductSchema);
    const Settings = mongoose.model('Settings', SettingsSchema);

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${products.length} products`);

    // Insert sample settings
    const settings = await Settings.create(sampleSettings);
    console.log('✅ Inserted settings');

    console.log('🎉 Database seeding completed successfully!');
    
    return {
      products: products.length,
      settings: 1,
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

// Function to check if database is empty
async function isDatabaseEmpty() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not set in environment variables');
    }
    
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB || 'ensaoffline',
    });
    
    const productCount = await mongoose.connection.db.collection('products').countDocuments();
    const settingsCount = await mongoose.connection.db.collection('settings').countDocuments();
    
    return productCount === 0 && settingsCount === 0;
  } catch (error) {
    console.error('Error checking database:', error);
    return false;
  } finally {
    await mongoose.disconnect();
  }
}

// Function to get database stats
async function getDatabaseStats() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not set in environment variables');
    }
    
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB || 'ensaoffline',
    });
    
    const productCount = await mongoose.connection.db.collection('products').countDocuments();
    const activeProductCount = await mongoose.connection.db.collection('products').countDocuments({ isActive: true });
    const settingsCount = await mongoose.connection.db.collection('settings').countDocuments();
    
    return {
      products: productCount,
      activeProducts: activeProductCount,
      settings: settingsCount,
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  } finally {
    await mongoose.disconnect();
  }
}

async function main() {
  console.log('🚀 ENSA OFFLINE Database Setup');
  console.log('================================\n');

  try {
    // Check if database is empty
    console.log('📊 Checking database status...');
    const isEmpty = await isDatabaseEmpty();
    const stats = await getDatabaseStats();

    if (stats) {
      console.log(`   Products: ${stats.products}`);
      console.log(`   Active Products: ${stats.activeProducts}`);
      console.log(`   Settings: ${stats.settings}`);
    }

    if (!isEmpty) {
      console.log('\n⚠️  Database is not empty!');
      console.log('   To seed with sample data, use: npm run seed-db -- --force');
      console.log('   To reset database, use: npm run reset-db');
      return;
    }

    // Seed the database
    console.log('\n🌱 Seeding database with sample data...');
    const result = await seedDatabase();

    console.log('\n✅ Database setup completed successfully!');
    console.log(`   Created ${result.products} products`);
    console.log(`   Created ${result.settings} settings document`);
    
    console.log('\n🎉 You can now:');
    console.log('   • Visit http://localhost:3000 to see the website');
    console.log('   • Visit http://localhost:3000/admin to manage products');
    console.log('   • Login with: admin / ensa2024');

  } catch (error) {
    console.error('\n❌ Error setting up database:', error);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
ENSA OFFLINE Database Setup

Usage:
  npm run setup-db          # Setup database (only if empty)
  npm run seed-db           # Seed database with sample data
  npm run seed-db -- --force # Force seed (overwrite existing data)
  npm run reset-db          # Reset database (clear all data)

Environment Variables Required:
  MONGODB_URI=mongodb://localhost:27017/ensaoffline
  MONGODB_DB=ensaoffline

Make sure MongoDB is running before executing this script.
  `);
  process.exit(0);
}

main();
