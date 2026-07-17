"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import {
  formatShortcutKeys,
  keyboardShortcuts,
} from "@/src/lib/keyboard-shortcuts";

type KeyboardShortcutsLayerContextValue = {
  openHelp: () => void;
  closeHelp: () => void;
};

const KeyboardShortcutsLayerContext =
  createContext<KeyboardShortcutsLayerContextValue | null>(null);

const groups = ["Navigation", "Actions", "View", "Search", "Admin"] as const;

export function useKeyboardShortcutsLayer() {
  const context = useContext(KeyboardShortcutsLayerContext);

  if (!context) {
    throw new Error("useKeyboardShortcutsLayer must be used within provider");
  }

  return context;
}

export function KeyboardShortcutsLayer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [helpOpen, setHelpOpen] = useState(false);

  const value = useMemo(
    () => ({
      openHelp: () => setHelpOpen(true),
      closeHelp: () => setHelpOpen(false),
    }),
    [],
  );

  return (
    <KeyboardShortcutsLayerContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {helpOpen ? (
          <motion.div
            className="fixed inset-0 z-[200] bg-black/80 p-4 text-white backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              aria-hidden="true"
              onClick={value.closeHelp}
            />
            <motion.div
              className="relative mx-auto flex h-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#020203]/96 shadow-2xl"
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 28, opacity: 0 }}
              transition={{ duration: 0.24 }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
                    Keyboard Shortcuts
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={value.closeHelp}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                  aria-label="Close shortcuts help"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="grid gap-6 overflow-y-auto p-6 md:grid-cols-2">
                {groups.map((group) => (
                  <section
                    key={group}
                    className="rounded-[28px] border border-white/10 bg-zinc-950/90 p-5"
                  >
                    <h3 className="text-sm uppercase tracking-[0.24em] text-cyan-300">
                      {group}
                    </h3>
                    <div className="mt-4 space-y-3">
                      {keyboardShortcuts
                        .filter((item) => item.group === group)
                        .map((shortcut) => (
                          <div
                            key={shortcut.id}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                          >
                            <span className="text-sm text-white">
                              {shortcut.label}
                            </span>
                            <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1 font-mono text-xs text-zinc-200">
                              {formatShortcutKeys(shortcut.keys)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </section>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </KeyboardShortcutsLayerContext.Provider>
  );
}
