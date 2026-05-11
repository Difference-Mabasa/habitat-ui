import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";
export const ACCENT_OPTIONS = ["#E97A1F", "#C56112", "#1E0F06", "#5C7A2F"] as const;
export type Accent = (typeof ACCENT_OPTIONS)[number];

const THEME_KEY = "backroom.theme";
const ACCENT_KEY = "backroom.accent";

function readStored<T extends string>(key: string, fallback: T, valid: readonly T[]): T {
  if (typeof window === "undefined") return fallback;
  const v = window.localStorage.getItem(key);
  return v && (valid as readonly string[]).includes(v) ? (v as T) : fallback;
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() =>
    readStored<ThemeMode>(THEME_KEY, "light", ["light", "dark"]),
  );
  const [accent, setAccentState] = useState<Accent>(() =>
    readStored<Accent>(ACCENT_KEY, "#E97A1F", ACCENT_OPTIONS),
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    window.localStorage.setItem(ACCENT_KEY, accent);
  }, [accent]);

  return {
    theme,
    setTheme: setThemeState,
    toggleTheme: () => setThemeState((t) => (t === "light" ? "dark" : "light")),
    accent,
    setAccent: setAccentState,
  };
}
