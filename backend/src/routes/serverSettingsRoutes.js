
import { Router } from "express";
import express from "express";
import multer from "multer";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { randomUUID } from "node:crypto";

import {
  getSettings,
  updateSettings,
  uploadServerAsset
} from "../controllers/serverSettingsController.js";

import {
  requireAuth,
  requireRole
} from "../middleware/auth.js";

const router = Router();

const assetsDirectory = fileURLToPath(
  new URL("../../uploads/server-assets/", import.meta.url)
);

const extensionsByMimeType = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif"
};

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    mkdir(assetsDirectory, { recursive: true })
      .then(() => callback(null, assetsDirectory))
      .catch(callback);
  },

  filename(_req, file, callback) {
    const extension = extensionsByMimeType[file.mimetype];

    callback(null, `${randomUUID()}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter(_req, file, callback) {
    if (!extensionsByMimeType[file.mimetype]) {
      return callback(
        new Error("Format refusé. Utilise PNG, JPG, WEBP ou GIF.")
      );
    }

    callback(null, true);
  }
});

function handleAssetUpload(req, res, next) {
  upload.single("file")(req, res, (error) => {
    if (error) {
      const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;

      return res.status(status).json({
        success: false,
        message: error.code === "LIMIT_FILE_SIZE"
          ? "L'image ne doit pas dépasser 5 Mo."
          : error.message
      });
    }

    next();
  });
}

// Les images importées sont accessibles publiquement.
router.use(
  "/assets",
  express.static(assetsDirectory, {
    maxAge: "1y",
    immutable: true
  })
);

// Tout le monde peut consulter les paramètres.
router.get("/", getSettings);

// Seul le fondateur peut importer une image.
router.post(
  "/assets/:type",
  requireAuth,
  requireRole("fondateur"),
  handleAssetUpload,
  uploadServerAsset
);

// Seul le fondateur peut modifier les paramètres.
router.put(
  "/",
  requireAuth,
  requireRole("fondateur"),
  updateSettings
);

export default router;
