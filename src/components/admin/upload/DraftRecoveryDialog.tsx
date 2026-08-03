"use client";

type DraftRecoveryDialogProps = {
  open: boolean;
  draftName: string;
  onRestore: () => void;
  onDiscard: () => void;
  onClose: () => void;
};

export function DraftRecoveryDialog({
  open,
  draftName,
  onRestore,
  onDiscard,
  onClose,
}: DraftRecoveryDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/80">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
              Unsaved draft found
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Restore your upload session?
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              A draft from your previous upload session was found. You can
              restore field values or discard it and start fresh.
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

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm text-zinc-300">Draft snapshot:</p>
          <p className="mt-2 text-base font-medium text-white">{draftName}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onDiscard}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={onRestore}
            className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-medium text-black transition hover:bg-cyan-200"
          >
            Restore draft
          </button>
        </div>
      </div>
    </div>
  );
}
