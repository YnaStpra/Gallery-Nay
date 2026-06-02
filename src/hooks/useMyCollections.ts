"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

type CollectionsData = Record<string, string[]>;

const STORAGE_KEY = "yan_my_collections";
const COLLECTIONS_EVENT = "yan:my-collections";

function getSnapshot() {
  if (typeof window === "undefined") {
    return "{}";
  }

  return window.localStorage.getItem(STORAGE_KEY) ?? "{}";
}

function readCollections(): CollectionsData {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CollectionsData) : {};
  } catch (error) {
    console.error("Failed to load collections", error);
    return {};
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
  window.addEventListener(COLLECTIONS_EVENT, callback);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(COLLECTIONS_EVENT, callback);
  };
}

function writeCollections(collections: CollectionsData) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
    window.dispatchEvent(new Event(COLLECTIONS_EVENT));
  } catch (error) {
    console.error("Failed to save collections", error);
  }
}

export function useMyCollections() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "{}");

  const collections = useMemo(() => {
    try {
      const parsed = JSON.parse(snapshot) as CollectionsData;
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }, [snapshot]);

  const createCollection = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    const current = readCollections();
    if (current[trimmed]) {
      return;
    }

    writeCollections({ ...current, [trimmed]: [] });
  }, []);

  const deleteCollection = useCallback((name: string) => {
    const current = readCollections();
    const updated = { ...current };
    delete updated[name];
    writeCollections(updated);
  }, []);

  const renameCollection = useCallback((oldName: string, newName: string) => {
    const trimmed = newName.trim();
    const current = readCollections();

    if (!trimmed || !current[oldName] || current[trimmed]) {
      return;
    }

    const updated = { ...current, [trimmed]: current[oldName] };
    delete updated[oldName];
    writeCollections(updated);
  }, []);

  const addPhotoToCollection = useCallback(
    (collectionName: string, photoId: string) => {
      const current = readCollections();
      const photos = current[collectionName];

      if (!photos || photos.includes(photoId)) {
        return;
      }

      writeCollections({
        ...current,
        [collectionName]: [...photos, photoId],
      });
    },
    [],
  );

  const removePhotoFromCollection = useCallback(
    (collectionName: string, photoId: string) => {
      const current = readCollections();
      const photos = current[collectionName];

      if (!photos) {
        return;
      }

      writeCollections({
        ...current,
        [collectionName]: photos.filter((id) => id !== photoId),
      });
    },
    [],
  );

  const getCollectionPhotoIds = useCallback(
    (collectionName: string) => collections[collectionName] || [],
    [collections],
  );

  const getCollectionCount = useCallback(
    (collectionName: string) => collections[collectionName]?.length || 0,
    [collections],
  );

  const getAllCollectionNames = useCallback(
    () => Object.keys(collections),
    [collections],
  );

  const shareCollectionLink = useCallback(
    (collectionName: string) => {
      const shareData = {
        collection: collectionName,
        photos: collections[collectionName] ?? [],
      };
      const encoded = btoa(JSON.stringify(shareData));
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      return `${origin}/my-collections?share=${encoded}`;
    },
    [collections],
  );

  return {
    collections,
    isLoaded: true,
    createCollection,
    deleteCollection,
    renameCollection,
    addPhotoToCollection,
    removePhotoFromCollection,
    getCollectionPhotoIds,
    getCollectionCount,
    getAllCollectionNames,
    shareCollectionLink,
  };
}
