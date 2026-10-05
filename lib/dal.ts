import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, SESSION_COOKIE } from "./session";

/** Reads and verifies the admin session cookie. Memoised per request. */
export const getSession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return decrypt(token);
});

export async function isAdmin() {
  return (await getSession()) !== null;
}

/** For pages: send non-admins to the login screen. */
export async function requireAdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/** For Server Actions: refuse anything that is not an admin request. */
export async function requireAdminAction() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest();
}

/** Compares against ADMIN_USERNAME / ADMIN_PASSWORD without leaking timing. */
export function verifyCredentials(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUsername || !expectedPassword) return false;

  const usernameOk = timingSafeEqual(sha256(username.trim().toLowerCase()), sha256(expectedUsername));
  const passwordOk = timingSafeEqual(sha256(password), sha256(expectedPassword));
  return usernameOk && passwordOk;
}

export function credentialsConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET);
}
