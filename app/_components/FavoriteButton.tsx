"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useFavorites } from "@/src/hooks";

type Props = {
  photoId: string;
  showCount?: boolean;
  compact?: boolean;
};

export function FavoriteButton({
  photoId,
  showCount = false,
  compact = false,
}: Props) {
  const { isFavorited, toggleFavorite, isLoaded } = useFavorites();
  const [count, setCount] = useState(0);
  const isFav = isFavorited(photoId);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    fetch(`/api/photo/${photoId}/favorite`)
      .then((res) => res.json())
      .then((data: { favoriteCount?: number }) =>
        setCount(data.favoriteCount ?? 0),
      )
      .catch(console.error);
  }, [photoId, isLoaded]);

  const handleToggle = async () => {
    toggleFavorite(photoId);

    try {
      const res = await fetch(`/api/photo/${photoId}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isFav ? "decrement" : "increment",
        }),
      });
      const data = (await res.json()) as { favoriteCount?: number };
      setCount(data.favoriteCount ?? 0);
    } catch (error) {
      console.error("Failed to update favorite count", error);
    }
  };

  if (!isLoaded) {
    return (
      <div
        className={
          compact
            ? "h-6 w-6 bg-white/10 rounded animate-pulse"
            : "h-8 w-8 bg-white/10 rounded animate-pulse"
        }
      />
    );
  }

  return (
    <button
      onClick={handleToggle}
      type="button"
      className={`inline-flex items-center gap-2 transition ${
        compact
          ? "p-1 hover:bg-white/5 rounded"
          : "px-3 py-2 rounded-lg border border-white/10 hover:border-red-300/30 hover:bg-red-300/5"
      }`}
      aria-pressed={isFav}
      title={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${compact ? "size-4" : "size-5"} transition ${
          isFav ? "fill-red-400 text-red-400" : "text-zinc-400"
        }`}
        aria-hidden
      />
      {showCount && !compact && (
        <span className="text-sm text-zinc-400">{count}</span>
      )}
    </button>
  );
}
