
import { randomUUID } from "node:crypto";

import {
  listAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from "../utils/assignments.js";

import {
  findUserById
} from "../utils/users.js";

const staffRoles = ["fondateur", "administrateur", "professeur"];
const assignmentTypes = ["normal", "supplementaire", "punition"];

export async function getAssignments(req, res) {
  try {
    const assignments = await listAssignments();

    if (req.session.role === "eleve") {
      const visibleAssignments = assignments.filter(
        (item) =>
          item.targetStudentId === null ||
          item.targetStudentId === req.session.userId
      );

      return res.json({
        success: true,
        assignments: visibleAssignments
      });
    }

    if (!staffRoles.includes(req.session.role)) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé."
      });
    }

    res.json({
      success: true,
      assignments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les travaux."
    });
  }
}

export async function createNewAssignment(req, res) {
  try {
    const {
      title,
      description,
      subject,
      dueDate,
      targetStudentId,
      type
    } = req.body;

    if (
      typeof title !== "string" ||
      title.trim().length < 3 ||
      title.trim().length > 120
    ) {
      return res.status(400).json({
        success: false,
        message: "Le titre doit contenir entre 3 et 120 caractères."
      });
    }

    if (
      typeof description !== "string" ||
      description.trim().length < 3 ||
      description.trim().length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "La description doit contenir entre 3 et 5000 caractères."
      });
    }

    if (
      typeof subject !== "string" ||
      subject.trim().length < 2 ||
      subject.trim().length > 80
    ) {
      return res.status(400).json({
        success: false,
        message: "La matière est invalide."
      });
    }

    if (!assignmentTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Le type de travail est invalide."
      });
    }

    if (
      dueDate !== null &&
      dueDate !== undefined &&
      (typeof dueDate !== "string" || Number.isNaN(Date.parse(dueDate)))
    ) {
      return res.status(400).json({
        success: false,
        message: "La date limite est invalide."
      });
    }

    let selectedStudentId = null;

    if (targetStudentId !== null && targetStudentId !== undefined && targetStudentId !== "") {
      const student = await findUserById(targetStudentId);

      if (!student || student.role !== "eleve" || student.disabled) {
        return res.status(400).json({
          success: false,
          message: "L'élève sélectionné est introuvable ou indisponible."
        });
      }

      selectedStudentId = student.id;
    }

    const assignment = {
      id: randomUUID(),
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      dueDate: dueDate || null,
      targetStudentId: selectedStudentId,
      type,
      createdBy: req.session.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await createAssignment(assignment);

    res.status(201).json({
      success: true,
      message: "Travail créé avec succès.",
      assignment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Impossible de créer le travail."
    });
  }
}

export async function editAssignment(req, res) {
  try {
    const { id } = req.params;
    const assignments = await listAssignments();
    const existing = assignments.find((item) => item.id === id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Travail introuvable."
      });
    }

    const {
      title,
      description,
      subject,
      dueDate,
      targetStudentId,
      type
    } = req.body;

    const changes = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 120) {
        return res.status(400).json({
          success: false,
          message: "Titre invalide."
        });
      }
      changes.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || description.trim().length < 3 || description.trim().length > 5000) {
        return res.status(400).json({
          success: false,
          message: "Description invalide."
        });
      }
      changes.description = description.trim();
    }

    if (subject !== undefined) {
      if (typeof subject !== "string" || subject.trim().length < 2 || subject.trim().length > 80) {
        return res.status(400).json({
          success: false,
          message: "Matière invalide."
        });
      }
      changes.subject = subject.trim();
    }

    if (dueDate !== undefined) {
      if (dueDate !== null && (typeof dueDate !== "string" || Number.isNaN(Date.parse(dueDate)))) {
        return res.status(400).json({
          success: false,
          message: "Date limite invalide."
        });
      }
      changes.dueDate = dueDate;
    }

    if (type !== undefined) {
      if (!assignmentTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Type de travail invalide."
        });
      }
      changes.type = type;
    }

    if (targetStudentId !== undefined) {
      if (targetStudentId === null || targetStudentId === "") {
        changes.targetStudentId = null;
      } else {
        const student = await findUserById(targetStudentId);

        if (!student || student.role !== "eleve" || student.disabled) {
          return res.status(400).json({
            success: false,
            message: "Élève introuvable ou indisponible."
          });
        }

        changes.targetStudentId = student.id;
      }
    }

    changes.updatedAt = new Date().toISOString();

    const updated = await updateAssignment(id, changes);

    res.json({
      success: true,
      message: "Travail modifié.",
      assignment: updated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Impossible de modifier le travail."
    });
  }
}

export async function removeAssignment(req, res) {
  try {
    const deleted = await deleteAssignment(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Travail introuvable."
      });
    }

    res.json({
      success: true,
      message: "Travail supprimé."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Impossible de supprimer le travail."
    });
  }
}
