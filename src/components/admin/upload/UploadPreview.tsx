"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  FitScreen,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

type PreviewMetadata = {
  title: string;
  camera: string;
  lens: string;
  location: string;
  country: string;
  collection: string;
  cameraProfile: string;
  editingSoftware: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
  takenAt: string;
  dominantColor: string;
};

type UploadPreviewProps = {
  imageUrl: string | null;
  previewName: string;
  metadata: PreviewMetadata;
  onDetailsReady: (details: {
    width: number;
    height: number;
    aspectRatio: string;
    dominantColor: string;
  }) => void;
};

function toHex(value: number) {
  return value.toString(16).padStart(2, "0");
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function UploadPreview({
  imageUrl,
  previewName,
  metadata,
  onDetailsReady,
}: UploadPreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [palette, setPalette] = useState<string[]>([]);
  const [dominantColor, setDominantColor] = useState(
    metadata.dominantColor || "#64748b",
  );
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!imageUrl) {
      setPalette([]);
      setDominantColor(metadata.dominantColor || "#64748b");
      setImageSize({ width: 0, height: 0 });
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.src = imageUrl;

    const handleLoad = async () => {
      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;
      setImageSize({ width, height });
      const ratio = width && height ? `${width}:${height}` : "n/a";
      onDetailsReady({
        width,
        height,
        aspectRatio: ratio,
        dominantColor: dominantColor || "#64748b",
      });

      const canvas = document.createElement("canvas");
      const maxSize = 240;
      const scale = Math.min(1, maxSize / Math.max(width, height));
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;
      const colorMap = new Map<string, number>();

      for (let i = 0; i < imageData.length; i += 8) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const hex = rgbToHex(r, g, b);
        colorMap.set(hex, (colorMap.get(hex) ?? 0) + 1);
      }

      const sorted = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([hex]) => hex);

      setPalette(sorted);
      if (sorted.length > 0) {
        setDominantColor(sorted[0]);
        onDetailsReady({
          width,
          height,
          aspectRatio: ratio,
          dominantColor: sorted[0],
        });
      }
    };

    image.addEventListener("load", handleLoad);
    return () => {
      image.removeEventListener("load", handleLoad);
    };
  }, [imageUrl, metadata.dominantColor, onDetailsReady, dominantColor]);

  const previewTiles = useMemo(
    () => [
      {
        label: "Aspect ratio",
        value:
          imageSize.width && imageSize.height
            ? `${imageSize.width}:${imageSize.height}`
            : "—",
      },
      {
        label: "Resolution",
        value: imageSize.width ? `${imageSize.width}×${imageSize.height}` : "—",
      },
      { label: "Dominant color", value: dominantColor },
      { label: "Camera", value: metadata.camera || "—" },
      { label: "Lens", value: metadata.lens || "—" },
    ],
    [
      dominantColor,
      imageSize.height,
      imageSize.width,
      metadata.camera,
      metadata.lens,
    ],
  );

  return (
    <section className="rounded-[32px] border border-white/10 bg-zinc-950/60 p-5 shadow-[0_30px_120px_-90px_rgba(0,0,0,0.8)]">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Live preview
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Photo preview
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            See the selected photo and metadata before publishing.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition hover:bg-white/10"
            onClick={() => setZoom(1)}
          >
            <FitScreen className="size-4" /> Fit
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition hover:bg-white/10"
            onClick={() => setZoom((current) => Math.min(2.4, current + 0.25))}
          >
            <ZoomIn className="size-4" /> Zoom In
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition hover:bg-white/10"
            onClick={() => setZoom((current) => Math.max(0.6, current - 0.25))}
          >
            <ZoomOut className="size-4" /> Zoom Out
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-4">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/70 p-4">
            <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/70 px-3 py-2 text-xs uppercase tracking-[0.2em] text-zinc-300">
              {previewName || "No photo selected"}
            </div>
            <div className="flex h-[380px] items-center justify-center overflow-hidden rounded-[22px] bg-zinc-950">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={metadata.title || "Upload preview"}
                  className="max-h-full max-w-full transition-transform duration-200"
                  style={{ transform: `scale(${zoom})` }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-center text-sm text-zinc-500">
                  Select a photo to generate live preview and metadata.
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <ArrowUpRight className="size-3" /> Zoom: {zoom.toFixed(2)}x
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <ArrowDownLeft className="size-3" /> Fit mode
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {previewTiles.map((tile) => (
              <div
                key={tile.label}
                className="rounded-3xl border border-white/10 bg-black/50 p-4"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                  {tile.label}
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {tile.value || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              Photo information
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Quick metadata
            </h3>
            <dl className="mt-4 grid gap-3 text-sm text-zinc-300">
              {[
                ["Title", metadata.title],
                ["Camera", metadata.camera],
                ["Lens", metadata.lens],
                ["Location", metadata.location],
                ["Collection", metadata.collection],
                ["Software", metadata.editingSoftware],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="grid gap-1 rounded-2xl border border-white/10 bg-black/50 p-3"
                >
                  <dt className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                    {label}
                  </dt>
                  <dd className="text-sm text-white">{value || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              Palette
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Dominant colors
            </h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {palette.length > 0 ? (
                palette.map((hex) => (
                  <div
                    key={hex}
                    className="group rounded-[22px] border border-white/10 p-4 text-center transition hover:-translate-y-0.5 hover:border-cyan-300/30"
                  >
                    <div
                      className="mx-auto h-16 w-16 rounded-2xl border border-white/10"
                      style={{ backgroundColor: hex }}
                    />
                    <p className="mt-3 text-xs text-zinc-300">{hex}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
                  Palette will appear after the image loads.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              Estimated color
            </p>
            <div className="mt-4 flex items-center gap-4 rounded-3xl border border-white/10 bg-black/70 p-4">
              <div
                className="h-14 w-14 rounded-2xl border border-white/15"
                style={{ backgroundColor: dominantColor }}
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  Dominant color
                </p>
                <p className="mt-1 text-sm text-zinc-300">{dominantColor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[28px] border border-white/10 bg-black/20 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          Preview metadata
        </p>
        <div className="mt-4 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/70 p-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              Title
            </p>
            <p className="mt-2 text-sm text-white">{metadata.title || "—"}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/70 p-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              Country
            </p>
            <p className="mt-2 text-sm text-white">{metadata.country || "—"}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/70 p-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              Camera profile
            </p>
            <p className="mt-2 text-sm text-white">
              {metadata.cameraProfile || "—"}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/70 p-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              Software
            </p>
            <p className="mt-2 text-sm text-white">
              {metadata.editingSoftware || "—"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
