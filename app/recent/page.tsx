"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Trash2 } from "lucide-react";
import { useRecentlyViewed } from "@/src/hooks";

type Photo = {
  id: string;
  title: string;
  slug: string | null;
  imageUrl: string;
  location: string | null;
  country: string | null;
};

type RecentPhoto = Photo & {
  viewedLabel: string;
};

function getPhotoHref(photo: Photo) {
  return photo.slug ? `/albums/${photo.slug}` : `/albums/${photo.id}`;
}

function formatViewedAt(timestamp: number, now: number) {
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
}

export default function RecentPage() {
  const { getRecentList, viewed, clearRecent, isLoaded } = useRecentlyViewed();
  const [photos, setPhotos] = useState<RecentPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const loadRecent = async () => {
      try {
        const res = await fetch("/api/photos");
        const allPhotos: Photo[] = await res.json();
        const recentIds = getRecentList();
        const now = Date.now();
        const recentPhotos = recentIds
          .map((id) => {
            const photo = allPhotos.find((p) => p.id === id);
            const viewedItem = viewed.find((v) => v.photoId === id);
            return photo && viewedItem
              ? {
                  ...photo,
                  viewedLabel: formatViewedAt(viewedItem.viewedAt, now),
                }
              : null;
          })
          .filter((p): p is RecentPhoto => p !== null);
        setPhotos(recentPhotos);
      } catch (error) {
        console.error("Failed to load recent photos", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecent();
  }, [isLoaded, getRecentList, viewed]);

  const isEmpty = !loading && photos.length === 0;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            History
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Recently viewed
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            {isEmpty
              ? "You haven't viewed any photos yet. Start exploring the gallery."
              : `${photos.length} photo${photos.length === 1 ? "" : "s"} in your history.`}
          </p>
          {!isEmpty && (
            <button
              onClick={() => {
                clearRecent();
                setPhotos([]);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-amber-300/20 px-4 py-2 text-sm text-amber-100 transition hover:bg-amber-300/5"
            >
              <Trash2 className="size-4" aria-hidden />
              Clear history
            </button>
          )}
        </div>
      </section>

      {isEmpty ? (
        <section className="px-4 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-[32px] border border-dashed border-white/10 p-12 text-center">
              <Clock className="mx-auto size-12 text-zinc-700" aria-hidden />
              <h2 className="mt-4 text-xl font-semibold text-zinc-300">
                No history yet
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Photos you view will appear here.
              </p>
              <Link
                href="/collections"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-200"
              >
                Start exploring
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-xs text-zinc-500 uppercase tracking-[0.18em]">
              {photos.length} recent views
            </div>
            <div className="grid gap-4">
              {photos.map((photo, idx) => (
                <Link
                  key={`${photo.id}-${idx}`}
                  href={getPhotoHref(photo)}
                  className="group grid gap-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-950/50 transition hover:border-cyan-300/30 md:grid-cols-[300px_1fr]"
                >
                  <div className="relative aspect-square overflow-hidden bg-zinc-900">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.title}
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-4 p-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                        {photo.location}, {photo.country}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-cyan-300">
                        {photo.title}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Viewed {photo.viewedLabel}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
