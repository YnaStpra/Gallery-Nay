"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { motion } from "framer-motion";
import {
  Aperture,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Heart,
  Link2,
  MapPin,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { useFavorites } from "@/src/hooks";
import { useKeyboardShortcuts } from "@/src/hooks/useKeyboardShortcuts";
import { keyboardShortcuts } from "@/src/lib/keyboard-shortcuts";
import type { GalleryPhoto } from "@/src/lib/gallery-data";
import { DownloadRequestPanel } from "./DownloadRequestPanel";
import { ModalCloseButton } from "./ModalCloseButton";
import { BeforeAfterButton } from "@/components/photo/BeforeAfterButton";
import { BeforeAfterModal } from "@/components/photo/BeforeAfterModal";
import { PhotoPalette } from "./PhotoPalette";
import { getPreviewImageSize } from "./photo-utils";
import { NearbyPhotos } from "@/components/NearbyPhotos";
import { useKeyboardShortcutsLayer } from "./KeyboardShortcutsLayer";
import { Histogram } from "@/components/photo/Histogram";

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
  href,
}: {
  label: string;
  value: string;
  accent: string;
  href?: string;
}) {
  const content = (
    <dd className="text-sm leading-6 text-white">
      <span
        className="inline-flex h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: accent }}
      />
      <span className="ml-2">{value}</span>
    </dd>
  );

  return (
    <div className="grid gap-1">
      <dt className="text-[11px] uppercase tracking-[0.24em] text-zinc-400">
        {label}
      </dt>
      {href ? (
        <a
          className="inline-flex items-center text-sm leading-6 text-white transition hover:text-cyan-300"
          href={href}
          rel="noreferrer"
          target="_blank"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

function PhotoFacts({
  photo,
  accent,
  formattedCapture,
}: {
  photo: GalleryPhoto;
  accent: string;
  formattedCapture: string;
}) {
  return (
    <div className="grid gap-3">
      {photo.location && photo.country ? (
        <DetailRow
          label="Location"
          value={`${photo.location}, ${photo.country}`}
          accent={accent}
        />
      ) : null}
      {photo.location ? (
        <DetailRow
          label="Open in Google Maps"
          value={photo.location}
          accent={accent}
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(photo.location)}`}
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

function formatFileSize(size?: number) {
  if (!size || size <= 0) return "Unknown";
  const mb = size / (1024 * 1024);
  return `${mb >= 1 ? mb.toFixed(0) : (size / 1024).toFixed(0)} ${mb >= 1 ? "MB" : "KB"}`;
}

function BehindTheShotCard({ photo }: { photo: GalleryPhoto }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasContent = Boolean(
    photo.shootingConditions ||
    photo.shootingChallenges ||
    photo.waitingTime ||
    photo.interestingFacts ||
    photo.behindTheShot,
  );

  if (!hasContent) {
    return null;
  }

  return (
    <section className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Behind the Shot
          </p>
          <h3 className="mt-2 text-sm font-semibold text-white">
            Story behind the frame
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="mt-1 size-4 shrink-0 text-zinc-400" />
        ) : (
          <ChevronDown className="mt-1 size-4 shrink-0 text-zinc-400" />
        )}
      </button>

      {isExpanded ? (
        <div className="mt-4 grid gap-4 text-sm">
          {photo.shootingConditions ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Shooting conditions
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {photo.shootingConditions
                  .split(/,|\n/)
                  .filter(Boolean)
                  .map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-100"
                    >
                      {item.trim()}
                    </span>
                  ))}
              </div>
            </div>
          ) : null}
          {photo.waitingTime ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Waiting time
              </p>
              <p className="mt-1 leading-6 text-zinc-200">
                {photo.waitingTime}
              </p>
            </div>
          ) : null}
          {photo.shootingChallenges ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Shooting challenges
              </p>
              <p className="mt-1 leading-6 whitespace-pre-line text-zinc-200">
                {photo.shootingChallenges}
              </p>
            </div>
          ) : null}
          {photo.interestingFacts ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Interesting facts
              </p>
              <p className="mt-1 leading-6 whitespace-pre-line text-zinc-200">
                {photo.interestingFacts}
              </p>
            </div>
          ) : null}
          {photo.behindTheShot ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Behind the shot
              </p>
              <p className="mt-1 leading-7 whitespace-pre-line text-zinc-200">
                {photo.behindTheShot}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function EditingPresetCard({ photo }: { photo: GalleryPhoto }) {
  if (
    !photo.lutName &&
    !photo.editingSoftware &&
    !photo.cameraProfile &&
    !photo.lutUrl
  ) {
    return null;
  }

  const formatLabel = photo.lutFormat?.toUpperCase() ?? "PRESET";
  const fileSize = formatFileSize(photo.lutFileSize);

  return (
    <section className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Editing
          </p>
          <h3 className="mt-2 text-sm font-semibold text-white">Preset</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-300">
          {formatLabel}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm">
        {photo.lutName ? (
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              Preset
            </p>
            <p className="mt-1 text-white">{photo.lutName}</p>
          </div>
        ) : null}
        {photo.lutVersion ? (
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              Version
            </p>
            <p className="mt-1 text-white">{photo.lutVersion}</p>
          </div>
        ) : null}
        {photo.editingSoftware ? (
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              Software
            </p>
            <p className="mt-1 text-white">{photo.editingSoftware}</p>
          </div>
        ) : null}
        {photo.cameraProfile ? (
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              Camera Profile
            </p>
            <p className="mt-1 text-white">{photo.cameraProfile}</p>
          </div>
        ) : null}
        {photo.lutFormat || photo.lutFileName || photo.lutFileSize ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {photo.lutFormat ? (
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                  Format
                </p>
                <p className="mt-1 text-white">
                  {photo.lutFormat.toUpperCase()}
                </p>
              </div>
            ) : null}
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Size
              </p>
              <p className="mt-1 text-white">{fileSize}</p>
            </div>
          </div>
        ) : null}
        {photo.lutDescription ? (
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              Description
            </p>
            <p className="mt-1 leading-6 text-zinc-200">
              {photo.lutDescription}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
        {photo.allowDownload ? (
          <a
            href={`/api/photo/${photo.id}/preset`}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/15"
          >
            Download Preset
          </a>
        ) : (
          <p className="text-xs text-zinc-400">
            Preset download disabled by photographer
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {photo.lutFormat ? (
            <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-300">
              {photo.lutFormat}
            </span>
          ) : null}
          {photo.editingSoftware ? (
            <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-300">
              {photo.editingSoftware}
            </span>
          ) : null}
          {photo.isPremium ? (
            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-100">
              Premium
            </span>
          ) : null}
        </div>
      </div>
    </section>
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
  const { openHelp } = useKeyboardShortcutsLayer();
  const { toggleFavorite } = useFavorites();
  const startSwipe = useRef<{ x: number; y: number } | null>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const nearbyRef = useRef<HTMLDivElement>(null);
  const histogramRef = useRef<HTMLDivElement>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [compareOpen, setCompareOpen] = useState(false);

  const accent = useMemo(
    () => photo.dominantColor || "#22d3ee",
    [photo.dominantColor],
  );
  const previewSize = useMemo(() => getPreviewImageSize(photo), [photo]);
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/#${photo.slug ?? photo.id}`;
  }, [photo.id, photo.slug]);
  const formattedCapture = photo.takenAtRaw ?? photo.takenAt;

  useKeyboardShortcuts(
    useMemo(
      () => [
        {
          id: "photo-previous",
          keys:
            keyboardShortcuts.find((item) => item.id === "previous")?.keys ??
            [],
          handler: () => {
            if (hasPrevious) onPrevious();
          },
          enabled: isOpen,
        },
        {
          id: "photo-next",
          keys:
            keyboardShortcuts.find((item) => item.id === "next")?.keys ?? [],
          handler: () => {
            if (hasNext) onNext();
          },
          enabled: isOpen,
        },
        {
          id: "photo-close",
          keys:
            keyboardShortcuts.find((item) => item.id === "close")?.keys ?? [],
          handler: () => onClose(),
          enabled: isOpen,
        },
        {
          id: "photo-help",
          keys:
            keyboardShortcuts.find((item) => item.id === "help")?.keys ?? [],
          handler: () => openHelp(),
          enabled: isOpen,
        },
        {
          id: "photo-favorite",
          keys:
            keyboardShortcuts.find((item) => item.id === "favorite")?.keys ??
            [],
          handler: () => toggleFavorite(photo.id),
          enabled: isOpen,
        },
        {
          id: "photo-like",
          keys:
            keyboardShortcuts.find((item) => item.id === "like")?.keys ?? [],
          handler: () => toggleFavorite(photo.id),
          enabled: isOpen,
        },
        {
          id: "photo-copy",
          keys:
            keyboardShortcuts.find((item) => item.id === "copy")?.keys ?? [],
          handler: async () => {
            await navigator.clipboard.writeText(shareUrl);
          },
          enabled: isOpen,
        },
        {
          id: "photo-share",
          keys:
            keyboardShortcuts.find((item) => item.id === "share")?.keys ?? [],
          handler: async () => {
            if (navigator.share) {
              await navigator.share({
                title: photo.title,
                text: `Yan Saputra Photography - ${photo.title}`,
                url: shareUrl,
              });
              return;
            }
            await navigator.clipboard.writeText(shareUrl);
          },
          enabled: isOpen,
        },
        {
          id: "photo-map",
          keys: keyboardShortcuts.find((item) => item.id === "map")?.keys ?? [],
          handler: () => {
            if (!photo.location) return;
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(photo.location)}`,
              "_blank",
              "noopener,noreferrer",
            );
          },
          enabled: isOpen,
        },
        {
          id: "photo-metadata",
          keys:
            keyboardShortcuts.find((item) => item.id === "metadata")?.keys ??
            [],
          handler: () => {
            setShowSidebar((current) => !current);
          },
          enabled: isOpen,
        },
        {
          id: "photo-palette",
          keys:
            keyboardShortcuts.find((item) => item.id === "palette")?.keys ?? [],
          handler: () => {
            paletteRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          },
          enabled: isOpen,
        },
        {
          id: "photo-histogram",
          keys:
            keyboardShortcuts.find((item) => item.id === "histogram")?.keys ??
            [],
          handler: () => {
            histogramRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          },
          enabled: isOpen,
        },
        {
          id: "photo-similar",
          keys:
            keyboardShortcuts.find((item) => item.id === "similar")?.keys ?? [],
          handler: () => {
            nearbyRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          },
          enabled: isOpen,
        },
        {
          id: "photo-download",
          keys:
            keyboardShortcuts.find((item) => item.id === "download")?.keys ??
            [],
          handler: () => {
            downloadRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          },
          enabled: isOpen,
        },
        {
          id: "photo-zoom-toggle",
          keys:
            keyboardShortcuts.find((item) => item.id === "zoom-toggle")?.keys ??
            [],
          handler: () => setZoom((current) => (current === 1 ? 1.2 : 1)),
          enabled: isOpen,
        },
        {
          id: "photo-zoom-reset",
          keys:
            keyboardShortcuts.find((item) => item.id === "zoom-reset")?.keys ??
            [],
          handler: () => setZoom(1),
          enabled: isOpen,
        },
        {
          id: "photo-zoom-in",
          keys:
            keyboardShortcuts.find((item) => item.id === "zoom-in")?.keys ?? [],
          handler: () =>
            setZoom((current) => Math.min(3, +(current + 0.2).toFixed(1))),
          enabled: isOpen,
        },
        {
          id: "photo-zoom-out",
          keys:
            keyboardShortcuts.find((item) => item.id === "zoom-out")?.keys ??
            [],
          handler: () =>
            setZoom((current) => Math.max(1, +(current - 0.2).toFixed(1))),
          enabled: isOpen,
        },
      ],
      [
        hasNext,
        hasPrevious,
        isOpen,
        onClose,
        onNext,
        onPrevious,
        openHelp,
        photo.id,
        photo.location,
        photo.title,
        shareUrl,
        toggleFavorite,
      ],
    ),
  );

  if (!isOpen) {
    return null;
  }

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

  const zoomStyle =
    zoom === 1
      ? undefined
      : { transform: `scale(${zoom})`, transformOrigin: "center" };

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
              className="h-auto max-h-[calc(100dvh-4rem)] w-auto max-w-full object-contain transition-transform duration-200"
              style={zoomStyle}
            />
          </div>

          <div className="absolute left-4 top-4 flex gap-2 lg:left-4 lg:top-auto lg:inset-y-0 lg:items-center">
            <button
              type="button"
              onClick={() =>
                setZoom((current) => Math.min(3, +(current + 0.2).toFixed(1)))
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition hover:border-white/20 hover:bg-white/10"
              aria-label="Zoom in"
            >
              <ZoomIn className="size-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setZoom((current) => Math.max(1, +(current - 0.2).toFixed(1)))
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition hover:border-white/20 hover:bg-white/10"
              aria-label="Zoom out"
            >
              <ZoomOut className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-black/50 px-3 text-xs text-white transition hover:border-white/20 hover:bg-white/10"
            >
              0 Reset
            </button>
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

          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 md:hidden">
            <button
              type="button"
              onClick={() => setShowSidebar((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/75"
            >
              <ChevronUp className="size-4" />
              {showSidebar ? "Tutup Detail" : "Detail Foto"}
            </button>
          </div>
        </section>

        <aside className="hidden w-full shrink-0 overflow-y-auto border-t border-white/10 bg-zinc-950 p-5 md:block lg:w-[380px] lg:border-l lg:border-t-0 lg:p-6">
          <PhotoSidebar
            photo={photo}
            accent={accent}
            formattedCapture={formattedCapture}
            downloadRef={downloadRef}
            paletteRef={paletteRef}
            histogramRef={histogramRef}
            nearbyRef={nearbyRef}
            onOpenCompare={() => setCompareOpen(true)}
          />
        </aside>

        {showSidebar ? (
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
                  onClick={() => setShowSidebar(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                >
                  ✕ Tutup Detail
                </button>
              </div>
              <div className="max-h-[58dvh] overflow-y-auto pr-1">
                <p className="text-sm leading-7 text-zinc-300">{photo.story}</p>
                <div className="mt-4">
                  <PhotoSidebar
                    photo={photo}
                    accent={accent}
                    formattedCapture={formattedCapture}
                    downloadRef={downloadRef}
                    paletteRef={paletteRef}
                    histogramRef={histogramRef}
                    nearbyRef={nearbyRef}
                    onOpenCompare={() => setCompareOpen(true)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        <BeforeAfterModal
          photo={photo}
          open={compareOpen}
          onClose={() => setCompareOpen(false)}
        />
      </div>
    </motion.div>
  );
}

function PhotoSidebar({
  photo,
  accent,
  formattedCapture,
  downloadRef,
  paletteRef,
  histogramRef,
  nearbyRef,
  onOpenCompare,
}: {
  photo: GalleryPhoto;
  accent: string;
  formattedCapture: string;
  downloadRef: React.RefObject<HTMLDivElement | null>;
  paletteRef: React.RefObject<HTMLDivElement | null>;
  histogramRef: React.RefObject<HTMLDivElement | null>;
  nearbyRef: React.RefObject<HTMLDivElement | null>;
  onOpenCompare: () => void;
}) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const shareUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/#${photo.slug ?? photo.id}`;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
          {photo.collection}
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
          {photo.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
          {photo.story}
        </p>
      </div>

      <PhotoFacts
        photo={photo}
        accent={accent}
        formattedCapture={formattedCapture}
      />
      <BehindTheShotCard photo={photo} />
      <EditingPresetCard photo={photo} />
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-300">
          Edited Image Available
        </span>
        {photo.originalImageUrl ? (
          <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-300">
            Original Image Available
          </span>
        ) : null}
      </div>
      {photo.originalImageUrl ? (
        <BeforeAfterButton onClick={onOpenCompare} />
      ) : null}

      <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
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

      <div className="grid gap-4">
        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Quick Actions
          </p>
          <div className="mt-4 grid gap-3">
            <div ref={downloadRef}>
              <DownloadRequestPanel
                photoId={photo.id}
                photoTitle={photo.title}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => toggleFavorite(photo.id)}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-200 transition hover:border-red-300/30 hover:bg-red-300/5"
              >
                <Heart
                  className={`size-4 ${isFavorited(photo.id) ? "fill-red-400 text-red-400" : "text-zinc-400"}`}
                />
                Favorite
              </button>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(shareUrl);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-200 transition hover:border-cyan-300/30 hover:bg-white/5"
              >
                <Copy className="size-4" />
                Copy
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: photo.title,
                      text: `Yan Saputra Photography - ${photo.title}`,
                      url: shareUrl,
                    })
                    .catch(() => undefined);
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-200 transition hover:border-cyan-300/30 hover:bg-white/5"
            >
              <Link2 className="size-4" />
              Share
            </button>
          </div>
        </div>

        <div ref={histogramRef}>
          <Histogram imageUrl={photo.imageUrl} />
        </div>
        <div ref={paletteRef}>
          <PhotoPalette imageUrl={photo.imageUrl} />
        </div>
        <div ref={nearbyRef}>
          <NearbyPhotos photoId={photo.id} />
        </div>
      </div>
    </div>
  );
}
