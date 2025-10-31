import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NODE_ENV, JWT_SECRET } from "../configs/env.js";

interface UserPayload extends JwtPayload {
  id: string;
  role: "client" | "vendor" | "admin";
}

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: "Email already used" });
      return;
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });

    // don't return password in response
    const { password: _, ...userData } = user.toObject();
    res.status(201).json({
      message: "User registered successfully",
      data: userData,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "Invalid credentials" });
      return;
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user?._id?.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      message: "Login successful",
      user: { id: user._id, name: user.name, role: user.role },
      token,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};

// fetch users
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user as UserPayload;
  console.log("Get users requested by:", user);

  try {
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const users = await User.find();
    if (!users) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res.status(200).send(users);
  } catch (err) {
    const error = err as Error;
    console.log(error.message);
    next(err);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user as UserPayload;

  try {
    if (user.role !== "admin") {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const fetchedUser = await User.findById(req.params.id);

    if (!fetchedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(fetchedUser);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};

// delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as UserPayload;

    if (user.role !== "admin") {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const fetchedUser = await User.findById(req.params.id);
    if (!fetchedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (fetchedUser.role === "admin") {
      res.status(400).json({ message: "Cannot delete admin user" });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};
