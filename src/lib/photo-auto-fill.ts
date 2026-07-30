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
    /^[A-Z0-9]{2,}$/.test(token)
      ? token
      : token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();

  return normalized
    .split(" ")
    .map(preserveAllCaps)
    .join(" ");
}

export type MetadataSection = {
  label: string;
  value: string;
};

export type LightroomMetadata = {
  file: Record<string, string>;
  camera: Record<string, string>;
  lens: Record<string, string>;
  exposure: Record<string, string>;
  image: Record<string, string>;
  gps: Record<string, string>;
  copyright: Record<string, string>;
  editing: Record<string, string>;
  raw?: Record<string, unknown>;
};

export type PhotoMetadataDraft = {
  title?: string;
  slug?: string;
  description?: string;
  altText?: string;
  location?: string;
  country?: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  focalLength35mm?: string;
  aperture?: string;
  shutterSpeed?: string;
  exposureBias?: string;
  meteringMode?: string;
  whiteBalance?: string;
  flash?: string;
  iso?: string;
  takenAt?: string;
  takenTime?: string;
  latitude?: string;
  longitude?: string;
  altitude?: string;
  artist?: string;
  copyright?: string;
  creator?: string;
  software?: string;
  orientation?: string;
  colorSpace?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  megapixels?: string;
  dominantColor?: string;
  metadata?: LightroomMetadata;
};

type ExifMetadata = {
  Make?: string;
  Model?: string;
  LensMake?: string;
  LensModel?: string;
  LensSpecification?: string;
  FocalLength?: number | string;
  FocalLengthIn35mmFormat?: number | string;
  FocalLength35efl?: string;
  FNumber?: number | string;
  ExposureTime?: string;
  ExposureBiasValue?: number | string;
  MeteringMode?: string | number;
  WhiteBalance?: string | number;
  Flash?: string | number;
  ISO?: number | string;
  DateTimeOriginal?: string | Date;
  CreateDate?: string | Date;
  SubSecTimeOriginal?: string;
  GPSLatitude?: number;
  GPSLongitude?: number;
  GPSAltitude?: number;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  Artist?: string;
  Copyright?: string;
  Creator?: string;
  Software?: string;
  Orientation?: string | number;
  ColorSpace?: string | number;
  ImageWidth?: number | string;
  ImageHeight?: number | string;
  City?: string;
  State?: string;
  SubLocation?: string;
  CountryName?: string;
  Country?: string;
  [key: string]: unknown;
};

function firstString(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function firstNumber(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function formatLocation(location?: string, country?: string) {
  if (location && country) return `${location}, ${country}`;
  return location || country || undefined;
}

function formatTime(date?: Date | string) {
  if (!date) return undefined;
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(11, 19);
}

function buildAspectRatio(width?: number, height?: number) {
  if (!width || !height) return undefined;
  return `${width}:${height}`;
}

function buildMegapixels(width?: number, height?: number) {
  if (!width || !height) return undefined;
  return `${(width * height / 1_000_000).toFixed(1)} MP`;
}

function mapColorSpace(value?: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number") {
    return value === 1 ? "sRGB" : value.toString();
  }
  return undefined;
}

function mapMeteringMode(value?: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number") {
    return `Mode ${value}`;
  }
  return undefined;
}

function mapWhiteBalance(value?: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number") {
    return value === 1 ? "Auto" : `Preset ${value}`;
  }
  return undefined;
}

function mapFlash(value?: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number") {
    return value === 0 ? "No Flash" : `Flash ${value}`;
  }
  return undefined;
}

