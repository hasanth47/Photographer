"use client";

import { useState } from "react";
import { PhotoCard } from "@/components/photo-card";
import { CATEGORIES, type Category, type Photo } from "@/lib/types";

type Filter = "All" | Category;

export function GalleryGrid({ photos, isAdmin }: { photos: Photo[]; isAdmin: boolean }) {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = filter === "All" ? photos : photos.filter((photo) => photo.category === filter);
  const filters: Filter[] = ["All", ...CATEGORIES];

  return (
    <>
      <div className="flex flex-wrap items-center gap-6" role="tablist" aria-label="Filter gallery">
        {filters.map((item) => {
          const active = item === filter;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(item)}
              className={`label pb-1 transition-colors ${
                active
                  ? "border-b border-foreground text-foreground"
                  : "border-b border-transparent text-muted hover:text-foreground"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="mt-12 text-muted">Nothing in this category yet.</p>
      ) : (
        <div className="masonry mt-10" key={filter}>
          {visible.map((photo, i) => (
            <div key={photo.id} className="fade-in" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
              <PhotoCard photo={photo} isAdmin={isAdmin} priority={i < 3} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
