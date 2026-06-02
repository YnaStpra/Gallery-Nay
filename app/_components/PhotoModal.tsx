"use client";

import Image from "next/image";
import type { PointerEvent, TouchEvent, WheelEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Aperture,
  Camera,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
} from "lucide-react";
import type { GalleryPhoto } from "@/src/lib/gallery-data";
import { useJourney, useRecentlyViewed } from "@/src/hooks";
import { DownloadRequestPanel } from "./DownloadRequestPanel";
import { PhotoCollectorActions } from "./PhotoCollectorActions";
import { getAspectRatio } from "./photo-utils";

type Props = {
  photo: GalleryPhoto;
  isOpen: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

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
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const startPan = useRef<{ x: number; y: number } | null>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const pinchState = useRef<{ distance: number; startScale: number } | null>(
    null,
  );

  const accent = useMemo(
    () => photo.dominantColor || "#22d3ee",
    [photo.dominantColor],
  );

  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `radial-gradient(circle at 18% 16%, ${accent}1a, transparent 26%), radial-gradient(circle at 78% 14%, ${accent}10, transparent 22%), linear-gradient(180deg, rgba(10,11,13,0.92), rgba(5,6,7,0.98))`,
    }),
    [accent],
  );

  const aspectRatio = getAspectRatio(photo);

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

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [hasNext, hasPrevious, isOpen, onClose, onNext, onPrevious]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    addToViewed(photo.id);
    addCountry(photo.country);
    addLocation(photo.location);
    addCollection(photo.collection);

    fetch(`/api/photo/${photo.id}/view`, { method: "POST" }).catch((error) => {
      console.error("Failed to track photo view", error);
    });
  }, [
    addCollection,
    addCountry,
    addLocation,
    addToViewed,
    isOpen,
    photo.collection,
    photo.country,
    photo.id,
    photo.location,
  ]);

  const handleDoubleClick = () => {
    setScale((current) => {
      const next = current > 1 ? 1 : 2.5;
      if (next === 1) {
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const nextScale = clamp(scale - event.deltaY * 0.002, 1, 4);
    setScale(nextScale);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (scale > 1) {
      startPan.current = { x: event.clientX, y: event.clientY };
      event.currentTarget.setPointerCapture(event.pointerId);
    } else {
      swipeStart.current = { x: event.clientX, y: event.clientY };
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!startPan.current || scale <= 1) return;
    const deltaX = event.clientX - startPan.current.x;
    const deltaY = event.clientY - startPan.current.y;
    setPan((current) => ({ x: current.x + deltaX, y: current.y + deltaY }));
    startPan.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (scale === 1 && swipeStart.current) {
      const delta = event.clientX - swipeStart.current.x;
      const vertical = Math.abs(event.clientY - swipeStart.current.y);
      if (Math.abs(delta) > 80 && vertical < 80) {
        if (delta < 0 && hasNext) onNext();
        if (delta > 0 && hasPrevious) onPrevious();
      }
    }
    startPan.current = null;
    swipeStart.current = null;
  };

  const handlePointerCancel = () => {
    startPan.current = null;
    swipeStart.current = null;
  };

  const handleTouchEnd = () => {
    pinchState.current = null;
    swipeStart.current = null;
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      const first = event.touches[0];
      const second = event.touches[1];
      if (!first || !second) return;
      const distance = Math.hypot(
        first.clientX - second.clientX,
        first.clientY - second.clientY,
      );
      pinchState.current = { distance, startScale: scale };
    }
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 2 || !pinchState.current) return;
    const first = event.touches[0];
    const second = event.touches[1];
    if (!first || !second) return;
    const distance = Math.hypot(
      first.clientX - second.clientX,
      first.clientY - second.clientY,
    );
    const nextScale = clamp(
      (distance / pinchState.current.distance) * pinchState.current.startScale,
      1,
      4,
    );
    setScale(nextScale);
  };

  if (!isOpen) {
    return null;
  }

  const formattedCapture = photo.takenAtRaw ?? photo.takenAt;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-hidden="true"
        />

        <motion.div
          className="relative mx-auto flex w-full max-w-[1600px] flex-col overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950/95 shadow-2xl shadow-black/80 backdrop-blur-xl"
          style={backgroundStyle}
          onClick={(event) => event.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <div
            className={`grid gap-10 items-start ${
              showInfo
                ? "lg:grid-cols-[1.9fr_minmax(440px,440px)]"
                : "lg:grid-cols-1"
            }`}
          >
            <div className="relative flex min-h-[70vh] items-center justify-center p-4 sm:p-6">
              <div className="relative w-full max-w-full overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950/75 shadow-[0_40px_120px_-72px_rgba(0,0,0,0.8)]">
                <div
                  className="relative mx-auto w-full overflow-hidden rounded-[32px] bg-zinc-950 touch-none"
                  style={{
                    aspectRatio,
                    maxHeight: "90vh",
                    touchAction: "none",
                    backgroundColor: `${accent}10`,
                  }}
                  onDoubleClick={handleDoubleClick}
                  onWheel={handleWheel}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ transformOrigin: "center center" }}
                    animate={{ scale, x: pan.x, y: pan.y }}
                    transition={{ type: "spring", damping: 26, stiffness: 260 }}
                  >
                    <Image
                      src={photo.imageUrl}
                      alt={photo.alt}
                      fill
                      className="h-full w-full object-contain"
                      sizes="(max-width: 1024px) 100vw, 70vw"
                      priority
                      placeholder={photo.blurDataUrl ? "blur" : "empty"}
                      blurDataURL={photo.blurDataUrl}
                      onLoadingComplete={() => setIsLoaded(true)}
                    />
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        isLoaded ? "opacity-0" : "opacity-100"
                      }`}
                      style={{
                        background: `radial-gradient(circle at center, ${accent}22, transparent 35%)`,
                      }}
                    />
                  </motion.div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowInfo((current) => !current)}
                  aria-label={
                    showInfo
                      ? "Hide photo information"
                      : "Show photo information"
                  }
                  className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-white backdrop-blur transition hover:border-white/20 hover:bg-white/10"
                >
                  <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-300">
                    ⓘ
                  </span>
                  <span>{showInfo ? "Hide Info" : "Info"}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close photo modal"
                  className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                >
                  <X className="size-5" />
                </button>

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
              </div>
            </div>

            <AnimatePresence initial={false}>
              {showInfo && (
                <motion.aside
                  className="absolute inset-x-0 bottom-0 z-50 mx-auto w-full max-w-4xl overflow-hidden rounded-t-[32px] border border-white/10 bg-zinc-950/95 p-6 shadow-2xl backdrop-blur-xl lg:relative lg:inset-auto lg:mx-0 lg:max-w-none lg:rounded-[32px] lg:border-none lg:bg-transparent lg:shadow-none"
                  initial={{ opacity: 0, x: 36, y: 18 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 36, y: 18 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                >
                  <div className="flex flex-col gap-8 lg:h-full">
                    <div className="space-y-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
                        {photo.collection}
                      </p>
                      <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                        {photo.title}
                      </h2>
                      <p className="text-sm leading-7 text-zinc-300 sm:text-base">
                        {photo.story}
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <DetailRow
                        label="Location"
                        value={`${photo.location}, ${photo.country}`}
                        accent={accent}
                      />
                      <DetailRow
                        label="Capture Date"
                        value={formattedCapture}
                        accent={accent}
                      />
                      <DetailRow
                        label="Collection"
                        value={photo.collection}
                        accent={accent}
                      />
                      <DetailRow
                        label="Camera"
                        value={photo.camera}
                        accent={accent}
                      />
                      <DetailRow
                        label="Lens"
                        value={photo.lens}
                        accent={accent}
                      />
                      <DetailRow
                        label="Focal Length"
                        value={photo.focalLength}
                        accent={accent}
                      />
                      <DetailRow
                        label="Aperture"
                        value={photo.aperture}
                        accent={accent}
                      />
                      <DetailRow
                        label="Shutter Speed"
                        value={photo.shutterSpeed}
                        accent={accent}
                      />
                      <DetailRow
                        label="ISO"
                        value={photo.iso}
                        accent={accent}
                      />
                      <DetailRow
                        label="Color Profile"
                        value={photo.colorProfile}
                        accent={accent}
                      />
                      <DetailRow
                        label="Copyright"
                        value={photo.copyright}
                        accent={accent}
                      />
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="inline-block h-3 w-8 rounded-full"
                            style={{ backgroundColor: accent }}
                          />
                          <span className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                            Dominant tone
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin
                            className="size-4 text-white"
                            aria-hidden="true"
                          />
                          <span>{photo.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Camera
                            className="size-4 text-white"
                            aria-hidden="true"
                          />
                          <span>{photo.camera}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Aperture
                            className="size-4 text-white"
                            aria-hidden="true"
                          />
                          <span>{photo.lens}</span>
                        </div>
                      </div>
                    </div>

                    <PhotoCollectorActions
                      photoId={photo.id}
                      slug={photo.slug}
                      title={photo.title}
                    />

                    <DownloadRequestPanel
                      photoId={photo.id}
                      photoTitle={photo.title}
                    />
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
