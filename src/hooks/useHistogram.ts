"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type HistogramChannels = {
  red: number[];
  green: number[];
  blue: number[];
  pixels: number;
};

type HistogramState = {
  histogram: HistogramChannels | null;
  loading: boolean;
  error: string | null;
};

type CacheEntry = {
  promise?: Promise<HistogramChannels>;
  value?: HistogramChannels;
  error?: string;
};

const histogramCache = new Map<string, CacheEntry>();

function createEmptyHistogram(): HistogramChannels {
  return {
    red: Array.from({ length: 256 }, () => 0),
    green: Array.from({ length: 256 }, () => 0),
    blue: Array.from({ length: 256 }, () => 0),
    pixels: 0,
  };
}

function downscaleDimensions(width: number, height: number, maxSize: number) {
  if (width <= maxSize && height <= maxSize) {
    return { width, height };
  }

  const scale = Math.min(maxSize / width, maxSize / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function loadImage(imageUrl: string) {
  const image = new window.Image();
  image.crossOrigin = "anonymous";
  image.decoding = "async";

  return await new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image"));
    image.src = imageUrl;
  });
}

async function computeHistogram(
  imageUrl: string,
  maxSize: number,
): Promise<HistogramChannels> {
  const image = await loadImage(imageUrl);

  const { width, height } = downscaleDimensions(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    maxSize,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Canvas context unavailable");
  }

  context.drawImage(image, 0, 0, width, height);

  const { data } = context.getImageData(0, 0, width, height);
  const histogram = createEmptyHistogram();
  histogram.pixels = width * height;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index] ?? 0;
    const green = data[index + 1] ?? 0;
    const blue = data[index + 2] ?? 0;

    histogram.red[red] += 1;
    histogram.green[green] += 1;
    histogram.blue[blue] += 1;
  }

  return histogram;
}

function getCachedHistogram(imageUrl: string, maxSize: number) {
  const cacheKey = `${imageUrl}|${maxSize}`;
  const cached = histogramCache.get(cacheKey);

  if (cached?.value) {
    return Promise.resolve(cached.value);
  }

  if (cached?.promise) {
    return cached.promise;
  }

  const promise = computeHistogram(imageUrl, maxSize)
    .then((value) => {
      histogramCache.set(cacheKey, { value });
      return value;
    })
    .catch((error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Unable to generate histogram";
      histogramCache.set(cacheKey, { error: message });
      throw error;
    });

  histogramCache.set(cacheKey, { promise });
  return promise;
}

export function useHistogram(imageUrl: string, maxSize = 1000) {
  const [state, setState] = useState<HistogramState>({
    histogram: null,
    loading: true,
    error: null,
  });
  const requestIdRef = useRef(0);

  const reload = useCallback(() => {
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;

    if (!imageUrl) {
      setState({
        histogram: null,
        loading: false,
        error: "Unable to generate histogram.",
      });
      return;
    }

    if (typeof window === "undefined" || !window.HTMLCanvasElement) {
      setState({
        histogram: null,
        loading: false,
        error: "Histogram unavailable in this browser.",
      });
      return;
    }

    setState((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    void getCachedHistogram(imageUrl, maxSize)
      .then((histogram) => {
        if (requestIdRef.current !== requestId) {
          return;
        }

        setState({
          histogram,
          loading: false,
          error: null,
        });
      })
      .catch(() => {
        if (requestIdRef.current !== requestId) {
          return;
        }

        setState({
          histogram: null,
          loading: false,
          error: "Unable to generate histogram.",
        });
      });
  }, [imageUrl, maxSize]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void reload();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [reload]);

  return useMemo(
    () => ({
      histogram: state.histogram,
      loading: state.loading,
      error: state.error,
      reload,
    }),
    [reload, state.error, state.histogram, state.loading],
  );
}
