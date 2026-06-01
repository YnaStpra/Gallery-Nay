import { prisma } from "./prisma";
import { getGalleryPhotos, getGalleryAlbums } from "./gallery-data";
import type { GalleryPhoto } from "./gallery-data";

export type StoryContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "quote"; text: string };

export type StorySummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  location: string;
  country: string;
  publishedAt: string;
  readingTime: string;
  published: boolean;
};

export type StoryDetail = StorySummary & {
  content: StoryContentBlock[];
  relatedPhotos: GalleryPhoto[];
};

const fallbackContent: StoryContentBlock[] = [
  {
    type: "paragraph",
    text: "The coast was quiet before sunrise, with only fishermen tracing the horizon in long, careful lines. This chapter began as a search for calm light, where warm sand met a cool blue sea.",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=88",
    alt: "Soft tropical sunrise over a quiet beach.",
    caption: "The first light of the day over Sanur, Bali.",
  },
  {
    type: "paragraph",
    text: "The journey through each frame is less about a single moment and more about the rhythm between light and place. I look for scenes that feel both intimate and expansive, where ordinary shorelines become a quiet journal entry.",
  },
  {
    type: "quote",
    text: "Travel stories are the spaces between photographs—they are what the frame cannot hold.",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=86",
    alt: "Low hills and golden fields under a vibrant sky.",
    caption: "Sunset across the Sumba grasslands.",
  },
];

const fallbackStories: StorySummary[] = [
  {
    id: "coastal-mapping-bali",
    slug: "coastal-mapping-bali",
    title: "Coastal Mapping: Bali's Shorelines",
    excerpt:
      "A travel story about early light, quiet beaches, and the calm rhythm of island edges.",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=88",
    location: "Bali",
    country: "Indonesia",
    publishedAt: "2025-08-14",
    published: true,
    readingTime: "4 min read",
  },
  {
    id: "night-walks-singapore",
    slug: "night-walks-singapore",
    title: "Night Walks: Singapore After Dark",
    excerpt:
      "Urban reflections, hidden neon, and the way a city feels alive in rain-washed light.",
    coverImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=86",
    location: "Singapore",
    country: "Singapore",
    publishedAt: "2026-01-03",
    published: true,
    readingTime: "3 min read",
  },
];

function estimateReadingTime(content: StoryContentBlock[]) {
  const words = content.reduce((sum, block) => {
    if (block.type === "paragraph" || block.type === "quote") {
      return sum + block.text.split(/\s+/).filter(Boolean).length;
    }
    return sum;
  }, 0);

  return `${Math.max(1, Math.round(words / 180))} min read`;
}

function formatDate(date: Date | string | null) {
  if (!date) {
    return "TBA";
  }

  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function parseContent(value: unknown): StoryContentBlock[] {
  if (!value) {
    return fallbackContent;
  }

  if (Array.isArray(value)) {
    return value.map((block) => {
      if (typeof block === "object" && block !== null && "type" in block) {
        return block as StoryContentBlock;
      }
      return { type: "paragraph", text: String(block) };
    });
  }

  return fallbackContent;
}

function buildStorySummary(story: any): StorySummary {
  const content = parseContent(story.content);
  return {
    id: story.id,
    slug: story.slug,
    title: story.title,
    excerpt:
      story.excerpt ||
      content.find((block) => block.type === "paragraph")?.text.slice(0, 120) ||
      "A travel story from the archive.",
    coverImage: story.coverImage,
    location: story.location || "Unknown",
    country: story.country || "Unknown",
    publishedAt: formatDate(story.publishedAt ?? story.createdAt),
    published: Boolean(story.published),
    readingTime: estimateReadingTime(content),
  };
}

export async function getStories(limit?: number): Promise<StorySummary[]> {
  try {
    const stories = await prisma.story.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    if (!stories.length) {
      return fallbackStories.slice(0, limit ?? fallbackStories.length);
    }

    return stories.map(buildStorySummary);
  } catch (error) {
    console.error("Failed to load stories", error);
    return fallbackStories.slice(0, limit ?? fallbackStories.length);
  }
}

export async function getStoryBySlug(
  slug: string,
): Promise<StoryDetail | null> {
  try {
    const story = await prisma.story.findUnique({
      where: { slug },
    });

    if (!story) {
      const fallback = fallbackStories.find((item) => item.slug === slug);
      if (!fallback) {
        return null;
      }
      return {
        ...fallback,
        content: fallbackContent,
        relatedPhotos: await getGalleryPhotos(),
      };
    }

    const summary = buildStorySummary(story);
    const photos = await getGalleryPhotos();

    const relatedPhotos = photos
      .filter(
        (photo) =>
          photo.location === summary.location ||
          photo.country === summary.country ||
          photo.collection.toLowerCase().includes(summary.title.toLowerCase()),
      )
      .slice(0, 6);

    return {
      ...summary,
      content: parseContent(story.content),
      relatedPhotos,
    };
  } catch (error) {
    console.error("Failed to load story", error);
    return null;
  }
}

export async function getStorySearchIndex() {
  const stories = await getStories();
  const photos = await getGalleryPhotos();
  const albums = await getGalleryAlbums();

  return [
    ...stories.map((story) => ({
      id: story.id,
      type: "Story" as const,
      title: story.title,
      subtitle: `${story.location}, ${story.country}`,
      href: `/stories/${story.slug}`,
    })),
    ...photos.map((photo) => ({
      id: photo.id,
      type: "Photo" as const,
      title: photo.title,
      subtitle: `${photo.location}, ${photo.country}`,
      href: `/#${photo.slug ?? photo.id}`,
    })),
    ...albums.map((album) => ({
      id: album.slug,
      type: "Collection" as const,
      title: album.collection,
      subtitle: `${album.photoCount} photos`,
      href: `/collections/${album.slug}`,
    })),
  ];
}
