import express from "express";

import {
  requireAuth,
  requireRole
} from "../middleware/auth.js";

import { uploadCourseFile } from "../middleware/upload.js";

import {
  getCourses,
  createNewCourse,
  editCourse,
  changeCourseStatus,
  addCourseFile,
  openCourseFile
} from "../controllers/coursesController.js";

import {
  deleteCourse,
  deleteCourseFile
} from "../controllers/courseDeletionController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getCourses);
router.get("/files/:fileId", openCourseFile);
router.post("/", requireRole("fondateur", "administrateur", "professeur"), createNewCourse);
router.post("/:id/files", requireRole("fondateur", "administrateur", "professeur"), uploadCourseFile, addCourseFile);
router.delete("/:id/files/:fileId", requireRole("fondateur", "administrateur", "professeur"), deleteCourseFile);
router.delete("/:id", requireRole("fondateur", "administrateur", "professeur"), deleteCourse);
router.put("/:id", requireRole("fondateur", "administrateur", "professeur"), editCourse);
router.patch("/:id/status", requireRole("fondateur", "administrateur", "professeur"), changeCourseStatus);

export default router;
