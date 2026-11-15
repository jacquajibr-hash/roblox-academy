
import { randomUUID } from "node:crypto";
import { open, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  listCourses,
  createCourse,
  updateCourse
} from "../utils/courses.js";

const editableRoles = [
  "fondateur",
  "administrateur",
  "professeur"
];

const uploadsDirectory = fileURLToPath(
  new URL("../../uploads/courses/", import.meta.url)
);

function validateCourse(data) {
  if (
    !data ||
    typeof data.title !== "string" ||
    data.title.trim().length < 3 ||
    data.title.trim().length > 100
  ) {
    return "Le titre doit contenir entre 3 et 100 caractères.";
  }

  if (
    typeof data.description !== "string" ||
    data.description.trim().length < 5 ||
    data.description.length > 1000
  ) {
    return "La description doit contenir entre 5 et 1000 caractères.";
  }

  if (
    typeof data.category !== "string" ||
    !data.category.trim() ||
    data.category.length > 60
  ) {
    return "La catégorie est obligatoire.";
  }

  if (
    typeof data.level !== "string" ||
    !data.level.trim() ||
    data.level.length > 60
  ) {
    return "Le niveau est obligatoire.";
  }

  if (!Array.isArray(data.chapters) || data.chapters.length > 50) {
    return "La liste des chapitres est invalide.";
  }

  for (const chapter of data.chapters) {
    if (
      !chapter ||
      typeof chapter.title !== "string" ||
      !chapter.title.trim() ||
      chapter.title.length > 120 ||
      typeof chapter.content !== "string" ||
      chapter.content.length > 20000
    ) {
      return "Un chapitre contient des informations invalides.";
    }
  }

  return null;
}

export async function getCourses(req, res) {
  try {
    let courses = await listCourses();

    if (!editableRoles.includes(req.session.role)) {
      courses = courses.filter(
        (course) => course.status === "published"
      );
    }

    courses.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    res.json({ success: true, courses });
  } catch (error) {
    console.error("Erreur de lecture des cours :", error);

    res.status(500).json({
      success: false,
      message: "Impossible de charger les cours."
    });
  }
}

export async function createNewCourse(req, res) {
  try {
    const errorMessage = validateCourse(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    const course = {
      id: randomUUID(),
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      category: req.body.category.trim(),
      level: req.body.level.trim(),
      chapters: req.body.chapters.map((chapter) => ({
        id: randomUUID(),
        title: chapter.title.trim(),
        content: chapter.content
      })),
      files: [],
      status: "draft",
      createdBy: req.session.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await createCourse(course);

    res.status(201).json({
      success: true,
      message: "Cours créé en brouillon.",
      course
    });
  } catch (error) {
    console.error("Erreur de création :", error);

    res.status(500).json({
      success: false,
      message: "Impossible de créer le cours."
    });
  }
}

export async function editCourse(req, res) {
  try {
    const errorMessage = validateCourse(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    const updated = await updateCourse(req.params.id, {
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      category: req.body.category.trim(),
      level: req.body.level.trim(),
      chapters: req.body.chapters.map((chapter) => ({
        id: typeof chapter.id === "string" ? chapter.id : randomUUID(),
        title: chapter.title.trim(),
        content: chapter.content
      }))
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Cours introuvable."
      });
    }

    res.json({
      success: true,
      message: "Cours modifié.",
      course: updated
    });
  } catch (error) {
    console.error("Erreur de modification :", error);

    res.status(500).json({
      success: false,
      message: "Impossible de modifier le cours."
    });
  }
}

export async function changeCourseStatus(req, res) {
  try {
    const { status } = req.body;

    if (!["draft", "published", "archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Statut invalide."
      });
    }

    const updated = await updateCourse(req.params.id, { status });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Cours introuvable."
      });
    }

    res.json({
      success: true,
      message: "Statut du cours modifié.",
      course: updated
    });
  } catch (error) {
    console.error("Erreur de statut :", error);

    res.status(500).json({
      success: false,
      message: "Impossible de modifier le statut."
    });
  }
}

