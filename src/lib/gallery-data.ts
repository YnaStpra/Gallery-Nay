import { prisma } from "./prisma";

export type GalleryPhoto = {
  id: string;
  title: string;
  story: string;
  imageUrl: string;
  originalImageUrl?: string;
  alt: string;
  location: string;
  country: string;
  takenAt: string;
  collection: string;
  camera: string;
  lens: string;
  collectionId?: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
  dimensions: string;
  fileType: string;
  colorProfile: string;
  dominantColor: string;
  width?: number;
  height?: number;
  originalWidth?: number;
  originalHeight?: number;
  originalFileSize?: number;
  originalFileType?: string;
  blurDataUrl?: string;
  copyright: string;
  shootingConditions?: string;
  shootingChallenges?: string;
  waitingTime?: string;
  interestingFacts?: string;
  behindTheShot?: string;
  metadata?: Record<string, Record<string, string>>;
  lutUrl?: string;
  lutFileName?: string;
  lutFormat?: string;
  lutFileSize?: number;
  lutName?: string;
  lutVersion?: string;
  lutDescription?: string;
  editingSoftware?: string;
  cameraProfile?: string;
  photographerNotes?: string;
  allowDownload?: boolean;
  isPremium?: boolean;
  uploadedAt?: string;
  takenAtRaw?: string;
  slug?: string;
  coordinates?: { lat: number; lng: number };
};

export type GalleryAlbum = {
  collection: string;
  slug: string;
  description: string;
  coverPhoto: GalleryPhoto;
  photoCount: number;
};

const locationCoordinates: Record<string, { lat: number; lng: number }> = {
  "Sanur, Bali": { lat: -8.7139, lng: 115.2711 },
  "Mount Rinjani, Lombok": { lat: -8.4074, lng: 116.473 },
  "Tana Toraja, South Sulawesi": { lat: -3.0189, lng: 119.7768 },
  "Rammang-Rammang, Maros": { lat: -4.6731, lng: 119.52 },
  "Wairinding Hill, Sumba": { lat: -9.8731, lng: 119.9163 },
  "Labuan Bajo, Flores": { lat: -8.4689, lng: 119.8924 },
  Singapore: { lat: 1.3521, lng: 103.8198 },
  "Kintamani, Bali": { lat: -8.2255, lng: 115.3809 },
};

function getDefaultCoordinates(
  location: string | null,
): { lat: number; lng: number } | undefined {
  if (!location) {
    return undefined;
  }

  return locationCoordinates[location];
}

