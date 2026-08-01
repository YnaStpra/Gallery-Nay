import { prisma } from "@/src/lib/prisma";
import type { GalleryPhoto } from "@/src/lib/gallery-data";

export type GalleryCollection = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  photoCount: number;
  locationCount: number;
  countryCount: number;
  createdAt: string;
  updatedAt: string;
  photos: GalleryPhoto[];
};

function formatDate(date: Date | null) {
  return date ? date.toISOString() : "";
}

type CollectionPhotoRecord = {
  altText: string | null;
  aperture: string | null;
  blurDataUrl?: string | null;
  camera: string | null;
  collection: string | null;
  collectionId: string | null;
  colorProfile: string | null;
  copyright: string | null;
  country: string | null;
  description: string | null;
  dominantColor: string | null;
  fileType: string | null;
  focalLength: string | null;
  height: number | null;
  id: string;
  imageUrl: string;
  iso: number | null;
  latitude: number | null;
  lens: string | null;
  location: string | null;
  longitude: number | null;
  shutterSpeed: string | null;
  slug: string | null;
  takenAt: Date | null;
  title: string;
  width: number | null;
};

function mapPhoto(photo: CollectionPhotoRecord): GalleryPhoto {
  return {
    alt: photo.altText ?? photo.title,
    aperture: photo.aperture ?? "Not set",
    camera: photo.camera ?? "Not set",
    collection: photo.collection ?? "Published Archive",
    collectionId: photo.collectionId ?? undefined,
    colorProfile: photo.colorProfile ?? "sRGB",
    copyright: photo.copyright ?? "(c) Yan Saputra",
    country: photo.country ?? "Not set",
    coordinates:
      photo.latitude != null && photo.longitude != null
        ? { lat: photo.latitude, lng: photo.longitude }
        : undefined,
    dimensions:
      photo.width && photo.height
        ? `${photo.width} x ${photo.height}`
        : "Not set",
    dominantColor: photo.dominantColor ?? "#64748b",
    blurDataUrl: photo.blurDataUrl ?? undefined,
    fileType: photo.fileType ?? "Display copy",
    focalLength: photo.focalLength ?? "Not set",
    id: photo.id,
    imageUrl: photo.imageUrl,
    iso: photo.iso ? String(photo.iso) : "Not set",
    lens: photo.lens ?? "Not set",
    location: photo.location ?? "Not set",
    shutterSpeed: photo.shutterSpeed ?? "Not set",
    story: photo.description ?? "Published travel frame.",
    takenAt: photo.takenAt
      ? new Intl.DateTimeFormat("en", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(photo.takenAt)
      : "Date not set",
    takenAtRaw: photo.takenAt?.toISOString() ?? undefined,
    slug: photo.slug ?? undefined,
    title: photo.title,
  };
}

export async function getCollections(): Promise<GalleryCollection[]> {
  const collections = await prisma.collection.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      photos: {
        orderBy: [{ takenAt: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  const hasPublishedPhotos = collections.some((collection) =>
    collection.photos.some((photo) => photo.published),
  );

  return collections.map((collection) => {
    const visiblePhotos = collection.photos.filter(
      (photo) => photo.published || !hasPublishedPhotos,
    );
    const photos = visiblePhotos.map(mapPhoto);
    const coverPhoto = photos[0];

    return {
      id: collection.id,
      slug: collection.slug,
      title: collection.title,
      description:
        collection.description ??
        `A curated collection of ${coverPhoto?.location ?? "travel"} frames.`,
      coverImage: collection.coverImage ?? coverPhoto?.imageUrl ?? "",
      photoCount: photos.length,
      locationCount: new Set(
        photos.map((photo) => photo.location).filter(Boolean),
      ).size,
      countryCount: new Set(
        photos.map((photo) => photo.country).filter(Boolean),
      ).size,
      createdAt: formatDate(collection.createdAt),
      updatedAt: formatDate(collection.updatedAt),
      photos,
    };
  });
}

export async function getCollectionBySlug(
  slug: string,
): Promise<GalleryCollection | null> {
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      photos: {
        orderBy: [{ takenAt: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!collection) {
    return null;
  }

  const hasPublishedPhotos = collection.photos.some((photo) => photo.published);
  const visiblePhotos = collection.photos.filter(
    (photo) => photo.published || !hasPublishedPhotos,
  );
  const photos = visiblePhotos.map(mapPhoto);
  const coverPhoto = photos[0];

  return {
    id: collection.id,
    slug: collection.slug,
    title: collection.title,
    description:
      collection.description ??
      `A curated collection of ${coverPhoto?.location ?? "travel"} frames.`,
    coverImage: collection.coverImage ?? coverPhoto?.imageUrl ?? "",
    photoCount: photos.length,
    locationCount: new Set(
      photos.map((photo) => photo.location).filter(Boolean),
    ).size,
    countryCount: new Set(photos.map((photo) => photo.country).filter(Boolean))
      .size,
    createdAt: formatDate(collection.createdAt),
    updatedAt: formatDate(collection.updatedAt),
    photos,
  };
}
