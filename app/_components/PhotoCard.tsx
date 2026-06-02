"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { GalleryPhoto } from "@/src/lib/gallery-data";
import { FavoriteButton } from "./FavoriteButton";
import { getAspectRatio } from "./photo-utils";

type Props = {
  photo: GalleryPhoto;
  onSelect: () => void;
};

export function PhotoCard({ photo, onSelect }: Props) {
  const aspectRatio = getAspectRatio(photo);

  return (
    <article
      className="group relative block w-full overflow-hidden rounded-[28px] bg-zinc-950 shadow-[0_18px_70px_-42px_rgba(0,0,0,0.9)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_90px_-50px_rgba(0,0,0,0.9)]"
      style={
        {
          breakInside: "avoid",
          columnBreakInside: "avoid",
          aspectRatio,
        } as CSSProperties
      }
    >
      <button
        type="button"
        onClick={onSelect}
        aria-label={`Open details for ${photo.title}`}
        className="relative h-full w-full overflow-hidden bg-zinc-900 text-left"
      >
        <Image
          src={photo.imageUrl}
          alt={photo.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-full w-full rounded-[28px] object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      </button>
      <div className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-1 backdrop-blur">
        <FavoriteButton photoId={photo.id} compact />
      </div>
    </article>
  );
}
