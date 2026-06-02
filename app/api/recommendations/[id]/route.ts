import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const limit = 6;

    // Get the reference photo
    const photo = await prisma.photo.findUnique({
      where: { id },
      select: {
        id: true,
        camera: true,
        location: true,
        country: true,
        collection: true,
      },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // Find similar photos by country first, then by location or camera
    const recommendations = await prisma.photo.findMany({
      where: {
        AND: [
          { id: { not: id } },
          { published: true },
          {
            OR: [
              { country: photo.country },
              { location: photo.location },
              { camera: photo.camera },
              { collection: photo.collection },
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        location: true,
        country: true,
        camera: true,
        collection: true,
      },
      take: limit,
      orderBy: { viewCount: "desc" },
    });

    return NextResponse.json({
      recommendations,
    });
  } catch (error) {
    console.error("Failed to get recommendations", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 },
    );
  }
}
