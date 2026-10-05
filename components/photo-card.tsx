import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/lib/types";

export function PhotoCard({
  photo,
  isAdmin = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: {
  photo: Photo;
  isAdmin?: boolean;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <figure
      className="group relative overflow-hidden bg-surface"
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
    >
      <Image
        src={photo.src}
        alt={photo.title}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-4 pt-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <p className="font-display text-base font-semibold text-foreground">{photo.title}</p>
        <p className="font-mono text-[0.7rem] tracking-[0.18em] text-accent">{photo.category}</p>
      </figcaption>
      {isAdmin && (
        <Link
          href={`/admin/photos#photo-${photo.id}`}
          className="label absolute right-3 top-3 border border-accent/70 bg-background/80 px-2 py-1 text-accent opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
        >
          Edit
        </Link>
      )}
    </figure>
  );
}
