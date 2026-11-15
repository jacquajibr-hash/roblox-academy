
import express from "express";

import {
  requireAuth,
  requireRole
} from "../middleware/auth.js";

import {
  getGradebook,
  createAssessment,
  editAssessment,
  removeAssessment,
  setAssessmentPublication
} from "../controllers/gradesController.js";

const router = express.Router();

router.use(requireAuth);

// Consultation : élèves, professeurs et administration
router.get(
  "/",
  requireRole(
    "eleve",
    "fondateur",
    "administrateur",
    "professeur"
  ),
  getGradebook
);

// Gestion : professeurs et administration uniquement
router.post(
  "/",
  requireRole("fondateur", "administrateur", "professeur"),
  createAssessment
);

router.put(
  "/:id",
  requireRole("fondateur", "administrateur", "professeur"),
  editAssessment
);

router.delete(
  "/:id",
  requireRole("fondateur", "administrateur", "professeur"),
  removeAssessment
);

router.patch(
  "/:id/publication",
  requireRole("fondateur", "administrateur", "professeur"),
  setAssessmentPublication
);

export default router;
