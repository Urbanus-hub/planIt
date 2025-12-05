import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "client" | "vendor" | "admin";
    phone?: string;
    avatar?: string;
    profileImage?: string;
    profileBackground?: string;
    isVerified: boolean;
    isActive: boolean;
    verificationToken?: string;
    verificationOTP?: string;
    verificationOTPExpire?: Date;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    businessName?: string;
    businessDescription?: string;
    businessLogo?: string;
    businessAddress?: string;
    serviceCategory?: string;
    yearsOfExperience?: number;
    businessLicense?: string;
    taxId?: string;
    specialties?: string[];
    certifications?: string[];
    businessHours?: string;
    responseTime?: string;
    city?: string;
    state?: string;
    website?: string;
    rating?: number;
    reviewCount?: number;
    totalBookings?: number;
    joinedDate?: Date;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=user.model.d.ts.map