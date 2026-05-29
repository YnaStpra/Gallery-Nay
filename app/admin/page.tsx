import type { Metadata } from "next";
import { Camera, Database, ImagePlus, LockKeyhole } from "lucide-react";

import { PhotoManager } from "./_components/photo-manager";
import { PhotoUploadForm } from "./_components/photo-upload-form";
import {
  getMissingCloudinaryEnv,
  isCloudinaryConfigured,
} from "@/src/lib/cloudinary";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Admin Upload",
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDateInput(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export default async function AdminPage() {
  const missingConfig = [
    ...getMissingCloudinaryEnv(),
    ...(!process.env.ADMIN_UPLOAD_KEY ? ["ADMIN_UPLOAD_KEY"] : []),
  ];
  const isConfigured =
    isCloudinaryConfigured() && Boolean(process.env.ADMIN_UPLOAD_KEY);

  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
  });
  const publishedCount = photos.filter((photo) => photo.published).length;
  const collections = Array.from(
    new Set(
      photos
        .map((photo) => photo.collection)
        .filter((collection): collection is string => Boolean(collection)),
    ),
  ).sort((a, b) => a.localeCompare(b));
  const managedPhotos = photos.map((photo) => ({
    altText: photo.altText ?? "",
    aperture: photo.aperture ?? "",
    camera: photo.camera ?? "",
    collection: photo.collection ?? "",
    colorProfile: photo.colorProfile ?? "",
    copyright: photo.copyright ?? "",
    country: photo.country ?? "",
    createdAt: dateFormatter.format(photo.createdAt),
    description: photo.description ?? "",
    dominantColor: photo.dominantColor ?? "#64748b",
    focalLength: photo.focalLength ?? "",
    id: photo.id,
    imageUrl: photo.imageUrl,
    iso: photo.iso ? String(photo.iso) : "",
    lens: photo.lens ?? "",
    location: photo.location ?? "",
    published: photo.published,
    shutterSpeed: photo.shutterSpeed ?? "",
    takenAt: formatDateInput(photo.takenAt),
    title: photo.title,
  }));

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-zinc-50 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-8">
        <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-cyan-200">
              <LockKeyhole className="size-4" aria-hidden />
              Admin
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
              Upload Photo
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Upload foto ke Cloudinary, simpan metadata ke Neon, dan tampilkan
              otomatis di homepage.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-zinc-400 sm:min-w-[360px]">
            <div className="rounded-lg border border-white/10 bg-zinc-950 p-4">
              <Database className="size-5 text-amber-200" aria-hidden />
              <span className="mt-3 block text-2xl font-semibold text-white">
                {photos.length}
              </span>
              <span>Total records</span>
            </div>
            <div className="rounded-lg border border-white/10 bg-zinc-950 p-4">
              <Camera className="size-5 text-cyan-200" aria-hidden />
              <span className="mt-3 block text-2xl font-semibold text-white">
                {publishedCount}
              </span>
              <span>Published</span>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <ImagePlus className="size-5 text-cyan-200" aria-hidden />
              <h2 className="text-xl font-semibold text-white">New photo</h2>
            </div>
            <PhotoUploadForm
              isConfigured={isConfigured}
              missingConfig={missingConfig}
            />
          </div>

          <aside className="rounded-lg border border-white/10 bg-zinc-950 p-5">
            <h2 className="text-xl font-semibold text-white">Latest uploads</h2>
            <div className="mt-5 grid gap-3">
              {photos.length > 0 ? (
                photos.slice(0, 6).map((photo) => (
                  <div
                    key={photo.id}
                    className="grid gap-3 rounded-md border border-white/10 bg-black p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-medium text-white">
                          {photo.title}
                        </h3>
                        <p className="mt-1 text-xs text-zinc-500">
                          {photo.createdAt
                            ? dateFormatter.format(photo.createdAt)
                            : "No date"}
                        </p>
                      </div>
                      <span
                        className={`rounded px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${
                          photo.published
                            ? "bg-emerald-300/10 text-emerald-100"
                            : "bg-zinc-700 text-zinc-300"
                        }`}
                      >
                        {photo.published ? "Live" : "Draft"}
                      </span>
                    </div>
                    <dl className="grid grid-cols-2 gap-3 text-xs text-zinc-400">
                      <div>
                        <dt className="uppercase tracking-[0.14em] text-zinc-600">
                          Location
                        </dt>
                        <dd className="mt-1 truncate">
                          {photo.location ?? "Not set"}
                        </dd>
                      </div>
                      <div>
                        <dt className="uppercase tracking-[0.14em] text-zinc-600">
                          Camera
                        </dt>
                        <dd className="mt-1 truncate">
                          {photo.camera ?? "Not set"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))
              ) : (
                <p className="rounded-md border border-dashed border-white/10 p-4 text-sm leading-6 text-zinc-500">
                  Belum ada foto di database. Setelah upload berhasil, daftar
                  terbaru akan muncul di sini.
                </p>
              )}
            </div>
          </aside>
        </section>

        <PhotoManager collections={collections} photos={managedPhotos} />
      </div>
    </main>
  );
}
