
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dataDirectory = fileURLToPath(
  new URL("../../data/", import.meta.url)
);

const settingsFile = path.join(dataDirectory, "server-settings.json");

export const defaultServerSettings = {
  siteName: "Roblox Academy",
  shortName: "RA",
  description: "La plateforme scolaire de Roblox Academy.",
  headerName: "Roblox Academy",
  logoUrl: "",
  iconUrl: "",
  theme: "dark",

  colors: {
    primary: "#7662d8",
    secondary: "#25213f",
    accent: "#a78bfa",
    background: "#0b1020"
  },

  home: {
    title: "Bienvenue sur Roblox Academy",
    subtitle: "Apprends, progresse et retrouve tes cours au même endroit.",
    welcomeMessage: "Connecte-toi pour accéder à ton espace personnel."
  },

  dashboard: {
    welcomeTitle: "Bienvenue",
    welcomeText: "Voici un aperçu de ton établissement Roblox Academy.",
    overviewTitle: "Vue d’ensemble",
    quickTitle: "Accès rapides"
  },

  updatedAt: null
};

const allowedColorKeys = [
  "primary",
  "secondary",
  "accent",
  "background"
];

function cleanText(value, fallback, maxLength) {
  if (typeof value !== "string") return fallback;
  return value.trim().slice(0, maxLength);
}

function cleanImageUrl(value, fallback) {
  if (typeof value !== "string") return fallback;

  const trimmed = value.trim();

  if (!trimmed) return "";

  if (
    trimmed.startsWith("/api/server-settings/assets/") &&
    !trimmed.includes("..") &&
    !trimmed.includes("\\")
  ) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      return fallback;
    }

    return url.toString();
  } catch {
    return fallback;
  }
}

function cleanColor(value, fallback) {
  if (typeof value !== "string") return fallback;

  const color = value.trim();

  return /^#[0-9a-fA-F]{6}$/.test(color)
    ? color
    : fallback;
}

export function sanitizeServerSettings(
  input = {},
  current = defaultServerSettings
) {
  const source =
    input && typeof input === "object" && !Array.isArray(input)
      ? input
      : {};

  const colorsInput =
    source.colors && typeof source.colors === "object"
      ? source.colors
      : {};

  const homeInput =
    source.home && typeof source.home === "object"
      ? source.home
      : {};

  const dashboardInput =
    source.dashboard && typeof source.dashboard === "object"
      ? source.dashboard
      : {};

  const currentColors = current.colors || defaultServerSettings.colors;
  const currentHome = current.home || defaultServerSettings.home;
  const currentDashboard =
    current.dashboard || defaultServerSettings.dashboard;

  const settings = {
    siteName: cleanText(
      source.siteName,
      current.siteName,
      60
    ),

    shortName: cleanText(
      source.shortName,
      current.shortName,
      5
    ),

    description: cleanText(
      source.description,
      current.description,
      240
    ),

    headerName: cleanText(
      source.headerName,
      current.headerName,
      60
    ),

    logoUrl: cleanImageUrl(
      source.logoUrl,
      current.logoUrl
    ),

    iconUrl: cleanImageUrl(
      source.iconUrl,
      current.iconUrl
    ),

    theme:
      source.theme === "light" || source.theme === "dark"
        ? source.theme
        : current.theme,

    colors: {},

    home: {
      title: cleanText(
        homeInput.title,
        currentHome.title,
        100
      ),

      subtitle: cleanText(
        homeInput.subtitle,
        currentHome.subtitle,
        180
      ),

      welcomeMessage: cleanText(
        homeInput.welcomeMessage,
        currentHome.welcomeMessage,
        240
      )
    },

    dashboard: {
      welcomeTitle: cleanText(
        dashboardInput.welcomeTitle,
        currentDashboard.welcomeTitle,
        100
      ),

      welcomeText: cleanText(
        dashboardInput.welcomeText,
        currentDashboard.welcomeText,
        300
      ),

      overviewTitle: cleanText(
        dashboardInput.overviewTitle,
        currentDashboard.overviewTitle,
        100
      ),

      quickTitle: cleanText(
        dashboardInput.quickTitle,
        currentDashboard.quickTitle,
        100
      )
    },

    updatedAt:
      typeof source.updatedAt === "string"
        ? source.updatedAt
        : current.updatedAt ?? null
  };

  for (const key of allowedColorKeys) {
    settings.colors[key] = cleanColor(
      colorsInput[key],
      currentColors[key]
    );
  }

  if (!settings.siteName) {
    settings.siteName = current.siteName;
  }

  if (!settings.shortName) {
    settings.shortName = current.shortName;
  }

  if (!settings.headerName) {
    settings.headerName = current.headerName;
  }

  return settings;
}

export async function getServerSettings() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    const content = await readFile(settingsFile, "utf8");
    const saved = JSON.parse(content);

    return sanitizeServerSettings(
      saved,
      defaultServerSettings
    );
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    await writeFile(
      settingsFile,
      JSON.stringify(defaultServerSettings, null, 2),
      "utf8"
    );

    return { ...defaultServerSettings };
  }
}

export async function saveServerSettings(input) {
  const current = await getServerSettings();

  const sanitized = sanitizeServerSettings(
    input,
    current
  );

  sanitized.updatedAt = new Date().toISOString();

  await writeFile(
    settingsFile,
    JSON.stringify(sanitized, null, 2),
    "utf8"
  );

  return sanitized;
}
