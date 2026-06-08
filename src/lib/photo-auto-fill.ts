import exifr from "exifr";

export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateTitleFromFilename(filename: string): string {
  const withoutExtension = filename.replace(/\.[^.]+$/, "");
  const normalized = withoutExtension
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return "Untitled Photo";
  }

  const preserveAllCaps = (token: string) =>
    /^[A-Z0-9]{2,}$/.test(token) ? token : token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();

  return normalized
    .split(" ")
    .map(preserveAllCaps)
    .join(" ");
}

export type PhotoMetadataDraft = {
  title?: string;
  description?: string;
  altText?: string;
  location?: string;
  country?: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  takenAt?: string;
  dominantColor?: string;
  width?: number;
  height?: number;
};

type ExifMetadata = {
  Model?: string;
  Make?: string;
  LensModel?: string;
  LensSpecification?: string;
  FocalLength?: number | string;
  FocalLength35efl?: string;
  FNumber?: number | string;
  ExposureTime?: string;
  ShutterSpeedValue?: string;
  ISO?: number | string;
  DateTimeOriginal?: string | Date;
  City?: string;
  State?: string;
  SubLocation?: string;
  CountryName?: string;
  Country?: string;
  ImageWidth?: number | string;
  ImageHeight?: number | string;
  latitude?: number;
  longitude?: number;
};

function firstString(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function formatLocation(location?: string, country?: string) {
  if (location && country) return `${location}, ${country}`;
  return location || country || undefined;
}

export async function extractPhotoMetadata(file: File): Promise<PhotoMetadataDraft> {
  const buffer = await file.arrayBuffer();
  const parsed = (await exifr.parse(buffer)) as ExifMetadata | null;

  const titleFromFile = generateTitleFromFilename(file.name);
  const camera = firstString(parsed?.Model, parsed?.Make);
  const lens = firstString(parsed?.LensModel, parsed?.LensSpecification);
  const focalLength = parsed?.FocalLength
    ? `${Math.round(Number(parsed.FocalLength))}mm`
    : firstString(parsed?.FocalLength35efl);
  const aperture = parsed?.FNumber ? `f/${Number(parsed.FNumber).toFixed(1).replace(/\.0$/, "")}` : undefined;
  const shutterSpeed = firstString(parsed?.ExposureTime, parsed?.ShutterSpeedValue);
  const iso = typeof parsed?.ISO === "number" ? String(parsed.ISO) : undefined;
  const takenAt = parsed?.DateTimeOriginal
    ? new Date(parsed.DateTimeOriginal).toISOString().slice(0, 10)
    : undefined;
  const location = firstString(parsed?.City, parsed?.State, parsed?.SubLocation);
  const country = firstString(parsed?.CountryName, parsed?.Country);
  const locationText = formatLocation(location, country);

  return {
    title: titleFromFile,
    description:
      camera && lens && locationText
        ? `Captured with ${camera} and ${lens} at ${locationText}.`
        : locationText && camera
          ? `Photographed in ${locationText} using ${camera}.`
          : locationText
            ? `Photographed in ${locationText}.`
            : camera
              ? `Photographed using ${camera}.`
              : undefined,
    altText:
      locationText && titleFromFile
        ? `${titleFromFile} photographed at ${locationText}.`
        : locationText
          ? `Travel photograph taken in ${locationText}.`
          : `${titleFromFile} travel photograph.`,
    location,
    country,
    camera,
    lens,
    focalLength,
    aperture,
    shutterSpeed,
    iso,
    takenAt,
    width: parsed?.ImageWidth ? Number(parsed.ImageWidth) : undefined,
    height: parsed?.ImageHeight ? Number(parsed.ImageHeight) : undefined,
    dominantColor: undefined,
  };
}
