
import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const uploadsDirectory = fileURLToPath(
  new URL("../../uploads/avatars/", import.meta.url)
);

const storage = multer.diskStorage({
  destination: async (req, file, callback) => {
    try {
      await mkdir(uploadsDirectory, { recursive: true });
      callback(null, uploadsDirectory);
    } catch (error) {
      callback(error);
    }
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  }
});

const allowedTypes = {
  ".png": ["image/png"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".webp": ["image/webp"]
};

const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowedMimeTypes = allowedTypes[extension];

  if (!allowedMimeTypes || !allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new Error("Format accepté : PNG, JPG, JPEG ou WEBP.")
    );
  }

  callback(null, true);
};

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  }
});
