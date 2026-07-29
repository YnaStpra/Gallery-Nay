"use client";

import { Layers2 } from "lucide-react";

type Props = {
  disabled?: boolean;
  onClick: () => void;
};

export function BeforeAfterButton({ disabled, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Layers2 className="size-4" />
      Compare Before / After
    </button>
  );
}