export const fallbackGalleryPhotos: GalleryPhoto[] = [
  {
    id: "sanur-morning-tide",
    title: "Morning Tide at Sanur",
    story: "Soft tide lines and early boats before the beach gets loud.",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=88",
    alt: "Calm tropical shoreline with blue water and a pale morning sky.",
    location: "Sanur, Bali",
    country: "Indonesia",
    takenAt: "12 Aug 2025",
    collection: "Coastline Notes",
    camera: "Sony A7 IV",
    lens: "FE 24-70mm f/2.8 GM II",
    focalLength: "35mm",
    aperture: "f/5.6",
    shutterSpeed: "1/640",
    iso: "100",
    dimensions: "6000 x 4000",
    fileType: "WEBP display copy",
    colorProfile: "Display P3",
    dominantColor: "#6fb6c9",
    copyright: "(c) Yan Saputra",
  },
  {
    id: "rinjani-ridge-light",
    title: "Rinjani Ridge Light",
    story: "A thin strip of warm light crossing the ridge after sunrise.",
    imageUrl:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=86",
    alt: "Layered mountain valley with warm sunlight and blue haze.",
    location: "Mount Rinjani, Lombok",
    country: "Indonesia",
    takenAt: "03 Sep 2025",
    collection: "Highland Routes",
    camera: "Sony A7 IV",
    lens: "FE 70-200mm f/4 G OSS II",
    focalLength: "112mm",
    aperture: "f/8",
    shutterSpeed: "1/320",
    iso: "160",
    dimensions: "6000 x 4000",
    fileType: "WEBP display copy",
    colorProfile: "sRGB",
    dominantColor: "#8c9a76",
    copyright: "(c) Yan Saputra",
  },
  {
    id: "toraja-mist",
    title: "Toraja Mist",
    story:
      "Morning fog lifting from a valley of timber houses and rice fields.",
    imageUrl:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=86",
    alt: "Green forest valley covered in low morning mist.",
    location: "Tana Toraja, South Sulawesi",
    country: "Indonesia",
    takenAt: "19 Oct 2025",
    collection: "Sulawesi Field Notes",
    camera: "Fujifilm X-T5",
    lens: "XF 16-55mm f/2.8",
    focalLength: "24mm",
    aperture: "f/4",
    shutterSpeed: "1/250",
    iso: "320",
    dimensions: "7728 x 5152",
    fileType: "WEBP display copy",
    colorProfile: "sRGB",
    dominantColor: "#4f6f46",
    copyright: "(c) Yan Saputra",
  },
  {
    id: "karst-passage",
    title: "Karst Passage",
    story: "River light reflecting under limestone cliffs outside Makassar.",
    imageUrl:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=86",
    alt: "A quiet lake surrounded by mountains and trees.",
    location: "Rammang-Rammang, Maros",
    country: "Indonesia",
    takenAt: "06 Nov 2025",
    collection: "Sulawesi Field Notes",
    camera: "Sony A7 IV",
    lens: "FE 16-35mm f/2.8 GM II",
    focalLength: "22mm",
    aperture: "f/7.1",
    shutterSpeed: "1/500",
    iso: "100",
    dimensions: "6000 x 4000",
    fileType: "WEBP display copy",
    colorProfile: "Display P3",
    dominantColor: "#2f7f7b",
    copyright: "(c) Yan Saputra",
  },
  {
    id: "sumba-grassland",
    title: "Sumba Grassland",
    story: "Dry-season grass moving in rows across an open hill.",
    imageUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=86",
    alt: "Wide desert road and warm hills under a clear sky.",
    location: "Wairinding Hill, Sumba",
    country: "Indonesia",
    takenAt: "22 Jul 2025",
    collection: "Open Roads",
    camera: "Fujifilm X-T5",
    lens: "XF 23mm f/1.4",
    focalLength: "23mm",
    aperture: "f/2.8",
    shutterSpeed: "1/1000",
    iso: "125",
    dimensions: "7728 x 5152",
    fileType: "WEBP display copy",
    colorProfile: "sRGB",
    dominantColor: "#b58b4c",
    copyright: "(c) Yan Saputra",
  },
  {
    id: "komodo-pink-shore",
    title: "Komodo Pink Shore",
    story: "Clear water and coral sand after the afternoon boats leave.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=86",
    alt: "Open landscape with water, trees, and warm sunlight.",
    location: "Labuan Bajo, Flores",
    country: "Indonesia",
    takenAt: "14 May 2025",
    collection: "Coastline Notes",
    camera: "Sony A7 IV",
    lens: "FE 24-70mm f/2.8 GM II",
    focalLength: "50mm",
    aperture: "f/6.3",
    shutterSpeed: "1/800",
    iso: "100",
    dimensions: "6000 x 4000",
    fileType: "WEBP display copy",
    colorProfile: "Display P3",
    dominantColor: "#c79882",
    copyright: "(c) Yan Saputra",
  },
  {
    id: "city-rain-study",
    title: "City Rain Study",
    story: "Reflections, umbrellas, and neon fragments during a late walk.",
    imageUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=86",
    alt: "Dark blue mountain scene under a starry night sky.",
    location: "Singapore",
    country: "Singapore",
    takenAt: "02 Jan 2026",
    collection: "Night Walks",
    camera: "Ricoh GR III",
    lens: "18.3mm f/2.8",
    focalLength: "28mm eq.",
    aperture: "f/2.8",
    shutterSpeed: "1/125",
    iso: "800",
    dimensions: "6000 x 4000",
    fileType: "WEBP display copy",
    colorProfile: "sRGB",
    dominantColor: "#273c75",
    copyright: "(c) Yan Saputra",
  },
  {
    id: "valley-after-rain",
    title: "Valley After Rain",
    story: "Clouds breaking open over a wet valley trail.",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=86",
    alt: "Green valley and river with mountains under dramatic clouds.",
    location: "Kintamani, Bali",
    country: "Indonesia",
    takenAt: "27 Dec 2025",
    collection: "Highland Routes",
    camera: "Sony A7 IV",
    lens: "FE 24-70mm f/2.8 GM II",
    focalLength: "28mm",
    aperture: "f/9",
    shutterSpeed: "1/200",
    iso: "200",
    dimensions: "6000 x 4000",
    fileType: "WEBP display copy",
    colorProfile: "Display P3",
    dominantColor: "#5c744f",
    copyright: "(c) Yan Saputra",
  },
];

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function formatPhotoDate(date: Date | null) {
  return date ? dateFormatter.format(date) : "Date not set";
}

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: [{ takenAt: "desc" }, { createdAt: "desc" }],
      where: { published: true },
    });

    if (photos.length === 0) {
      return fallbackGalleryPhotos.map((photo) => ({
        ...photo,
        takenAtRaw: photo.takenAtRaw ?? new Date(photo.takenAt).toISOString(),
        coordinates: photo.coordinates ?? getDefaultCoordinates(photo.location),
      }));
    }

    return photos.map((photo) => ({
      alt: photo.altText ?? photo.title,
      aperture: photo.aperture ?? "Not set",
      camera: photo.camera ?? "Not set",
      collection: photo.collection ?? "Published Archive",
      colorProfile: photo.colorProfile ?? "sRGB",
      copyright: photo.copyright ?? "(c) Yan Saputra",
      shootingConditions: photo.shootingConditions ?? undefined,
      shootingChallenges: photo.shootingChallenges ?? undefined,
      waitingTime: photo.waitingTime ?? undefined,
      interestingFacts: photo.interestingFacts ?? undefined,
      behindTheShot: photo.behindTheShot ?? undefined,
      allowDownload: photo.allowDownload,
      cameraProfile: photo.cameraProfile ?? undefined,
      country: photo.country ?? "Not set",
      coordinates:
        photo.latitude != null && photo.longitude != null
          ? { lat: photo.latitude, lng: photo.longitude }
          : getDefaultCoordinates(photo.location),
      dimensions:
        photo.width && photo.height
          ? `${photo.width} x ${photo.height}`
          : "Not set",
      dominantColor: photo.dominantColor ?? "#64748b",
      blurDataUrl: photo.blurDataUrl ?? undefined,
      editingSoftware: photo.editingSoftware ?? undefined,
      photographerNotes: photo.photographerNotes ?? undefined,
      fileType: photo.fileType ?? "Display copy",
      focalLength: photo.focalLength ?? "Not set",
      id: photo.id,
      imageUrl: photo.imageUrl,
      originalFileSize: photo.originalFileSize ?? undefined,
      originalFileType: photo.originalFileType ?? undefined,
      originalHeight: photo.originalHeight ?? undefined,
      originalImageUrl: photo.originalImageUrl ?? undefined,
      originalWidth: photo.originalWidth ?? undefined,
      iso: photo.iso ? String(photo.iso) : "Not set",
      lens: photo.lens ?? "Not set",
      location: photo.location ?? "Not set",
      metadata: (photo.metadata as Record<string, Record<string, string>>) ?? undefined,
      lutDescription: photo.lutDescription ?? undefined,
      lutFileName: photo.lutFileName ?? undefined,
      lutFileSize: photo.lutFileSize ?? undefined,
      lutFormat: photo.lutFormat ?? undefined,
      lutName: photo.lutName ?? undefined,
      lutVersion: photo.lutVersion ?? undefined,
      lutUrl: photo.lutUrl ?? undefined,
      isPremium: photo.isPremium,
      shutterSpeed: photo.shutterSpeed ?? "Not set",
      story: photo.description ?? "Published travel frame.",
      takenAt: formatPhotoDate(photo.takenAt),
      takenAtRaw: photo.takenAt?.toISOString() ?? undefined,
      uploadedAt: photo.uploadedAt?.toISOString() ?? undefined,
      collectionId: photo.collectionId ?? undefined,
      slug: photo.slug ?? undefined,
      title: photo.title,
    }));
  } catch (error) {
    console.error("Failed to load gallery photos from database", error);
    return fallbackGalleryPhotos;
  }
}

