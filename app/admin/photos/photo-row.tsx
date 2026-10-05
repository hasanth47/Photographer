"use client";

import Image from "next/image";
import { useState } from "react";
import { deletePhoto, movePhoto, updatePhoto } from "../actions";
import { AdminForm, Checkbox, Field } from "../admin-form";
import { CATEGORIES, type Photo } from "@/lib/types";

export function PhotoRow({ photo, isFirst, isLast }: { photo: Photo; isFirst: boolean; isLast: boolean }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <li id={`photo-${photo.id}`} className="scroll-mt-10 grid grid-cols-1 gap-6 border border-line bg-surface p-5 md:grid-cols-[160px_1fr]">
      <div>
        <div className="relative w-full overflow-hidden bg-background" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
          <Image src={photo.src} alt={photo.title} fill sizes="160px" className="object-cover" />
        </div>
        <p className="mt-2 break-all font-mono text-[0.6rem] text-muted">{photo.src}</p>

        <div className="mt-4 flex items-center gap-3">
          <form action={movePhoto}>
            <input type="hidden" name="id" value={photo.id} />
            <input type="hidden" name="direction" value="up" />
            <button type="submit" disabled={isFirst} className="label text-muted hover:text-foreground disabled:opacity-30">
              ↑ Up
            </button>
          </form>
          <form action={movePhoto}>
            <input type="hidden" name="id" value={photo.id} />
            <input type="hidden" name="direction" value="down" />
            <button type="submit" disabled={isLast} className="label text-muted hover:text-foreground disabled:opacity-30">
              ↓ Down
            </button>
          </form>
        </div>
      </div>

      <div>
        <AdminForm action={updatePhoto} submitLabel="Save">
          <input type="hidden" name="id" value={photo.id} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Title" name="title" defaultValue={photo.title} />
            <div>
              <label htmlFor={`category-${photo.id}`} className="label block text-muted">
                Category
              </label>
              <select id={`category-${photo.id}`} name="category" defaultValue={photo.category} className="admin-field mt-2">
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Aspect width" name="width" type="number" defaultValue={photo.width} />
            <Field label="Aspect height" name="height" type="number" defaultValue={photo.height} />
          </div>
          <div className="flex flex-wrap gap-6">
            <Checkbox label="Selected work (home)" name="featured" defaultChecked={photo.featured} />
            <Checkbox label="Use in hero" name="hero" defaultChecked={photo.hero} />
          </div>
        </AdminForm>

        <div className="mt-5 border-t border-line pt-4">
          {confirming ? (
            <form action={deletePhoto} className="flex flex-wrap items-center gap-4">
              <input type="hidden" name="id" value={photo.id} />
              <span className="text-sm text-red-400">Delete “{photo.title}” permanently?</span>
              <button type="submit" className="label border border-red-400 px-3 py-1 text-red-400 hover:bg-red-400 hover:text-background">
                Yes, delete
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="label text-muted hover:text-foreground">
                Cancel
              </button>
            </form>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="label text-muted hover:text-red-400">
              Delete photo
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
