import mongoose from 'mongoose';

export interface CommunityTextDocument extends mongoose.Document {
  text: string;
  category: 'motivational' | 'funny' | 'minimalist' | 'chaotic' | 'philosophical';
  isApproved: boolean;
  submittedBy: string; // anonymous ID
  createdAt: Date;
  usageCount: number;
}

const CommunityTextSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 50, // Keep it short for shirts
    trim: true
  },
  category: {
    type: String,
    enum: ['motivational', 'funny', 'minimalist', 'chaotic', 'philosophical'],
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  submittedBy: {
    type: String,
    required: true // Just a random anonymous ID
  },
  usageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for quick queries
CommunityTextSchema.index({ isApproved: 1, category: 1 });

export const CommunityText = mongoose.models.CommunityText || mongoose.model<CommunityTextDocument>('CommunityText', CommunityTextSchema);