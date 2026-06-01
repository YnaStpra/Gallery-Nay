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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
        {label}
      </dt>
      <dd className="text-sm leading-6 text-zinc-100">{value}</dd>
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
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const startPan = useRef<{ x: number; y: number } | null>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const pinchState = useRef<{ distance: number; startScale: number } | null>(
    null,
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
      setScale(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen, photo.id]);

  const handleDoubleClick = () => {
    setScale((current) => (current > 1 ? 1 : 2.3));
    if (scale > 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const nextScale = clamp(scale - event.deltaY * 0.0018, 1, 3);
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
      3,
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
          className="relative mx-auto w-full max-w-350 overflow-hidden rounded-4xl border border-white/10 bg-zinc-950/95 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(380px,1fr)]">
            <div className="relative bg-zinc-900 p-4 sm:p-6">
              <div
                className="relative mx-auto w-full overflow-hidden rounded-[28px] bg-zinc-950 touch-none"
                style={{ aspectRatio, maxHeight: "76vh", touchAction: "none" }}
                onDoubleClick={handleDoubleClick}
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                <motion.div
                  className="absolute inset-0"
                  style={pan}
                  animate={{ scale }}
                  transition={{ type: "spring", damping: 20, stiffness: 280 }}
                >
                  <Image
                    src={photo.imageUrl}
                    alt={photo.alt}
                    fill
                    className="h-full w-full object-contain"
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    priority
                  />
                </motion.div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close photo modal"
                className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <X className="size-5" />
              </button>

              <div className="absolute inset-y-0 left-4 flex items-center">
                <button
                  type="button"
                  disabled={!hasPrevious}
                  onClick={onPrevious}
                  aria-label="Previous photo"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="size-5" />
                </button>
              </div>

              <div className="absolute inset-y-0 right-4 flex items-center justify-end">
                <button
                  type="button"
                  disabled={!hasNext}
                  onClick={onNext}
                  aria-label="Next photo"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 border-t border-white/10 p-6 text-zinc-200 lg:border-t-0 lg:border-l lg:p-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
                    {photo.collection}
                  </p>
                  <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    {photo.title}
                  </h2>
                  <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                    {photo.story}
                  </p>
                </div>

                <div className="grid gap-3">
                  <DetailRow
                    label="Location"
                    value={`${photo.location}, ${photo.country}`}
                  />
                  <DetailRow label="Capture Date" value={formattedCapture} />
                  <DetailRow label="Collection" value={photo.collection} />
                  <DetailRow label="Camera" value={photo.camera} />
                  <DetailRow label="Lens" value={photo.lens} />
                  <DetailRow label="Focal Length" value={photo.focalLength} />
                  <DetailRow label="Aperture" value={photo.aperture} />
                  <DetailRow label="Shutter Speed" value={photo.shutterSpeed} />
                  <DetailRow label="ISO" value={photo.iso} />
                  <DetailRow label="Color Profile" value={photo.colorProfile} />
                  <DetailRow label="Copyright" value={photo.copyright} />
                </div>
              </div>

              <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-cyan-300" aria-hidden="true" />
                  <span>{photo.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Camera className="size-4 text-cyan-300" aria-hidden="true" />
                  <span>{photo.camera}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
