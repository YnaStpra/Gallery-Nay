"use client";

import Image from "next/image";
import {
  X,
  MapPin,
  Camera,
  Aperture,
  Ruler,
  ScanSearch,
  Palette,
} from "lucide-react";
import { useEffect } from "react";
import type { GalleryPhoto } from "@/src/lib/gallery-data";

type Props = {
  photo: GalleryPhoto;
  isOpen: boolean;
  onClose: () => void;
};

function MetadataItem({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex min-w-0 gap-3">
      <dt className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-zinc-100">{value}</dd>
    </div>
  );
}

export function ImageModal({ photo, isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-[1100px] max-h-[90vh] overflow-hidden rounded bg-black/90 border border-white/10 flex flex-col lg:flex-row">
        {/* Left: image */}
        <div className="lg:flex-1 flex items-center justify-center bg-zinc-950 p-4">
          <div className="relative w-full max-h-[82vh]">
            <Image
              src={photo.imageUrl}
              alt={photo.alt}
              width={1600}
              height={1200}
              className="w-full h-auto object-contain"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            <button
              onClick={onClose}
              aria-label="Close image viewer"
              className="absolute right-3 top-3 rounded bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Right: details */}
        <div className="w-full lg:w-[380px] overflow-y-auto p-6 bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-amber-200">
            {photo.collection}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            {photo.title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">
            {photo.story}
          </p>

          <div className="mt-6 space-y-3 border-t border-white/6 pt-4 text-sm text-zinc-200">
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
          </div>

          <div className="mt-6 border-t border-white/6 pt-4 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-6 rounded"
                style={{ backgroundColor: photo.dominantColor }}
              />
              <span>Dominant: {photo.dominantColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
