"use client";

import Image from "next/image";
import { ChangeEvent, useMemo, useState } from "react";

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

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("edited-photo.jpg");
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const filterString = useMemo(() => {
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) blur(${filters.blur}px) hue-rotate(${filters.hue}deg)`;
  }, [filters]);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImage(objectUrl);
    setFileName(file.name || "edited-photo.jpg");
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

  const handleDownload = () => {
    if (!image) return;

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const context = canvas.getContext("2d");
      if (!context) return;

      context.filter = filterString;
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate((filters.rotate * Math.PI) / 180);
      context.translate(-canvas.width / 2, -canvas.height / 2);
      context.drawImage(img, 0, 0);
      context.setTransform(1, 0, 0, 1, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName.replace(/\.[^/.]+$/, "") + "-edited.jpg";
        link.click();
        URL.revokeObjectURL(url);
      }, "image/jpeg", 0.92);
    };

    img.src = image;
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Studio</p>
            <h1 className="mt-2 text-3xl font-bold md:text-5xl">Photo Editor</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer rounded-full border border-cyan-400/60 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/20">
              Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!image}
              className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              Download
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.95fr]">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-cyan-950/30">
            <div className="flex min-h-[520px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/10 bg-slate-950/80 p-4">
              {image ? (
                <Image
                  src={image}
                  alt="Edited preview"
                  unoptimized
                  width={1200}
                  height={800}
                  className="max-h-[70vh] max-w-full rounded-xl object-contain shadow-lg shadow-black/40 transition-all duration-200"
                  style={{
                    filter: filterString,
                    transform: `rotate(${filters.rotate}deg)`,
                  }}
                />
              ) : (
                <div className="text-center text-slate-400">
                  <p className="text-lg font-medium">No photo selected</p>
                  <p className="mt-2 text-sm">Upload an image to start editing.</p>
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-xl shadow-slate-950/40">
            <h2 className="text-xl font-semibold">Presets</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((preset) => {
                const active = isPresetActive(preset);
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    aria-pressed={active}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      active
                        ? "border-cyan-400 bg-cyan-400 font-semibold text-slate-950"
                        : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>

            <h2 className="mt-6 text-xl font-semibold">Adjustments</h2>
            <div className="mt-5 space-y-4">
              {sliderConfig.map(({ key, label, min, max, step, suffix }) => (
                <div key={key}>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                    <label htmlFor={key}>{label}</label>
                    <span>{filters[key]}{suffix}</span>
                  </div>
                  <input
                    id={key}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={filters[key]}
                    onChange={(event) => updateFilter(key, Number(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-400"
                  />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
