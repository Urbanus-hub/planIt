import { Request, Response, NextFunction } from "express";
/**
 * Verify that the user is accessing their own profile or is an admin
 */
export declare const verifyUserOwnership: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=userAuthorization.d.ts.map