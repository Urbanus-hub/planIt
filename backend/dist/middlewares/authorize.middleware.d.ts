import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
export interface AuthUser extends JwtPayload {
    id: string;
    email: string;
    role: "client" | "vendor" | "admin";
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
declare const authorize: (req: Request, res: Response, next: NextFunction) => void;
export default authorize;
//# sourceMappingURL=authorize.middleware.d.ts.map