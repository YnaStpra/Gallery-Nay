import type { Metadata } from "next";
import { getGalleryPhotos } from "@/src/lib/gallery-data";

export const metadata: Metadata = {
  title: "Statistics | Yan Saputra Photography",
  description:
    "Photography metrics and collection insights for the Yan Saputra portfolio.",
};

export const dynamic = "force-dynamic";

function toSortedEntries(map: Map<string, number>) {
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

export default async function StatsPage() {
  const photos = await getGalleryPhotos();
  const totalPhotos = photos.length;
  const countryCount = new Set(
    photos.map((photo) => photo.country).filter(Boolean),
  ).size;
  const locationCount = new Set(
    photos.map((photo) => photo.location).filter(Boolean),
  ).size;
  const collectionCount = new Set(
    photos.map((photo) => photo.collection).filter(Boolean),
  ).size;

  const cameraUsage = photos.reduce((map, photo) => {
    const key = photo.camera || "Unknown";
    map.set(key, (map.get(key) ?? 0) + 1);
    return map;
  }, new Map<string, number>());

  const lensUsage = photos.reduce((map, photo) => {
    const key = photo.lens || "Unknown";
    map.set(key, (map.get(key) ?? 0) + 1);
    return map;
  }, new Map<string, number>());

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-50">
      <section className="border-b border-white/10 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Statistics
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Photography metrics for the archive.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Track the breadth of travel imagery across countries, collections,
            cameras, and lenses.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-6 xl:grid-cols-4">
          {[
            { label: "Total Photos", value: totalPhotos },
            { label: "Countries", value: countryCount },
            { label: "Locations", value: locationCount },
            { label: "Collections", value: collectionCount },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-[32px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/20"
            >
              <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
                {metric.label}
              </p>
              <p className="mt-4 text-4xl font-semibold text-white">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-2">
          <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Camera usage
            </p>
            <div className="mt-6 space-y-4">
              {toSortedEntries(cameraUsage).map(([camera, count]) => (
                <div
                  key={camera}
                  className="flex items-center justify-between gap-4 text-sm text-zinc-200"
                >
                  <span className="truncate">{camera}</span>
                  <span className="font-semibold text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Lens usage
            </p>
            <div className="mt-6 space-y-4">
              {toSortedEntries(lensUsage).map(([lens, count]) => (
                <div
                  key={lens}
                  className="flex items-center justify-between gap-4 text-sm text-zinc-200"
                >
                  <span className="truncate">{lens}</span>
                  <span className="font-semibold text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
