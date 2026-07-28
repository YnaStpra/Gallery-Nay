import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const photo = await prisma.photo.findUnique({
      select: {
        allowDownload: true,
        id: true,
        lutFileName: true,
        lutUrl: true,
      },
      where: { id },
    });

    if (!photo || !photo.lutUrl) {
      return NextResponse.json({ error: "Preset not found." }, { status: 404 });
    }

    if (!photo.allowDownload) {
      return NextResponse.json(
        { error: "Preset download disabled." },
        { status: 403 },
      );
    }

    const response = await fetch(photo.lutUrl);
    if (!response.ok || !response.body) {
      return NextResponse.json(
        { error: "Failed to fetch preset." },
        { status: 502 },
      );
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Disposition": `attachment; filename="${photo.lutFileName ?? "preset"}"`,
        "Content-Type":
          response.headers.get("content-type") ?? "application/octet-stream",
      },
    });
  } catch (error) {
    console.error("Failed to download preset", error);
    return NextResponse.json(
      { error: "Failed to download preset." },
      { status: 500 },
    );
  }
}
