import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { defaultContent } from "./default-content";
import type { Message, SiteContent } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, value: unknown) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

/**
 * Site content, read once per request. Falls back to the seed content on first run.
 * Always returns a fresh deep copy so that actions mutating the result never touch
 * the module-level defaults in a long-running server process.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  const stored = await readJson<Partial<SiteContent> | null>(CONTENT_FILE, null);
  const defaults = structuredClone(defaultContent);
  if (!stored) return defaults;
  return {
    site: { ...defaults.site, ...stored.site },
    hero: { ...defaults.hero, ...stored.hero },
    about: { ...defaults.about, ...stored.about },
    photos: stored.photos ?? defaults.photos,
  };
});

export async function saveContent(content: SiteContent) {
  await writeJson(CONTENT_FILE, content);
}

export async function getMessages(): Promise<Message[]> {
  return readJson<Message[]>(MESSAGES_FILE, []);
}

export async function saveMessages(messages: Message[]) {
  await writeJson(MESSAGES_FILE, messages);
}
