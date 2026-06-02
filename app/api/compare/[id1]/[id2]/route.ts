import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ id1: string; id2: string }>;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id1, id2 } = await params;

    const [photo1, photo2] = await Promise.all([
      prisma.photo.findUnique({
        where: { id: id1 },
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
          colorProfile: true,
          collection: true,
        },
      }),
      prisma.photo.findUnique({
        where: { id: id2 },
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
          colorProfile: true,
          collection: true,
        },
      }),
    ]);

    if (!photo1 || !photo2) {
      return NextResponse.json(
        { error: "One or both photos not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      photo1,
      photo2,
    });
  } catch (error) {
    console.error("Failed to get comparison data", error);
    return NextResponse.json(
      { error: "Failed to get comparison data" },
      { status: 500 },
    );
  }
}
