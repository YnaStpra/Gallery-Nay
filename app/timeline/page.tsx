import type { Metadata } from "next";
import { motion } from "framer-motion";
import { getTimelinePoints } from "@/src/lib/gallery-data";

export const metadata: Metadata = {
  title: "Timeline | Yan Saputra Photography",
  description:
    "Visualize the travel photography journey over time with a cinematic timeline of destinations and photo chapters.",
};

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const timeline = await getTimelinePoints();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Timeline
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            The photography journey through place and year.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Stories and locations arranged in a cinematic vertical timeline,
            revealing how the archive evolved over each year.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-10">
          {timeline.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950/90 p-8 shadow-2xl shadow-black/20"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200">
                    {item.year}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">
                    {item.location}
                  </h2>
                </div>
                <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-200">
                  {item.photoCount} photos
                </span>
              </div>
              <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-300">
                {item.note}
              </p>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
