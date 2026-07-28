import type { Metadata } from "next";
import { GalleryExperience } from "./_components/GalleryExperience";
import { getGalleryPhotos } from "@/src/lib/gallery-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yan Saputra Photography",
  description:
    "A minimalist photography gallery by Yan Saputra.",
  openGraph: {
    title: "Yan Saputra Photography",
    description:
      "A minimalist photography gallery by Yan Saputra.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yan Saputra Photography",
  },
};

export default async function HomePage() {
  const galleryPhotos = await getGalleryPhotos();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="pb-10">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
              Yan Saputra Photography
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              Photography first. Calm, minimal, and focused on the image.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              Browse the archive through a clean gallery, curated collections,
              and travel stories.
            </p>
          </div>
        </section>

        <section className="space-y-8">
          <GalleryExperience photos={galleryPhotos} />
        </section>
      </div>
    </main>
  );
}
