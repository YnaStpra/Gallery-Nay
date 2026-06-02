import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import { DownloadRequestType } from "@/src/generated/prisma/enums";

type RouteParams = {
  params: Promise<{ id: string }>;
};

type RequestBody = {
  email?: string;
  message?: string;
  name?: string;
  purpose?: string;
  requestType?: string;
};

const validRequestTypes = new Set<string>(Object.values(DownloadRequestType));

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = (await req.json()) as RequestBody;
    const name = clean(body.name);
    const email = clean(body.email);
    const purpose = clean(body.purpose);
    const message = clean(body.message);
    const requestType = validRequestTypes.has(clean(body.requestType))
      ? (clean(body.requestType) as DownloadRequestType)
      : DownloadRequestType.ORIGINAL;

    if (!name || !email || !purpose) {
      return NextResponse.json(
        { error: "Name, email, and purpose are required." },
        { status: 400 },
      );
    }

    const photo = await prisma.photo.findUnique({
      select: { id: true },
      where: { id },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    const request = await prisma.$transaction(async (tx) => {
      const created = await tx.downloadRequest.create({
        data: {
          email,
          message: message || null,
          name,
          photoId: id,
          reason: purpose,
          requestType,
          usagePurpose: requestType,
        },
        select: {
          id: true,
          status: true,
        },
      });

      await tx.photo.update({
        data: { requestCount: { increment: 1 } },
        where: { id },
      });

      return created;
    });

    return NextResponse.json({
      request,
      success: true,
    });
  } catch (error) {
    console.error("Failed to create download request", error);
    return NextResponse.json(
      { error: "Failed to create download request." },
      { status: 500 },
    );
  }
}
