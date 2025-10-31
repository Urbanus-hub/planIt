import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBooking extends Document {
  user: Types.ObjectId;
  service: Types.ObjectId;
  provider: Types.ObjectId;
  date: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  totalPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    notes: String,
    totalPrice: Number,
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", bookingSchema);
