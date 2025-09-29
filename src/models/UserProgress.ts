import mongoose from 'mongoose';

export interface UserProgressDocument extends mongoose.Document {
  sessionId: string; // Anonymous session tracking
  unlockedTexts: string[]; // Array of CommunityText IDs
  completedPuzzles: {
    puzzleId: string;
    difficulty: number;
    completedAt: Date;
    attempts: number;
  }[];
  achievements: {
    id: string;
    name: string;
    description: string;
    unlockedAt: Date;
    rarity: 'bronze' | 'silver' | 'gold' | 'legendary';
  }[];
  stats: {
    totalPuzzlesSolved: number;
    totalTextsUnlocked: number;
    favoriteCategory: string;
    streakDays: number;
    lastActive: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  unlockedTexts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityText'
  }],
  completedPuzzles: [{
    puzzleId: {
      type: String,
      required: true
    },
    difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    attempts: {
      type: Number,
      default: 1
    }
  }],
  achievements: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    rarity: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'legendary'],
      default: 'bronze'
    }
  }],
  stats: {
    totalPuzzlesSolved: {
      type: Number,
      default: 0
    },
    totalTextsUnlocked: {
      type: Number,
      default: 0
    },
    favoriteCategory: {
      type: String,
      default: 'motivational'
    },
    streakDays: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
UserProgressSchema.index({ sessionId: 1 });
UserProgressSchema.index({ 'stats.totalPuzzlesSolved': -1 });
UserProgressSchema.index({ 'stats.lastActive': -1 });

export const UserProgress = mongoose.models.UserProgress || mongoose.model<UserProgressDocument>('UserProgress', UserProgressSchema);
