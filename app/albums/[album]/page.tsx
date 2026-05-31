import Link from "next/link";
import { notFound } from "next/navigation";

import { ImageGallery } from "@/app/_components/image-gallery";
import { ProtectedPhoto } from "@/app/_components/protected-photo";
import {
  getGalleryPhotosByCollectionSlug,
  GalleryPhoto,
} from "@/src/lib/gallery-data";

export const dynamic = "force-dynamic";

type AlbumPageProps = {
  params: {
    album: string;
  };
};

export default async function AlbumPage({ params }: AlbumPageProps) {
  const photos = await getGalleryPhotosByCollectionSlug(params.album);

  if (photos.length === 0) {
    notFound();
  }

  const featuredPhoto = photos[0];
  const placeCount = new Set(
    photos.map((photo) => photo.location).filter((location) => location !== ""),
  ).size;
  const countryCount = new Set(
    photos.map((photo) => photo.country).filter((country) => country !== ""),
  ).size;

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-50">
      <section className="relative min-h-[58vh] overflow-hidden border-b border-white/10">
        <ProtectedPhoto
          src={featuredPhoto.imageUrl}
          alt={featuredPhoto.alt}
          className="absolute inset-0"
          imageClassName="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.36),rgba(0,0,0,0.82))]" />
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-14 pt-24 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
              Album collection
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-white sm:text-6xl">
              {featuredPhoto.collection}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
              A photo album containing {photos.length} curated frames from this
              collection.
            </p>
            <div className="mt-9 grid max-w-3xl grid-cols-2 gap-5 border-t border-white/18 pt-6 sm:grid-cols-4">
              <div className="flex min-w-0 gap-3">
                <span
                  className="mt-0.5 inline-flex h-4 w-4 rounded-full bg-amber-300"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                    Place count
                  </dt>
                  <dd className="mt-1 truncate text-sm text-zinc-100">
                    {placeCount}
                  </dd>
                </div>
              </div>
              <div className="flex min-w-0 gap-3">
                <span
                  className="mt-0.5 inline-flex h-4 w-4 rounded-full bg-cyan-300"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                    Countries
                  </dt>
                  <dd className="mt-1 truncate text-sm text-zinc-100">
                    {countryCount}
                  </dd>
                </div>
              </div>
              <div className="flex min-w-0 gap-3">
                <span
                  className="mt-0.5 inline-flex h-4 w-4 rounded-full bg-pink-300"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                    Photos
                  </dt>
                  <dd className="mt-1 truncate text-sm text-zinc-100">
                    {photos.length}
                  </dd>
                </div>
              </div>
              <div className="flex min-w-0 gap-3">
                <span
                  className="mt-0.5 inline-flex h-4 w-4 rounded-full bg-zinc-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                    Cover
                  </dt>
                  <dd className="mt-1 truncate text-sm text-zinc-100">
                    {featuredPhoto.location}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200">
              Album gallery
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              All photos in this collection
            </h2>
          </div>
          <Link
            href="/albums"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back to albums
          </Link>
        </div>

        <ImageGallery photos={photos} />
      </section>
    </main>
  );
}
