import { Document, Types } from "mongoose";
export interface INotification extends Document {
    user: Types.ObjectId;
    type: "booking" | "payment" | "review" | "system";
    title: string;
    message: string;
    isRead: boolean;
    link?: string;
    createdAt: Date;
}
//# sourceMappingURL=notification.model.d.ts.map