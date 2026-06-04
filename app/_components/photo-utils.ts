import type { GalleryPhoto } from "@/src/lib/gallery-data";

export function parsePhotoDimensions(photo: GalleryPhoto) {
  const fallbackWidth = photo.width ?? 1600;
  const fallbackHeight = photo.height ?? 1200;

  if (photo.width && photo.height) {
    return { width: photo.width, height: photo.height };
  }

  const [width, height] = photo.dimensions
    .split("x")
    .map((value) => Number(value.trim()));

  if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
    return { width, height };
  }

  return { width: fallbackWidth, height: fallbackHeight };
}

export function getAspectRatio(photo: GalleryPhoto): number {
  const { width, height } = parsePhotoDimensions(photo);

  if (Number.isFinite(width) && Number.isFinite(height) && height > 0) {
    return width / height;
  }

  return 1;
}

export function getPreviewImageSize(photo: GalleryPhoto) {
  const { width, height } = parsePhotoDimensions(photo);
  const targetHeight = 1200;
  const ratio = width / height;

  if (!Number.isFinite(ratio) || ratio <= 0) {
    return { height: targetHeight, width: targetHeight };
  }

  if (ratio >= 1) {
    return {
      height: targetHeight,
      width: Math.round(targetHeight * ratio),
    };
  }

  return {
    height: Math.round(targetHeight / ratio),
    width: targetHeight,
  };
}
