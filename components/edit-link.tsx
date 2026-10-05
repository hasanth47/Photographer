import Link from "next/link";

/** Small "Edit" affordance rendered next to editable sections for admins. */
export function EditLink({ href, label = "Edit" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="label inline-flex items-center gap-1 border border-accent/60 px-2 py-1 text-accent hover:bg-accent hover:text-background"
    >
      ✎ {label}
    </Link>
  );
}
