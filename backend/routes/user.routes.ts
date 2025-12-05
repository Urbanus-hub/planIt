import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  toggleUserActive,
  verifyVendor,
  getVendors,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/users.controller.js";

import authorize from "../middlewares/authorize.middleware.js";
import { authorizeRole } from "../middlewares/roleBasedAccess.middleware.js";
import { verifyUserOwnership } from "../middlewares/userAuthorization.js";

const router = Router();

// Public routes (no authentication required)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
// Get current logged-in user
router.get("/me", authorize, getCurrentUser);

// Logout
router.post("/logout", authorize, logoutUser);

// Get all users (admin only)
router.get("/", authorize, authorizeRole("admin"), getUsers);

//get vendors (must be before /:id route)
router.get("/vendors", getVendors);

// Get vendor profile by ID (public)
router.get("/vendors/:id", getUser);

// Get user by ID (user themselves or admin)
router.get("/:id", authorize, verifyUserOwnership, getUser);

// Update user (user themselves or admin)
router.patch("/:id", authorize, verifyUserOwnership, updateUser);

// Delete user (user themselves or admin)
router.delete("/:id", authorize, verifyUserOwnership, deleteUser);

// deactivate or activate user
router.patch(
  "/:id/toggle-active",
  authorize,
  authorizeRole("admin"),
  toggleUserActive
);

// verify vendor
router.patch(
  "/:id/verify-vendor",
  authorize,
  authorizeRole("admin"),
  verifyVendor
);

export default router;
