import type { Metadata } from "next";
import Link from "next/link";
import { GalleryExperience } from "./_components/GalleryExperience";
import { getGalleryPhotos } from "@/src/lib/gallery-data";
import { getStories } from "@/src/lib/story-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yan Saputra Photography",
  description:
    "A travel photography journal by Yan Saputra with stories, journal entries, and premium visual narratives.",
  openGraph: {
    title: "Yan Saputra Photography",
    description:
      "A travel photography journal by Yan Saputra with stories, journal entries, and premium visual narratives.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yan Saputra Photography",
  },
};

export default async function HomePage() {
  const galleryPhotos = await getGalleryPhotos();
  const featuredStories = await getStories(2);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-10 pb-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
              Travel Journal
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              Photography first. Stories second. Travel always.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              Explore the archive through premium galleries, travel narratives,
              and curated visual essays that connect location, craft, and
              memory.
            </p>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-zinc-950/90 p-8 shadow-2xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
              Featured stories
            </p>
            <div className="mt-6 space-y-4">
              {featuredStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/30"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                    {story.location}, {story.country}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-white">
                    {story.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {story.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-zinc-500">
                    <span>{story.readingTime}</span>
                    <span>{story.publishedAt}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/stories"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              See all stories
            </Link>
          </div>
        </section>

        <section className="space-y-8">
          <GalleryExperience photos={galleryPhotos} />
        </section>
      </div>
    </main>
  );
}
