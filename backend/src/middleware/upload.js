
import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const uploadsDirectory = fileURLToPath(
  new URL("../../uploads/courses/", import.meta.url)
);

const allowedTypes = {
  ".pdf": ["application/pdf"],
  ".doc": ["application/msword"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ".odt": ["application/vnd.oasis.opendocument.text"],
  ".txt": ["text/plain"],
  ".ppt": ["application/vnd.ms-powerpoint"],
  ".pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  ".xls": ["application/vnd.ms-excel"],
  ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ".csv": ["text/csv", "application/csv", "text/plain"],
  ".png": ["image/png"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".gif": ["image/gif"],
  ".webp": ["image/webp"],
  ".mp4": ["video/mp4"],
  ".webm": ["video/webm"],
  ".mov": ["video/quicktime"],
  ".mp3": ["audio/mpeg"],
  ".wav": ["audio/wav", "audio/x-wav"],
  ".ogg": ["audio/ogg", "application/ogg"],
  ".zip": ["application/zip", "application/x-zip-compressed"]
};

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

function fileFilter(req, file, callback) {
  const extension = path.extname(file.originalname).toLowerCase();
  const acceptedMimeTypes = allowedTypes[extension];

  if (!acceptedMimeTypes) {
    return callback(
      new Error("Ce format de fichier n'est pas autorisé.")
    );
  }

  if (!acceptedMimeTypes.includes(file.mimetype)) {
    return callback(
      new Error("Le type du fichier ne correspond pas à son extension.")
    );
  }

  callback(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 1
  }
});

export function uploadCourseFile(req, res, next) {
  upload.single("file")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Le fichier dépasse la limite de 100 Mo."
          : "Impossible de recevoir ce fichier.";

      return res.status(400).json({
        success: false,
        message
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Fichier refusé."
    });
  });
}
