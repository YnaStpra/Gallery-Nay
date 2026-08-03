"use client";

import Image from "next/image";

export function UploadPreview({
  imageUrl,
  title,
  dominantColor,
  fileName,
  metadataMessage,
  selectedFileName,
}: {
  imageUrl?: string;
  title: string;
  dominantColor: string;
  fileName?: string;
  metadataMessage: string;
  selectedFileName: string;
}) {
  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-[0_30px_120px_-70px_rgba(0,0,0,0.9)]">
        <div
          className="relative aspect-[4/3] w-full"
          style={{
            background:
              dominantColor && dominantColor !== "#64748b"
                ? `linear-gradient(180deg, color-mix(in srgb, ${dominantColor} 24%, transparent), transparent 60%)`
                : "linear-gradient(180deg, rgba(34,211,238,0.12), transparent 60%)",
          }}
        >
          {imageUrl ? (
            <Image
              fill
              alt={title || "Selected preview"}
              className="object-contain"
              sizes="(min-width: 1280px) 50vw, 100vw"
              src={imageUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div className="max-w-xs px-6">
                <p className="text-lg font-semibold text-white">
                  Select a photo to start
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Live preview, metadata, histogram, and palette will appear
                  here before upload.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-3 rounded-3xl border border-white/10 bg-black/35 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">
              Live Preview
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              {title || "Untitled Photo"}
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              {selectedFileName || "No file selected"}
            </p>
          </div>
          <span
            className="size-5 rounded-sm border border-white/10"
            style={{ backgroundColor: dominantColor || "#64748b" }}
            aria-label={`Dominant color ${dominantColor}`}
          />
        </div>
        <p className="text-sm leading-6 text-zinc-300">
          {metadataMessage || "Select an image to read metadata."}
        </p>
        {fileName ? (
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            File: {fileName}
          </p>
        ) : null}
      </div>
    </div>
  );
}

