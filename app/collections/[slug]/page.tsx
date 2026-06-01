import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GalleryExperience } from "@/app/_components/GalleryExperience";
import {
  getGalleryPhotosByCollectionSlug,
  type GalleryPhoto,
} from "@/src/lib/gallery-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const photos = await getGalleryPhotosByCollectionSlug(params.slug);
  if (photos.length === 0) {
    return {
      title: "Collection not found",
      description: "This collection could not be located.",
    };
  }

  const collection = photos[0].collection;
  return {
    title: `${collection} | Collections | Yan Saputra Photography`,
    description: `Explore the ${collection} collection with travel photography across locations and lighting.`,
  };
}

type Props = {
  params: {
    slug: string;
  };
};

export default async function CollectionPage({ params }: Props) {
  const photos = await getGalleryPhotosByCollectionSlug(params.slug);
  if (photos.length === 0) {
    notFound();
  }

  const collectionName = photos[0]?.collection ?? "Collection";
  const locationCount = new Set(
    photos.map((photo) => photo.location).filter(Boolean),
  ).size;
  const countryCount = new Set(
    photos.map((photo) => photo.country).filter(Boolean),
  ).size;

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-50">
      <section className="border-b border-white/10 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Collection
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {collectionName}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            A curated selection of {photos.length} travel images from this
            collection.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-zinc-400">
            <span>{photos.length} photos</span>
            <span>{locationCount} locations</span>
            <span>{countryCount} countries</span>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200">
              Collection gallery
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Stories from {collectionName}
            </h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back to collections
          </Link>
        </div>

        <GalleryExperience photos={photos} />
      </section>
    </main>
  );
}
