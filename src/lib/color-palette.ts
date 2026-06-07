import { cache } from "react";
import { Vibrant } from "node-vibrant/node";

type VibrantSwatch = {
  hex: string;
  rgb: [number, number, number];
};

type PaletteLike = Record<
  string,
  { hex: string; rgb: [number, number, number] } | null | undefined
>;

const MIN_CHANNEL = 8;
const MAX_CHANNEL = 247;
const MAX_COLORS = 5;
const COLOR_DISTANCE_THRESHOLD = 28;

function isValidHex(hex: string) {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

function isAcceptableColor([r, g, b]: [number, number, number]) {
  return [r, g, b].every((channel) => channel >= MIN_CHANNEL && channel <= MAX_CHANNEL);
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function colorDistance(a: [number, number, number], b: [number, number, number]) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function dedupeColors(swatches: VibrantSwatch[]) {
  const result: VibrantSwatch[] = [];

  for (const swatch of swatches) {
    if (!isValidHex(swatch.hex) || !isAcceptableColor(swatch.rgb)) {
      continue;
    }

    const isDuplicate = result.some(
      (existing) =>
        existing.hex.toLowerCase() === swatch.hex.toLowerCase() ||
        colorDistance(existing.rgb, swatch.rgb) < COLOR_DISTANCE_THRESHOLD,
    );

    if (!isDuplicate) {
      result.push(swatch);
    }

    if (result.length >= MAX_COLORS) {
      break;
    }
  }

  return result;
}

function normalizePalette(palette: PaletteLike | null | undefined) {
  if (!palette) {
    return [];
  }

  const ordered = [
    palette.Vibrant,
    palette.DarkVibrant,
    palette.LightVibrant,
    palette.Muted,
    palette.DarkMuted,
    palette.LightMuted,
  ]
    .filter(Boolean)
    .map((swatch) => ({
      hex: swatch!.hex,
      rgb: swatch!.rgb as [number, number, number],
    }));

  return dedupeColors(ordered);
}

async function extractPalette(imageUrl: string) {
  const palette = await Vibrant.from(imageUrl).getPalette();
  const colors = normalizePalette(palette);
  return colors.map((swatch) => swatch.hex);
}

export const getColorPalette = cache(async (imageUrl: string) => {
  try {
    return await extractPalette(imageUrl);
  } catch (error) {
    console.error("Failed to extract color palette", error);
    return [] as string[];
  }
});

export function hexToRgbTuple(hex: string) {
  return hexToRgb(hex);
}
