"use client";

import { useMemo } from "react";
import type { GalleryPhoto } from "@/src/lib/gallery-data";

type Props = {
  photos: GalleryPhoto[];
  selectedPhoto: GalleryPhoto | null;
  clusterPhotos: GalleryPhoto[];
  onSelectPhoto: (photoId: string) => void;
  onClearCluster: () => void;
};

export function MapSidebar({
  photos,
  selectedPhoto,
  clusterPhotos,
  onSelectPhoto,
  onClearCluster,
}: Props) {
  const highlightedPhotos = useMemo(
    () => (clusterPhotos.length ? clusterPhotos : photos.slice(0, 12)),
    [clusterPhotos, photos],
  );

  return (
    <aside className="h-full w-full border-r border-white/10 bg-[#060809]/95 p-6 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
            Travel map
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            Explore photography by destination.
          </h1>
        </div>
        <button
          type="button"
          onClick={onClearCluster}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
        >
          Reset
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <div className="rounded-[32px] border border-white/10 bg-zinc-950/90 p-5">
          <p className="text-xs uppercase tracking-[0.26em] text-zinc-400">
            Map summary
          </p>
          <div className="mt-4 grid gap-3">
            <Stat label="Photos mapped" value={photos.length} />
            <Stat
              label="Locations"
              value={
                new Set(photos.map((photo) => photo.location).filter(Boolean))
                  .size
              }
            />
            <Stat
              label="Countries"
              value={
                new Set(photos.map((photo) => photo.country).filter(Boolean))
                  .size
              }
            />
          </div>
        </div>

        {selectedPhoto ? (
          <div className="rounded-[32px] border border-white/10 bg-zinc-950/90 p-5">
            <p className="text-xs uppercase tracking-[0.26em] text-cyan-300">
              Selected photo
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">
              {selectedPhoto.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {selectedPhoto.location}, {selectedPhoto.country}
            </p>
            <div className="mt-5 grid gap-3 text-sm text-zinc-300">
              <KeyValue label="Camera" value={selectedPhoto.camera} />
              <KeyValue label="Lens" value={selectedPhoto.lens} />
              <KeyValue label="Aperture" value={selectedPhoto.aperture} />
              <KeyValue label="ISO" value={selectedPhoto.iso} />
            </div>
          </div>
        ) : null}

        <div className="rounded-[32px] border border-white/10 bg-zinc-950/90 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.26em] text-cyan-300">
              Preview gallery
            </p>
            {clusterPhotos.length ? (
              <span className="rounded-full bg-cyan-300/10 px-2 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-200">
                {clusterPhotos.length} selected
              </span>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3">
            {highlightedPhotos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => onSelectPhoto(photo.id)}
                className="group grid grid-cols-[90px_1fr] items-center gap-4 overflow-hidden rounded-3xl border border-white/10 bg-black/50 p-3 text-left transition hover:border-cyan-300/40 hover:bg-white/5"
              >
                <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-zinc-900">
                  <img
                    src={photo.imageUrl}
                    alt={photo.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {photo.title}
                  </p>
                  <p className="mt-2 text-xs text-zinc-400">{photo.location}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl bg-[#081010] p-4">
      <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm text-zinc-300">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
