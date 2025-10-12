import mongoose, { Schema, model, models } from "mongoose";

type OrderStatus =
  | "pending"
  | "contacted"
  | "printed"
  | "delivering"
  | "delivered"
  | "finished";

export interface OrderDocument extends mongoose.Document {
  orderId: string;
  customerInfo: {
    fullName: string;
    whatsappNumber: string;
    city: string;
    isTetouan: boolean;
  };
  productDetails: {
    productId: mongoose.Types.ObjectId;
    size?: string;
    isCustom: boolean;
    customText?: string;
  };
  pricing: {
    basePrice: number;
    customFee: number;
    shippingFee: number;
    totalPrice: number;
    currency: string; // Store the currency used for this order
    exchangeRate: number; // Store the exchange rate used at time of order
  };
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<OrderDocument>(
  {
    orderId: { type: String, unique: true, index: true },
    customerInfo: {
      fullName: { type: String, required: true, trim: true },
      whatsappNumber: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      isTetouan: { type: Boolean, default: false },
    },
    productDetails: {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      size: { type: String },
      isCustom: { type: Boolean, default: false },
      customText: { type: String, trim: true },
    },
    pricing: {
      basePrice: { type: Number, required: true, min: 0 },
      customFee: { type: Number, required: true, min: 0, default: 0 },
      shippingFee: { type: Number, required: true, min: 0 },
      totalPrice: { type: Number, required: true, min: 0 },
      currency: { type: String, required: true, default: 'MAD' },
      exchangeRate: { type: Number, required: true, default: 10 },
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "printed", "delivering", "delivered", "finished"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

// Auto-generate orderId if missing: ENSA-YYYYMMDD-XXXXXX
OrderSchema.pre("save", function (next) {
  if (!this.orderId) {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderId = `ENSA-${y}${m}${d}-${rand}`;
  }
  next();
});

export const Order = models.Order || model<OrderDocument>("Order", OrderSchema);


