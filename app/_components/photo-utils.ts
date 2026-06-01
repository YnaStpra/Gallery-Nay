import type { GalleryPhoto } from "@/src/lib/gallery-data";

export function getAspectRatio(photo: GalleryPhoto): number {
  const [width, height] = photo.dimensions
    .split("x")
    .map((value) => Number(value.trim()));

  if (Number.isFinite(width) && Number.isFinite(height) && height > 0) {
    return width / height;
  }

  return 1;
}
