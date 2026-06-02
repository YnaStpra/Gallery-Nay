import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Increment view count
    const photo = await prisma.photo.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });

    return NextResponse.json({
      success: true,
      viewCount: photo.viewCount,
    });
  } catch (error) {
    console.error("Failed to track view", error);
    return NextResponse.json(
      { success: false, error: "Failed to track view" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const photo = await prisma.photo.findUnique({
      where: { id },
      select: { viewCount: true },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json({ viewCount: photo.viewCount });
  } catch (error) {
    console.error("Failed to get view count", error);
    return NextResponse.json(
      { error: "Failed to get view count" },
      { status: 500 },
    );
  }
}
