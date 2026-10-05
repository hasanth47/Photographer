"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Photo, SiteContent } from "@/lib/types";

const SLIDE_MS = 6000;

export function Hero({ hero, slides }: { hero: SiteContent["hero"]; slides: Photo[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-background">
      {slides.map((photo, i) => (
        <div
          key={photo.id}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={photo.src}
            alt={photo.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-[50%_20%] brightness-[0.55] grayscale-[0.35]"
          />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-14 md:pb-14">
        <p className="label fade-in text-foreground/80">{hero.eyebrow}</p>
        <h1 className="fade-in mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.05] text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          {hero.headline}
          <br />
          <em className="font-medium">{hero.headlineItalic}</em>
        </h1>

        {slides.length > 1 && (
          <div className="mt-10 flex items-center gap-3" role="tablist" aria-label="Hero slides">
            {slides.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show slide ${i + 1}: ${photo.title}`}
                onClick={() => setIndex(i)}
                className={`h-px transition-all duration-500 ${
                  i === index ? "w-8 bg-foreground" : "w-3 bg-foreground/40 hover:bg-foreground/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
