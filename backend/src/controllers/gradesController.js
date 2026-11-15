
import { randomUUID } from "node:crypto";

import { listUsers } from "../utils/users.js";

import {
  listGradeAssessments,
  createGradeAssessment,
  updateGradeAssessment,
  deleteGradeAssessment
} from "../utils/grades.js";

function validateGrades(grades, validStudentIds) {
  if (!Array.isArray(grades)) {
    return {
      valid: false,
      message: "La liste des notes est invalide."
    };
  }

  const seenStudentIds = new Set();
  const cleanGrades = [];

  for (const entry of grades) {
    if (
      !entry ||
      typeof entry.studentId !== "string" ||
      !validStudentIds.has(entry.studentId)
    ) {
      return {
        valid: false,
        message: "Un Ã©lÃ¨ve sÃ©lectionnÃ© est invalide."
      };
    }

    if (seenStudentIds.has(entry.studentId)) {
      return {
        valid: false,
        message: "Un Ã©lÃ¨ve apparaÃ®t plusieurs fois dans les notes."
      };
    }

    seenStudentIds.add(entry.studentId);

    const value = entry.value;

    if (
      value !== null &&
      value !== "" &&
      (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        value < 0 ||
        value > 20
      )
    ) {
      return {
        valid: false,
        message: "Une note doit Ãªtre comprise entre 0 et 20."
      };
    }

    cleanGrades.push({
      studentId: entry.studentId,
      value: value === null || value === "" ? null : value
    });
  }

  return {
    valid: true,
    grades: cleanGrades
  };
}

function validateAssessmentDetails({ title, subject, date, coefficient }) {
  if (
    typeof title !== "string" ||
    title.trim().length < 2 ||
    title.trim().length > 100
  ) {
    return "Titre du devoir invalide.";
  }

  if (
    typeof subject !== "string" ||
    subject.trim().length < 2 ||
    subject.trim().length > 60
  ) {
    return "MatiÃ¨re invalide.";
  }

  if (
    typeof coefficient !== "number" ||
    !Number.isFinite(coefficient) ||
    coefficient <= 0 ||
    coefficient > 20
  ) {
    return "Coefficient invalide.";
  }

  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(Date.parse(`${date}T00:00:00`))
  ) {
    return "Date invalide.";
  }

  return null;
}

export async function getGradebook(req, res) {
  try {
    const assessments = await listGradeAssessments();

    // ESPACE Ã‰LÃˆVE : uniquement les notes publiÃ©es de cet Ã©lÃ¨ve.
    if (req.session.role === "eleve") {
      const studentAssessments = assessments
        .filter((assessment) => assessment.published === true)
        .map((assessment) => {
          const studentGrade = assessment.grades?.find(
            (grade) => grade.studentId === req.session.userId
          );

          if (
            !studentGrade ||
            studentGrade.value === null ||
            studentGrade.value === ""
          ) {
            return null;
          }

          return {
            id: assessment.id,
            title: assessment.title,
            subject: assessment.subject,
            date: assessment.date,
            coefficient: assessment.coefficient,
            publishedAt: assessment.publishedAt,
            value: studentGrade.value
          };
        })
        .filter(Boolean);

      return res.json({
        success: true,
        assessments: studentAssessments
      });
    }

    // ESPACE PROFESSEUR / ADMINISTRATION : tableau complet inchangÃ©.
    const users = await listUsers();

    const students = users
      .filter((user) => user.role === "eleve" && !user.disabled)
      .map((user) => ({
        id: user.id,
        username: user.username
      }));

    res.json({
      success: true,
      students,
      assessments
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Impossible de charger le tableau des notes."
    });
  }
}

export async function createAssessment(req, res) {
  try {
    const { title, subject, date, coefficient, grades } = req.body;
  console.log("DEBUG DEVOIR :", req.body);

    const detailsError = validateAssessmentDetails({
      title,
      subject,
      date,
      coefficient
    });

    if (detailsError) {
      return res.status(400).json({
        success: false,
        message: detailsError
      });
    }

    const users = await listUsers();

    const students = users.filter(
      (user) => user.role === "eleve" && !user.disabled
    );

    const validStudentIds = new Set(
      students.map((student) => student.id)
    );

    const result = validateGrades(grades, validStudentIds);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    const assessment = {
      id: randomUUID(),
      title: title.trim(),
      subject: subject.trim(),
      date,
      coefficient,
      grades: result.grades,
      published: false,
      publishedAt: null,
      createdBy: req.session.userId,
      createdAt: new Date().toISOString()
    };

    await createGradeAssessment(assessment);

    res.status(201).json({
      success: true,
      message: "Devoir crÃ©Ã©. Il est actuellement en brouillon.",
      assessment
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Impossible d'enregistrer les notes."
    });
  }
}

export async function editAssessment(req, res) {
  try {
    const { id } = req.params;
    const { title, subject, date, coefficient, grades } = req.body;
  console.log("DEBUG DEVOIR :", req.body);

    const detailsError = validateAssessmentDetails({
      title,
      subject,
      date,
      coefficient
    });

    if (detailsError) {
      return res.status(400).json({
        success: false,
        message: detailsError
      });
    }

    const users = await listUsers();

    const validStudentIds = new Set(
      users
        .filter((user) => user.role === "eleve" && !user.disabled)
        .map((user) => user.id)
    );

    const result = validateGrades(grades, validStudentIds);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    const updated = await updateGradeAssessment(id, {
      title: title.trim(),
      subject: subject.trim(),
      date,
      coefficient,
      grades: result.grades
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Devoir introuvable."
      });
    }

    res.json({
      success: true,
      message: "Devoir et notes modifiÃ©s.",
      assessment: updated
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Impossible de modifier le devoir."
    });
  }
}

export async function removeAssessment(req, res) {
  try {
    const deleted = await deleteGradeAssessment(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Devoir introuvable."
      });
    }

    res.json({
      success: true,
      message: "Devoir supprimÃ©."
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Impossible de supprimer le devoir."
    });
  }
}

export async function setAssessmentPublication(req, res) {
  try {
    const { published } = req.body;

    if (typeof published !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Le statut de publication est invalide."
      });
    }

    const updated = await updateGradeAssessment(req.params.id, {
      published,
      publishedAt: published ? new Date().toISOString() : null
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Devoir introuvable."
      });
    }

    res.json({
      success: true,
      message: published
        ? "Devoir publiÃ©."
        : "Devoir remis en brouillon.",
      assessment: updated
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Impossible de modifier la publication."
    });
  }
}

