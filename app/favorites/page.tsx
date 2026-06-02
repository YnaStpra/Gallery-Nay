"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useFavorites } from "@/src/hooks";
import { MasonryGallery } from "@/app/_components/MasonryGallery";

type Photo = {
  id: string;
  title: string;
  slug: string | null;
  imageUrl: string;
  location: string | null;
  country: string | null;
};

export default function FavoritesPage() {
  const { getFavoritesList, clearFavorites, isLoaded } = useFavorites();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const loadFavorites = async () => {
      try {
        const res = await fetch("/api/photos");
        const allPhotos: Photo[] = await res.json();
        const favoriteIds = getFavoritesList();
        const favoritePhotos = allPhotos.filter((p) =>
          favoriteIds.includes(p.id),
        );
        setPhotos(favoritePhotos);
      } catch (error) {
        console.error("Failed to load favorites", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isLoaded, getFavoritesList]);

  const isEmpty = !loading && photos.length === 0;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Saved
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Your favorite photos
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            {isEmpty
              ? "You haven't saved any photos yet. Browse the gallery and add photos to your favorites."
              : `${photos.length} photo${photos.length === 1 ? "" : "s"} saved to your collection.`}
          </p>
          {!isEmpty && (
            <button
              onClick={() => {
                clearFavorites();
                setPhotos([]);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-red-300/20 px-4 py-2 text-sm text-red-100 transition hover:bg-red-300/5"
            >
              <Trash2 className="size-4" aria-hidden />
              Clear all
            </button>
          )}
        </div>
      </section>

      {isEmpty ? (
        <section className="px-4 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-[32px] border border-dashed border-white/10 p-12 text-center">
              <Heart className="mx-auto size-12 text-zinc-700" aria-hidden />
              <h2 className="mt-4 text-xl font-semibold text-zinc-300">
                No favorites yet
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Heart your favorite photos to see them here.
              </p>
              <Link
                href="/collections"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-200"
              >
                Browse photos
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <MasonryGallery photos={photos} />
          </div>
        </section>
      )}
    </main>
  );
}
