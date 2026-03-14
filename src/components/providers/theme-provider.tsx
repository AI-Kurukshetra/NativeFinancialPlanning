"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
);

function resolveTheme(defaultTheme: Theme, storageKey: string): Theme {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const root = document.documentElement;

  if (root.classList.contains("dark")) {
    return "dark";
  }

  if (root.classList.contains("light")) {
    return "light";
  }

  const stored = window.localStorage.getItem(storageKey);
  return stored === "dark" || stored === "light" ? stored : defaultTheme;
}

function applyTheme(theme: Theme, storageKey: string) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
  window.localStorage.setItem(storageKey, theme);
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "native-fpa-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    resolveTheme(defaultTheme, storageKey),
  );
  const resetThemeSwitchRef = useRef<number | null>(null);

  useEffect(() => {
    applyTheme(theme, storageKey);
  }, [storageKey, theme]);

  useEffect(
    () => () => {
      if (resetThemeSwitchRef.current !== null) {
        window.clearTimeout(resetThemeSwitchRef.current);
      }
    },
    [],
  );

  const setTheme = (nextTheme: Theme) => {
    if (nextTheme === theme) {
      return;
    }

    const root = document.documentElement;
    root.classList.add("theme-switching");
    applyTheme(nextTheme, storageKey);
    setThemeState(nextTheme);

    if (resetThemeSwitchRef.current !== null) {
      window.clearTimeout(resetThemeSwitchRef.current);
    }

    resetThemeSwitchRef.current = window.setTimeout(() => {
      root.classList.remove("theme-switching");
      resetThemeSwitchRef.current = null;
    }, 120);
  };

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
