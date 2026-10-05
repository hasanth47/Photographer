"use client";

import Image from "next/image";
import { ChangeEvent, useMemo, useState, useTransition } from "react";
import { addPhoto, type ActionState } from "../actions";
import { CATEGORIES, type Category } from "@/lib/types";

type FilterState = {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  sepia: number;
  blur: number;
  hue: number;
  rotate: number;
};

const initialFilters: FilterState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  blur: 0,
  hue: 0,
  rotate: 0,
};

const sliderConfig = [
  { key: "brightness", label: "Brightness", min: 0, max: 200, step: 1, suffix: "%" },
  { key: "contrast", label: "Contrast", min: 0, max: 200, step: 1, suffix: "%" },
  { key: "saturation", label: "Saturation", min: 0, max: 200, step: 1, suffix: "%" },
  { key: "grayscale", label: "Grayscale", min: 0, max: 100, step: 1, suffix: "%" },
  { key: "sepia", label: "Sepia", min: 0, max: 100, step: 1, suffix: "%" },
  { key: "blur", label: "Blur", min: 0, max: 12, step: 0.5, suffix: "px" },
  { key: "hue", label: "Hue", min: 0, max: 360, step: 1, suffix: "°" },
  { key: "rotate", label: "Rotate", min: -180, max: 180, step: 1, suffix: "°" },
] as const;

type Preset = {
  name: string;
  values: Partial<Omit<FilterState, "rotate">>;
};

const presets: Preset[] = [
  { name: "Vivid", values: { saturation: 140, contrast: 110 } },
  { name: "Black & White", values: { grayscale: 100, contrast: 110 } },
  { name: "Vintage", values: { sepia: 45, contrast: 90, brightness: 105, saturation: 85 } },
  { name: "Faded", values: { contrast: 85, brightness: 110, saturation: 80 } },
  { name: "Dramatic", values: { contrast: 140, saturation: 90, brightness: 95 } },
  { name: "Soft", values: { blur: 1, brightness: 105, contrast: 95 } },
];

const lookKeys = sliderConfig
  .map(({ key }) => key)
  .filter((key): key is Exclude<typeof key, "rotate"> => key !== "rotate");

