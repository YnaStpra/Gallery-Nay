"use client";

import { useEffect } from "react";

import { useJourney } from "@/src/hooks";

type JourneyTrackerProps = {
  collection?: string;
  country?: string;
  location?: string;
  story?: string;
};

export function JourneyTracker({
  collection,
  country,
  location,
  story,
}: JourneyTrackerProps) {
  const { addCollection, addCountry, addLocation, addStory } = useJourney();

  useEffect(() => {
    if (collection) addCollection(collection);
    if (country) addCountry(country);
    if (location) addLocation(location);
    if (story) addStory(story);
  }, [
    addCollection,
    addCountry,
    addLocation,
    addStory,
    collection,
    country,
    location,
    story,
  ]);

  return null;
}
