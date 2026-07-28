"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Grid, Menu, X, Search, Info, Compass } from "lucide-react";
import { SearchPalette } from "./SearchPalette";
import { useRouter } from "next/navigation";
import { useKeyboardShortcuts } from "@/src/hooks/useKeyboardShortcuts";
import { useKeyboardShortcutsLayer } from "./KeyboardShortcutsLayer";
import { keyboardShortcuts } from "@/src/lib/keyboard-shortcuts";

const navItems = [
  { href: "/", label: "Gallery", icon: Grid },
  { href: "/collections", label: "Collections", icon: Compass },
  { href: "/stories", label: "Stories", icon: BookOpen },
  { href: "/about", label: "About", icon: Info },
];

export function MainNavigation() {
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const router = useRouter();
  const { openHelp } = useKeyboardShortcutsLayer();

  const globalShortcuts = useMemo(
    () => [
      {
        id: "nav-focus-search",
        keys: keyboardShortcuts.filter(
          (item) => item.id === "focus-search" || item.id === "global-search",
        ).flatMap((item) => item.keys),
        handler: (event: KeyboardEvent) => {
          event.preventDefault();
          setPaletteOpen(true);
        },
      },
      {
        id: "nav-help",
        keys: keyboardShortcuts.find((item) => item.id === "help")?.keys ?? [],
        handler: (event: KeyboardEvent) => {
          event.preventDefault();
          openHelp();
        },
      },
      {
        id: "nav-admin",
        keys: keyboardShortcuts.find((item) => item.id === "admin-upload")?.keys ?? [],
        handler: (event: KeyboardEvent) => {
          event.preventDefault();
          router.push("/admin");
        },
      },
    ],
    [openHelp, router],
  );

  useKeyboardShortcuts(globalShortcuts);

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
              Search
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
