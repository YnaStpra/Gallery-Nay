"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, Compass, BookOpen, MapPin } from "lucide-react";
import { useJourney } from "@/src/hooks";

type Photo = {
  id: string;
  title: string;
  country: string | null;
  location: string | null;
};

export default function MyJourneyPage() {
  const { journey, isLoaded, getVisitedCountries, getVisitedLocations } =
    useJourney();

  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (!isLoaded) return;

    fetch("/api/photos")
      .then((res) => res.json())
      .then((photos: Photo[]) =>
        setAllPhotos(
          photos.map((photo) => ({
            country: photo.country,
            id: photo.id,
            location: photo.location,
            title: photo.title,
          })),
        ),
      )
      .catch(console.error);
  }, [isLoaded]);

  const countries = Array.from(getVisitedCountries());
  const locations = Array.from(getVisitedLocations());

  const countriesCount = new Map<string, number>();
  allPhotos.forEach((p) => {
    if (p.country) {
      countriesCount.set(p.country, (countriesCount.get(p.country) ?? 0) + 1);
    }
  });

  const locationsCount = new Map<string, number>();
  allPhotos.forEach((p) => {
    if (p.location) {
      locationsCount.set(p.location, (locationsCount.get(p.location) ?? 0) + 1);
    }
  });

  const isEmpty =
    countries.length === 0 &&
    locations.length === 0 &&
    journey.stories.length === 0 &&
    journey.collections.length === 0;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Personal
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Your photography journey
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Track countries you have explored, locations you have visited, and
            stories you have followed through Yan Saputra&apos;s archive.
          </p>
        </div>
      </section>

      {isEmpty ? (
        <section className="px-4 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-[32px] border border-dashed border-white/10 p-12 text-center">
              <Compass className="mx-auto size-12 text-zinc-700" aria-hidden />
              <h2 className="mt-4 text-xl font-semibold text-zinc-300">
                Your journey is starting
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Browse photos, stories, and collections to build your personal
                journey.
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
          <div className="mx-auto max-w-6xl space-y-12">
            {/* Countries */}
            {countries.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <Globe className="size-6 text-cyan-300" aria-hidden />
                  <h2 className="text-2xl font-semibold text-white">
                    Countries visited: {countries.length}
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {countries.map((country) => (
                    <Link
                      key={country}
                      href={`/collections?country=${encodeURIComponent(country)}`}
                      className="rounded-lg border border-white/10 bg-zinc-950 p-4 transition hover:border-cyan-300/30 hover:bg-cyan-300/5"
                    >
                      <p className="font-medium text-white">{country}</p>
                      <p className="text-xs text-zinc-500">
                        {countriesCount.get(country) || 0} photos
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Locations */}
            {locations.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <MapPin className="size-6 text-amber-300" aria-hidden />
                  <h2 className="text-2xl font-semibold text-white">
                    Locations explored: {locations.length}
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {locations.map((location) => (
                    <Link
                      key={location}
                      href={`/collections?location=${encodeURIComponent(location)}`}
                      className="rounded-lg border border-white/10 bg-zinc-950 p-4 transition hover:border-amber-300/30 hover:bg-amber-300/5"
                    >
                      <p className="font-medium text-white">{location}</p>
                      <p className="text-xs text-zinc-500">
                        {locationsCount.get(location) || 0} photos
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Stories */}
            {journey.stories.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <BookOpen className="size-6 text-teal-300" aria-hidden />
                  <h2 className="text-2xl font-semibold text-white">
                    Stories read: {journey.stories.length}
                  </h2>
                </div>
                <p className="text-sm text-zinc-500">
                  You have explored {journey.stories.length} travel narrative
                  {journey.stories.length === 1 ? "" : "s"} from the archive.
                </p>
              </div>
            )}

            {/* Collections */}
            {journey.collections.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <Compass className="size-6 text-purple-300" aria-hidden />
                  <h2 className="text-2xl font-semibold text-white">
                    Collections visited: {journey.collections.length}
                  </h2>
                </div>
                <p className="text-sm text-zinc-500">
                  You have explored {journey.collections.length} curated
                  collection{journey.collections.length === 1 ? "" : "s"} from
                  the archive.
                </p>
              </div>
            )}

            {/* Stats Card */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/50 p-8">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-amber-200">
                Journey Summary
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-3xl font-semibold text-cyan-300">
                    {countries.length}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">Countries</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-amber-300">
                    {locations.length}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">Locations</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-teal-300">
                    {journey.stories.length}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">Stories</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-purple-300">
                    {journey.collections.length}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">Collections</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
