import { Document, Types } from 'mongoose';
export interface IReview extends Document {
    booking: Types.ObjectId;
    service: Types.ObjectId;
    provider: Types.ObjectId;
    user: Types.ObjectId;
    rating: number;
    comment?: string;
    response?: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=review.model.d.ts.map