import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { action } = (await req.json()) as {
      action: "increment" | "decrement";
    };

    if (!["increment", "decrement"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const photo = await prisma.photo.update({
      where: { id },
      data: {
        favoriteCount: {
          increment: action === "increment" ? 1 : -1,
        },
      },
      select: { favoriteCount: true },
    });

    return NextResponse.json({
      success: true,
      favoriteCount: photo.favoriteCount,
    });
  } catch (error) {
    console.error("Failed to update favorite count", error);
    return NextResponse.json(
      { success: false, error: "Failed to update favorite count" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const photo = await prisma.photo.findUnique({
      where: { id },
      select: { favoriteCount: true },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json({ favoriteCount: photo.favoriteCount });
  } catch (error) {
    console.error("Failed to get favorite count", error);
    return NextResponse.json(
      { error: "Failed to get favorite count" },
      { status: 500 },
    );
  }
}
