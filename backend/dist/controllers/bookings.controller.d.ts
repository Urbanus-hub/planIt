import { Request, Response, NextFunction } from "express";
export declare const createBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserBookings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getServiceBookings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getProviderBookings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllBookings: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateBookingStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=bookings.controller.d.ts.map