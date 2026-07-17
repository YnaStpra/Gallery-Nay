export type ShortcutMatch = {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  alt?: boolean;
  shift?: boolean;
};

export type ShortcutDefinition = {
  id: string;
  label: string;
  group: "Navigation" | "Actions" | "View" | "Search" | "Admin";
  keys: ShortcutMatch[];
};

export const keyboardShortcuts: ShortcutDefinition[] = [
  {
    id: "previous",
    label: "Previous",
    group: "Navigation",
    keys: [{ key: "ArrowLeft" }],
  },
  {
    id: "next",
    label: "Next",
    group: "Navigation",
    keys: [{ key: "ArrowRight" }],
  },
  {
    id: "close",
    label: "Close",
    group: "Navigation",
    keys: [{ key: "Escape" }],
  },
  {
    id: "favorite",
    label: "Favorite",
    group: "Actions",
    keys: [{ key: "f" }],
  },
  {
    id: "like",
    label: "Like",
    group: "Actions",
    keys: [{ key: "l" }],
  },
  {
    id: "download",
    label: "Download",
    group: "Actions",
    keys: [{ key: "d" }],
  },
  {
    id: "share",
    label: "Share",
    group: "Actions",
    keys: [{ key: "s" }],
  },
  {
    id: "copy",
    label: "Copy Link",
    group: "Actions",
    keys: [{ key: "c" }],
  },
  {
    id: "metadata",
    label: "Metadata",
    group: "View",
    keys: [{ key: "i" }],
  },
  {
    id: "palette",
    label: "Palette",
    group: "View",
    keys: [{ key: "p" }],
  },
  {
    id: "histogram",
    label: "Histogram",
    group: "View",
    keys: [{ key: "h" }],
  },
  {
    id: "map",
    label: "Map",
    group: "View",
    keys: [{ key: "m" }],
  },
  {
    id: "similar",
    label: "Similar Photos",
    group: "View",
    keys: [{ key: "r" }],
  },
  {
    id: "zoom-toggle",
    label: "Toggle Zoom",
    group: "View",
    keys: [{ key: "z" }],
  },
  {
    id: "zoom-reset",
    label: "Reset Zoom",
    group: "View",
    keys: [{ key: "0" }],
  },
  {
    id: "zoom-in",
    label: "Zoom In",
    group: "View",
    keys: [{ key: "+" }, { key: "=" }],
  },
  {
    id: "zoom-out",
    label: "Zoom Out",
    group: "View",
    keys: [{ key: "-" }],
  },
  {
    id: "help",
    label: "Help",
    group: "View",
    keys: [{ key: "?" }, { key: "/", shift: true }],
  },
  {
    id: "focus-search",
    label: "Focus Search",
    group: "Search",
    keys: [{ key: "/" }],
  },
  {
    id: "global-search",
    label: "Search",
    group: "Search",
    keys: [{ key: "k", ctrl: true }, { key: "k", meta: true }],
  },
  {
    id: "admin-upload",
    label: "Upload",
    group: "Admin",
    keys: [{ key: "u", ctrl: true }, { key: "u", meta: true }],
  },
];

export function isFormElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest("input, textarea, select, form, [contenteditable='true']"),
  );
}

export function matchesShortcut(
  event: KeyboardEvent,
  match: ShortcutMatch,
) {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  const expectedKey = match.key.length === 1 ? match.key.toLowerCase() : match.key;

  return (
    key === expectedKey &&
    Boolean(event.ctrlKey) === Boolean(match.ctrl) &&
    Boolean(event.metaKey) === Boolean(match.meta) &&
    Boolean(event.altKey) === Boolean(match.alt) &&
    Boolean(event.shiftKey) === Boolean(match.shift)
  );
}

export function formatShortcutKeys(keys: ShortcutMatch[]) {
  return keys
    .map((key) => {
      const parts: string[] = [];
      if (key.ctrl) parts.push("Ctrl");
      if (key.meta) parts.push("Cmd");
      if (key.alt) parts.push("Alt");
      if (key.shift) parts.push("Shift");

      const label =
        key.key === "?" || key.key === "/"
          ? key.key
          : key.key.length === 1
            ? key.key.toUpperCase()
            : key.key;
      parts.push(label);
      return parts.join("+");
    })
    .join(" / ");
}
