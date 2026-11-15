
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  findUserById,
  findUserByUsername,
  updateUser
} from "../utils/users.js";

const uploadsDirectory = fileURLToPath(
  new URL("../../uploads/avatars/", import.meta.url)
);

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    avatarUrl: user.avatarUrl || null
  };
}

export async function updateProfile(req, res) {
  try {
    const user = await findUserById(req.session.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable."
      });
    }

    const username = String(req.body.username || "").trim();

    if (!/^[a-zA-Z0-9_-]{3,24}$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: "Le nom doit contenir entre 3 et 24 caractères : lettres, chiffres, _ ou -."
      });
    }

    const existingUser = await findUserByUsername(username);

    if (
      existingUser &&
      String(existingUser.id) !== String(user.id)
    ) {
      return res.status(409).json({
        success: false,
        message: "Ce nom d'utilisateur est déjà utilisé."
      });
    }

    const changes = { username };

    if (req.file) {
      changes.avatarUrl = `/api/profile/avatar/${req.file.filename}`;
    }

    const updatedUser = await updateUser(user.id, changes);

    return res.json({
      success: true,
      message: "Profil mis à jour avec succès.",
      user: publicUser(updatedUser)
    });
  } catch (error) {
    console.error("Erreur modification profil :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de modifier le profil."
    });
  }
}

export async function getAvatar(req, res) {
  try {
    const filename = req.params.filename;

    if (
      typeof filename !== "string" ||
      !/^[a-zA-Z0-9_-]+\.(png|jpe?g|webp)$/i.test(filename)
    ) {
      return res.status(400).json({
        success: false,
        message: "Nom de fichier invalide."
      });
    }

    const filePath = path.join(uploadsDirectory, filename);

    return res.sendFile(filePath, (error) => {
      if (error && !res.headersSent) {
        res.status(404).json({
          success: false,
          message: "Photo introuvable."
        });
      }
    });
  } catch (error) {
    console.error("Erreur récupération avatar :", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Impossible de récupérer la photo."
      });
    }
  }
}
