import type { Metadata } from "next";
import { MapExplorer } from "@/src/features/map/MapExplorer";
import { getGalleryPhotos } from "@/src/lib/gallery-data";

export const metadata: Metadata = {
  title: "Travel Map | Yan Saputra Photography",
  description:
    "Explore travel photography across the globe with location-aware markers, clusters, and immersive previews.",
};

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const photos = await getGalleryPhotos();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col lg:flex-row">
        <MapExplorer photos={photos} />
      </div>
    </main>
  );
}
