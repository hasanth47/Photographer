"use server";

import { redirect } from "next/navigation";
import { credentialsConfigured, verifyCredentials } from "@/lib/dal";
import { createSession } from "@/lib/session";

export type LoginState = {
  error?: string;
};

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!credentialsConfigured()) {
    return { error: "Admin login is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD and SESSION_SECRET in .env.local." };
  }

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Enter your username and password." };
  }

  if (!verifyCredentials(username, password)) {
    return { error: "Invalid username or password." };
  }

  await createSession(username.trim().toLowerCase());

  const next = String(formData.get("next") ?? "");
  // Only allow redirects back into the admin area, never to external URLs.
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}
