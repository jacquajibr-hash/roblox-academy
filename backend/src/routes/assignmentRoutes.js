
import express from "express";

import {
  requireAuth,
  requireRole
} from "../middleware/auth.js";

import {
  getAssignments,
  createNewAssignment,
  editAssignment,
  removeAssignment
} from "../controllers/assignmentsController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getAssignments);

router.post(
  "/",
  requireRole("fondateur", "administrateur", "professeur"),
  createNewAssignment
);

router.patch(
  "/:id",
  requireRole("fondateur", "administrateur", "professeur"),
  editAssignment
);

router.delete(
  "/:id",
  requireRole("fondateur", "administrateur", "professeur"),
  removeAssignment
);

export default router;
