import nodemailer from "nodemailer";
declare const transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options>;
export declare const generateOTP: () => string;
export declare const sendOTPEmail: (email: string, otp: string, name: string) => Promise<boolean>;
export declare const sendWelcomeEmail: (email: string, name: string, role: string) => Promise<boolean>;
export declare const sendPasswordResetEmail: (email: string, resetToken: string, name: string) => Promise<boolean>;
export default transporter;
//# sourceMappingURL=emailService.d.ts.map