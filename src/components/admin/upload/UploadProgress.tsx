"use client";

type ProgressStep = {
  key: string;
  label: string;
};

type UploadProgressProps = {
  stage: string;
  status: "idle" | "active" | "complete" | "error";
  message?: string;
};

const steps: ProgressStep[] = [
  { key: "extract", label: "Extract Metadata" },
  { key: "preview", label: "Generate Preview" },
  { key: "palette", label: "Generate Palette" },
  { key: "histogram", label: "Generate Histogram" },
  { key: "upload", label: "Upload Original" },
  { key: "save", label: "Save Database" },
  { key: "complete", label: "Complete" },
];

export function UploadProgress({
  stage,
  status,
  message,
}: UploadProgressProps) {
  const currentIndex = Math.max(
    0,
    steps.findIndex((item) => item.key === stage),
  );

  return (
    <section className="rounded-[28px] border border-white/10 bg-black/40 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Upload progress
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            Realtime workflow
          </h3>
        </div>
        <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs uppercase tracking-[0.20em] text-zinc-300">
          {status === "complete"
            ? "Ready"
            : status === "error"
              ? "Issue"
              : stage}
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const active = step.key === stage;
          const complete =
            index < currentIndex ||
            (status === "complete" && step.key === "complete");

          return (
            <div key={step.key} className="flex items-center gap-3">
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition ${
                  active
                    ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                    : complete
                      ? "border-emerald-300 bg-emerald-300/10 text-emerald-100"
                      : "border-white/10 bg-white/5 text-zinc-500"
                }`}
              >
                {complete ? "✓" : active ? "•" : ""}
              </span>
              <span className="text-sm text-white">{step.label}</span>
            </div>
          );
        })}
      </div>

      {message ? (
        <p className="mt-4 rounded-2xl border border-cyan-300/10 bg-cyan-300/5 px-4 py-3 text-sm text-cyan-100">
          {message}
        </p>
      ) : null}
    </section>
  );
}
