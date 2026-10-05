"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Nav({ siteName, isAdmin }: { siteName: string; isAdmin: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const itemClass = (active: boolean) =>
    `label px-1.5 py-0.5 transition-colors ${
      active
        ? "text-foreground outline outline-1 outline-foreground/70"
        : "text-muted hover:text-foreground"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || open ? "bg-background/90 backdrop-blur border-b border-line" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5 md:px-8">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-[0.22em] uppercase text-foreground"
        >
          {siteName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={itemClass(isActive(link.href))}>
              {link.label}
            </Link>
          ))}
          <Link
            href={isAdmin ? "/admin" : "/login"}
            className={`${itemClass(pathname.startsWith("/admin"))} ${
              isAdmin ? "!text-accent" : "!text-muted/60"
            }`}
          >
            Admin
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="label text-foreground md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-5 border-t border-line px-6 py-6 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={itemClass(isActive(link.href))}
            >
              {link.label}
            </Link>
          ))}
          <Link href={isAdmin ? "/admin" : "/login"} onClick={() => setOpen(false)} className={itemClass(false)}>
            Admin
          </Link>
        </nav>
      )}
    </header>
  );
}
