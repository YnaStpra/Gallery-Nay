import type { Metadata } from "next";
import { prisma } from "@/src/lib/prisma";
import { StoryManagerClient } from "./StoryManagerClient";

export const metadata: Metadata = {
  title: "Admin Stories | Yan Saputra Photography",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminStoriesPage() {
  const stories = await prisma.story.findMany({
    orderBy: { publishedAt: "desc" },
  });

  const serializedStories = stories.map((story) => ({
    ...story,
    publishedAt: story.publishedAt ? story.publishedAt.toISOString() : null,
  }));

  return <StoryManagerClient stories={serializedStories} />;
}
