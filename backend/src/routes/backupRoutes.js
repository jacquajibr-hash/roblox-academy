
import express from "express";

import {
  requireAuth,
  requireRole
} from "../middleware/auth.js";

import {
  getBackups,
  createManualBackup,
  restoreExistingBackup
} from "../controllers/backupController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole("fondateur"));

router.get("/", getBackups);

router.post("/", createManualBackup);

router.post("/:id/restore", restoreExistingBackup);

export default router;
