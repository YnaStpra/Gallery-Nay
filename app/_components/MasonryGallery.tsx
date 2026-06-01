"use client";

import type { GalleryPhoto } from "@/src/lib/gallery-data";
import { useMemo, useState } from "react";
import { PhotoCard } from "./PhotoCard";
import { PhotoModal } from "./PhotoModal";

type Props = {
  photos: GalleryPhoto[];
};

export function MasonryGallery({ photos }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  const hasPrevious = selectedIndex !== null && selectedIndex > 0;
  const hasNext = selectedIndex !== null && selectedIndex < photos.length - 1;

  const photoCards = useMemo(
    () =>
      photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onSelect={() => setSelectedIndex(index)}
        />
      )),
    [photos],
  );

  return (
    <section className="mx-auto max-w-7xl px-0 sm:px-2 lg:px-4">
      <div className="mb-6 px-1 sm:px-2">
        <p className="text-xs uppercase tracking-[0.36em] text-zinc-500">
          Gallery
        </p>
      </div>

      <div className="columns-2 gap-y-4 gap-x-4 sm:columns-3 lg:columns-4">
        {photoCards}
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          isOpen={selectedPhoto !== null}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          onClose={() => setSelectedIndex(null)}
          onPrevious={() => {
            if (hasPrevious)
              setSelectedIndex((current) =>
                current === null ? null : current - 1,
              );
          }}
          onNext={() => {
            if (hasNext)
              setSelectedIndex((current) =>
                current === null ? null : current + 1,
              );
          }}
        />
      )}
    </section>
  );
}
