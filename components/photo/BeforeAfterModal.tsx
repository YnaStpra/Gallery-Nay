"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useMemo, useCallback } from "react";

import type { GalleryPhoto } from "@/src/lib/gallery-data";
import { useBeforeAfter } from "@/src/hooks/useBeforeAfter";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

type Props = {
  photo: GalleryPhoto;
  open: boolean;
  onClose: () => void;
};

export function BeforeAfterModal({ photo, open, onClose }: Props) {
  const { closeModal, moveSplit, resetSplit, setSplit, showLabels, toggleLabels, split } =
    useBeforeAfter();

  useEffect(() => {
    if (open) {
      resetSplit();
    }
  }, [open, resetSplit]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key === " ") {
        event.preventDefault();
        toggleLabels();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveSplit(-2);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveSplit(2);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveSplit, onClose, open, toggleLabels]);

  const hasOriginal = Boolean(photo.originalImageUrl);

  const beforeImageUrl = useMemo(
    () => photo.originalImageUrl ?? photo.imageUrl,
    [photo.imageUrl, photo.originalImageUrl],
  );

  const handleClose = useCallback(() => {
    closeModal();
    onClose();
  }, [closeModal, onClose]);

  if (!hasOriginal || !open) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[120] bg-black/90 p-3 backdrop-blur-xl sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70" onClick={handleClose} aria-hidden="true" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4 sm:p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                Before / After Comparison
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                Compare original and edited image
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              aria-label="Close compare modal"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-xs text-zinc-400 sm:px-6">
            <span>Space: toggle label</span>
            <span>Double click: reset slider</span>
            <span>Esc: close</span>
          </div>

          <div className="relative min-h-0 flex-1 p-4 sm:p-6">
            <BeforeAfterSlider
              afterAlt={photo.alt}
              afterBlurDataUrl={photo.blurDataUrl}
              afterImageUrl={photo.imageUrl}
              beforeAlt={`${photo.title} original`}
              beforeBlurDataUrl={photo.blurDataUrl}
              beforeImageUrl={beforeImageUrl}
              showLabels={showLabels}
              split={split}
              onSplitChange={setSplit}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