async function checkFileSignature(filePath, extension) {
  const handle = await open(filePath, "r");

  try {
    const buffer = Buffer.alloc(16);
    const { bytesRead } = await handle.read(buffer, 0, 16, 0);
    const header = buffer.subarray(0, bytesRead);

    if (extension === ".pdf") {
      return header.subarray(0, 5).toString() === "%PDF-";
    }

    if (extension === ".png") {
      return header.subarray(0, 8).equals(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
      );
    }

    if ([".jpg", ".jpeg"].includes(extension)) {
      return header[0] === 0xff &&
        header[1] === 0xd8 &&
        header[2] === 0xff;
    }

    if (extension === ".gif") {
      return ["GIF87a", "GIF89a"].includes(
        header.subarray(0, 6).toString()
      );
    }

    if (extension === ".webp") {
      return (
        header.subarray(0, 4).toString() === "RIFF" &&
        header.subarray(8, 12).toString() === "WEBP"
      );
    }

    if ([".mp4", ".mov"].includes(extension)) {
      return header.subarray(4, 8).toString() === "ftyp";
    }

    if (extension === ".webm") {
      return header.subarray(0, 4).equals(
        Buffer.from([0x1a, 0x45, 0xdf, 0xa3])
      );
    }

    if (extension === ".mp3") {
      return (
        header.subarray(0, 3).toString() === "ID3" ||
        (header[0] === 0xff && (header[1] & 0xe0) === 0xe0)
      );
    }

    if (extension === ".wav") {
      return (
        header.subarray(0, 4).toString() === "RIFF" &&
        header.subarray(8, 12).toString() === "WAVE"
      );
    }

    if (extension === ".ogg") {
      return header.subarray(0, 4).toString() === "OggS";
    }

    if (extension === ".zip" ||
        [".docx", ".pptx", ".xlsx", ".odt"].includes(extension)) {
      return header[0] === 0x50 &&
        header[1] === 0x4b;
    }

    // Les formats texte et certains anciens formats Office
    // ne possèdent pas de signature simple à vérifier ici.
    return true;
  } finally {
    await handle.close();
  }
}

export async function addCourseFile(req, res) {
  let uploadedPath;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Sélectionne un fichier."
      });
    }

    uploadedPath = req.file.path;

    const courses = await listCourses();
    const course = courses.find(
      (item) => item.id === req.params.id
    );

    if (!course) {
      await unlink(uploadedPath);

      return res.status(404).json({
        success: false,
        message: "Cours introuvable."
      });
    }

    const files = Array.isArray(course.files) ? course.files : [];

    if (files.length >= 20) {
      await unlink(uploadedPath);

      return res.status(400).json({
        success: false,
        message: "Un cours ne peut pas contenir plus de 20 fichiers."
      });
    }

    const extension = path.extname(req.file.originalname).toLowerCase();
    const validSignature = await checkFileSignature(
      uploadedPath,
      extension
    );

    if (!validSignature) {
      await unlink(uploadedPath);

      return res.status(400).json({
        success: false,
        message: "Le contenu du fichier ne correspond pas à son format."
      });
    }

    const originalName = path
      .basename(req.file.originalname)
      .replace(/[^\w.\- ()]/g, "_")
      .slice(0, 120);

    const file = {
      id: randomUUID(),
      filename: req.file.filename,
      originalName,
      extension,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.session.userId,
      uploadedAt: new Date().toISOString()
    };

    const updated = await updateCourse(req.params.id, {
      files: [...files, file]
    });

    if (!updated) {
      await unlink(uploadedPath);

      return res.status(404).json({
        success: false,
        message: "Cours introuvable."
      });
    }

    res.status(201).json({
      success: true,
      message: "Fichier ajouté au cours.",
      file
    });
  } catch (error) {
    if (uploadedPath) {
      await unlink(uploadedPath).catch(() => {});
    }

    console.error("Erreur d'ajout du fichier :", error);

    res.status(500).json({
      success: false,
      message: "Impossible d'ajouter le fichier."
    });
  }
}

export async function openCourseFile(req, res) {
  try {
    const courses = await listCourses();

    const course = courses.find(
      (item) =>
        Array.isArray(item.files) &&
        item.files.some((file) => file.id === req.params.fileId)
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Fichier introuvable."
      });
    }

    if (
      !editableRoles.includes(req.session.role) &&
      course.status !== "published"
    ) {
      return res.status(404).json({
        success: false,
        message: "Fichier introuvable."
      });
    }

    const file = course.files.find(
      (item) => item.id === req.params.fileId
    );

    if (!/^[\w-]+\.[a-z0-9]+$/i.test(file.filename)) {
      return res.status(400).json({
        success: false,
        message: "Nom de fichier invalide."
      });
    }

    const filePath = path.join(uploadsDirectory, file.filename);

    res.setHeader("X-Content-Type-Options", "nosniff");

    const inlineTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "audio/mpeg",
      "audio/wav",
      "audio/x-wav",
      "audio/ogg",
      "application/ogg"
    ];

    if (inlineTypes.includes(file.mimeType)) {
      res.type(file.mimeType);
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${file.originalName.replace(/["\\]/g, "_")}"`
      );

      return res.sendFile(filePath, (error) => {
        if (error && !res.headersSent) {
          res.status(404).json({
            success: false,
            message: "Fichier introuvable sur le serveur."
          });
        }
      });
    }

    return res.download(filePath, file.originalName, (error) => {
      if (error && !res.headersSent) {
        res.status(404).json({
          success: false,
          message: "Fichier introuvable sur le serveur."
        });
      }
    });
  } catch (error) {
    console.error("Erreur d'ouverture du fichier :", error);

    res.status(500).json({
      success: false,
      message: "Impossible d'ouvrir le fichier."
    });
  }
}
