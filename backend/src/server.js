
import "dotenv/config";
import app from "./app.js";
import { startAutomaticBackups } from "./utils/backups.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Roblox Academy API démarrée sur le port ${PORT}`);

  try {
    startAutomaticBackups();
    console.log("Système de sauvegardes automatiques activé.");
  } catch (error) {
    console.error(
      "Impossible de démarrer les sauvegardes automatiques :",
      error
    );
  }
});

server.on("error", (error) => {
  console.error("Erreur du serveur :", error);
});
