import mongoose, { Document, Schema, Types } from "mongoose";

export interface IService extends Document {
  title: string;
  slug: string; // For SEO-friendly URLs
  category:
    | "Photography"
    | "Catering"
    | "Decor"
    | "Entertainment"
    | "Venue"
    | "Other";
  description: string;
  price: number;
  pricingType: "fixed" | "per-hour" | "per-person" | "custom";
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  images: string[]; // Multiple images
  provider: Types.ObjectId;
  isActive: boolean; // To enable/disable services
  availability: {
    daysOfWeek: number[]; // 0-6 for Sun-Sat
    timeSlots?: { start: string; end: string }[];
  };
  capacity?: number; // Max bookings per day/slot
  duration?: number; // Service duration in minutes
  minAdvanceBooking?: number; // Minimum days in advance
  maxAdvanceBooking?: number; // Maximum days in advance
  cancellationPolicy?: string;
  depositRequired?: boolean;
  depositPercentage?: number;
  rating?: number;
  reviewCount?: number;
  tags?: string[]; // For better search/filtering
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: { 
      type: String, 
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Photography",
        "Catering",
        "Decor",
        "Entertainment",
        "Venue",
        "Other",
      ],
      index: true,
    },
    description: { 
      type: String, 
      required: true,
      maxlength: 2000,
    },
    price: { 
      type: Number, 
      required: true,
      min: 0,
    },
    pricingType: {
      type: String,
      enum: ["fixed", "per-hour", "per-person", "custom"],
      default: "fixed",
    },
    location: { 
      type: String, 
      required: true,
      index: true,
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    images: {
      type: [String],
      default: [],
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    availability: {
      daysOfWeek: [Number],
      timeSlots: [{
        start: String,
        end: String,
      }],
    },
    capacity: Number,
    duration: Number,
    minAdvanceBooking: {
      type: Number,
      default: 1,
    },
    maxAdvanceBooking: {
      type: Number,
      default: 365,
    },
    cancellationPolicy: String,
    depositRequired: {
      type: Boolean,
      default: false,
    },
    depositPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  { timestamps: true }
);

// Indexes for common queries
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ location: 1, category: 1 });
serviceSchema.index({ rating: -1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ tags: 1 });

// Auto-generate slug from title
serviceSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

export default mongoose.model<IService>("Service", serviceSchema);