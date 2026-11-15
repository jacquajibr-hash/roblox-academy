
import bcrypt from "bcryptjs";
import { randomUUID, timingSafeEqual } from "node:crypto";

import {
  findUserByUsername,
  createUser,
  updateUser
} from "../utils/users.js";

export async function recoverFounder(req, res) {
  try {
    const expectedKey = process.env.FOUNDER_RECOVERY_KEY;
    const providedKey = req.get("x-founder-recovery-key");

    if (!expectedKey || !providedKey) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé."
      });
    }

    const expectedBuffer = Buffer.from(expectedKey);
    const providedBuffer = Buffer.from(providedKey);

    if (
      expectedBuffer.length !== providedBuffer.length ||
      !timingSafeEqual(expectedBuffer, providedBuffer)
    ) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé."
      });
    }

    const { password } = req.body;

    if (typeof password !== "string" || password.length < 12) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 12 caractères."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const existingUser = await findUserByUsername("Lstio");

    if (existingUser) {
      if (existingUser.role !== "fondateur") {
        return res.status(409).json({
          success: false,
          message: "Le compte existe avec un rôle inattendu."
        });
      }

      await updateUser(existingUser.id, { passwordHash });
    } else {
      await createUser({
        id: randomUUID(),
        username: "Lstio",
        passwordHash,
        role: "fondateur",
        disabled: false,
        createdAt: new Date().toISOString(),
        avatarUrl: null
      });
    }

    return res.json({
      success: true,
      message: "Récupération du compte Fondateur effectuée."
    });
  } catch (error) {
    console.error("Erreur récupération Fondateur :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de récupérer le compte Fondateur."
    });
  }
}
