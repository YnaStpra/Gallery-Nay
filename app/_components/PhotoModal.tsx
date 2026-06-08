"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Aperture,
  Camera,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  MapPin,
} from "lucide-react";

import { useJourney, useRecentlyViewed } from "@/src/hooks";
import type { GalleryPhoto } from "@/src/lib/gallery-data";
import { DownloadRequestPanel } from "./DownloadRequestPanel";
import { ModalCloseButton } from "./ModalCloseButton";
import { PhotoCollectorActions } from "./PhotoCollectorActions";
import { PhotoPalette } from "./PhotoPalette";
import { getPreviewImageSize } from "./photo-utils";
import { NearbyPhotos } from "@/components/NearbyPhotos";

type Props = {
  photo: GalleryPhoto;
  isOpen: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

function DetailRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="grid gap-1">
      <dt className="text-[11px] uppercase tracking-[0.24em] text-zinc-400">
        {label}
      </dt>
      <dd className="text-sm leading-6 text-white">
        <span
          className="inline-flex h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <span className="ml-2">{value}</span>
      </dd>
    </div>
  );
}

function MetadataPanel({
  photo,
  accent,
  formattedCapture,
  compact = false,
}: {
  photo: GalleryPhoto;
  accent: string;
  formattedCapture: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "grid gap-3" : "grid gap-3"}>
      {photo.location && photo.country ? (
        <DetailRow
          label="Location"
          value={`${photo.location}, ${photo.country}`}
          accent={accent}
        />
      ) : null}
      {photo.takenAt ? (
        <DetailRow
          label="Capture date"
          value={formattedCapture}
          accent={accent}
        />
      ) : null}
      {photo.camera ? (
        <DetailRow label="Camera" value={photo.camera} accent={accent} />
      ) : null}
      {photo.lens ? (
        <DetailRow label="Lens" value={photo.lens} accent={accent} />
      ) : null}
      {photo.focalLength ? (
        <DetailRow
          label="Focal length"
          value={photo.focalLength}
          accent={accent}
        />
      ) : null}
      {photo.aperture ? (
        <DetailRow label="Aperture" value={photo.aperture} accent={accent} />
      ) : null}
      {photo.shutterSpeed ? (
        <DetailRow
          label="Shutter speed"
          value={photo.shutterSpeed}
          accent={accent}
        />
      ) : null}
      {photo.iso ? (
        <DetailRow label="ISO" value={photo.iso} accent={accent} />
      ) : null}
      {photo.colorProfile ? (
        <DetailRow
          label="Color profile"
          value={photo.colorProfile}
          accent={accent}
        />
      ) : null}
      {photo.copyright ? (
        <DetailRow label="Copyright" value={photo.copyright} accent={accent} />
      ) : null}
    </div>
  );
}

