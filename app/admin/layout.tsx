import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/dal";
import { getMessages } from "@/lib/content";
import { AdminNav } from "./admin-nav";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Hard guard: the proxy redirects early, but this is what actually protects the pages.
  const session = await requireAdminPage();
  const messages = await getMessages();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex w-full flex-col border-b border-line bg-surface md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="px-6 py-6">
          <p className="font-display text-lg font-bold uppercase tracking-[0.22em] text-foreground">Admin</p>
          <p className="mt-1 truncate font-mono text-[0.65rem] text-muted" title={session.username}>
            {session.username}
          </p>
        </div>
        <AdminNav unread={messages.length} />
        <form action={logout} className="mt-auto px-6 py-6">
          <button type="submit" className="label text-muted hover:text-foreground">
            Log out
          </button>
        </form>
      </aside>

      <main className="flex-1 px-6 py-10 md:px-12">{children}</main>
    </div>
  );
}
