import type { Metadata } from "next";
import { getGearStats } from "@/src/lib/gallery-data";

export const metadata: Metadata = {
  title: "Gear | Yan Saputra Photography",
  description:
    "A detailed look at the photography equipment used to capture the travel archive.",
};

export const dynamic = "force-dynamic";

export default async function GearPage() {
  const gearStats = await getGearStats();
  const topGear = gearStats.slice(0, 4);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Gear
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            The cameras and lenses that shaped the archive.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Equipment is only one part of the story. These are the trusted tools
            that support travel photography in diverse light and locations.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-6 xl:grid-cols-2">
          {topGear.map((gear) => (
            <article
              key={gear.label}
              className="rounded-[32px] border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-black/20"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-amber-200">
                Top gear
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                {gear.label}
              </h2>
              <div className="mt-6 grid gap-4 text-sm text-zinc-300">
                <div className="flex items-center justify-between">
                  <span>Photos captured</span>
                  <span className="font-semibold text-white">{gear.count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Usage</span>
                  <span className="font-semibold text-white">
                    {gear.usagePct}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Collections used in</span>
                  <span className="font-semibold text-white">
                    {gear.collections}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Countries used in</span>
                  <span className="font-semibold text-white">
                    {gear.countries}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
