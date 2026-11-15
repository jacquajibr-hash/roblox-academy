
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

import {
  listUsers,
  findUserByUsername,
  findUserById,
  createUser,
  updateUser
} from "../utils/users.js";

const allowedRoles = ["eleve", "professeur", "administrateur"];

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    disabled: Boolean(user.disabled),
    createdAt: user.createdAt
  };
}

export async function getUsers(req, res) {
  try {
    const users = await listUsers();

    res.json({
      success: true,
      users: users.map(publicUser)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les comptes."
    });
  }
}

export async function createAccount(req, res) {
  try {
    const { username, password, role } = req.body;

    if (
      typeof username !== "string" ||
      !/^[a-zA-Z0-9_-]{3,24}$/.test(username.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Identifiant invalide : 3 à 24 caractères, lettres, chiffres, _ ou -."
      });
    }

    if (typeof password !== "string" || password.length < 12) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 12 caractères."
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Rôle invalide."
      });
    }

    const existingUser = await findUserByUsername(username);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Cet identifiant existe déjà."
      });
    }

    const user = {
      id: randomUUID(),
      username: username.trim(),
      passwordHash: await bcrypt.hash(password, 12),
      role,
      disabled: false,
      createdAt: new Date().toISOString()
    };

    await createUser(user);

    res.status(201).json({
      success: true,
      message: "Compte créé avec succès.",
      user: publicUser(user)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Impossible de créer le compte."
    });
  }
}

export async function editAccount(req, res) {
  try {
    const { id } = req.params;
    const { username, role } = req.body;

    const target = await findUserById(id);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "Compte introuvable."
      });
    }

    if (target.role === "fondateur" || id === req.session.userId) {
      return res.status(403).json({
        success: false,
        message: "Ce compte ne peut pas être modifié depuis cette rubrique."
      });
    }

    const changes = {};

    if (username !== undefined) {
      if (
        typeof username !== "string" ||
        !/^[a-zA-Z0-9_-]{3,24}$/.test(username.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: "Identifiant invalide."
        });
      }

      const existingUser = await findUserByUsername(username);

      if (existingUser && existingUser.id !== id) {
        return res.status(409).json({
          success: false,
          message: "Cet identifiant est déjà utilisé."
        });
      }

      changes.username = username.trim();
    }

    if (role !== undefined) {
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Rôle invalide."
        });
      }

      changes.role = role;
    }

    const updated = await updateUser(id, changes);

    res.json({
      success: true,
      message: "Compte modifié.",
      user: publicUser(updated)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Impossible de modifier le compte."
    });
  }
}

export async function changeAccountPassword(req, res) {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const target = await findUserById(id);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "Compte introuvable."
      });
    }

    if (target.role === "fondateur") {
      return res.status(403).json({
        success: false,
        message: "Le mot de passe du Fondateur ne peut pas être changé ici."
      });
    }

    if (typeof password !== "string" || password.length < 12) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 12 caractères."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await updateUser(id, { passwordHash });

    res.json({
      success: true,
      message: "Mot de passe réinitialisé."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Impossible de réinitialiser le mot de passe."
    });
  }
}

export async function toggleAccount(req, res) {
  try {
    const { id } = req.params;
    const target = await findUserById(id);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "Compte introuvable."
      });
    }

    if (target.role === "fondateur" || id === req.session.userId) {
      return res.status(403).json({
        success: false,
        message: "Impossible de désactiver ce compte."
      });
    }

    const updated = await updateUser(id, {
      disabled: !target.disabled
    });

    res.json({
      success: true,
      message: updated.disabled
        ? "Compte désactivé."
        : "Compte réactivé.",
      user: publicUser(updated)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Impossible de modifier le statut du compte."
    });
  }
}