export function PhotoModal({
  photo,
  isOpen,
  hasPrevious,
  hasNext,
  onClose,
  onPrevious,
  onNext,
}: Props) {
  const { addToViewed } = useRecentlyViewed();
  const { addCollection, addCountry, addLocation } = useJourney();
  const startSwipe = useRef<{ x: number; y: number } | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);
  const accent = useMemo(
    () => photo.dominantColor || "#22d3ee",
    [photo.dominantColor],
  );
  const previewSize = useMemo(() => getPreviewImageSize(photo), [photo]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowLeft" && hasPrevious) {
        onPrevious();
      }
      if (event.key === "ArrowRight" && hasNext) {
        onNext();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    addToViewed(photo.id);
    addCountry(photo.country);
    addLocation(photo.location);
    addCollection(photo.collection);

    fetch(`/api/photo/${photo.id}/view`, { method: "POST" }).catch((error) => {
      console.error("Failed to track photo view", error);
    });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [
    addCollection,
    addCountry,
    addLocation,
    addToViewed,
    hasNext,
    hasPrevious,
    isOpen,
    onClose,
    onNext,
    onPrevious,
    photo.collection,
    photo.country,
    photo.id,
    photo.location,
  ]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    startSwipe.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!startSwipe.current) return;

    const deltaX = event.clientX - startSwipe.current.x;
    const deltaY = event.clientY - startSwipe.current.y;

    if (Math.abs(deltaX) > 80 && Math.abs(deltaY) < 80) {
      if (deltaX < 0 && hasNext) onNext();
      if (deltaX > 0 && hasPrevious) onPrevious();
    }

    startSwipe.current = null;
  };

  if (!isOpen) {
    return null;
  }

  const formattedCapture = photo.takenAtRaw ?? photo.takenAt;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/90 p-3 backdrop-blur-xl sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-end p-4 sm:p-6">
        <ModalCloseButton
          onClick={onClose}
          ariaLabel="Close photo modal"
          className="pointer-events-auto"
        />
      </div>

      <div className="relative z-10 flex h-[calc(100dvh-1.5rem)] w-full overflow-hidden rounded-[28px] border border-white/10 bg-black lg:h-[calc(100dvh-2rem)] lg:flex-row">
        <section className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black p-4 sm:p-6">
          <div
            className="relative flex h-full w-full items-center justify-center"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <Image
              src={photo.imageUrl}
              alt={photo.alt}
              width={previewSize.width}
              height={previewSize.height}
              priority
              sizes="(max-width: 1024px) 100vw, calc(100vw - 380px)"
              className="h-auto max-h-[calc(100dvh-4rem)] w-auto max-w-full object-contain"
              style={{ imageOrientation: "from-image" }}
            />
          </div>

          <div className="absolute inset-y-0 left-4 hidden items-center lg:flex">
            <button
              type="button"
              disabled={!hasPrevious}
              onClick={onPrevious}
              aria-label="Previous photo"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-6" />
            </button>
          </div>

          <div className="absolute inset-y-0 right-4 hidden items-center justify-end lg:flex">
            <button
              type="button"
              disabled={!hasNext}
              onClick={onNext}
              aria-label="Next photo"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>

          <div className="absolute bottom-4 right-4 md:hidden">
            <button
              type="button"
              onClick={() => setShowMetadata(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/75"
            >
              <ChevronUp className="size-4" />
              Detail Foto
            </button>
          </div>
        </section>

        <aside className="hidden w-full shrink-0 overflow-y-auto border-t border-white/10 bg-zinc-950 p-5 md:block lg:w-[380px] lg:border-l lg:border-t-0 lg:p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
            {photo.collection}
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            {photo.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
            {photo.story}
          </p>

          <div className="mt-6">
            <MetadataPanel
              accent={accent}
              formattedCapture={formattedCapture}
              photo={photo}
            />
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-3 w-8 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <span className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                Dominant tone
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <MapPin className="size-4 text-white" aria-hidden="true" />
              <span>{photo.location}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <Camera className="size-4 text-white" aria-hidden="true" />
              <span>{photo.camera}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <Aperture className="size-4 text-white" aria-hidden="true" />
              <span>{photo.lens}</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <PhotoCollectorActions
              photoId={photo.id}
              slug={photo.slug}
              title={photo.title}
            />
            <DownloadRequestPanel photoId={photo.id} photoTitle={photo.title} />
            <PhotoPalette imageUrl={photo.imageUrl} />
            <NearbyPhotos photoId={photo.id} />
          </div>
        </aside>

        {showMetadata ? (
          <motion.div
            className="absolute inset-x-0 bottom-0 z-20 md:hidden"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.24 }}
          >
            <div className="rounded-t-[28px] border border-white/10 bg-zinc-950/98 px-4 pb-5 pt-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
                    {photo.collection}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {photo.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMetadata(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                >
                  ✕ Tutup Detail
                </button>
              </div>
              <div className="max-h-[44dvh] overflow-y-auto pr-1">
                <p className="text-sm leading-7 text-zinc-300">{photo.story}</p>
                <div className="mt-4">
                  <MetadataPanel
                    accent={accent}
                    formattedCapture={formattedCapture}
                    photo={photo}
                    compact
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}
