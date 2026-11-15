
import express from "express";

import {
  requireAuth,
  requireRole
} from "../middleware/auth.js";

import {
  getActivity
} from "../controllers/activityController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole("fondateur"));

router.get("/", getActivity);

export default router;
