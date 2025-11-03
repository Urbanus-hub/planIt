import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../configs/env.js";

// Extended user interface with common JWT payload fields
export interface AuthUser extends JwtPayload {
  id: string;
  email: string;
  role: "client" | "vendor" | "admin";
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const authorize = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Extract token from cookies (primary) or Authorization header (fallback)
    const token =
      req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;

    next();
  } catch (error) {
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
