import {
  Aperture,
  CalendarDays,
  Camera,
  Copyright,
  Images,
  LockKeyhole,
  MapPin,
  Palette,
  Ruler,
  ScanSearch,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ProtectedPhoto } from "./_components/protected-photo";
import { galleryPhotos } from "@/src/lib/gallery-data";
import type { GalleryPhoto } from "@/src/lib/gallery-data";

const featuredPhoto = galleryPhotos[0];
const previewPhotos = galleryPhotos.slice(1, 4);

function MetadataItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-cyan-300" aria-hidden />
      <div className="min-w-0">
        <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
          {label}
        </dt>
        <dd className="mt-1 truncate text-sm text-zinc-100">{value}</dd>
      </div>
    </div>
  );
}

function PhotoMetadata({ photo }: { photo: GalleryPhoto }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
      <MetadataItem icon={CalendarDays} label="Date" value={photo.takenAt} />
      <MetadataItem icon={Camera} label="Camera" value={photo.camera} />
      <MetadataItem icon={Aperture} label="Lens" value={photo.lens} />
      <MetadataItem
        icon={ScanSearch}
        label="Exposure"
        value={`${photo.focalLength} | ${photo.aperture} | ${photo.shutterSpeed} | ISO ${photo.iso}`}
      />
      <MetadataItem icon={Ruler} label="Size" value={photo.dimensions} />
      <MetadataItem icon={Palette} label="Profile" value={photo.colorProfile} />
    </dl>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-zinc-50">
      <section className="relative min-h-[86svh] overflow-hidden">
        <ProtectedPhoto
          src={featuredPhoto.imageUrl}
          alt={featuredPhoto.alt}
          priority
          sizes="100vw"
          className="absolute inset-0"
          imageClassName="scale-105"
        />
        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.78),rgba(0,0,0,0.38)_48%,rgba(0,0,0,0.12)),linear-gradient(0deg,rgba(5,5,5,0.94),rgba(5,5,5,0.18)_46%,rgba(5,5,5,0.52))]" />

        <nav className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
            My Travel Gallery
          </span>
          <div className="hidden items-center gap-5 text-xs font-medium uppercase tracking-[0.18em] text-white/72 sm:flex">
            <span>Archive</span>
            <span>Metadata</span>
            <span className="inline-flex items-center gap-2">
              <LockKeyhole className="size-3.5" aria-hidden />
              View only
            </span>
          </div>
        </nav>

        <div className="relative z-20 flex min-h-[86svh] flex-col justify-end px-5 pb-14 pt-24 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
              Yan Saputra Photography
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl">
              Travel frames with place, light, and camera data intact.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
              A curated public archive of journeys across Indonesia and beyond,
              presented as protected viewing copies with complete metadata.
            </p>

            <dl className="mt-9 grid max-w-3xl grid-cols-2 gap-5 border-t border-white/18 pt-6 sm:grid-cols-4">
              <MetadataItem
                icon={MapPin}
                label="Featured"
                value={featuredPhoto.location}
              />
              <MetadataItem
                icon={CalendarDays}
                label="Captured"
                value={featuredPhoto.takenAt}
              />
              <MetadataItem
                icon={Camera}
                label="Camera"
                value={featuredPhoto.camera}
              />
              <MetadataItem
                icon={Copyright}
                label="Rights"
                value={featuredPhoto.copyright}
              />
            </dl>
          </div>
        </div>
      </section>

      <section className="relative z-30 -mt-10 px-4 pb-8 sm:px-8 lg:px-12">
        <div className="grid gap-3 sm:grid-cols-3">
          {previewPhotos.map((photo) => (
            <article
              key={photo.id}
              className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl shadow-black/30"
            >
              <ProtectedPhoto
                src={photo.imageUrl}
                alt={photo.alt}
                className="h-36"
                sizes="(min-width: 768px) 30vw, 100vw"
              />
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-medium text-white">
                    {photo.title}
                  </h2>
                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {photo.location}
                  </p>
                </div>
                <span
                  className="size-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: photo.dominantColor }}
                  aria-label={`Dominant color ${photo.dominantColor}`}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-amber-200">
              Published Archive
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Selected Travel Frames
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm text-zinc-400 sm:min-w-[420px]">
            <div>
              <span className="block text-2xl font-semibold text-white">
                {galleryPhotos.length}
              </span>
              <span>Photos</span>
            </div>
            <div>
              <span className="block text-2xl font-semibold text-white">6</span>
              <span>Places</span>
            </div>
            <div>
              <span className="block text-2xl font-semibold text-white">0</span>
              <span>Downloads</span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {galleryPhotos.map((photo) => (
            <article
              key={photo.id}
              className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950"
            >
              <ProtectedPhoto
                src={photo.imageUrl}
                alt={photo.alt}
                className="aspect-[4/3]"
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                      {photo.collection}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {photo.title}
                    </h3>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded border border-cyan-300/25 bg-cyan-300/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-100">
                    <LockKeyhole className="size-3" aria-hidden />
                    View
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {photo.story}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-zinc-300">
                  <MapPin className="size-4 text-amber-200" aria-hidden />
                  <span>
                    {photo.location}, {photo.country}
                  </span>
                </div>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <PhotoMetadata photo={photo} />
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="size-3 rounded-sm"
                      style={{ backgroundColor: photo.dominantColor }}
                    />
                    {photo.dominantColor}
                  </span>
                  <span>{photo.fileType}</span>
                  <span>{photo.copyright}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-200">
              Metadata Index
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Ready for real EXIF and publishing data.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Location and country",
              "Captured date",
              "Camera and lens",
              "Focal length",
              "Aperture, shutter, ISO",
              "Dimensions and color profile",
              "File type",
              "Copyright owner",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-300"
              >
                <span className="inline-flex items-center gap-2">
                  <Images className="size-4 text-amber-200" aria-hidden />
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
