import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  deleteUser,
} from "../controllers/users.controller.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = Router();

// register a new user
router.post("/auth/register", registerUser);
// log in
router.post("/auth/login", loginUser);
// get all users
router.get("/", authorize, getUsers);
router.get("/:id", authorize, getUser);
router.delete("/:id", authorize, deleteUser);

export default router;
