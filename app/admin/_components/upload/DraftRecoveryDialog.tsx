"use client";

export function DraftRecoveryDialog({
  open,
  onRestore,
  onDiscard,
}: {
  open: boolean;
  onRestore: () => void;
  onDiscard: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">
          Unsaved Draft Found
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">
          Restore your upload draft?
        </h3>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          A previous draft is available in this browser. Restore it or discard
          it and start fresh.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRestore}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-200"
          >
            Restore Draft
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}

