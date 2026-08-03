"use client";

import { CheckCircle2, Loader2, UploadCloud } from "lucide-react";

export type UploadProgressStage =
  | "idle"
  | "extract"
  | "palette"
  | "histogram"
  | "original"
  | "edited"
  | "database"
  | "complete";

const STAGES = [
  { id: "extract", label: "Extract Metadata" },
  { id: "palette", label: "Generate Palette" },
  { id: "histogram", label: "Generate Histogram" },
  { id: "original", label: "Upload Original" },
  { id: "edited", label: "Upload Edited" },
  { id: "database", label: "Save Database" },
  { id: "complete", label: "Complete" },
] as const;

export function UploadProgress({
  activeStage,
  message,
}: {
  activeStage: UploadProgressStage;
  message?: string;
}) {
  const activeIndex = STAGES.findIndex((stage) => stage.id === activeStage);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="flex items-center gap-2">
        {activeStage === "complete" ? (
          <CheckCircle2 className="size-4 text-emerald-300" aria-hidden />
        ) : (
          <Loader2 className="size-4 animate-spin text-cyan-200" aria-hidden />
        )}
        <p className="text-sm font-medium text-white">
          {activeStage === "complete"
            ? "Upload complete"
            : "Upload in progress"}
        </p>
      </div>
      {message ? (
        <p className="mt-2 text-xs leading-5 text-zinc-400">{message}</p>
      ) : null}
      <div className="mt-4 grid gap-2">
        {STAGES.map((stage, index) => {
          const isDone = index < activeIndex;
          const isActive = stage.id === activeStage;
          return (
            <div
              key={stage.id}
              className={`flex items-center justify-between rounded-xl border px-3 py-2 text-xs ${
                isActive
                  ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-50"
                  : isDone
                    ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                    : "border-white/10 bg-white/5 text-zinc-400"
              }`}
            >
              <span>{stage.label}</span>
              {isDone ? (
                <CheckCircle2 className="size-3.5" aria-hidden />
              ) : isActive ? (
                <UploadCloud className="size-3.5" aria-hidden />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

