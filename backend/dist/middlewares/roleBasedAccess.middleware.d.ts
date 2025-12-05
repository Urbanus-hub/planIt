import { Request, Response, NextFunction } from "express";
/**
 * Middleware to check if user has required role(s)
 * @param roles - Array of allowed roles
 */
export declare const authorizeRole: (...roles: Array<"client" | "vendor" | "admin">) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to check if user owns the resource
 * @param resourceUserIdField - Field name in request params/body containing the user ID
 */
export declare const authorizeOwnership: (resourceUserIdField?: string) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=roleBasedAccess.middleware.d.ts.map