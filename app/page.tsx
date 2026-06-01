import type { Metadata } from "next";
import { GalleryExperience } from "./_components/GalleryExperience";
import { getGalleryPhotos } from "@/src/lib/gallery-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yan Saputra Photography",
  description:
    "A premium travel photography portfolio with cinematic frames, curated collections, and an immersive gallery experience.",
  openGraph: {
    title: "Yan Saputra Photography",
    description:
      "A premium travel photography portfolio with cinematic frames, curated collections, and an immersive gallery experience.",
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
        <GalleryExperience photos={galleryPhotos} />
      </div>
    </main>
  );
}
