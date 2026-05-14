import { useCallback, useEffect, useState } from "react";

/**
 * LocalStorage-backed set of saved property IDs. Shared by every surface
 * that renders a save heart — Browse cards, PropertyDetail's "Save"
 * button, future saved-search emails. Returns the live set plus toggle /
 * is-saved helpers.
 *
 * <p>Storage is anonymous: no server sync yet. When auth-aware "Saved
 * Listings" lands the hook can swap to a session-scoped store without
 * changing call sites.
 *
 * <p>Listens to the {@code storage} event so two open tabs stay in sync
 * — toggle a heart on one, the other updates without a refresh.
 */
const STORAGE_KEY = "habitat:savedProperties";

function readStored(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((x): x is string => typeof x === "string")) : new Set();
  } catch {
    return new Set();
  }
}

function writeStored(set: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // Quota / private-mode failures — fall through silently; in-memory
    // state still updates so the heart still toggles for this session.
  }
}

export interface UseSavedPropertiesResult {
  saved: Set<string>;
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
}

export function useSavedProperties(): UseSavedPropertiesResult {
  const [saved, setSaved] = useState<Set<string>>(readStored);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      setSaved(readStored());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeStored(next);
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => saved.has(id), [saved]);

  return { saved, isSaved, toggle };
}
