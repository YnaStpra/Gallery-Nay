"use client";

import { useCallback, useMemo, useState } from "react";

export function useBeforeAfter() {
  const [open, setOpen] = useState(false);
  const [split, setSplit] = useState(50);
  const [showLabels, setShowLabels] = useState(true);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  const resetSplit = useCallback(() => setSplit(50), []);
  const toggleLabels = useCallback(() => setShowLabels((current) => !current), []);

  const moveSplit = useCallback((delta: number) => {
    setSplit((current) => Math.max(0, Math.min(100, current + delta)));
  }, []);

  return useMemo(
    () => ({
      closeModal,
      moveSplit,
      open,
      openModal,
      resetSplit,
      setSplit,
      showLabels,
      toggleLabels,
      split,
    }),
    [
      closeModal,
      moveSplit,
      open,
      openModal,
      resetSplit,
      showLabels,
      toggleLabels,
      split,
    ],
  );
}
