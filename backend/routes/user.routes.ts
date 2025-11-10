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
  toggleUserActive
} from "../controllers/users.controller.js";
import authorize from "../middlewares/authorize.middleware.js";
import { authorizeRole } from "../middlewares/roleBasedAccess.middleware";
import { verifyUserOwnership } from "../middlewares/userAuthorization";

const router = Router();

// Public routes (no authentication required)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
// Get current logged-in user
router.get("/me", authorize, getCurrentUser);

// Logout
router.post("/logout", authorize, logoutUser);

// Get all users (admin only)
router.get("/", authorize, authorizeRole("admin"), getUsers);

// Get user by ID (user themselves or admin)
router.get(
  "/:id",
  authorize,
  verifyUserOwnership,
  getUser
);

// Update user (user themselves or admin)
router.patch(
  "/:id",
  authorize,
  verifyUserOwnership,
  updateUser
);

// Delete user (user themselves or admin)
router.delete(
  "/:id",
  authorize,
  verifyUserOwnership,
  deleteUser
);

// deactivate or activate user


router.patch(
  "/:id/toggle-active",
  authorize,
  authorizeRole("admin"),
  toggleUserActive
);

export default router;