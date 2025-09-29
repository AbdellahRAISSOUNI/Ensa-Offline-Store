import mongoose, { Schema, model, models } from "mongoose";

// For storing exclusive unlockable custom text options
export interface ExclusiveTextDocument extends mongoose.Document {
  textOption: string;
  category: string; // 'minimalist', 'chaotic', 'motivational', etc.
  difficulty: 'easy' | 'medium' | 'hard';
  riddle: string;
  answer: string;
  unlockCount: number; // how many times it's been unlocked
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// For storing community-generated custom text from previous orders
export interface CommunityTextDocument extends mongoose.Document {
  customText: string;
  orderId: string;
  category?: string;
  isApproved: boolean; // moderation flag
  isFeatured: boolean; // highlight popular ones
  likes: number; // community voting
  createdAt: Date;
  updatedAt: Date;
}

// For tracking user achievements/unlocks
export interface UserUnlocksDocument extends mongoose.Document {
  sessionId: string; // anonymous session tracking
  unlockedTexts: string[]; // array of ExclusiveText IDs
  riddesSolved: number;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExclusiveTextSchema = new Schema<ExclusiveTextDocument>(
  {
    textOption: { type: String, required: true, trim: true, maxlength: 100 },
    category: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    riddle: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true, lowercase: true },
    unlockCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const CommunityTextSchema = new Schema<CommunityTextDocument>(
  {
    customText: { type: String, required: true, trim: true, maxlength: 100 },
    orderId: { type: String, required: true, index: true },
    category: { type: String, trim: true },
    isApproved: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    likes: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

const UserUnlocksSchema = new Schema<UserUnlocksDocument>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    unlockedTexts: { type: [String], default: [] },
    riddesSolved: { type: Number, default: 0, min: 0 },
    lastActivity: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes for better performance
ExclusiveTextSchema.index({ category: 1, isActive: 1 });
ExclusiveTextSchema.index({ difficulty: 1, isActive: 1 });
CommunityTextSchema.index({ isApproved: 1, isFeatured: 1 });
CommunityTextSchema.index({ createdAt: -1 });

export const ExclusiveText = models.ExclusiveText || model<ExclusiveTextDocument>("ExclusiveText", ExclusiveTextSchema);
export const CommunityText = models.CommunityText || model<CommunityTextDocument>("CommunityText", CommunityTextSchema);
export const UserUnlocks = models.UserUnlocks || model<UserUnlocksDocument>("UserUnlocks", UserUnlocksSchema);
