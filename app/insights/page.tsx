import type { Metadata } from "next";
import { InsightsCharts } from "@/app/_components/InsightsCharts";
import { getInsightData } from "@/src/lib/gallery-data";

export const metadata: Metadata = {
  title: "Insights | Yan Saputra Photography",
  description:
    "Photography insights and travel trends from the Yan Saputra archive.",
};

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const insights = await getInsightData();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Insights
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Travel photography insights from the archive.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Explore the data behind the journeys: countries, cities, cameras,
            and growth through time.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-black/20">
            <h2 className="text-2xl font-semibold text-white">Data portrait</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              The archive is as much about place and tools as it is about light.
              See the patterns that shaped the travel stories.
            </p>
          </div>

          <InsightsCharts
            countries={insights.topCountries.map(([name, value]) => ({
              name,
              value,
            }))}
            cities={insights.topCities.map(([name, value]) => ({
              name,
              value,
            }))}
            cameras={insights.topCameras.map(([name, value]) => ({
              name,
              value,
            }))}
            lenses={insights.topLenses.map(([name, value]) => ({
              name,
              value,
            }))}
            growth={insights.yearGrowth}
          />
        </div>
      </section>
    </main>
  );
}
