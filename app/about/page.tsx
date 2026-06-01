import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Yan Saputra Photography",
  description:
    "Learn about the photographer, creative approach, and travel philosophy behind Yan Saputra's visual journal.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">
            About
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            A travel photography journal built around curiosity, light, and
            place.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            This space is designed to feel editorial—not corporate—where visuals
            lead and ideas follow. Here you can discover the vision behind the
            lens, the philosophy of travel, and the gear that makes it possible.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-10">
            <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-black/20">
              <h2 className="text-2xl font-semibold text-white">Biography</h2>
              <p className="mt-4 leading-8 text-zinc-300">
                Yan Saputra is a travel photographer who seeks the quiet edges
                of popular places, capturing moments where light and atmosphere
                intersect. Every frame is an invitation to slow down, observe,
                and remember.
              </p>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-black/20">
              <h2 className="text-2xl font-semibold text-white">
                Photography Philosophy
              </h2>
              <p className="mt-4 leading-8 text-zinc-300">
                Rather than creating images for social media, the work is rooted
                in travel journaling—composition, mood, and storytelling. The
                strongest frames are the ones that feel true to the place and
                the moment.
              </p>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-black/20">
              <h2 className="text-2xl font-semibold text-white">
                Travel Philosophy
              </h2>
              <p className="mt-4 leading-8 text-zinc-300">
                Travel is not a checklist. It is an ongoing conversation with
                landscapes, cultures, and the light each location offers. The
                journey is as important as the photograph.
              </p>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-black/20">
              <h2 className="text-2xl font-semibold text-white">
                Favorite Destinations
              </h2>
              <ul className="mt-6 space-y-4 text-zinc-300">
                <li>Sanur, Bali</li>
                <li>Mount Rinjani, Lombok</li>
                <li>Singapore</li>
                <li>Labuan Bajo, Flores</li>
                <li>Tana Toraja, South Sulawesi</li>
              </ul>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-black/20">
              <h2 className="text-2xl font-semibold text-white">
                Gear Overview
              </h2>
              <p className="mt-4 leading-8 text-zinc-300">
                The work is created with tools chosen for reliability and image
                quality: mirrorless cameras, sharp zooms, and compact walkaround
                lenses that perform in low light.
              </p>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-black/20">
              <h2 className="text-2xl font-semibold text-white">Contact</h2>
              <p className="mt-4 text-zinc-300">
                For collaborations, commissions, or story inquiries, reach out
                via email or use the contact section on the site.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
