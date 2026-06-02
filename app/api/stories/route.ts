import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        location: true,
        country: true,
        createdAt: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error("Failed to get stories", error);
    return NextResponse.json(
      { error: "Failed to get stories" },
      { status: 500 },
    );
  }
}
