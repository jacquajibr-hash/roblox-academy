
import express from "express";

import {
  login,
  logout,
  getCurrentUser
} from "../controllers/authController.js";

import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, getCurrentUser);

export default router;
