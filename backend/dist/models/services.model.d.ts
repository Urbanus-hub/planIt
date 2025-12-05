import mongoose, { Document, Types } from "mongoose";
export interface IService extends Document {
    title: string;
    slug: string;
    category: "Photography" | "Catering" | "Decor" | "Entertainment" | "Venue" | "Other";
    description: string;
    price: number;
    pricingType: "fixed" | "per-hour" | "per-person" | "custom";
    location: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    images: string[];
    provider: Types.ObjectId;
    isActive: boolean;
    availability: {
        daysOfWeek: number[];
        timeSlots?: {
            start: string;
            end: string;
        }[];
    };
    capacity?: number;
    duration?: number;
    minAdvanceBooking?: number;
    maxAdvanceBooking?: number;
    cancellationPolicy?: string;
    depositRequired?: boolean;
    depositPercentage?: number;
    rating?: number;
    reviewCount?: number;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IService, {}, {}, {}, mongoose.Document<unknown, {}, IService, {}, {}> & IService & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=services.model.d.ts.map