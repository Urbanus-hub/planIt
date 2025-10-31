import { Document, Types } from 'mongoose';

export interface IReview extends Document {
  booking: Types.ObjectId;
  service: Types.ObjectId;
  provider: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment?: string;
  response?: string; // Vendor response
  isVerified: boolean; // Only from completed bookings
  createdAt: Date;
  updatedAt: Date;
}