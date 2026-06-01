import { NextResponse } from "next/server";
import { getStorySearchIndex } from "@/src/lib/story-data";

export async function GET() {
  const items = await getStorySearchIndex();
  return NextResponse.json({ items });
}
