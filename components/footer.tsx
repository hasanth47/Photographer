import type { SiteContent } from "@/lib/types";

export function Footer({ site }: { site: SiteContent["site"] }) {
  const year = new Date().getFullYear();
  const socials = [
    { label: "Instagram", value: site.instagram },
    { label: "Twitter", value: site.twitter },
    { label: "Behance", value: site.behance },
  ].filter((item) => item.value);

  return (
    <footer className="mt-auto border-t border-line px-6 py-8 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs text-muted">
          © {year} {site.name}. All rights reserved.
        </p>
        <nav className="flex flex-wrap gap-6">
          {socials.map((item) => (
            <span key={item.label} className="label text-muted hover:text-foreground" title={item.value}>
              {item.label}
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
}
