"use client";

import { X } from "lucide-react";

type ModalCloseButtonProps = {
  onClick: () => void;
  ariaLabel: string;
  className?: string;
};

export function ModalCloseButton({
  onClick,
  ariaLabel,
  className = "",
}: ModalCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-lg shadow-black/30 backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 ${className}`}
    >
      <X className="size-5" />
    </button>
  );
}
