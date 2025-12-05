import { Document, Types } from "mongoose";
export interface IPayment extends Document {
    booking: Types.ObjectId;
    user: Types.ObjectId;
    provider: Types.ObjectId;
    amount: number;
    paymentMethod: "card" | "mobile_money" | "bank_transfer" | "cash";
    status: "pending" | "completed" | "failed" | "refunded";
    transactionId?: string;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=payment.model.d.ts.map