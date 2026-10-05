import type { Metadata } from "next";
import { getMessages } from "@/lib/content";
import { deleteMessage } from "../actions";

export const metadata: Metadata = { title: "Messages" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div className="max-w-3xl space-y-10">
      <header>
        <p className="label text-muted">Inbox</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-foreground">Messages</h1>
        <p className="mt-3 text-sm text-muted">Submissions from the contact form.</p>
      </header>

      {messages.length === 0 ? (
        <p className="text-muted">No messages yet.</p>
      ) : (
        <ul className="space-y-5">
          {messages.map((message) => (
            <li key={message.id} className="border border-line bg-surface p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl font-semibold text-foreground">{message.subject || "(no subject)"}</p>
                  <p className="mt-1 text-sm text-foreground/80">
                    {message.name} · <span className="font-mono text-xs">{message.email}</span>
                  </p>
                </div>
                <p className="font-mono text-[0.65rem] text-muted">{formatDate(message.receivedAt)}</p>
              </div>
              <p className="mt-5 whitespace-pre-wrap leading-relaxed text-foreground/80">{message.message}</p>
              <form action={deleteMessage} className="mt-5 border-t border-line pt-4">
                <input type="hidden" name="id" value={message.id} />
                <button type="submit" className="label text-muted hover:text-red-400">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
