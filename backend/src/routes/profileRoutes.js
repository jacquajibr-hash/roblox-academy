
import express from "express";

import { requireAuth } from "../middleware/auth.js";
import { uploadAvatar } from "../middleware/avatarUpload.js";

import {
  updateProfile,
  getAvatar
} from "../controllers/profileController.js";

const router = express.Router();

// Modification du profil et envoi d'une photo
router.patch(
  "/",
  requireAuth,
  uploadAvatar.single("avatar"),
  updateProfile
);

// Récupération d'une photo de profil
router.get(
  "/avatar/:filename",
  requireAuth,
  getAvatar
);

export default router;
