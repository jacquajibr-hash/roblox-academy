
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dataDirectory = fileURLToPath(
  new URL("../../data/", import.meta.url)
);

const usersFile = path.join(dataDirectory, "users.json");

async function readUsers() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    const content = await readFile(usersFile, "utf8");
    const users = JSON.parse(content);

    if (!Array.isArray(users)) {
      throw new Error("Le fichier users.json doit contenir un tableau.");
    }

    return users;
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(usersFile, "[]", "utf8");
      return [];
    }

    throw error;
  }
}

async function saveUsers(users) {
  await writeFile(usersFile, JSON.stringify(users, null, 2), "utf8");
}

export async function findUserByUsername(username) {
  const users = await readUsers();

  return users.find(
    (user) =>
      user.username.toLowerCase() === username.trim().toLowerCase()
  );
}

export async function findUserById(id) {
  const users = await readUsers();
  return users.find((user) => user.id === id);
}

export async function listUsers() {
  return readUsers();
}

export async function createUser(user) {
  const users = await readUsers();

  const exists = users.some(
    (item) =>
      item.username.toLowerCase() === user.username.toLowerCase()
  );

  if (exists) {
    throw new Error("Cet identifiant existe déjà.");
  }

  users.push(user);
  await saveUsers(users);

  return user;
}

export async function updateUser(id, changes) {
  const users = await readUsers();
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return null;
  }

  users[index] = {
    ...users[index],
    ...changes
  };

  await saveUsers(users);
  return users[index];
}
