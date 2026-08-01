"use client";

import { useEffect, useMemo, useState } from "react";

import { PhotographerNotesCard } from "./PhotographerNotesCard";

type PhotographerNotesProps = {
  notes?: string | null;
  shareText?: string;
};

export function PhotographerNotes({
  notes,
  shareText,
}: PhotographerNotesProps) {
  const [copied, setCopied] = useState(false);

  const safeNotes = useMemo(() => {
    const trimmed = notes?.trim() ?? "";
    return trimmed.length > 0 ? trimmed : "";
  }, [notes]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!safeNotes) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText ?? safeNotes);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <PhotographerNotesCard
      copied={copied}
      notes={safeNotes}
      onCopy={handleCopy}
    />
  );
}
