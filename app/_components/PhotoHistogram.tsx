"use client";

import { useEffect, useState } from "react";

type Props = {
  imageUrl: string;
};

export function PhotoHistogram({ imageUrl }: Props) {
  const [bins, setBins] = useState<number[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 96;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Canvas context unavailable");
        }

        ctx.drawImage(image, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        const nextBins = Array.from({ length: 16 }, () => 0);

        for (let index = 0; index < data.length; index += 4) {
          const r = data[index] ?? 0;
          const g = data[index + 1] ?? 0;
          const b = data[index + 2] ?? 0;
          const luminance = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          const binIndex = Math.min(15, Math.floor((luminance / 256) * 16));
          nextBins[binIndex] += 1;
        }

        if (!cancelled) {
          setBins(nextBins);
        }
      } catch (error) {
        console.error("Failed to compute histogram", error);
        if (!cancelled) {
          setBins([]);
        }
      }
    };

    image.onerror = () => {
      if (!cancelled) {
        setBins([]);
      }
    };

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  if (bins === null) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-5 text-sm text-zinc-300">
        Loading histogram...
      </div>
    );
  }

  if (bins.length === 0) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-5 text-sm text-zinc-300">
        Histogram unavailable for this photo.
      </div>
    );
  }

  const max = Math.max(...bins, 1);

  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
        Histogram
      </p>
      <div className="mt-4 flex h-28 items-end gap-1">
        {bins.map((value, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-md bg-gradient-to-t from-cyan-400/40 to-cyan-200/90"
            style={{ height: `${Math.max(8, (value / max) * 100)}%` }}
          />
        ))}
      </div>
    </div>
  );
}
