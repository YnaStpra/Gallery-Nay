"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";

import { useHistogram } from "@/src/hooks/useHistogram";

type Props = {
  imageUrl: string;
  width?: number;
  height?: number;
};

type ChannelKey = "rgb" | "red" | "green" | "blue";

const channelStyles: Record<
  Exclude<ChannelKey, "rgb">,
  { color: string; label: string }
> = {
  red: { color: "rgba(255,0,0,.8)", label: "R" },
  green: { color: "rgba(0,255,0,.8)", label: "G" },
  blue: { color: "rgba(0,120,255,.8)", label: "B" },
};

function buildPath(values: number[], width: number, height: number) {
  const max = Math.max(...values, 1);
  const step = width / (values.length - 1);

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - (value / max) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function ChannelToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        checked
          ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
          : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
      }`}
      aria-pressed={checked}
    >
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current">
        {checked ? <Check className="size-3" /> : null}
      </span>
      {label}
    </button>
  );
}

export function Histogram({ imageUrl, width = 320, height = 140 }: Props) {
  const { histogram, loading, error, reload } = useHistogram(imageUrl, 1000);
  const [activeChannels, setActiveChannels] = useState<ChannelKey[]>(["rgb"]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveChannels(["rgb"]);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [imageUrl]);

  const paths = useMemo(() => {
    if (!histogram) {
      return null;
    }

    return {
      red: buildPath(histogram.red, width, height),
      green: buildPath(histogram.green, width, height),
      blue: buildPath(histogram.blue, width, height),
    };
  }, [height, histogram, width]);

  const toggleChannel = (channel: ChannelKey) => {
    setActiveChannels((current) => {
      if (channel === "rgb") {
        return current.includes("rgb") && current.length === 1 ? ["red", "green", "blue"] : ["rgb"];
      }

      const next = current.filter((item) => item !== "rgb");
      if (next.includes(channel)) {
        const filtered = next.filter((item) => item !== channel);
        return filtered.length > 0 ? filtered : ["rgb"];
      }

      return [...next, channel];
    });
  };

  const hasRgb = activeChannels.includes("rgb");
  const showRed = hasRgb || activeChannels.includes("red");
  const showGreen = hasRgb || activeChannels.includes("green");
  const showBlue = hasRgb || activeChannels.includes("blue");

  return (
    <section
      className="rounded-[24px] border border-white/10 bg-black/20 p-4"
      aria-label="RGB histogram"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Histogram
          </p>
          <h3 className="mt-2 text-sm font-semibold text-white">RGB Histogram</h3>
        </div>
        <button
          type="button"
          onClick={reload}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10"
        >
          Reload
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-3">
        {loading ? (
          <div className="flex h-[140px] items-center justify-center text-sm text-zinc-400">
            Loading histogram...
          </div>
        ) : error ? (
          <div className="flex h-[140px] items-center justify-center text-sm text-zinc-400">
            {error}
          </div>
        ) : paths ? (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-[140px] w-full"
            role="img"
            aria-label="RGB histogram chart"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="hist-red" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,0,0,.8)" stopOpacity="0.95" />
                <stop offset="100%" stopColor="rgba(255,0,0,.8)" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="hist-green" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,255,0,.8)" stopOpacity="0.95" />
                <stop offset="100%" stopColor="rgba(0,255,0,.8)" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="hist-blue" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,120,255,.8)" stopOpacity="0.95" />
                <stop offset="100%" stopColor="rgba(0,120,255,.8)" stopOpacity="0.05" />
              </linearGradient>
              <filter id="hist-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {showRed ? (
              <path
                d={paths.red}
                fill="none"
                stroke={hasRgb ? "url(#hist-red)" : channelStyles.red.color}
                strokeWidth="1.8"
                filter="url(#hist-glow)"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ) : null}
            {showGreen ? (
              <path
                d={paths.green}
                fill="none"
                stroke={hasRgb ? "url(#hist-green)" : channelStyles.green.color}
                strokeWidth="1.8"
                filter="url(#hist-glow)"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ) : null}
            {showBlue ? (
              <path
                d={paths.blue}
                fill="none"
                stroke={hasRgb ? "url(#hist-blue)" : channelStyles.blue.color}
                strokeWidth="1.8"
                filter="url(#hist-glow)"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ) : null}
          </svg>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <ChannelToggle checked={hasRgb} label="RGB" onChange={() => toggleChannel("rgb")} />
        <ChannelToggle checked={showRed && !hasRgb} label="R" onChange={() => toggleChannel("red")} />
        <ChannelToggle checked={showGreen && !hasRgb} label="G" onChange={() => toggleChannel("green")} />
        <ChannelToggle checked={showBlue && !hasRgb} label="B" onChange={() => toggleChannel("blue")} />
      </div>
    </section>
  );
}
