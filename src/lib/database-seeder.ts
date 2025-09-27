import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Settings } from '@/models/Settings';

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
      type: "percentage" as const,
      value: 10,
      isActive: true,
    },
    {
      code: "OFFLINE5",
      type: "fixed" as const,
      value: 5,
      isActive: true,
    },
    {
      code: "WELCOME15",
      type: "percentage" as const,
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
export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectToDatabase();
    console.log('✅ Connected to database');

    // Clear existing data
    await Product.deleteMany({});
    await Settings.deleteMany({});
    console.log('🗑️ Cleared existing data');

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
  }
}

// Function to check if database is empty
export async function isDatabaseEmpty(): Promise<boolean> {
  try {
    await connectToDatabase();
    
    const productCount = await Product.countDocuments();
    const settingsCount = await Settings.countDocuments();
    
    return productCount === 0 && settingsCount === 0;
  } catch (error) {
    console.error('Error checking database:', error);
    return false;
  }
}

// Function to get database stats
export async function getDatabaseStats() {
  try {
    await connectToDatabase();
    
    const productCount = await Product.countDocuments();
    const activeProductCount = await Product.countDocuments({ isActive: true });
    const settingsCount = await Settings.countDocuments();
    
    return {
      products: productCount,
      activeProducts: activeProductCount,
      settings: settingsCount,
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  }
}

// Auto-seed if database is empty (for development)
if (process.env.NODE_ENV === 'development') {
  seedDatabase().catch(console.error);
}