export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  const photos = await getGalleryPhotos();
  const albumMap = new Map<string, GalleryPhoto[]>();

  for (const photo of photos) {
    const collection = photo.collection || "Untitled";
    const existing = albumMap.get(collection);
    if (existing) {
      existing.push(photo);
    } else {
      albumMap.set(collection, [photo]);
    }
  }

  return Array.from(albumMap.entries()).map(([collection, photos]) => ({
    collection,
    slug: slugify(collection),
    description: photos[0]?.story ?? "A curated set of travel frames.",
    coverPhoto: photos[0],
    photoCount: photos.length,
  }));
}

export async function getGalleryPhotosByCollectionSlug(
  slug: string,
): Promise<GalleryPhoto[]> {
  const photos = await getGalleryPhotos();
  return photos.filter((photo) => slugify(photo.collection) === slug);
}

export type TimelinePoint = {
  id: string;
  year: string;
  label: string;
  location: string;
  photoCount: number;
  note: string;
};

export type JournalEntry = {
  id: string;
  month: string;
  year: string;
  location: string;
  country: string;
  photoCount: number;
  note: string;
  coverImage: string;
};

export type GearStat = {
  label: string;
  count: number;
  usagePct: number;
  collections: number;
  countries: number;
};

export type InsightData = {
  topCountries: [string, number][];
  topCities: [string, number][];
  topCameras: [string, number][];
  topLenses: [string, number][];
  yearGrowth: { year: string; count: number }[];
};

