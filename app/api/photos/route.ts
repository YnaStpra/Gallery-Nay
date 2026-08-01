import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        location: true,
        country: true,
        camera: true,
        lens: true,
        focalLength: true,
        aperture: true,
        shutterSpeed: true,
        iso: true,
        width: true,
        height: true,
        takenAt: true,
        description: true,
        shootingConditions: true,
        shootingChallenges: true,
        waitingTime: true,
        interestingFacts: true,
        behindTheShot: true,
        photographerNotes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Failed to get photos", error);
    return NextResponse.json(
      { error: "Failed to get photos" },
      { status: 500 },
    );
  }
}
