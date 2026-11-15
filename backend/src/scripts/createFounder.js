
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { createInterface } from "node:readline";
import { createUser } from "../utils/users.js";

function ask(question) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function askHidden(question) {
  return new Promise((resolve, reject) => {
    const input = process.stdin;
    const output = process.stdout;

    if (!input.isTTY || typeof input.setRawMode !== "function") {
      reject(new Error("Ouvre le script dans un terminal CMD classique."));
      return;
    }

    let password = "";

    output.write(question);
    input.setRawMode(true);
    input.resume();

    function finish() {
      input.setRawMode(false);
      input.removeListener("data", onData);
      output.write("\n");
    }

    function onData(data) {
      const character = data.toString();

      if (character === "\u0003") {
        finish();
        reject(new Error("Création annulée."));
        return;
      }

      if (character === "\r" || character === "\n") {
        finish();
        resolve(password);
        return;
      }

      if (character === "\u007f" || character === "\b") {
        if (password.length > 0) {
          password = password.slice(0, -1);
          output.write("\b \b");
        }
        return;
      }

      if (character.length === 1 && character >= " ") {
        password += character;
        output.write("*");
      }
    }

    input.on("data", onData);
  });
}

async function main() {
  console.log("\n=== Création du compte Fondateur ===\n");

  const username = await ask("Identifiant du Fondateur : ");

  if (!/^[a-zA-Z0-9_-]{3,24}$/.test(username)) {
    throw new Error(
      "Identifiant invalide : 3 à 24 caractères, lettres, chiffres, _ ou -."
    );
  }

  const password = await askHidden("Mot de passe : ");

  if (password.length < 12) {
    throw new Error("Le mot de passe doit contenir au moins 12 caractères.");
  }

  const confirmation = await askHidden("Confirme le mot de passe : ");

  if (password !== confirmation) {
    throw new Error("Les deux mots de passe ne correspondent pas.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const founder = {
    id: randomUUID(),
    username,
    passwordHash,
    role: "fondateur",
    disabled: false,
    createdAt: new Date().toISOString()
  };

  await createUser(founder);

  console.log("\nCompte Fondateur créé avec succès !");
  console.log(`Identifiant : ${username}`);
  console.log("Rôle : fondateur");
  console.log("Mot de passe : enregistré de manière sécurisée.");
}

main().catch((error) => {
  console.error("\nErreur :", error.message);
  process.exitCode = 1;
});