export function PhotoEditor() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("edited-photo.jpg");
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [saveTitle, setSaveTitle] = useState("");
  const [saveCategory, setSaveCategory] = useState<Category>("Portraits");
  const [saveState, setSaveState] = useState<ActionState | null>(null);
  const [saving, startSaving] = useTransition();

  const filterString = useMemo(() => {
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) blur(${filters.blur}px) hue-rotate(${filters.hue}deg)`;
  }, [filters]);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImage(objectUrl);
    setFileName(file.name || "edited-photo.jpg");
    setSaveTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " "));
    setSaveState(null);
  };

  const updateFilter = (key: keyof FilterState, value: number) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => setFilters(initialFilters);

  const applyPreset = (preset: Preset) => {
    setFilters((current) => ({ ...initialFilters, ...preset.values, rotate: current.rotate }));
  };

  const isPresetActive = (preset: Preset) => {
    const target = { ...initialFilters, ...preset.values };
    return lookKeys.every((key) => filters[key] === target[key]);
  };

  /** Renders the current edit to a JPEG blob plus its pixel size. */
  const renderBlob = () =>
    new Promise<{ blob: Blob; width: number; height: number } | null>((resolve) => {
      if (!image) return resolve(null);

      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const context = canvas.getContext("2d");
        if (!context) return resolve(null);

        context.filter = filterString;
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate((filters.rotate * Math.PI) / 180);
        context.translate(-canvas.width / 2, -canvas.height / 2);
        context.drawImage(img, 0, 0);
        context.setTransform(1, 0, 0, 1, 0, 0);

        canvas.toBlob(
          (blob) => resolve(blob ? { blob, width: canvas.width, height: canvas.height } : null),
          "image/jpeg",
          0.92,
        );
      };
      img.onerror = () => resolve(null);
      img.src = image;
    });

  const handleDownload = async () => {
    const result = await renderBlob();
    if (!result) return;

    const url = URL.createObjectURL(result.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.replace(/\.[^/.]+$/, "") + "-edited.jpg";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToGallery = () => {
    if (!image) return;
    if (!saveTitle.trim()) {
      setSaveState({ ok: false, message: "Give the photo a title first." });
      return;
    }

    startSaving(async () => {
      const result = await renderBlob();
      if (!result) {
        setSaveState({ ok: false, message: "Could not render the image." });
        return;
      }

      const formData = new FormData();
      formData.set("file", new File([result.blob], fileName.replace(/\.[^/.]+$/, "") + "-edited.jpg", { type: "image/jpeg" }));
      formData.set("title", saveTitle.trim());
      formData.set("category", saveCategory);
      formData.set("width", String(result.width));
      formData.set("height", String(result.height));

      setSaveState(await addPhoto({ ok: false }, formData));
    });
  };

  return (
    <div className="max-w-6xl">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label text-muted">Tools</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-foreground">Photo editor</h1>
          <p className="mt-3 text-sm text-muted">Adjust a photo, then download it or save it straight into the gallery.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="btn-outline label cursor-pointer">
            Upload photo
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
          <button type="button" onClick={resetFilters} className="label text-muted hover:text-foreground">
            Reset
          </button>
          <button type="button" onClick={handleDownload} disabled={!image} className="btn-solid label">
            Download
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.95fr]">
        <section className="border border-line bg-surface p-4">
          <div className="flex min-h-130 items-center justify-center overflow-hidden border border-dashed border-line bg-background p-4">
            {image ? (
              <Image
                src={image}
                alt="Edited preview"
                unoptimized
                width={1200}
                height={800}
                className="max-h-[70vh] max-w-full object-contain transition-all duration-200"
                style={{
                  filter: filterString,
                  transform: `rotate(${filters.rotate}deg)`,
                }}
              />
            ) : (
              <div className="text-center text-muted">
                <p className="font-display text-xl text-foreground">No photo selected</p>
                <p className="mt-2 text-sm">Upload an image to start editing.</p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-8 border border-line bg-surface p-5">
          <div>
            <p className="label text-muted">Presets</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((preset) => {
                const active = isPresetActive(preset);
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    aria-pressed={active}
                    className={`label border px-3 py-1.5 transition ${
                      active
                        ? "border-accent bg-accent text-background"
                        : "border-line text-foreground/80 hover:border-accent hover:text-foreground"
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="label text-muted">Adjustments</p>
            <div className="mt-4 space-y-4">
              {sliderConfig.map(({ key, label, min, max, step, suffix }) => (
                <div key={key}>
                  <div className="mb-1.5 flex items-center justify-between text-sm text-foreground/80">
                    <label htmlFor={key}>{label}</label>
                    <span className="font-mono text-xs text-muted">
                      {filters[key]}
                      {suffix}
                    </span>
                  </div>
                  <input
                    id={key}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={filters[key]}
                    onChange={(event) => updateFilter(key, Number(event.target.value))}
                    className="h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-line pt-6">
            <p className="label text-muted">Save to gallery</p>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="save-title" className="label block text-muted">
                  Title
                </label>
                <input
                  id="save-title"
                  type="text"
                  value={saveTitle}
                  onChange={(event) => setSaveTitle(event.target.value)}
                  className="admin-field mt-2"
                />
              </div>
              <div>
                <label htmlFor="save-category" className="label block text-muted">
                  Category
                </label>
                <select
                  id="save-category"
                  value={saveCategory}
                  onChange={(event) => setSaveCategory(event.target.value as Category)}
                  className="admin-field mt-2"
                >
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleSaveToGallery}
                  disabled={!image || saving}
                  className="btn-outline label"
                >
                  {saving ? "Saving…" : "Add to gallery"}
                </button>
                {saveState?.message && (
                  <p role="status" className={`text-sm ${saveState.ok ? "text-accent" : "text-red-400"}`}>
                    {saveState.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
