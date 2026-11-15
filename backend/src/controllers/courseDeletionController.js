import { unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  findCourseById,
  updateCourse,
  deleteCourse as removeCourseFromData
} from "../utils/courses.js";

const uploadsDirectory = fileURLToPath(
  new URL("../../uploads/courses/", import.meta.url)
);

function getSafeStoredFilePath(filename) {
  if (typeof filename !== "string" || path.basename(filename) !== filename) {
    throw new Error("Nom de fichier stocké invalide.");
  }

  // Les noms sont générés avec randomUUID() lors de l'envoi des fichiers.
  if (!/^[a-f0-9-]{36}\.[a-z0-9]{1,10}$/i.test(filename)) {
    throw new Error("Nom de fichier stocké invalide.");
  }

  return path.join(uploadsDirectory, filename);
}

async function removeStoredFile(filename) {
  if (!filename) return;

  const filePath = getSafeStoredFilePath(filename);

  try {
    await unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

export async function deleteCourseFile(req, res) {
  try {
    const { id, fileId } = req.params;
    const course = await findCourseById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Cours introuvable."
      });
    }

    const files = Array.isArray(course.files) ? course.files : [];
    const file = files.find((item) => item.id === fileId);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Fichier introuvable dans ce cours."
      });
    }

    await removeStoredFile(file.filename);

    const updatedCourse = await updateCourse(id, {
      files: files.filter((item) => item.id !== fileId)
    });

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Le cours n'existe plus."
      });
    }

    return res.json({
      success: true,
      message: "Fichier supprimé.",
      course: updatedCourse
    });
  } catch (error) {
    console.error("Erreur suppression fichier de cours :", error);
    return res.status(500).json({
      success: false,
      message: "Une erreur est survenue pendant la suppression du fichier."
    });
  }
}

export async function deleteCourse(req, res) {
  try {
    const course = await findCourseById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Cours introuvable."
      });
    }

    const files = Array.isArray(course.files) ? course.files : [];

    // Supprime d'abord les fichiers physiques. Si une suppression échoue,
    // le cours reste dans courses.json afin de ne pas perdre ses références.
    for (const file of files) {
      await removeStoredFile(file.filename);
    }

    const deletedCourse = await removeCourseFromData(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Le cours n'existe plus."
      });
    }

    return res.json({
      success: true,
      message: "Cours et fichiers associés supprimés."
    });
  } catch (error) {
    console.error("Erreur suppression cours :", error);
    return res.status(500).json({
      success: false,
      message: "Une erreur est survenue pendant la suppression du cours ou de ses fichiers."
    });
  }
}
