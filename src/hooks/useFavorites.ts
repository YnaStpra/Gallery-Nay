"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

type FavoritesData = Record<string, { addedAt: number }>;

const STORAGE_KEY = "yan_favorites";
const FAVORITES_EVENT = "yan:favorites";

function readFavoritesData(): FavoritesData {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as FavoritesData) : {};
  } catch (error) {
    console.error("Failed to load favorites", error);
    return {};
  }
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return "{}";
  }

  return window.localStorage.getItem(STORAGE_KEY) ?? "{}";
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(FAVORITES_EVENT, callback);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(FAVORITES_EVENT, callback);
  };
}

function writeFavorites(data: FavoritesData) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(FAVORITES_EVENT));
  } catch (error) {
    console.error("Failed to save favorites", error);
  }
}

export function useFavorites() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "{}");

  const data = useMemo(() => {
    try {
      return JSON.parse(snapshot) as FavoritesData;
    } catch {
      return {};
    }
  }, [snapshot]);

  const favorites = useMemo(() => new Set(Object.keys(data)), [data]);

  const addFavorite = useCallback((photoId: string) => {
    const current = readFavoritesData();
    if (current[photoId]) {
      return;
    }

    writeFavorites({
      ...current,
      [photoId]: { addedAt: Date.now() },
    });
  }, []);

  const removeFavorite = useCallback((photoId: string) => {
    const current = readFavoritesData();
    if (!current[photoId]) {
      return;
    }

    const updated = { ...current };
    delete updated[photoId];
    writeFavorites(updated);
  }, []);

  const toggleFavorite = useCallback(
    (photoId: string) => {
      if (readFavoritesData()[photoId]) {
        removeFavorite(photoId);
      } else {
        addFavorite(photoId);
      }
    },
    [addFavorite, removeFavorite],
  );

  const isFavorited = useCallback(
    (photoId: string) => favorites.has(photoId),
    [favorites],
  );

  const getFavoritesList = useCallback(
    () =>
      Object.entries(data)
        .sort((a, b) => b[1].addedAt - a[1].addedAt)
        .map(([photoId]) => photoId),
    [data],
  );

  const clearFavorites = useCallback(() => {
    writeFavorites({});
  }, []);

  return {
    favorites,
    isLoaded: true,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorited,
    getFavoritesList,
    clearFavorites,
  };
}
