import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "playverse-theme";

export type GamesTheme = "light" | "dark";

function readInitialTheme(): GamesTheme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY) as GamesTheme | null;
  if (stored === "light" || stored === "dark") return stored;
  const tg = window.Telegram?.WebApp?.colorScheme;
  if (tg) return tg === "dark" ? "dark" : "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useGamesTheme() {
  const [theme, setThemeState] = useState<GamesTheme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const setTheme = useCallback((t: GamesTheme) => {
    setThemeState(t);
  }, []);

  return { theme, toggle, setTheme, isDark: theme === "dark" };
}
