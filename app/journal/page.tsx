import type { Metadata } from "next";
import Link from "next/link";
import { getJournalEntries } from "@/src/lib/gallery-data";

export const metadata: Metadata = {
  title: "Journal | Yan Saputra Photography",
  description:
    "Chronological travel journal entries presenting location-based photo chapters.",
};

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const entries = await getJournalEntries();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Journal
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Chronological travel entries from the archive.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Browse concise notes and photo counts that capture the rhythm of
            each journey and destination.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="grid gap-6 rounded-[32px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/20 sm:grid-cols-[0.8fr_1.2fr]"
            >
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
                  {entry.month} {entry.year}
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  {entry.location}
                </h2>
                <p className="text-sm leading-7 text-zinc-400">{entry.note}</p>
                <div className="grid gap-2 text-sm text-zinc-300">
                  <span>{entry.photoCount} photos</span>
                  <span>{entry.country}</span>
                </div>
              </div>
              <div className="overflow-hidden rounded-[28px] bg-zinc-900">
                <img
                  src={entry.coverImage}
                  alt={entry.location}
                  className="h-full w-full object-cover"
                />
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/stories"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Read the full travel stories
          </Link>
        </div>
      </section>
    </main>
  );
}
