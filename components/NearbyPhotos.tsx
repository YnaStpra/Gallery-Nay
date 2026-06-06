"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type NearbyPhoto = {
  id: string;
  slug: string | null;
  title: string;
  imageUrl: string;
  distanceKm: number;
};

type Props = {
  photoId: string;
};

export function NearbyPhotos({ photoId }: Props) {
  const [items, setItems] = useState<NearbyPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadNearby() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(`/api/photo/${photoId}/nearby`);
        if (!response.ok) {
          throw new Error("Failed to load nearby photos");
        }

        const data = (await response.json()) as NearbyPhoto[];
        if (!ignore) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        console.error(loadError);
        if (!ignore) {
          setError(true);
          setItems([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadNearby();

    return () => {
      ignore = true;
    };
  }, [photoId]);

  return (
    <section className="rounded-[24px] border border-white/10 bg-black/20 p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
            Nearby Photos
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
            📍 Nearby Photos
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Explore other photographs taken around this location.
          </p>
        </div>
        <Link
          href={`/map?photo=${photoId}`}
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          View on Map
        </Link>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/5] animate-pulse rounded-3xl bg-white/5"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-300/20 bg-red-300/10 px-4 py-6 text-sm text-red-100">
            Failed to load nearby photos.
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-zinc-300">
            There&apos;s no nearby photo available yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((photo) => (
              <Link
                key={photo.id}
                href={photo.slug ? `/albums/${photo.slug}` : `/albums/${photo.id}`}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/30"
              >
                <div className="relative aspect-[4/5] bg-zinc-900">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2 p-3">
                  <h4 className="line-clamp-2 text-sm font-medium text-white">
                    {photo.title}
                  </h4>
                  <span className="inline-flex rounded-full bg-cyan-300/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                    📍 {photo.distanceKm.toFixed(1)} km
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
