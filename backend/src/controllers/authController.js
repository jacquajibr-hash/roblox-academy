
import bcrypt from "bcryptjs";

import {
  findUserByUsername,
  findUserById
} from "../utils/users.js";

import { addActivity } from "../utils/activity.js";

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Identifiant et mot de passe obligatoires."
      });
    }

    const user = await findUserByUsername(username);

    if (!user || user.disabled) {
      return res.status(401).json({
        success: false,
        message: "Identifiant ou mot de passe incorrect."
      });
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: "Identifiant ou mot de passe incorrect."
      });
    }

    await new Promise((resolve, reject) => {
      req.session.regenerate((error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    req.session.userId = user.id;
    req.session.role = user.role;

    await new Promise((resolve, reject) => {
      req.session.save((error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    try {
      await addActivity({
        userId: user.id,
        username: user.username,
        action: "Connexion",
        details: "Connexion réussie."
      });
    } catch (error) {
      console.error("Erreur journal connexion :", error);
    }

    return res.json({
      success: true,
      message: "Connexion réussie.",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl || null
      }
    });
  } catch (error) {
    console.error("Erreur connexion :", error);

    return res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion."
    });
  }
}

export async function logout(req, res) {
  try {
    const user = await findUserById(req.session.userId);

    if (user) {
      try {
        await addActivity({
          userId: user.id,
          username: user.username,
          action: "Déconnexion",
          details: "Déconnexion du compte."
        });
      } catch (error) {
        console.error("Erreur journal déconnexion :", error);
      }
    }
  } catch (error) {
    console.error("Erreur récupération utilisateur :", error);
  }

  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Impossible de se déconnecter."
      });
    }

    res.clearCookie("ra.sid");

    return res.json({
      success: true,
      message: "Déconnexion réussie."
    });
  });
}

export async function getCurrentUser(req, res) {
  try {
    const user = await findUserById(req.session.userId);

    if (!user || user.disabled) {
      req.session.destroy(() => {});

      return res.status(401).json({
        success: false,
        message: "Session invalide."
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl || null
      }
    });
  } catch (error) {
    console.error("Erreur récupération session :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de vérifier la session."
    });
  }
}
