"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowRight, X } from "lucide-react";

type SearchItem = {
  id: string;
  type: "Photo" | "Story" | "Collection" | "Album" | "Location" | "Country";
  title: string;
  subtitle: string;
  href: string;
};

type SearchPaletteProps = {
  open: boolean;
  onClose: () => void;
};

export function SearchPalette({ open, onClose }: SearchPaletteProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[] | null>(null);

  useEffect(() => {
    if (!open) return;
    let ignore = false;

    fetch("/api/search")
      .then((res) => res.json())
      .then((data: { items?: SearchItem[] }) => {
        if (!ignore) {
          setItems(data.items ?? []);
        }
      })
      .catch(() => {
        if (!ignore) {
          setItems([]);
        }
      });

    return () => {
      ignore = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const searchableItems = items ?? [];
    if (!normalized) return searchableItems;
    return searchableItems.filter((item) =>
      [item.title, item.subtitle, item.type].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [items, query]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl p-4 text-white">
      <div className="mx-auto flex h-full max-w-4xl flex-col gap-6 overflow-hidden rounded-[32px] border border-white/10 bg-[#020203]/95 p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-300 text-black">
              <Search className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
                Quick find
              </p>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Search photos, stories, collections, and places
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-cyan-300/30 hover:bg-white/10"
            aria-label="Close search"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950/90 px-4 py-3">
          <label className="sr-only">Search query</label>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent text-lg text-white outline-none placeholder:text-zinc-500"
            placeholder="Type a location, collection, or story title..."
          />
        </div>

        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#050505]/95">
          <div className="max-h-[420px] overflow-y-auto">
            {items === null ? (
              <div className="p-6 text-center text-zinc-400">
                Loading search index…
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-6 text-center text-zinc-500">
                No results. Try another keyword.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredItems.map((item) => (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={item.href}
                    className="flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-white/5"
                    onClick={onClose}
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                        {item.type}
                      </p>
                      <p className="mt-1 text-base font-semibold text-white">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-zinc-400">
                        {item.subtitle}
                      </p>
                    </div>
                    <ArrowRight className="size-5 text-cyan-300" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
