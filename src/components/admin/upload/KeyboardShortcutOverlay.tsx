"use client";

type Shortcut = {
  label: string;
  keys: string;
  description: string;
};

type KeyboardShortcutOverlayProps = {
  open: boolean;
  onClose: () => void;
};

const shortcuts: Shortcut[] = [
  {
    label: "Save draft",
    keys: "Ctrl+S / Cmd+S",
    description: "Save the current upload draft.",
  },
  {
    label: "Publish",
    keys: "Ctrl+Enter / Cmd+Enter",
    description: "Submit the upload form.",
  },
  {
    label: "Cancel upload",
    keys: "Esc",
    description: "Reset the current file selection.",
  },
  {
    label: "Focus title",
    keys: "Ctrl+T / Cmd+T",
    description: "Jump to the title field.",
  },
  {
    label: "Focus tags",
    keys: "Ctrl+N / Cmd+N",
    description: "Jump to the tags field.",
  },
  {
    label: "Focus notes",
    keys: "Ctrl+P / Cmd+P",
    description: "Jump to photographer notes.",
  },
];

export function KeyboardShortcutOverlay({
  open,
  onClose,
}: KeyboardShortcutOverlayProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-xl">
      <div className="w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/90">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Keyboard shortcuts
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Use these shortcuts to move faster through the upload workflow.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.keys}
              className="rounded-3xl border border-white/10 bg-black/40 p-4"
            >
              <p className="text-sm font-semibold text-white">
                {shortcut.label}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-cyan-300">
                Keys
              </p>
              <p className="mt-1 font-mono text-sm text-white">
                {shortcut.keys}
              </p>
              <p className="mt-3 text-sm text-zinc-400">
                {shortcut.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
