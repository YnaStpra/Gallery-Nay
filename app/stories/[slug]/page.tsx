import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JourneyTracker } from "@/app/_components/JourneyTracker";
import { getStoryBySlug, type StoryDetail } from "@/src/lib/story-data";
import { getStories } from "@/src/lib/story-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const story = await getStoryBySlug(params.slug);
  if (!story) {
    return {
      title: "Story not found | Yan Saputra Photography",
      description: "This story could not be located.",
    };
  }

  return {
    title: `${story.title} | Stories | Yan Saputra Photography`,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      images: [story.coverImage],
      type: "article",
    },
  };
}

type Props = {
  params: {
    slug: string;
  };
};

function StoryBlock({ block }: { block: StoryDetail["content"][number] }) {
  if (block.type === "paragraph") {
    return <p className="mt-8 text-lg leading-8 text-zinc-300">{block.text}</p>;
  }

  if (block.type === "quote") {
    return (
      <blockquote className="mx-auto mt-8 max-w-3xl border-l-2 border-cyan-300/70 pl-6 italic text-xl leading-9 text-white/90">
        {block.text}
      </blockquote>
    );
  }

  return (
    <figure className="mt-10 overflow-hidden rounded-[32px] bg-zinc-900">
      <Image
        src={block.src}
        alt={block.alt}
        width={1600}
        height={900}
        className="w-full object-cover"
        sizes="(max-width: 1024px) 100vw, 1024px"
      />
      {block.caption ? (
        <figcaption className="bg-black/60 px-5 py-4 text-sm text-zinc-400">
          {block.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default async function StoryPage({ params }: Props) {
  const story = await getStoryBySlug(params.slug);
  const allStories = await getStories();

  if (!story) {
    notFound();
  }

  const relatedStories = allStories
    .filter((item) => item.id !== story.id)
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <JourneyTracker
        country={story.country}
        location={story.location}
        story={story.title}
      />
      <section className="relative overflow-hidden border-b border-white/10 pb-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.14),_transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-8 lg:px-12">
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950/90 shadow-2xl shadow-black/40">
            <div className="relative aspect-[16/9] w-full bg-zinc-900">
              <Image
                src={story.coverImage}
                alt={story.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1152px"
              />
            </div>
            <div className="space-y-4 px-6 py-8 sm:px-10 sm:py-10">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                {story.location}, {story.country} • {story.publishedAt}
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                {story.title}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-zinc-300">
                {story.excerpt}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-8 lg:px-12">
        {story.content.map((block, index) => (
          <StoryBlock key={index} block={block} />
        ))}
      </section>

      <section className="border-t border-white/10 px-4 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-amber-200">
                Related stories
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                Continue the journal
              </h2>
            </div>
            <Link
              href="/stories"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              All stories
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {relatedStories.map((item) => (
              <Link
                key={item.id}
                href={`/stories/${item.slug}`}
                className="group overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950 p-6 transition hover:-translate-y-1 hover:border-cyan-300/30"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                  {item.location}, {item.country}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  {item.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-zinc-500">
                  <span>{item.readingTime}</span>
                  <span>{item.publishedAt}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
