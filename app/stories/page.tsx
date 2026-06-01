import Link from "next/link";
import type { Metadata } from "next";
import { getStories } from "@/src/lib/story-data";

export const metadata: Metadata = {
  title: "Stories | Yan Saputra Photography",
  description:
    "Read travel photography stories and editorial journeys from Yan Saputra's archive.",
};

export const dynamic = "force-dynamic";

export default async function StoriesPage() {
  const stories = await getStories();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Stories
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Travel narratives for every frame.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Discover travel photography articles with cinematic hero imagery,
            location details, and reflective storytelling.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-8 xl:grid-cols-2">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.slug}`}
              className="group overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950 shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-cyan-300/30"
            >
              <div className="relative aspect-[16/9] bg-zinc-900">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                  {story.location}, {story.country}
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-white">
                  {story.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  {story.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-zinc-500">
                  <span>{story.readingTime}</span>
                  <span>{story.publishedAt}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
