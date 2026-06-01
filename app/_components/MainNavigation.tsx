"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  Camera,
  Compass,
  Grid,
  Menu,
  Sparkles,
  Timeline,
  X,
  MapPin,
  Search,
  Info,
} from "lucide-react";
import { SearchPalette } from "./SearchPalette";

const navItems = [
  { href: "/", label: "Gallery", icon: Grid },
  { href: "/stories", label: "Stories", icon: BookOpen },
  { href: "/timeline", label: "Timeline", icon: Timeline },
  { href: "/collections", label: "Collections", icon: Compass },
  { href: "/map", label: "Map", icon: MapPin },
  { href: "/insights", label: "Insights", icon: Sparkles },
  { href: "/gear", label: "Gear", icon: Camera },
  { href: "/about", label: "About", icon: Info },
];

export function MainNavigation() {
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <>
      <SearchPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-300 text-black">
              YS
            </span>
            <span className="hidden sm:inline">Yan Saputra Photography</span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:border-cyan-300/30 hover:bg-white/10"
            >
              <Search className="size-4" />
              CMD + K
            </button>
            <nav className="hidden items-center gap-1 xl:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-cyan-300/30 hover:bg-white/10"
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:border-cyan-300/30 hover:bg-white/10"
            >
              <Search className="size-4" />
              Search
            </button>
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 transition hover:border-cyan-300/30 hover:bg-white/10"
              aria-label="Open navigation menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-white/10 bg-[#050505]/95 px-4 py-4 sm:px-6 lg:px-8">
            <div className="grid gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-3xl border border-white/10 bg-zinc-950/95 px-4 py-3 text-sm font-medium text-white transition hover:border-cyan-300/30 hover:bg-white/5"
                  >
                    <Icon className="size-5 text-cyan-300" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
