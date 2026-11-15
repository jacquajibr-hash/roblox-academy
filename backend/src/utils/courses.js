import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dataDirectory = fileURLToPath(
  new URL("../../data/", import.meta.url)
);

const coursesFile = path.join(dataDirectory, "courses.json");

async function readCourses() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    const content = await readFile(coursesFile, "utf8");
    const courses = JSON.parse(content);

    if (!Array.isArray(courses)) {
      throw new Error("courses.json doit contenir un tableau.");
    }

    return courses;
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(coursesFile, "[]", "utf8");
      return [];
    }

    throw error;
  }
}

async function saveCourses(courses) {
  await writeFile(
    coursesFile,
    JSON.stringify(courses, null, 2),
    "utf8"
  );
}

export async function listCourses() {
  return readCourses();
}

export async function findCourseById(id) {
  const courses = await readCourses();
  return courses.find((course) => course.id === id);
}

export async function createCourse(course) {
  const courses = await readCourses();
  courses.push(course);
  await saveCourses(courses);
  return course;
}

export async function updateCourse(id, changes) {
  const courses = await readCourses();
  const index = courses.findIndex((course) => course.id === id);

  if (index === -1) {
    return null;
  }

  courses[index] = {
    ...courses[index],
    ...changes,
    updatedAt: new Date().toISOString()
  };

  await saveCourses(courses);
  return courses[index];
}

export async function deleteCourse(id) {
  const courses = await readCourses();
  const index = courses.findIndex((course) => course.id === id);

  if (index === -1) {
    return null;
  }

  const [deletedCourse] = courses.splice(index, 1);
  await saveCourses(courses);
  return deletedCourse;
}
