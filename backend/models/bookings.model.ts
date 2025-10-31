import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBooking extends Document {
  user: Types.ObjectId;
  service: Types.ObjectId;
  provider: Types.ObjectId;
  startDate: Date;
  endDate?: Date; // For multi-day events
  status: "pending" | "confirmed" | "completed" | "cancelled" | "refunded";
  paymentStatus: "unpaid" | "partial" | "paid" | "refunded";
  notes?: string;
  totalPrice: number; // Should be required
  depositAmount?: number;
  cancellationReason?: string;
  cancelledAt?: Date;
  cancelledBy?: Types.ObjectId;
  confirmedAt?: Date;
  completedAt?: Date;
  attendees?: number; // Guest count for capacity planning
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for queries by user
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for provider dashboard queries
    },
    startDate: {
      type: Date,
      required: true,
      index: true, // Index for date-based queries
    },
    endDate: Date,
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid", "refunded"],
      default: "unpaid",
    },
    notes: String,
    totalPrice: {
      type: Number,
      required: true, // Should always have a price
    },
    depositAmount: Number,
    cancellationReason: String,
    cancelledAt: Date,
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    confirmedAt: Date,
    completedAt: Date,
    attendees: Number,
  },
  { timestamps: true }
);

// Compound indexes for common queries
bookingSchema.index({ provider: 1, startDate: 1 });
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ startDate: 1, status: 1 });

export default mongoose.model<IBooking>("Booking", bookingSchema);