export async function extractPhotoMetadata(file: File): Promise<PhotoMetadataDraft> {
  const buffer = await file.arrayBuffer();
  const parsed = (await exifr.parse(buffer, { tiff: true, exif: true, gps: true })) as ExifMetadata | null;

  const titleFromFile = generateTitleFromFilename(file.name);
  const camera = firstString(parsed?.Model, parsed?.Make);
  const lens = firstString(parsed?.LensModel, parsed?.LensSpecification);
  const focalLengthNumber = firstNumber(parsed?.FocalLength);
  const focalLength = focalLengthNumber ? `${Math.round(focalLengthNumber)}mm` : firstString(parsed?.FocalLength35efl);
  const focalLength35mmNumber = firstNumber(parsed?.FocalLengthIn35mmFormat);
  const focalLength35mm = focalLength35mmNumber
    ? `${Math.round(focalLength35mmNumber)}mm`
    : firstString(parsed?.FocalLength35efl);
  const apertureNumber = firstNumber(parsed?.FNumber);
  const aperture = apertureNumber
    ? `f/${apertureNumber.toFixed(1).replace(/\.0$/, "")}`
    : undefined;
  const shutterSpeed = firstString(parsed?.ExposureTime);
  const exposureBiasValue = firstNumber(parsed?.ExposureBiasValue);
  const exposureBias = typeof exposureBiasValue === "number" ? `${exposureBiasValue > 0 ? "+" : ""}${exposureBiasValue}` : undefined;
  const meteringMode = mapMeteringMode(parsed?.MeteringMode);
  const whiteBalance = mapWhiteBalance(parsed?.WhiteBalance);
  const flash = mapFlash(parsed?.Flash);
  const iso = firstNumber(parsed?.ISO)?.toString();
  const takenAt = parsed?.DateTimeOriginal
    ? new Date(parsed.DateTimeOriginal).toISOString().slice(0, 10)
    : parsed?.CreateDate
      ? new Date(parsed.CreateDate).toISOString().slice(0, 10)
      : undefined;
  const takenTime = formatTime(parsed?.DateTimeOriginal ?? parsed?.CreateDate);
  const location = firstString(parsed?.City, parsed?.State, parsed?.SubLocation);
  const country = firstString(parsed?.CountryName, parsed?.Country);
  const locationText = formatLocation(location, country);
  const width = firstNumber(parsed?.ImageWidth);
  const height = firstNumber(parsed?.ImageHeight);

  const metadata: LightroomMetadata = {
    file: {
      Filename: file.name,
      "File Type": file.type || "Unknown",
      "File Size": `${Math.round(file.size / 1024)} KB`,
      Width: width ? String(width) : "",
      Height: height ? String(height) : "",
      "Aspect Ratio": buildAspectRatio(width, height) ?? "",
      Megapixels: buildMegapixels(width, height) ?? "",
    },
    camera: {
      "Camera Make": firstString(parsed?.Make) ?? "",
      "Camera Model": firstString(parsed?.Model) ?? "",
      "Lens Make": firstString(parsed?.LensMake) ?? "",
      "Lens Model": firstString(parsed?.LensModel) ?? "",
    },
    lens: {
      "Focal Length": focalLength ?? "",
      "35mm Equivalent": focalLength35mm ?? "",
    },
    exposure: {
      Aperture: aperture ?? "",
      ISO: iso ?? "",
      "Shutter Speed": shutterSpeed ?? "",
      "Exposure Bias": exposureBias ?? "",
      "Metering Mode": meteringMode ?? "",
      "White Balance": whiteBalance ?? "",
      Flash: flash ?? "",
    },
    image: {
      Orientation: firstString(parsed?.Orientation) ?? (typeof parsed?.Orientation === "number" ? String(parsed.Orientation) : ""),
      "Color Space": mapColorSpace(parsed?.ColorSpace) ?? "",
    },
    gps: {
      Latitude: firstNumber(parsed?.GPSLatitude, parsed?.latitude)?.toString() ?? "",
      Longitude: firstNumber(parsed?.GPSLongitude, parsed?.longitude)?.toString() ?? "",
      Altitude: firstNumber(parsed?.GPSAltitude, parsed?.altitude)?.toString() ?? "",
    },
    copyright: {
      Artist: firstString(parsed?.Artist) ?? "",
      Copyright: firstString(parsed?.Copyright) ?? "",
      Creator: firstString(parsed?.Creator) ?? "",
      Software: firstString(parsed?.Software) ?? "",
    },
    editing: {},
    raw: parsed ?? undefined,
  };

  const cleaned = Object.fromEntries(
    Object.entries(metadata).map(([section, values]) => [
      section,
      Object.fromEntries(
        Object.entries(values).filter(([, value]) => Boolean(value)),
      ),
    ]),
  ) as LightroomMetadata;

  return {
    title: titleFromFile,
    slug: slugify(titleFromFile),
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
    focalLength35mm,
    aperture,
    shutterSpeed,
    exposureBias,
    meteringMode,
    whiteBalance,
    flash,
    iso,
    takenAt,
    takenTime,
    latitude: firstNumber(parsed?.GPSLatitude, parsed?.latitude)?.toString(),
    longitude: firstNumber(parsed?.GPSLongitude, parsed?.longitude)?.toString(),
    altitude: firstNumber(parsed?.GPSAltitude, parsed?.altitude)?.toString(),
    artist: firstString(parsed?.Artist),
    copyright: firstString(parsed?.Copyright),
    creator: firstString(parsed?.Creator),
    software: firstString(parsed?.Software),
    orientation: firstString(parsed?.Orientation) ?? (typeof parsed?.Orientation === "number" ? String(parsed.Orientation) : undefined),
    colorSpace: mapColorSpace(parsed?.ColorSpace),
    width,
    height,
    aspectRatio: buildAspectRatio(width, height),
    megapixels: buildMegapixels(width, height),
    dominantColor: undefined,
    metadata: cleaned,
  };
}
