"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryPhoto } from "@/src/lib/gallery-data";
import { ImageModal } from "./image-modal";

type Props = { photos: GalleryPhoto[] };

export function ImageGallery({ photos }: Props) {
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
        {photos.map((p) => (
          <div
            key={p.id}
            className="break-inside-avoid mb-4 overflow-hidden rounded-lg bg-zinc-950 border border-white/6 cursor-pointer"
            onClick={() => setSelected(p)}
          >
            <div className="relative bg-zinc-900">
              <Image
                src={p.imageUrl}
                alt={p.alt}
                width={800}
                height={800}
                className="w-full h-auto object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 transition-colors hover:bg-black/10" />
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <ImageModal
          photo={selected}
          isOpen={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
