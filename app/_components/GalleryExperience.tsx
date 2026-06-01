"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { GalleryPhoto } from "@/src/lib/gallery-data";
import { PhotoCard } from "./PhotoCard";
import { PhotoModal } from "./PhotoModal";

const FILTERS = [
  "All",
  "Travel",
  "Landscape",
  "Street",
  "Night",
  "Portrait",
] as const;

type Filter = (typeof FILTERS)[number];

function isFiltered(photo: GalleryPhoto, activeFilter: Filter) {
  const combined =
    `${photo.collection} ${photo.location} ${photo.country} ${photo.story}`.toLowerCase();

  switch (activeFilter) {
    case "Travel":
      return /travel|journey|route|coast|shore|field|island|ocean|mountain|valley/.test(
        combined,
      );
    case "Landscape":
      return /mountain|valley|shore|landscape|river|forest|hills|sea|lake|coast/.test(
        combined,
      );
    case "Street":
      return /city|street|urban|market|singapore|traffic|rain|neon/.test(
        combined,
      );
    case "Night":
      return /night|dark|neon|star|evening|dusk|midnight|rain/.test(combined);
    case "Portrait":
      return /portrait|face|people|human|model|subject/.test(combined);
    default:
      return true;
  }
}

function matchesSearch(photo: GalleryPhoto, query: string) {
  if (!query.trim()) return true;
  const normalized = query.trim().toLowerCase();
  return [photo.title, photo.location, photo.country, photo.collection]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalized));
}

type Props = {
  photos: GalleryPhoto[];
};

export function GalleryExperience({ photos }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredPhotos = useMemo(
    () =>
      photos.filter(
        (photo) =>
          matchesSearch(photo, searchQuery) && isFiltered(photo, activeFilter),
      ),
    [photos, searchQuery, activeFilter],
  );

  const selectedPhoto =
    selectedIndex !== null ? filteredPhotos[selectedIndex] : null;
  const hasPrevious = selectedIndex !== null && selectedIndex > 0;
  const hasNext =
    selectedIndex !== null && selectedIndex < filteredPhotos.length - 1;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_auto] lg:items-end">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            Portfolio
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Travel photography with cinematic light, calm silhouettes, and
            immersive detail.
          </h1>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 text-right text-sm text-zinc-300 shadow-[0_30px_120px_-82px_rgba(0,0,0,0.8)]">
          <p className="font-semibold text-white">Premium travel portfolio</p>
          <p className="mt-2 text-zinc-400">
            Search, filter, and experience each frame in a modern lightbox
            designed for fine art photography.
          </p>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-[#050505]/90 p-5 shadow-[0_40px_140px_-80px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <label className="relative block">
            <span className="sr-only">Search photos</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by title, location, country, collection"
              className="w-full rounded-full border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeFilter === filter
                    ? "bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/30"
                    : "bg-white/5 text-zinc-300 hover:bg-white/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
          <span>{filteredPhotos.length} photos</span>
          <span className="hidden sm:inline">
            Swipe or arrow through the gallery in the lightbox.
          </span>
        </div>

        <div className="columns-2 gap-y-5 gap-x-5 sm:columns-3 lg:columns-4">
          <AnimatePresence initial={false}>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="mb-5 break-inside-avoid"
              >
                <PhotoCard
                  photo={photo}
                  onSelect={() => setSelectedIndex(index)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPhotos.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-zinc-950/75 px-6 py-12 text-center text-sm text-zinc-400">
            No photos match your search. Try another keyword or reset the
            filter.
          </div>
        ) : null}
      </section>

      {selectedPhoto && (
        <>
          <PhotoModal
            photo={selectedPhoto}
            isOpen={Boolean(selectedPhoto)}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onClose={() => setSelectedIndex(null)}
            onPrevious={() => {
              if (hasPrevious)
                setSelectedIndex((current) =>
                  current === null ? null : current - 1,
                );
            }}
            onNext={() => {
              if (hasNext)
                setSelectedIndex((current) =>
                  current === null ? null : current + 1,
                );
            }}
          />

          <div className="sr-only">
            {hasPrevious && selectedIndex !== null ? (
              <Image
                src={filteredPhotos[selectedIndex - 1].imageUrl}
                alt=""
                width={16}
                height={16}
                priority
              />
            ) : null}
            {hasNext && selectedIndex !== null ? (
              <Image
                src={filteredPhotos[selectedIndex + 1].imageUrl}
                alt=""
                width={16}
                height={16}
                priority
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
