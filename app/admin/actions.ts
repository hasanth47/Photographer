"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getContent, getMessages, saveContent, saveMessages } from "@/lib/content";
import { requireAdminAction } from "@/lib/dal";
import { deleteSession } from "@/lib/session";
import { CATEGORIES, type Category, type Photo } from "@/lib/types";

export type ActionState = {
  ok: boolean;
  message?: string;
};

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function text(formData: FormData, key: string, max = 2000) {
  return String(formData.get(key) ?? "")
    .trim()
    .slice(0, max);
}

function flag(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function category(formData: FormData): Category {
  const value = text(formData, "category");
  return (CATEGORIES as readonly string[]).includes(value) ? (value as Category) : "Portraits";
}

function dimension(formData: FormData, key: string, fallback: number) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) && value > 0 ? Math.round(value) : fallback;
}

function isSafeImageUrl(value: string) {
  if (value.startsWith("/uploads/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "images.unsplash.com";
  } catch {
    return false;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

/* ---------- auth ---------- */

export async function logout() {
  await deleteSession();
  revalidateSite();
  redirect("/");
}

/* ---------- content ---------- */

export async function updateSite(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminAction();
  const content = await getContent();
  const name = text(formData, "name", 80);
  if (!name) return { ok: false, message: "Site name is required." };

  content.site = {
    name,
    email: text(formData, "email", 120),
    location: text(formData, "location", 120),
    instagram: text(formData, "instagram", 80),
    twitter: text(formData, "twitter", 80),
    behance: text(formData, "behance", 80),
    bookingNote: text(formData, "bookingNote", 600),
  };
  await saveContent(content);
  revalidateSite();
  return { ok: true, message: "Site details saved." };
}

export async function updateHero(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminAction();
  const content = await getContent();
  content.hero = {
    eyebrow: text(formData, "eyebrow", 80),
    headline: text(formData, "headline", 120),
    headlineItalic: text(formData, "headlineItalic", 120),
  };
  await saveContent(content);
  revalidateSite();
  return { ok: true, message: "Hero saved." };
}

export async function updateAbout(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminAction();
  const content = await getContent();
  const portrait = text(formData, "portrait", 1000) || content.about.portrait;
  if (!isSafeImageUrl(portrait)) {
    return { ok: false, message: "Portrait must be an /uploads/ path or an images.unsplash.com URL." };
  }
  const paragraphs = text(formData, "paragraphs", 6000)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  content.about = {
    heading: text(formData, "heading", 80) || content.about.heading,
    teaser: text(formData, "teaser", 800),
    paragraphs,
    portrait,
  };
  await saveContent(content);
  revalidateSite();
  return { ok: true, message: "About saved." };
}

/* ---------- photos ---------- */

async function storeUpload(file: File) {
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) throw new Error("Only JPEG, PNG, WebP or AVIF images are allowed.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Image must be smaller than 10 MB.");

  await mkdir(UPLOAD_DIR, { recursive: true });
  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  await writeFile(path.join(UPLOAD_DIR, fileName), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${fileName}`;
}

async function removeUpload(src: string) {
  if (!src.startsWith("/uploads/")) return;
  const fileName = path.basename(src);
  try {
    await unlink(path.join(UPLOAD_DIR, fileName));
  } catch {
    // Already gone; nothing to do.
  }
}

export async function addPhoto(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminAction();
  const title = text(formData, "title", 120);
  if (!title) return { ok: false, message: "Give the photo a title." };

  const file = formData.get("file");
  const url = text(formData, "url", 1000);
  let src: string;

  try {
    if (file instanceof File && file.size > 0) {
      src = await storeUpload(file);
    } else if (url) {
      if (!isSafeImageUrl(url)) {
        return { ok: false, message: "Image URL must be from images.unsplash.com (or upload a file)." };
      }
      src = url;
    } else {
      return { ok: false, message: "Upload a file or paste an image URL." };
    }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Upload failed." };
  }

  const content = await getContent();
  const base = slugify(title) || "photo";
  let id = base;
  let n = 2;
  while (content.photos.some((photo) => photo.id === id)) id = `${base}-${n++}`;

  const photo: Photo = {
    id,
    src,
    title,
    category: category(formData),
    width: dimension(formData, "width", 4),
    height: dimension(formData, "height", 5),
    featured: flag(formData, "featured"),
    hero: flag(formData, "hero"),
  };
  content.photos.push(photo);
  await saveContent(content);
  revalidateSite();
  return { ok: true, message: `"${title}" added to the gallery.` };
}

export async function updatePhoto(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminAction();
  const id = text(formData, "id", 80);
  const content = await getContent();
  const photo = content.photos.find((item) => item.id === id);
  if (!photo) return { ok: false, message: "Photo not found." };

  const title = text(formData, "title", 120);
  if (!title) return { ok: false, message: "Title is required." };

  photo.title = title;
  photo.category = category(formData);
  photo.featured = flag(formData, "featured");
  photo.hero = flag(formData, "hero");
  photo.width = dimension(formData, "width", photo.width);
  photo.height = dimension(formData, "height", photo.height);

  await saveContent(content);
  revalidateSite();
  return { ok: true, message: "Photo saved." };
}

export async function deletePhoto(formData: FormData) {
  await requireAdminAction();
  const id = text(formData, "id", 80);
  const content = await getContent();
  const photo = content.photos.find((item) => item.id === id);
  if (!photo) return;

  content.photos = content.photos.filter((item) => item.id !== id);
  await saveContent(content);
  await removeUpload(photo.src);
  revalidateSite();
}

export async function movePhoto(formData: FormData) {
  await requireAdminAction();
  const id = text(formData, "id", 80);
  const direction = text(formData, "direction", 8) === "up" ? -1 : 1;
  const content = await getContent();
  const index = content.photos.findIndex((item) => item.id === id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= content.photos.length) return;

  [content.photos[index], content.photos[target]] = [content.photos[target], content.photos[index]];
  await saveContent(content);
  revalidateSite();
}

/* ---------- messages ---------- */

export async function deleteMessage(formData: FormData) {
  await requireAdminAction();
  const id = text(formData, "id", 80);
  const messages = await getMessages();
  await saveMessages(messages.filter((message) => message.id !== id));
  revalidatePath("/admin/messages");
}
