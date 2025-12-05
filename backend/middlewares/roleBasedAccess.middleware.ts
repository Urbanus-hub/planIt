import { Request, Response, NextFunction } from "express";
import { AuthUser } from "./authorize.middleware.js";

/**
 * Middleware to check if user has required role(s)
 * @param roles - Array of allowed roles
 */
export const authorizeRole = (
  ...roles: Array<"client" | "vendor" | "admin">
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const user = req.user as AuthUser;

    if (!roles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user owns the resource
 * @param resourceUserIdField - Field name in request params/body containing the user ID
 */
export const authorizeOwnership = (resourceUserIdField: string = "userId") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const user = req.user as AuthUser;
    const resourceUserId =
      req.params[resourceUserIdField] || req.body[resourceUserIdField];

    // Admins can access any resource
    if (user.role === "admin") {
      next();
      return;
    }

    if (user.id !== resourceUserId) {
      res.status(403).json({
        success: false,
        message: "Access denied. You can only access your own resources.",
      });
      return;
    }

    next();
  };
};
