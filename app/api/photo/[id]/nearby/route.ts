import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import { calculateDistanceKm } from "@/src/lib/distance";

type RouteParams = {
  params: Promise<{ id: string }>;
};

type NearbyPhotoResponse = {
  id: string;
  slug: string | null;
  title: string;
  imageUrl: string;
  distanceKm: number;
};

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const currentPhoto = await prisma.photo.findUnique({
      where: { id },
      select: {
        id: true,
        latitude: true,
        longitude: true,
      },
    });

    if (
      !currentPhoto ||
      currentPhoto.latitude == null ||
      currentPhoto.longitude == null
    ) {
      return NextResponse.json([]);
    }

    const currentLatitude = currentPhoto.latitude;
    const currentLongitude = currentPhoto.longitude;

    const nearbyCandidates = await prisma.photo.findMany({
      where: {
        AND: [
          { id: { not: id } },
          { published: true },
          { latitude: { not: null } },
          { longitude: { not: null } },
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        imageUrl: true,
        latitude: true,
        longitude: true,
      },
    });

    const nearbyPhotos = nearbyCandidates
      .map((photo): NearbyPhotoResponse | null => {
        if (photo.latitude == null || photo.longitude == null) {
          return null;
        }

        const distanceKm = calculateDistanceKm(
          currentLatitude,
          currentLongitude,
          photo.latitude,
          photo.longitude,
        );

        if (distanceKm > 10) {
          return null;
        }

        return {
          id: photo.id,
          slug: photo.slug,
          title: photo.title,
          imageUrl: photo.imageUrl,
          distanceKm: Number(distanceKm.toFixed(1)),
        };
      })
      .filter((photo): photo is NearbyPhotoResponse => photo !== null)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 12);

    return NextResponse.json(nearbyPhotos);
  } catch (error) {
    console.error("Failed to get nearby photos", error);
    return NextResponse.json(
      { error: "Failed to get nearby photos" },
      { status: 500 },
    );
  }
}
