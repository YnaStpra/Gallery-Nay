"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDownUp, ChevronDown, X } from "lucide-react";

type Photo = {
  id: string;
  title: string;
  slug: string | null;
  imageUrl: string;
  location: string | null;
  country: string | null;
  camera: string | null;
  lens: string | null;
  focalLength: string | null;
  aperture: string | null;
  shutterSpeed: string | null;
  iso: number | null;
  width: number | null;
  height: number | null;
  takenAt: string | null;
};

type PhotoMeta = {
  id: string;
  title: string;
  slug: string | null;
  imageUrl: string;
  location: string | null;
  country: string | null;
  camera: string | null;
  lens: string | null;
  focalLength: string | null;
  aperture: string | null;
  shutterSpeed: string | null;
  iso: number | null;
  width: number | null;
  height: number | null;
  takenAt: string | null;
};

type MetadataKey =
  | "camera"
  | "lens"
  | "focalLength"
  | "aperture"
  | "shutterSpeed"
  | "iso"
  | "dimensions"
  | "location"
  | "takenAt";

export default function ComparePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photo1, setPhoto1] = useState<PhotoMeta | null>(null);
  const [photo2, setPhoto2] = useState<PhotoMeta | null>(null);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/photos")
      .then((res) => res.json())
      .then(setPhotos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const selectPhoto1 = useCallback((p: Photo) => {
    setPhoto1(p);
    setOpen1(false);
  }, []);

  const selectPhoto2 = useCallback((p: Photo) => {
    setPhoto2(p);
    setOpen2(false);
  }, []);

  const swapPhotos = useCallback(() => {
    const temp = photo1;
    setPhoto1(photo2);
    setPhoto2(temp);
  }, [photo1, photo2]);

  const metadataRows: { label: string; key: MetadataKey }[] = [
    { label: "Camera", key: "camera" },
    { label: "Lens", key: "lens" },
    { label: "Focal Length", key: "focalLength" },
    { label: "Aperture", key: "aperture" },
    { label: "Shutter Speed", key: "shutterSpeed" },
    { label: "ISO", key: "iso" },
    { label: "Dimensions", key: "dimensions" },
    { label: "Location", key: "location" },
    { label: "Date Taken", key: "takenAt" },
  ];

  const getValue = (photo: PhotoMeta | null, key: MetadataKey): string => {
    if (!photo) return "—";

    switch (key) {
      case "dimensions":
        return photo.width && photo.height
          ? `${photo.width}x${photo.height}`
          : "—";
      case "takenAt":
        return photo.takenAt
          ? new Date(photo.takenAt).toLocaleDateString()
          : "—";
      case "aperture":
        return photo.aperture ?? "—";
      case "iso":
        return photo.iso ? String(photo.iso) : "—";
      default:
        return photo[key] ?? "—";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-pulse text-zinc-500">Loading photos...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Tools
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Photo comparison
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Select two photos to compare their metadata and camera settings side
            by side.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {/* Photo Selectors */}
          <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
            {/* Photo 1 */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-300">
                Photo 1
              </label>
              <div className="relative">
                <button
                  onClick={() => {
                    setOpen1(!open1);
                    setOpen2(false);
                  }}
                  className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-left text-sm flex items-center justify-between hover:border-cyan-300/30"
                >
                  <span className="truncate text-zinc-300">
                    {photo1?.title || "Select a photo"}
                  </span>
                  <ChevronDown className="size-4 flex-shrink-0" aria-hidden />
                </button>

                {open1 && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-10 max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-zinc-950 shadow-2xl">
                    {photos.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => selectPhoto1(p)}
                        className="w-full border-b border-white/5 px-4 py-2 text-left text-sm hover:bg-white/5"
                      >
                        <p className="font-medium text-white truncate">
                          {p.title}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {p.location}, {p.country}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {photo1 && (
                <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900">
                  <Image
                    src={photo1.imageUrl}
                    alt={photo1.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <button
                    onClick={() => setPhoto1(null)}
                    className="absolute top-2 right-2 rounded-full bg-black/50 p-1 hover:bg-black/70"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex items-end">
              <button
                onClick={swapPhotos}
                disabled={!photo1 || !photo2}
                className="rounded-lg border border-white/10 p-3 text-white transition hover:bg-white/5 disabled:opacity-50"
                title="Swap photos"
              >
                <ArrowDownUp className="size-5" aria-hidden />
              </button>
            </div>

            {/* Photo 2 */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-300">
                Photo 2
              </label>
              <div className="relative">
                <button
                  onClick={() => {
                    setOpen2(!open2);
                    setOpen1(false);
                  }}
                  className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-left text-sm flex items-center justify-between hover:border-cyan-300/30"
                >
                  <span className="truncate text-zinc-300">
                    {photo2?.title || "Select a photo"}
                  </span>
                  <ChevronDown className="size-4 flex-shrink-0" aria-hidden />
                </button>

                {open2 && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-10 max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-zinc-950 shadow-2xl">
                    {photos.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => selectPhoto2(p)}
                        className="w-full border-b border-white/5 px-4 py-2 text-left text-sm hover:bg-white/5"
                      >
                        <p className="font-medium text-white truncate">
                          {p.title}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {p.location}, {p.country}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {photo2 && (
                <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900">
                  <Image
                    src={photo2.imageUrl}
                    alt={photo2.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <button
                    onClick={() => setPhoto2(null)}
                    className="absolute top-2 right-2 rounded-full bg-black/50 p-1 hover:bg-black/70"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Comparison Table */}
          {photo1 && photo2 && (
            <div className="rounded-lg border border-white/10 overflow-hidden bg-zinc-950/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">
                        Metadata
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">
                        Photo 1
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">
                        Photo 2
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {metadataRows.map((row, idx) => (
                      <tr
                        key={row.key}
                        className={idx % 2 === 0 ? "bg-zinc-900/20" : ""}
                      >
                        <td className="px-6 py-3 text-sm font-medium text-zinc-300">
                          {row.label}
                        </td>
                        <td className="px-6 py-3 text-sm text-zinc-200">
                          {getValue(photo1, row.key)}
                        </td>
                        <td className="px-6 py-3 text-sm text-zinc-200">
                          {getValue(photo2, row.key)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(!photo1 || !photo2) && (
            <div className="rounded-lg border border-dashed border-white/10 p-12 text-center">
              <p className="text-sm text-zinc-500">
                Select two photos above to compare their metadata.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
