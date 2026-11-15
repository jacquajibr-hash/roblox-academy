
import express from "express";

import { requireAuth, requireRole } from "../middleware/auth.js";

import {
  getUsers,
  createAccount,
  editAccount,
  changeAccountPassword,
  toggleAccount
} from "../controllers/usersController.js";

const router = express.Router();

router.use(requireAuth, requireRole("fondateur"));

router.get("/", getUsers);
router.post("/", createAccount);
router.patch("/:id", editAccount);
router.patch("/:id/password", changeAccountPassword);
router.patch("/:id/status", toggleAccount);

export default router;
