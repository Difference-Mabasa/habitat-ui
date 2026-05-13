import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface PaletteContextValue {
  open: boolean;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
}

const PaletteContext = createContext<PaletteContextValue | null>(null);

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const value = useMemo<PaletteContextValue>(
    () => ({
      open,
      openPalette: () => setOpen(true),
      closePalette: () => setOpen(false),
      togglePalette: () => setOpen((v) => !v),
    }),
    [open],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isShortcut = (e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K");
      if (!isShortcut) return;
      e.preventDefault();
      setOpen((v) => !v);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>;
}

export function usePalette(): PaletteContextValue {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used inside <PaletteProvider>");
  return ctx;
}
