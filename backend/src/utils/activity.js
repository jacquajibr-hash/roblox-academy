
import {
  appendFile,
  mkdir,
  readFile,
  writeFile
} from "node:fs/promises";

import path from "node:path";
import { fileURLToPath } from "node:url";

const dataDirectory = fileURLToPath(
  new URL("../../data/", import.meta.url)
);

const activityFile = path.join(
  dataDirectory,
  "activity.json"
);

export async function addActivity(entry) {
  await mkdir(dataDirectory, { recursive: true });

  await appendFile(
    activityFile,
    `${JSON.stringify({
      id: entry.id,
      userId: entry.userId || null,
      username: entry.username || "Compte inconnu",
      role: entry.role || null,
      action: entry.action,
      method: entry.method || null,
      path: entry.path || null,
      status: entry.status || null,
      createdAt: new Date().toISOString()
    })}\n`,
    "utf8"
  );
}

export async function listActivity(limit = 200) {
  await mkdir(dataDirectory, { recursive: true });

  try {
    const content = await readFile(activityFile, "utf8");

    return content
      .split(/\r?\n/)
      .filter(Boolean)
      .slice(-limit)
      .reverse()
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(activityFile, "", "utf8");
      return [];
    }

    throw error;
  }
}
