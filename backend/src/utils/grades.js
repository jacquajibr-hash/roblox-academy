
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dataDirectory = fileURLToPath(
  new URL("../../data/", import.meta.url)
);

const gradesFile = path.join(dataDirectory, "grades.json");

async function readGrades() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    const content = await readFile(gradesFile, "utf8");
    const grades = JSON.parse(content);

    if (!Array.isArray(grades)) {
      throw new Error("grades.json doit contenir un tableau.");
    }

    return grades;
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(gradesFile, "[]", "utf8");
      return [];
    }

    throw error;
  }
}

async function saveGrades(grades) {
  await writeFile(
    gradesFile,
    JSON.stringify(grades, null, 2),
    "utf8"
  );
}

export async function listGradeAssessments() {
  return readGrades();
}

export async function createGradeAssessment(assessment) {
  const grades = await readGrades();

  grades.push(assessment);

  await saveGrades(grades);

  return assessment;
}

export async function updateGradeAssessment(id, changes) {
  const grades = await readGrades();
  const index = grades.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  grades[index] = {
    ...grades[index],
    ...changes,
    updatedAt: new Date().toISOString()
  };

  await saveGrades(grades);

  return grades[index];
}

export async function deleteGradeAssessment(id) {
  const grades = await readGrades();
  const index = grades.findIndex((item) => item.id === id);

  if (index === -1) {
    return false;
  }

  grades.splice(index, 1);

  await saveGrades(grades);

  return true;
}
