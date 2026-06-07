import { NextRequest, NextResponse } from "next/server";
import { getColorPalette } from "@/src/lib/color-palette";

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get("imageUrl") ?? "";

  if (!imageUrl) {
    return NextResponse.json(
      { error: "imageUrl is required" },
      { status: 400 },
    );
  }

  const palette = await getColorPalette(imageUrl);
  return NextResponse.json({ palette });
}
