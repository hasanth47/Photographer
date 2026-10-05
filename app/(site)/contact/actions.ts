"use server";

import { randomUUID } from "node:crypto";
import { getMessages, saveMessages } from "@/lib/content";

export type ContactState = {
  ok: boolean;
  error?: string;
};

const MAX_MESSAGES = 500;

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in your name, email address and a message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "That email address does not look right." };
  }
  if (message.length > 5000) {
    return { ok: false, error: "Message is too long (max 5000 characters)." };
  }

  const messages = await getMessages();
  messages.unshift({
    id: randomUUID(),
    name: name.slice(0, 200),
    email: email.slice(0, 200),
    subject: subject.slice(0, 200),
    message,
    receivedAt: new Date().toISOString(),
  });
  await saveMessages(messages.slice(0, MAX_MESSAGES));

  return { ok: true };
}
