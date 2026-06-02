"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

export type RecentlyViewedItem = {
  photoId: string;
  viewedAt: number;
};

const STORAGE_KEY = "yan_recently_viewed";
const RECENT_EVENT = "yan:recently-viewed";
const MAX_ITEMS = 50;

function getSnapshot() {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function readRecent(): RecentlyViewedItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as RecentlyViewedItem[]) : [];
  } catch (error) {
    console.error("Failed to load recently viewed", error);
    return [];
  }
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
  window.addEventListener(RECENT_EVENT, callback);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(RECENT_EVENT, callback);
  };
}

function writeRecent(items: RecentlyViewedItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(RECENT_EVENT));
  } catch (error) {
    console.error("Failed to save recently viewed", error);
  }
}

export function useRecentlyViewed() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");

  const viewed = useMemo(() => {
    try {
      const parsed = JSON.parse(snapshot) as RecentlyViewedItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [snapshot]);

  const addToViewed = useCallback((photoId: string) => {
    const filtered = readRecent().filter((item) => item.photoId !== photoId);
    writeRecent([{ photoId, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS));
  }, []);

  const clearRecent = useCallback(() => {
    writeRecent([]);
  }, []);

  const getRecentCount = useCallback(() => viewed.length, [viewed]);

  const getRecentList = useCallback(
    () => viewed.map((item) => item.photoId),
    [viewed],
  );

  return {
    viewed,
    isLoaded: true,
    addToViewed,
    clearRecent,
    getRecentCount,
    getRecentList,
  };
}
