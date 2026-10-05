"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Content" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/editor", label: "Photo editor" },
] as const;

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row flex-wrap gap-x-6 gap-y-2 px-6 pb-4 md:flex-col md:gap-y-4 md:pb-0">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`label flex items-center gap-2 ${active ? "text-accent" : "text-muted hover:text-foreground"}`}
          >
            {item.label}
            {item.href === "/admin/messages" && unread > 0 && (
              <span className="rounded-full bg-accent px-1.5 text-[0.6rem] text-background">{unread}</span>
            )}
          </Link>
        );
      })}
      <Link href="/" className="label text-muted hover:text-foreground md:mt-4">
        ← View site
      </Link>
    </nav>
  );
}
