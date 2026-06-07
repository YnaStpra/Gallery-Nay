"use client";

import { Copy, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PhotoPaletteProps = {
  imageUrl: string;
};

type PaletteModalColor = {
  hex: string;
  rgb: string;
};

function formatRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export function PhotoPalette({ imageUrl }: PhotoPaletteProps) {
  const [palette, setPalette] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState("");
  const [activeColor, setActiveColor] = useState<PaletteModalColor | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadPalette() {
      try {
        setLoading(true);
        setError(false);
        setPalette(null);

        const response = await fetch(
          `/api/photo/palette?imageUrl=${encodeURIComponent(imageUrl)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load palette");
        }

        const data = (await response.json()) as { palette?: string[] };

        if (!ignore) {
          setPalette(Array.isArray(data.palette) ? data.palette : []);
        }
      } catch (loadError) {
        console.error(loadError);
        if (!ignore) {
          setError(true);
          setPalette([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPalette();

    return () => {
      ignore = true;
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const colors = useMemo(() => palette ?? [], [palette]);

  const handleCopy = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setToast(`Copied ${hex}`);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5"
      style={
        colors[0]
          ? ({
              boxShadow: `0 0 0 1px ${colors[0]}20, 0 24px 80px -50px ${colors[0]}55`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {colors[0] ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors[0]}, transparent)`,
          }}
        />
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Colors in This Photo
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            🎨 Colors in This Photo
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            A curated palette extracted from the image.
          </p>
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-zinc-300">
            <Loader2 className="size-4 animate-spin text-cyan-300" />
            Extracting palette...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-zinc-300">
            Palette unavailable for this photo.
          </div>
        ) : colors.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-zinc-300">
            Palette unavailable for this photo.
          </div>
        ) : (
          <div className="grid gap-3">
            {colors.slice(0, 5).map((hex, index) => (
              <div
                key={hex}
                role="button"
                tabIndex={0}
                onClick={() =>
                  setActiveColor({
                    hex,
                    rgb: formatRgb(hex),
                  })
                }
                className="group grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded-3xl border border-white/10 bg-zinc-950/90 p-3 text-left transition hover:-translate-y-0.5 hover:border-cyan-300/30"
              >
                <div
                  className="h-[72px] w-[72px] rounded-2xl border border-white/10 shadow-inner shadow-black/20 transition duration-300 group-hover:scale-[1.03]"
                  style={{ backgroundColor: hex }}
                />
                <div className="min-w-0">
                  {index === 0 ? (
                    <p className="text-[11px] uppercase tracking-[0.24em] text-amber-200">
                      Dominant Color
                    </p>
                  ) : null}
                  <p className="mt-1 font-mono text-base font-semibold text-white">
                    {hex}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    void handleCopy(hex);
                  }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 transition hover:border-cyan-300/30 hover:bg-white/10"
                  aria-label={`Copy ${hex}`}
                >
                  <Copy className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeColor ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xs rounded-[28px] border border-white/10 bg-zinc-950 p-5 shadow-2xl shadow-black/40">
            <div
              className="h-28 rounded-3xl border border-white/10"
              style={{ backgroundColor: activeColor.hex }}
            />
            <div className="mt-4 space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                Color detail
              </p>
              <p className="font-mono text-lg font-semibold text-white">
                HEX: {activeColor.hex}
              </p>
              <p className="font-mono text-sm text-zinc-300">
                RGB: {activeColor.rgb}
              </p>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  void handleCopy(activeColor.hex);
                }}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-200"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={() => setActiveColor(null)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="pointer-events-none absolute right-4 top-4 z-30 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100 shadow-lg shadow-black/20">
          {toast}
        </div>
      ) : null}
    </section>
  );
}
