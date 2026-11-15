
import {
  createBackup,
  listBackups,
  restoreBackup
} from "../utils/backups.js";

export async function getBackups(req, res) {
  try {
    const backups = await listBackups();

    return res.json({
      success: true,
      backups
    });
  } catch (error) {
    console.error("Erreur liste sauvegardes :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de récupérer les sauvegardes."
    });
  }
}

export async function createManualBackup(req, res) {
  try {
    const backup = await createBackup("Sauvegarde manuelle");

    return res.status(201).json({
      success: true,
      message: "Sauvegarde créée avec succès.",
      backup
    });
  } catch (error) {
    console.error("Erreur création sauvegarde :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de créer la sauvegarde."
    });
  }
}

export async function restoreExistingBackup(req, res) {
  try {
    const { id } = req.params;

    await restoreBackup(id);

    return res.json({
      success: true,
      message: "Sauvegarde restaurée avec succès."
    });
  } catch (error) {
    console.error("Erreur restauration sauvegarde :", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Impossible de restaurer cette sauvegarde."
    });
  }
}
