
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dataDirectory = fileURLToPath(
  new URL("../../data/", import.meta.url)
);

const assignmentsFile = path.join(dataDirectory, "assignments.json");

async function readAssignments() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    const content = await readFile(assignmentsFile, "utf8");
    const assignments = JSON.parse(content);

    if (!Array.isArray(assignments)) {
      throw new Error("Le fichier assignments.json doit contenir un tableau.");
    }

    return assignments;
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(assignmentsFile, "[]", "utf8");
      return [];
    }

    throw error;
  }
}

async function saveAssignments(assignments) {
  await writeFile(
    assignmentsFile,
    JSON.stringify(assignments, null, 2),
    "utf8"
  );
}

export async function listAssignments() {
  return readAssignments();
}

export async function createAssignment(assignment) {
  const assignments = await readAssignments();
  assignments.push(assignment);
  await saveAssignments(assignments);
  return assignment;
}

export async function updateAssignment(id, changes) {
  const assignments = await readAssignments();
  const index = assignments.findIndex((item) => item.id === id);

  if (index === -1) return null;

  assignments[index] = {
    ...assignments[index],
    ...changes
  };

  await saveAssignments(assignments);
  return assignments[index];
}

export async function deleteAssignment(id) {
  const assignments = await readAssignments();
  const filtered = assignments.filter((item) => item.id !== id);

  if (filtered.length === assignments.length) {
    return false;
  }

  await saveAssignments(filtered);
  return true;
}
