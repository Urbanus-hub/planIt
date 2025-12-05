import { Request, Response, NextFunction } from "express";
/**
 * Verify that the user owns the booking or is an admin
 */
export declare const verifyBookingOwnership: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Verify that the user is the provider of the booking service or admin
 * Used for updating booking status (confirm, complete, etc.)
 */
export declare const verifyProviderAccess: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=bookingAuthorization.d.ts.map