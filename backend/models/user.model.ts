import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "client" | "vendor" | "admin";
  phone?: string;
  avatar?: string;
  profileImage?: string;
  isVerified: boolean;
  isActive: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  // Vendor-specific fields
  businessName?: string;
  businessDescription?: string;
  businessLogo?: string;
  businessAddress?: string;
  taxId?: string;
  rating?: number;
  reviewCount?: number;
  totalBookings?: number;
  joinedDate?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["client", "vendor", "admin"],
      default: "client",
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: String,
    profileImage: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // Vendor fields
    businessName: String,
    businessDescription: String,
    businessLogo: String,
    businessAddress: String,
    taxId: String,
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
    totalBookings: {
      type: Number,
      default: 0,
    },
    joinedDate: Date,
    lastLoginAt: Date,
  },
  { timestamps: true }
);

// Index for vendor searches
userSchema.index({ role: 1, isActive: 1, isVerified: 1 });
userSchema.index({ rating: -1 });

export default mongoose.model<IUser>("User", userSchema);
