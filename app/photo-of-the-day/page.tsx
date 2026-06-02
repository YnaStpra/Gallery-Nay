import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Heart, Calendar, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Photo of the Day | Yan Saputra Photography",
  description: "Today's featured photo from the Yan Saputra archive.",
};

export const dynamic = "force-dynamic";

async function getPhotoOfTheDay() {
  // Get today's entry or create one
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let photoOfDay = await prisma.photoOfTheDay.findFirst({
    where: {
      selectedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      photo: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          imageUrl: true,
          location: true,
          country: true,
          camera: true,
          lens: true,
          focalLength: true,
          aperture: true,
          shutterSpeed: true,
          iso: true,
          takenAt: true,
          viewCount: true,
          favoriteCount: true,
          collection: true,
        },
      },
    },
  });

  // If no photo for today, create one
  if (!photoOfDay) {
    const publishedCount = await prisma.photo.count({
      where: { published: true },
    });
    const randomPhoto =
      publishedCount > 0
        ? await prisma.photo.findFirst({
            where: { published: true },
            select: { id: true },
            skip: Math.floor(Math.random() * publishedCount),
          })
        : null;

    if (randomPhoto) {
      photoOfDay = await prisma.photoOfTheDay.create({
        data: {
          photoId: randomPhoto.id,
        },
        include: {
          photo: {
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              imageUrl: true,
              location: true,
              country: true,
              camera: true,
              lens: true,
              focalLength: true,
              aperture: true,
              shutterSpeed: true,
              iso: true,
              takenAt: true,
              viewCount: true,
              favoriteCount: true,
              collection: true,
            },
          },
        },
      });
    }
  }

  return photoOfDay;
}

export default async function PhotoOfTheDayPage() {
  const photoOfDay = await getPhotoOfTheDay();

  if (!photoOfDay) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <section className="flex flex-col items-center justify-center min-h-screen px-4">
          <h1 className="text-3xl font-semibold">No photos available</h1>
          <p className="mt-2 text-zinc-400">Please try again later.</p>
        </section>
      </main>
    );
  }

  const photo = photoOfDay.photo;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-amber-200">
            Daily Selection
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Featured frame today
          </h1>
        </div>
      </section>

      <section className="px-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-2">
          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden">
            <div className="relative aspect-square bg-zinc-900">
              <Image
                src={photo.imageUrl}
                alt={photo.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              {/* Title & Location */}
              <div>
                <h2 className="text-3xl font-semibold text-white">
                  {photo.title}
                </h2>
                {photo.location && photo.country && (
                  <div className="mt-3 flex items-center gap-2 text-lg text-cyan-300">
                    <MapPin className="size-5" aria-hidden />
                    {photo.location}, {photo.country}
                  </div>
                )}
              </div>

              {/* Description */}
              {photo.description && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-base leading-7 text-zinc-300">
                    {photo.description}
                  </p>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  {photo.camera && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Camera
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        {photo.camera}
                      </p>
                    </div>
                  )}
                  {photo.lens && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Lens
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        {photo.lens}
                      </p>
                    </div>
                  )}
                  {photo.aperture && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Aperture
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        f/{photo.aperture}
                      </p>
                    </div>
                  )}
                  {photo.shutterSpeed && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Shutter Speed
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        {photo.shutterSpeed}
                      </p>
                    </div>
                  )}
                  {photo.iso && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        ISO
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        {photo.iso}
                      </p>
                    </div>
                  )}
                  {photo.takenAt && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Date Taken
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        {new Date(photo.takenAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-1">
                  <Heart className="size-4" aria-hidden />
                  {photo.favoriteCount} favorites
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" aria-hidden />
                  {photo.viewCount} views
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex gap-3">
              <Link
                href={photo.slug ? `/albums/${photo.slug}` : `/#${photo.id}`}
                className="flex-1 rounded-lg bg-cyan-300 px-4 py-3 text-center font-semibold text-black transition hover:bg-cyan-200"
              >
                View Full Photo
              </Link>
              {photo.collection && (
                <Link
                  href={`/collections`}
                  className="flex-1 rounded-lg border border-white/10 px-4 py-3 text-center font-semibold text-white transition hover:bg-white/5"
                >
                  More from {photo.collection}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent PhotosOfTheDay */}
      <section className="border-t border-white/10 px-4 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-amber-200">
            Recent Selections
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-white">
            Previous daily selections
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Check back daily for a new featured photo.
          </p>
        </div>
      </section>
    </main>
  );
}
