import Link from "next/link";
import type { Metadata } from "next";
import { getGalleryAlbums } from "@/src/lib/gallery-data";
import { ProtectedPhoto } from "@/app/_components/protected-photo";

export const metadata: Metadata = {
  title: "Collections | Yan Saputra Photography",
  description:
    "Explore curated photography collections from travel stories across Indonesia and beyond.",
};

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const albums = await getGalleryAlbums();

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-50">
      <section className="border-b border-white/10 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Collections
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Curated chapters of light, place, and mood.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Browse travel photography collections organized by destination and
            visual story.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200">
              Select a collection
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Photography collections ready to explore
            </h2>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back to home
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-3 lg:grid-cols-2">
          {albums.map((album) => (
            <Link
              key={album.slug}
              href={`/collections/${album.slug}`}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/20 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/30"
            >
              <div className="relative aspect-[4/3] bg-zinc-900">
                <ProtectedPhoto
                  src={album.coverPhoto.imageUrl}
                  alt={album.coverPhoto.alt}
                  className="absolute inset-0"
                  imageClassName="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
                  {album.photoCount} photos
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  {album.collection}
                </h3>
                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  {album.description}
                </p>
                <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-cyan-200">
                  <span>Open collection</span>
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300/80" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
