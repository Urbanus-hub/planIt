import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../configs/env.js";

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log(
    `authorize middleware for method ${req.method} at ${req.originalUrl}`
  );
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: "Not authorized, no token" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      res.status(401).json({ message: "Not authorized, token failed" });
      return;
    }

    req.user = decoded;
    console.log("User authorized:", req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }
};

export default authorize;
