"use client";

import Image from "next/image";
import type { SyntheticEvent } from "react";

type ProtectedPhotoProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  watermark?: string;
};

export function ProtectedPhoto({
  src,
  alt,
  className = "",
  imageClassName = "",
  priority = false,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  watermark = "Yan Saputra",
}: ProtectedPhotoProps) {
  const blockSaveGesture = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <div
      className={`relative overflow-hidden bg-zinc-900 ${className}`}
      onContextMenu={blockSaveGesture}
      onDragStart={blockSaveGesture}
    >
      <Image
        src={src}
        alt={alt}
        fill
        draggable={false}
        priority={priority}
        sizes={sizes}
        className={`pointer-events-none select-none object-cover ${imageClassName}`}
      />
      <div className="absolute inset-0 z-10" aria-hidden="true" />
      <span className="absolute bottom-3 right-3 z-20 rounded bg-black/45 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/75 backdrop-blur">
        {watermark}
      </span>
    </div>
  );
}
