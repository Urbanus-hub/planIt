import { Request, Response, NextFunction } from "express";
export declare const registerUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const loginUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const logoutUser: (_req: Request, res: Response, _next: NextFunction) => Promise<void>;
export declare const getCurrentUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getVendors: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const toggleUserActive: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyVendor: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyOTP: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const resendOTP: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const forgotPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const resetPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=users.controller.d.ts.map