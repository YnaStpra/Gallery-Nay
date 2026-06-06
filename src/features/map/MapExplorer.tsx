"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { GalleryPhoto } from "@/src/lib/gallery-data";
import { PhotoModal } from "@/app/_components/PhotoModal";
import { MapSidebar } from "./MapSidebar";
import { getMarkerClusters } from "./map-utils";

const MapContainer = dynamic(
  () => import("./MapContainer").then((module) => module.MapContainer),
  {
    ssr: false,
  },
);

type Props = {
  photos: GalleryPhoto[];
  initialPhotoId?: string | null;
};

export function MapExplorer({ photos, initialPhotoId }: Props) {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(
    initialPhotoId ?? null,
  );
  const [selectedClusterPhotoIds, setSelectedClusterPhotoIds] = useState<
    string[] | null
  >(null);
  const [focusedClusterIds, setFocusedClusterIds] = useState<string[] | null>(
    null,
  );

  const selectedPhoto = useMemo(
    () => photos.find((photo) => photo.id === selectedPhotoId) ?? null,
    [photos, selectedPhotoId],
  );

  const clusterPhotos = useMemo(
    () =>
      selectedClusterPhotoIds
        ? photos.filter((photo) => selectedClusterPhotoIds.includes(photo.id))
        : [],
    [photos, selectedClusterPhotoIds],
  );

  const clusters = useMemo(() => getMarkerClusters(photos), [photos]);

  return (
    <div className="relative flex-1 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 z-10 hidden lg:block">
        <MapSidebar
          photos={photos}
          selectedPhoto={selectedPhoto}
          clusterPhotos={clusterPhotos}
          onSelectPhoto={setSelectedPhotoId}
          onClearCluster={() => setSelectedClusterPhotoIds(null)}
        />
      </div>
      <div className="relative h-screen w-full lg:pl-[420px]">
        <MapContainer
          photos={photos}
          selectedPhotoId={selectedPhotoId}
          onSelect={setSelectedPhotoId}
          onSelectCluster={(photoIds) => {
            setSelectedClusterPhotoIds(photoIds);
            setSelectedPhotoId(null);
          }}
          onClusterFocus={setFocusedClusterIds}
        />
      </div>

      <PhotoModal
        photo={
          selectedPhoto ||
          photos.find((photo) => photo.coordinates != null) ||
          photos[0]
        }
        isOpen={Boolean(selectedPhoto)}
        hasPrevious={false}
        hasNext={false}
        onClose={() => setSelectedPhotoId(null)}
        onPrevious={() => undefined}
        onNext={() => undefined}
      />
      {selectedClusterPhotoIds?.length ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 lg:hidden">
          <div className="mx-auto w-full max-w-3xl rounded-t-3xl border border-white/10 border-b-0 bg-zinc-950/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 pb-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
                  Cluster preview
                </p>
                <p className="text-sm text-zinc-200">
                  {selectedClusterPhotoIds.length} photos in this region
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClusterPhotoIds(null)}
                className="pointer-events-auto rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 overflow-x-auto pb-2">
              {clusterPhotos.slice(0, 6).map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelectedPhotoId(photo.id)}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-0"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.alt}
                    className="h-32 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-xs text-white">
                    {photo.location}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
