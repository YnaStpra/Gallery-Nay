"use client";

import { Keyboard } from "lucide-react";

export function KeyboardShortcutOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-center gap-2">
          <Keyboard className="size-5 text-cyan-200" aria-hidden />
          <h3 className="text-xl font-semibold text-white">
            Keyboard Shortcuts
          </h3>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <ShortcutBlock
            title="Navigation"
            items={[
              ["Tab", "Next Field"],
              ["Shift + Tab", "Previous Field"],
              ["Esc", "Cancel Upload"],
            ]}
          />
          <ShortcutBlock
            title="Save"
            items={[
              ["Ctrl/Cmd + S", "Save Draft"],
              ["Ctrl/Cmd + Enter", "Publish"],
              ["Ctrl/Cmd + L", "Focus Title"],
              ["Ctrl/Cmd + T", "Focus Tags"],
              ["Ctrl/Cmd + N", "Focus Photographer Notes"],
            ]}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ShortcutBlock({
  title,
  items,
}: {
  title: string;
  items: Array<[string, string]>;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">
        {title}
      </p>
      <div className="mt-4 grid gap-3">
        {items.map(([key, label]) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="text-sm text-zinc-200">{label}</span>
            <kbd className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-300">
              {key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
}

