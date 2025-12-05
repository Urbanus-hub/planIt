import mongoose, { Document, Types } from "mongoose";
export interface IBooking extends Document {
    user: Types.ObjectId;
    service: Types.ObjectId;
    provider: Types.ObjectId;
    startDate: Date;
    endDate?: Date;
    status: "pending" | "confirmed" | "completed" | "cancelled" | "refunded";
    paymentStatus: "unpaid" | "partial" | "paid" | "refunded";
    notes?: string;
    totalPrice: number;
    depositAmount?: number;
    cancellationReason?: string;
    cancelledAt?: Date;
    cancelledBy?: Types.ObjectId;
    confirmedAt?: Date;
    completedAt?: Date;
    attendees?: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IBooking, {}, {}, {}, mongoose.Document<unknown, {}, IBooking, {}, {}> & IBooking & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=bookings.model.d.ts.map