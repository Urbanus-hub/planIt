import { Request, Response, NextFunction } from "express";
import { AuthUser } from "./authorize.middleware.js";

/**
 * Verify that the user is accessing their own profile or is an admin
 */
export const verifyUserOwnership = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user as AuthUser;
  const userId = req.params.id;

  // Admins can access any user
  if (user.role === "admin") {
    next();
    return;
  }

  // User can only access their own profile
  if (user.id !== userId) {
    res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own profile.",
    });
    return;
  }

  next();
};
