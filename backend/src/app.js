
import "dotenv/config";
import express from "express";
import session from "express-session";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import backupRoutes from "./routes/backupRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import serverSettingsRoutes from "./routes/serverSettingsRoutes.js";
import founderRecoveryRoutes from "./routes/founderRecoveryRoutes.js";

import { logActivity } from "./middleware/logActivity.js";

const app = express();

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET manquant dans le fichier .env");
}

app.set("trust proxy", 1);

const allowedOrigins = [
  "https://academy-kskv.onrender.com"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Founder-Recovery-Key"
    );
    res.setHeader("Vary", "Origin");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json({ limit: "20kb" }));

app.use(
  session({
    name: "ra.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Roblox Academy fonctionne !"
  });
});

app.use("/api/recovery/founder", founderRecoveryRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/users", logActivity("Gestion des comptes"), userRoutes);
app.use("/api/courses", logActivity("Gestion des cours"), courseRoutes);
app.use("/api/grades", logActivity("Gestion des notes"), gradeRoutes);
app.use("/api/assignments", logActivity("Gestion des devoirs"), assignmentRoutes);
app.use("/api/profile", logActivity("Modification du profil"), profileRoutes);

app.use("/api/activity", activityRoutes);
app.use("/api/backups", logActivity("Gestion des sauvegardes"), backupRoutes);

app.use("/api/server-settings", serverSettingsRoutes);

export default app;
