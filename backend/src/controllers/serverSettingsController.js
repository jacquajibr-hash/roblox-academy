
import { unlink } from "node:fs/promises";

import {
  getServerSettings,
  saveServerSettings
} from "../utils/serverSettings.js";

export async function getSettings(req, res) {
  try {
    const settings = await getServerSettings();

    return res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    console.error("Erreur lecture paramètres serveur :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de récupérer les paramètres du serveur."
    });
  }
}

export async function updateSettings(req, res) {
  try {
    const settings = await saveServerSettings(req.body);

    return res.status(200).json({
      success: true,
      message: "Les paramètres du serveur ont été enregistrés.",
      settings
    });
  } catch (error) {
    console.error("Erreur modification paramètres serveur :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible d'enregistrer les paramètres du serveur."
    });
  }
}

export async function uploadServerAsset(req, res) {
  try {
    if (!["logo", "icon"].includes(req.params.type)) {
      if (req.file?.path) {
        await unlink(req.file.path).catch(() => {});
      }

      return res.status(400).json({
        success: false,
        message: "Type d'image invalide."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Aucune image reçue."
      });
    }

    return res.status(201).json({
      success: true,
      message: "Image importée avec succès.",
      url: `/api/server-settings/assets/${req.file.filename}`
    });
  } catch (error) {
    console.error("Erreur importation image serveur :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible d'importer cette image."
    });
  }
}
