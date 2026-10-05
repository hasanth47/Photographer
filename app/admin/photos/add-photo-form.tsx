"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { addPhoto } from "../actions";
import { AdminForm, Checkbox, Field } from "../admin-form";
import { CATEGORIES } from "@/lib/types";

/** Reads an image's natural size in the browser so the server can store its aspect ratio. */
function readDimensions(src: string) {
  return new Promise<{ width: number; height: number } | null>((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function AddPhotoForm() {
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const previewUrl = useRef<string | null>(null);

  const setPreviewFrom = async (src: string) => {
    setPreview(src);
    setDims(await readDimensions(src));
  };

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = URL.createObjectURL(file);
    void setPreviewFrom(previewUrl.current);
  };

  const onUrl = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    if (value) void setPreviewFrom(value);
  };

  return (
    <AdminForm action={addPhoto} submitLabel="Add photo">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="file" className="label block text-muted">
            Upload image
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={onFile}
            className="admin-field mt-2 file:mr-3 file:border-0 file:bg-accent file:px-3 file:py-1 file:text-xs file:uppercase file:tracking-widest file:text-background"
          />
          <p className="mt-1 font-mono text-[0.65rem] text-muted">JPEG, PNG, WebP or AVIF, max 10 MB.</p>
        </div>
        <div>
          <label htmlFor="url" className="label block text-muted">
            …or image URL
          </label>
          <input
            id="url"
            name="url"
            type="url"
            placeholder="https://images.unsplash.com/…"
            onBlur={onUrl}
            className="admin-field mt-2"
          />
          <p className="mt-1 font-mono text-[0.65rem] text-muted">Only images.unsplash.com URLs are accepted.</p>
        </div>
      </div>

      {preview && (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="h-24 w-24 object-cover" />
          <p className="font-mono text-[0.65rem] text-muted">
            {dims ? `${dims.width} × ${dims.height}` : "Reading size…"}
          </p>
        </div>
      )}
      <input type="hidden" name="width" value={dims?.width ?? ""} />
      <input type="hidden" name="height" value={dims?.height ?? ""} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Title" name="title" />
        <div>
          <label htmlFor="category" className="label block text-muted">
            Category
          </label>
          <select id="category" name="category" className="admin-field mt-2">
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <Checkbox label="Show in “Selected work” on the home page" name="featured" />
        <Checkbox label="Use in hero" name="hero" />
      </div>
    </AdminForm>
  );
}
