"use client";

import { useEffect } from "react";
import {
  isFormElement,
  matchesShortcut,
  type ShortcutMatch,
} from "@/src/lib/keyboard-shortcuts";

export type ShortcutHandler = {
  id: string;
  keys: ShortcutMatch[];
  handler: (event: KeyboardEvent) => void;
  enabled?: boolean;
};

type RegistryEntry = {
  id: string;
  keys: ShortcutMatch[];
  handler: (event: KeyboardEvent) => void;
};

const registry = new Map<string, RegistryEntry>();
let listenerInstalled = false;

function handleKeyDown(event: KeyboardEvent) {
  if (isFormElement(event.target)) {
    return;
  }

  const entries = Array.from(registry.values());

  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const entry = entries[index];
    const matches = entry.keys.some((key) => matchesShortcut(event, key));

    if (!matches) {
      continue;
    }

    event.preventDefault();
    entry.handler(event);
    return;
  }
}

function ensureListener() {
  if (listenerInstalled || typeof window === "undefined") {
    return;
  }

  window.addEventListener("keydown", handleKeyDown);
  listenerInstalled = true;
}

function cleanupListener() {
  if (!listenerInstalled || typeof window === "undefined") {
    return;
  }

  if (registry.size === 0) {
    window.removeEventListener("keydown", handleKeyDown);
    listenerInstalled = false;
  }
}

export function useKeyboardShortcuts(shortcuts: ShortcutHandler[]) {
  useEffect(() => {
    ensureListener();

    for (const shortcut of shortcuts) {
      if (!shortcut.enabled) {
        continue;
      }

      registry.set(shortcut.id, {
        id: shortcut.id,
        keys: shortcut.keys,
        handler: shortcut.handler,
      });
    }

    return () => {
      for (const shortcut of shortcuts) {
        registry.delete(shortcut.id);
      }

      cleanupListener();
    };
  }, [shortcuts]);
}
