import { Request, Response, NextFunction } from "express";
/**
 * Verify that the user owns the service or is an admin
 */
export declare const verifyServiceOwnership: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=serviceAuthorization.d.ts.map