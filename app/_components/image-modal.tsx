"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect } from "react";

import type { GalleryPhoto } from "@/src/lib/gallery-data";
import { getPreviewImageSize } from "./photo-utils";

type Props = {
  photo: GalleryPhoto;
  isOpen: boolean;
  onClose: () => void;
};

function MetadataItem({ label, value }: { label: string; value: string }) {
  if (!value) return null;

  return (
    <div className="grid gap-1">
      <dt className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </dt>
      <dd className="text-sm leading-6 text-zinc-100">{value}</dd>
    </div>
  );
}

export function ImageModal({ photo, isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const imageSize = getPreviewImageSize(photo);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 p-3 backdrop-blur-sm sm:p-4">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 flex h-[calc(100dvh-1.5rem)] w-full overflow-hidden rounded-[28px] border border-white/10 bg-black lg:h-[calc(100dvh-2rem)] lg:flex-row">
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black p-4 sm:p-6">
          <div className="flex h-full w-full items-center justify-center">
            <Image
              src={photo.imageUrl}
              alt={photo.alt}
              width={imageSize.width}
              height={imageSize.height}
              priority
              sizes="(max-width: 1024px) 100vw, calc(100vw - 380px)"
              className="h-auto max-h-[calc(100dvh-4rem)] w-auto max-w-full object-contain"
              style={{ imageOrientation: "from-image" }}
            />
          </div>

          <button
            onClick={onClose}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition hover:bg-white/70 hover:text-black"
          >
            <X className="size-5" />
          </button>
        </div>

        <aside className="w-full shrink-0 overflow-y-auto border-t border-white/10 bg-zinc-950 p-5 lg:w-[380px] lg:border-l lg:border-t-0 lg:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-200">
            {photo.collection}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            {photo.title}
          </h3>
          <p className="mt-4 text-sm leading-7 text-zinc-300">{photo.story}</p>

          <dl className="mt-6 grid gap-4 border-t border-white/10 pt-5 text-sm text-zinc-200">
            <MetadataItem
              label="Location"
              value={`${photo.location}, ${photo.country}`}
            />
            <MetadataItem label="Taken" value={photo.takenAt} />
            <MetadataItem label="Camera" value={photo.camera} />
            <MetadataItem label="Lens" value={photo.lens} />
            <MetadataItem label="Focal Length" value={photo.focalLength} />
            <MetadataItem
              label="Exposure"
              value={`${photo.aperture} | ${photo.shutterSpeed} | ISO ${photo.iso}`}
            />
            <MetadataItem label="Dimensions" value={photo.dimensions} />
            <MetadataItem label="File Type" value={photo.fileType} />
          </dl>

          <div className="mt-6 border-t border-white/10 pt-4 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-6 rounded"
                style={{ backgroundColor: photo.dominantColor }}
              />
              <span>Dominant: {photo.dominantColor}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
