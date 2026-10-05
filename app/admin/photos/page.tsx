import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { AddPhotoForm } from "./add-photo-form";
import { PhotoRow } from "./photo-row";

export const metadata: Metadata = { title: "Photos" };

export default async function AdminPhotosPage() {
  const { photos } = await getContent();

  return (
    <div className="max-w-4xl space-y-14">
      <header>
        <p className="label text-muted">Gallery</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-foreground">Photos</h1>
        <p className="mt-3 text-sm text-muted">
          Order here is the order on the gallery page. Hero slides and “Selected work” are picked with the checkboxes.
        </p>
      </header>

      <section id="add" className="scroll-mt-10 border border-accent/40 bg-surface p-6">
        <h2 className="font-display text-2xl font-semibold text-foreground">Add a photo</h2>
        <div className="mt-6">
          <AddPhotoForm />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold text-foreground">
          All photos <span className="font-mono text-sm text-muted">({photos.length})</span>
        </h2>
        {photos.length === 0 ? (
          <p className="mt-6 text-muted">No photos yet. Add one above.</p>
        ) : (
          <ul className="mt-6 space-y-6">
            {photos.map((photo, i) => (
              <PhotoRow key={photo.id} photo={photo} isFirst={i === 0} isLast={i === photos.length - 1} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
