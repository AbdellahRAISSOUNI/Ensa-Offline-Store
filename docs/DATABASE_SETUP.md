# Database Setup Guide - ENSA OFFLINE

## Overview

This guide will help you set up the database connection and populate it with initial data for the ENSA OFFLINE brutalist merch website.

## Prerequisites

1. **MongoDB** - Either local installation or MongoDB Atlas account
2. **Node.js** 18+ installed
3. **Environment variables** configured

## Quick Start

### 1. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ensaoffline
MONGODB_DB=ensaoffline

# Alternative: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ensaoffline?retryWrites=true&w=majority

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ensa2024

# Image Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/gif

# Development/Production
NODE_ENV=development
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

```bash
# Setup database with sample data (only if empty)
npm run setup-db

# Or force seed with sample data
npm run seed-db -- --force
```

### 4. Start Development Server

```bash
npm run dev
```

## Database Options

### Option 1: Local MongoDB

1. **Install MongoDB locally:**
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB service:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   # or
   mongod
   ```

3. **Use local connection string:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/ensaoffline
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a new cluster:**
   - Choose free tier (M0)
   - Select region closest to you
   - Create cluster

3. **Set up database access:**
   - Go to "Database Access"
   - Add new database user
   - Set username/password
   - Give "Read and write to any database" permissions

4. **Set up network access:**
   - Go to "Network Access"
   - Add IP address (0.0.0.0/0 for development)
   - Or add your current IP

5. **Get connection string:**
   - Go to "Database"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password

6. **Use Atlas connection string:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ensaoffline?retryWrites=true&w=majority
   ```

## Database Commands

### Setup Commands

```bash
# Setup database (only if empty)
npm run setup-db

# Seed database with sample data
npm run seed-db

# Force seed (overwrite existing data)
npm run seed-db -- --force

# Reset database (clear all data)
npm run reset-db
```

### Manual Database Operations

```bash
# Connect to MongoDB shell
mongosh

# Use database
use ensaoffline

# View collections
show collections

# View products
db.products.find().pretty()

# View settings
db.settings.find().pretty()

# Clear all data
db.products.deleteMany({})
db.settings.deleteMany({})
db.orders.deleteMany({})
```

## Sample Data

The database seeder creates:

### Products (6 items)
- ENSA OFFLINE Hoodie ($89)
- ENSA OFFLINE T-Shirt ($45)
- ENSA OFFLINE Tank Top ($35)
- ENSA OFFLINE Long Sleeve ($55)
- ENSA OFFLINE Cap ($25)
- ENSA OFFLINE Beanie ($20)

### Settings
- Shipping fees for all Moroccan cities
- Custom text pricing ($15)
- Discount codes (ENSA10, OFFLINE5, WELCOME15)
- Contact information
- Social media links

## Image Upload System

### Features
- **Automatic optimization** with Sharp
- **Multiple sizes** generated (thumbnail, medium, large)
- **Format conversion** (JPEG, PNG, WebP)
- **Compression** for fast loading
- **File validation** (type, size)

### Upload Process
1. Admin uploads image via `/admin/products`
2. Image is processed and optimized
3. Multiple sizes are generated
4. URLs are stored in database
5. Frontend loads appropriate size based on context

### Image Storage
- **Location**: `public/uploads/products/`
- **Formats**: Original + optimized versions
- **Sizes**: 
  - Thumbnail: 300x300px
  - Medium: 600x600px
  - Large: 1200x1200px

## Admin Features

### Product Management
- **Add/Edit/Delete** products
- **Image upload** with optimization
- **Stock management**
- **Category assignment**
- **Customization options**
- **Tags and descriptions**

### Access
- **URL**: `http://localhost:3000/admin`
- **Login**: `admin` / `ensa2024`
- **Features**: Full CRUD operations

## API Endpoints

### Products
- `GET /api/products` - List all active products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Image Upload
- `POST /api/upload` - Upload image (admin)
- `GET /api/upload/images` - List uploaded images (admin)
- `DELETE /api/upload/image?filename=...` - Delete image (admin)

### Database Management
- `POST /api/seed` - Seed database (admin)
- `GET /api/seed` - Get database status (admin)

## Troubleshooting

### Common Issues

#### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Check connection string format
# Local: mongodb://localhost:27017/ensaoffline
# Atlas: mongodb+srv://user:pass@cluster.mongodb.net/ensaoffline
```

#### Image Upload Failed
```bash
# Check file permissions
ls -la public/uploads/

# Create upload directory
mkdir -p public/uploads/products

# Check Sharp installation
npm list sharp
```

#### Database Empty After Setup
```bash
# Check if seeding completed
npm run seed-db -- --force

# Check database connection
node -e "require('./src/lib/mongodb').connectToDatabase().then(() => console.log('Connected')).catch(console.error)"
```

#### Environment Variables Not Loading
```bash
# Check .env.local exists
ls -la .env.local

# Restart development server
npm run dev
```

### Performance Optimization

#### Database Indexes
The system automatically creates indexes for:
- Product name and description (text search)
- Product category and active status
- Product price
- Creation date

#### Image Optimization
- **Lazy loading** on frontend
- **Responsive images** (different sizes for different screens)
- **WebP format** for modern browsers
- **Compression** for faster loading

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ensaoffline
MONGODB_DB=ensaoffline
```

### Database Backup
```bash
# Backup database
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/ensaoffline" --out=backup/

# Restore database
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/ensaoffline" backup/ensaoffline/
```

### Image Storage
For production, consider:
- **Cloud storage** (AWS S3, Cloudinary)
- **CDN** for faster image delivery
- **Image optimization** service

## Support

If you encounter issues:

1. **Check logs** in browser console and terminal
2. **Verify environment variables** are set correctly
3. **Test database connection** manually
4. **Check file permissions** for uploads directory
5. **Restart services** (MongoDB, development server)

## Next Steps

After successful setup:

1. **Visit the website**: `http://localhost:3000`
2. **Access admin panel**: `http://localhost:3000/admin`
3. **Add your own products** with real images
4. **Customize settings** for your business
5. **Test the ordering system**

---

**ENSA OFFLINE** - *grace under pressure*