function toSortedEntries(map: Map<string, number>) {
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

export async function getTimelinePoints(): Promise<TimelinePoint[]> {
  const photos = await getGalleryPhotos();
  const groups = new Map<string, GalleryPhoto[]>();

  for (const photo of photos) {
    const year = photo.takenAtRaw
      ? new Date(photo.takenAtRaw).getFullYear().toString()
      : "Unknown";
    const key = `${year}::${photo.location}`;
    const entry = groups.get(key) ?? [];
    entry.push(photo);
    groups.set(key, entry);
  }

  return Array.from(groups.entries())
    .map(([key, items]) => {
      const [year, location] = key.split("::");
      return {
        id: `${year}-${location}`,
        year,
        label: `${location} · ${year}`,
        location,
        photoCount: items.length,
        note: items[0]?.story ?? "A chapter in the travel archive.",
      };
    })
    .sort(
      (a, b) => Number(b.year) - Number(a.year) || b.photoCount - a.photoCount,
    );
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const photos = await getGalleryPhotos();
  const groups = new Map<string, GalleryPhoto[]>();

  for (const photo of photos) {
    const date = photo.takenAtRaw ? new Date(photo.takenAtRaw) : new Date();
    const month = new Intl.DateTimeFormat("en", {
      month: "long",
      year: "numeric",
    }).format(date);
    const key = `${month}::${photo.location}`;
    const entry = groups.get(key) ?? [];
    entry.push(photo);
    groups.set(key, entry);
  }

  return Array.from(groups.entries())
    .map(([key, items]) => {
      const [month, location] = key.split("::");
      return {
        id: key,
        month: month.replace(/\s+\d+$/, ""),
        year: month.replace(/^.*\s/, ""),
        location,
        country: items[0]?.country ?? "Unknown",
        photoCount: items.length,
        note: `A visual record of ${location} from the archive.`,
        coverImage: items[0]?.imageUrl ?? items[0]?.imageUrl,
      };
    })
    .sort((a, b) => (a.id < b.id ? 1 : -1));
}

export async function getGearStats(): Promise<GearStat[]> {
  const photos = await getGalleryPhotos();
  const cameraCounts = new Map<string, number>();
  const lensCounts = new Map<string, number>();
  const collectionMap = new Map<string, Set<string>>();
  const countryMap = new Map<string, Set<string>>();

  for (const photo of photos) {
    cameraCounts.set(photo.camera, (cameraCounts.get(photo.camera) ?? 0) + 1);
    lensCounts.set(photo.lens, (lensCounts.get(photo.lens) ?? 0) + 1);

    if (!collectionMap.has(photo.camera)) {
      collectionMap.set(photo.camera, new Set());
    }
    collectionMap.get(photo.camera)?.add(photo.collection);

    if (!countryMap.has(photo.camera)) {
      countryMap.set(photo.camera, new Set());
    }
    countryMap.get(photo.camera)?.add(photo.country);
  }

  const total = photos.length || 1;
  return toSortedEntries(cameraCounts).map(([camera, count]) => ({
    label: camera,
    count,
    usagePct: Number(((count / total) * 100).toFixed(1)),
    collections: collectionMap.get(camera)?.size ?? 0,
    countries: countryMap.get(camera)?.size ?? 0,
  }));
}

export async function getInsightData(): Promise<InsightData> {
  const photos = await getGalleryPhotos();
  const countryCounts = new Map<string, number>();
  const cityCounts = new Map<string, number>();
  const cameraCounts = new Map<string, number>();
  const lensCounts = new Map<string, number>();
  const yearCounts = new Map<string, number>();

  for (const photo of photos) {
    countryCounts.set(
      photo.country,
      (countryCounts.get(photo.country) ?? 0) + 1,
    );
    cityCounts.set(photo.location, (cityCounts.get(photo.location) ?? 0) + 1);
    cameraCounts.set(photo.camera, (cameraCounts.get(photo.camera) ?? 0) + 1);
    lensCounts.set(photo.lens, (lensCounts.get(photo.lens) ?? 0) + 1);

    const year = photo.takenAtRaw
      ? new Date(photo.takenAtRaw).getFullYear().toString()
      : "Unknown";
    yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1);
  }

  return {
    topCountries: toSortedEntries(countryCounts).slice(0, 8),
    topCities: toSortedEntries(cityCounts).slice(0, 8),
    topCameras: toSortedEntries(cameraCounts).slice(0, 8),
    topLenses: toSortedEntries(lensCounts).slice(0, 8),
    yearGrowth: Array.from(yearCounts.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => Number(a.year) - Number(b.year)),
  };
}
