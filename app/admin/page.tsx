import type { Metadata } from "next";

import { AdminDashboard } from "./_components/admin-dashboard";
import {
  getMissingCloudinaryEnv,
  isCloudinaryConfigured,
} from "@/src/lib/cloudinary";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Admin Dashboard - Yan Saputra Photography",
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDateInput(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export default async function AdminPage() {
  const missingConfig = [
    ...getMissingCloudinaryEnv(),
    ...(!process.env.ADMIN_UPLOAD_KEY ? ["ADMIN_UPLOAD_KEY"] : []),
  ];
  const isConfigured =
    isCloudinaryConfigured() && Boolean(process.env.ADMIN_UPLOAD_KEY);

  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
  });

  const collections = Array.from(
    new Set(
      photos
        .map((photo) => photo.collection)
        .filter((collection): collection is string => Boolean(collection)),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const managedPhotos = photos.map((photo) => ({
    altText: photo.altText ?? "",
    aperture: photo.aperture ?? "",
    camera: photo.camera ?? "",
    collection: photo.collection ?? "",
    colorProfile: photo.colorProfile ?? "",
    copyright: photo.copyright ?? "",
    country: photo.country ?? "",
    createdAt: dateFormatter.format(photo.createdAt),
    createdAtRaw: photo.createdAt.toISOString(),
    description: photo.description ?? "",
    shootingConditions: photo.shootingConditions ?? "",
    shootingChallenges: photo.shootingChallenges ?? "",
    waitingTime: photo.waitingTime ?? "",
    interestingFacts: photo.interestingFacts ?? "",
    behindTheShot: photo.behindTheShot ?? "",
    dominantColor: photo.dominantColor ?? "#64748b",
    photographerNotes: photo.photographerNotes ?? "",
    focalLength: photo.focalLength ?? "",
    id: photo.id,
    imageUrl: photo.imageUrl,
    iso: photo.iso ? String(photo.iso) : "",
    lens: photo.lens ?? "",
    location: photo.location ?? "",
    published: photo.published,
    shutterSpeed: photo.shutterSpeed ?? "",
    takenAt: formatDateInput(photo.takenAt),
    title: photo.title,
  }));

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-zinc-50 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <AdminDashboard
          collections={collections}
          isConfigured={isConfigured}
          missingConfig={missingConfig}
          photos={managedPhotos}
        />
      </div>
    </main>
  );
}
