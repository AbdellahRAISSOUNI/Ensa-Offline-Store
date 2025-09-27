import mongoose, { Schema, model, models } from "mongoose";

export interface ProductImage {
  original: string;
  thumbnail: string;
  medium: string;
  large: string;
}

export interface ProductDocument extends mongoose.Document {
  name: string;
  description?: string;
  price: number;
  images: ProductImage[];
  sizes: string[];
  category?: string;
  isCustomizable: boolean;
  customPrice?: number; // extra cost for custom text
  isActive: boolean;
  stock?: number; // inventory tracking
  tags?: string[]; // for filtering and search
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<ProductImage>({
  original: { type: String, required: true },
  thumbnail: { type: String, required: true },
  medium: { type: String, required: true },
  large: { type: String, required: true },
}, { _id: false });

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [ProductImageSchema], default: [] },
    sizes: { type: [String], default: [] },
    category: { type: String, trim: true },
    isCustomizable: { type: Boolean, default: false },
    customPrice: { type: Number, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
    stock: { type: Number, default: 0, min: 0 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Indexes for better performance
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

export const Product = models.Product || model<ProductDocument>("Product", ProductSchema);


