"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/(site)/contact/actions";

const initialState: ContactState = { ok: false };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendMessage, initialState);

  if (state.ok) {
    return (
      <div className="border border-line p-8">
        <p className="label text-accent">Message sent</p>
        <p className="mt-4 text-foreground/80">Thank you. I read every message and usually reply within a few days.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      <div>
        <label htmlFor="name" className="label block text-muted">
          Name
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className="field" />
      </div>
      <div>
        <label htmlFor="email" className="label block text-muted">
          Email address
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="field" />
      </div>
      <div>
        <label htmlFor="subject" className="label block text-muted">
          Subject
        </label>
        <input id="subject" name="subject" type="text" className="field" />
      </div>
      <div>
        <label htmlFor="message" className="label block text-muted">
          Message
        </label>
        <textarea id="message" name="message" required rows={4} className="field resize-y" />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-outline label">
        {pending ? "Sending…" : "Send message"} <span aria-hidden>→</span>
      </button>
    </form>
  );
}
