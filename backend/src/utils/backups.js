
import {
  cp,
  mkdir,
  readdir,
  rm,
  stat,
  writeFile,
  readFile
} from "node:fs/promises";

import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const backendDirectory = fileURLToPath(
  new URL("../../", import.meta.url)
);

const dataDirectory = path.join(backendDirectory, "data");
const uploadsDirectory = path.join(backendDirectory, "uploads");
const backupsDirectory = path.join(backendDirectory, "backups");

const RETENTION_COUNT = 14;

export async function createBackup(reason = "manual") {
  await mkdir(backupsDirectory, { recursive: true });

  const id =
    `${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID().slice(0, 8)}`;

  const destination = path.join(backupsDirectory, id);

  await mkdir(destination, { recursive: true });

  try {
    await cp(
      dataDirectory,
      path.join(destination, "data"),
      { recursive: true, force: true }
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;

    await mkdir(
      path.join(destination, "data"),
      { recursive: true }
    );
  }

  try {
    await cp(
      uploadsDirectory,
      path.join(destination, "uploads"),
      { recursive: true, force: true }
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;

    await mkdir(
      path.join(destination, "uploads"),
      { recursive: true }
    );
  }

  const metadata = {
    id,
    reason,
    createdAt: new Date().toISOString()
  };

  await writeFile(
    path.join(destination, "backup.json"),
    JSON.stringify(metadata, null, 2),
    "utf8"
  );

  await pruneBackups();

  return metadata;
}

export async function listBackups() {
  await mkdir(backupsDirectory, { recursive: true });

  const entries = await readdir(
    backupsDirectory,
    { withFileTypes: true }
  );

  const backups = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    try {
      const metadataPath = path.join(
        backupsDirectory,
        entry.name,
        "backup.json"
      );

      const metadata = JSON.parse(
        await readFile(metadataPath, "utf8")
      );

      const info = await stat(
        path.join(backupsDirectory, entry.name)
      );

      backups.push({
        ...metadata,
        size: info.size
      });

    } catch {
      // Ignore les dossiers de sauvegarde incomplets.
    }
  }

  return backups.sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );
}

async function pruneBackups() {
  const backups = await listBackups();

  for (const backup of backups.slice(RETENTION_COUNT)) {
    await rm(
      path.join(backupsDirectory, backup.id),
      {
        recursive: true,
        force: true
      }
    );
  }
}

export async function restoreBackup(id) {
  if (
    typeof id !== "string" ||
    !/^[\wT-]+$/.test(id)
  ) {
    throw new Error("Identifiant de sauvegarde invalide.");
  }

  const source = path.join(backupsDirectory, id);

  const metadata = JSON.parse(
    await readFile(
      path.join(source, "backup.json"),
      "utf8"
    )
  );

  if (metadata.id !== id) {
    throw new Error("Sauvegarde invalide.");
  }

  const restoreSource = path.join(
    backupsDirectory,
    `.restore-${randomUUID()}`
  );

  await cp(source, restoreSource, { recursive: true });

  try {
    await createBackup("before-restore");

    await rm(dataDirectory, {
      recursive: true,
      force: true
    });

    await mkdir(
      path.dirname(dataDirectory),
      { recursive: true }
    );

    await cp(
      path.join(restoreSource, "data"),
      dataDirectory,
      { recursive: true }
    );

    await rm(uploadsDirectory, {
      recursive: true,
      force: true
    });

    await cp(
      path.join(restoreSource, "uploads"),
      uploadsDirectory,
      { recursive: true }
    );

  } finally {
    await rm(restoreSource, {
      recursive: true,
      force: true
    });
  }

  return metadata;
}

export function startAutomaticBackups() {
  const DAY = 24 * 60 * 60 * 1000;

  const run = async () => {
    try {
      await createBackup("automatic");
    } catch (error) {
      console.error(
        "Échec de la sauvegarde automatique :",
        error
      );
    }
  };

  run();

  const timer = setInterval(run, DAY);

  timer.unref?.();
}
