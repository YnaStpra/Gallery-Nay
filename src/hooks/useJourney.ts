"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

type JourneyData = {
  countries: string[];
  collections: string[];
  stories: string[];
  locations: string[];
};

const STORAGE_KEY = "yan_journey";
const JOURNEY_EVENT = "yan:journey";

const emptyJourney: JourneyData = {
  countries: [],
  collections: [],
  stories: [],
  locations: [],
};

function getSnapshot() {
  if (typeof window === "undefined") {
    return JSON.stringify(emptyJourney);
  }

  return window.localStorage.getItem(STORAGE_KEY) ?? JSON.stringify(emptyJourney);
}

function readJourney(): JourneyData {
  if (typeof window === "undefined") {
    return emptyJourney;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as Partial<JourneyData>) : {};

    return {
      countries: parsed.countries ?? [],
      collections: parsed.collections ?? [],
      stories: parsed.stories ?? [],
      locations: parsed.locations ?? [],
    };
  } catch (error) {
    console.error("Failed to load journey", error);
    return emptyJourney;
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
  window.addEventListener(JOURNEY_EVENT, callback);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(JOURNEY_EVENT, callback);
  };
}

function writeJourney(journey: JourneyData) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(journey));
    window.dispatchEvent(new Event(JOURNEY_EVENT));
  } catch (error) {
    console.error("Failed to save journey", error);
  }
}

function addUnique(field: keyof JourneyData, value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "Not set") {
    return;
  }

  const current = readJourney();
  if (current[field].includes(trimmed)) {
    return;
  }

  writeJourney({
    ...current,
    [field]: [...current[field], trimmed],
  });
}

export function useJourney() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => JSON.stringify(emptyJourney),
  );

  const journey = useMemo(() => {
    try {
      const parsed = JSON.parse(snapshot) as Partial<JourneyData>;

      return {
        countries: parsed.countries ?? [],
        collections: parsed.collections ?? [],
        stories: parsed.stories ?? [],
        locations: parsed.locations ?? [],
      };
    } catch {
      return emptyJourney;
    }
  }, [snapshot]);

  const addCountry = useCallback((country: string) => {
    addUnique("countries", country);
  }, []);

  const addCollection = useCallback((collection: string) => {
    addUnique("collections", collection);
  }, []);

  const addStory = useCallback((story: string) => {
    addUnique("stories", story);
  }, []);

  const addLocation = useCallback((location: string) => {
    addUnique("locations", location);
  }, []);

  const getVisitedCountries = useCallback(
    () => new Set(journey.countries),
    [journey],
  );

  const getVisitedCollections = useCallback(
    () => new Set(journey.collections),
    [journey],
  );

  const getVisitedStories = useCallback(
    () => new Set(journey.stories),
    [journey],
  );

  const getVisitedLocations = useCallback(
    () => new Set(journey.locations),
    [journey],
  );

  const clearJourney = useCallback(() => {
    writeJourney(emptyJourney);
  }, []);

  return {
    journey,
    isLoaded: true,
    addCountry,
    addCollection,
    addStory,
    addLocation,
    getVisitedCountries,
    getVisitedCollections,
    getVisitedStories,
    getVisitedLocations,
    clearJourney,
  };
}
