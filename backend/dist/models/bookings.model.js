import mongoose, { Schema } from "mongoose";
const bookingSchema = new Schema({
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
}, { timestamps: true });
// Compound indexes for common queries
bookingSchema.index({ provider: 1, startDate: 1 });
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ startDate: 1, status: 1 });
export default mongoose.model("Booking", bookingSchema);
//# sourceMappingURL=bookings.model.js.map