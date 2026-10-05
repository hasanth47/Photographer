import Link from "next/link";
import { logout } from "@/app/admin/actions";

/** Floating toolbar shown on public pages only when an admin is signed in. */
export function AdminBar({ editHref, username }: { editHref: string; username: string }) {
  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center gap-4 border border-accent/60 bg-background/90 px-4 py-2.5 backdrop-blur">
      <span className="label text-accent">Admin</span>
      <span className="hidden font-mono text-[0.65rem] text-muted sm:inline" title={username}>
        {username}
      </span>
      <Link href={editHref} className="label text-foreground hover:text-accent">
        Edit this page
      </Link>
      <Link href="/admin" className="label text-foreground hover:text-accent">
        Dashboard
      </Link>
      <form action={logout}>
        <button type="submit" className="label text-muted hover:text-foreground">
          Log out
        </button>
      </form>
    </div>
  );
}
