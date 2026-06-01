import type { GalleryPhoto } from "@/src/lib/gallery-data";

export function getMarkerClusters(photos: GalleryPhoto[]) {
  return photos
    .filter((photo) => photo.coordinates)
    .map((photo) => ({
      id: photo.id,
      title: photo.title,
      location: photo.location,
      coordinates: photo.coordinates!,
      thumbnail: photo.imageUrl,
      dominantColor: photo.dominantColor,
    }));
}
