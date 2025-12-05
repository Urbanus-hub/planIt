import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/env.js";
const authorize = (req, res, next) => {
    try {
        // Extract token from cookies (primary) or Authorization header (fallback)
        const token = req.cookies?.authToken || req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
            return;
        }
        // Verify and decode token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        // Handle specific JWT errors
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: "Token expired. Please login again.",
            });
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: "Invalid token.",
            });
            return;
        }
        res.status(401).json({
            success: false,
            message: "Authorization failed.",
        });
    }
};
export default authorize;
//# sourceMappingURL=authorize.middleware.js.map