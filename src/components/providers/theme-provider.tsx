"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
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

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => void;
};

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

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "native-fpa-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    resolveTheme(defaultTheme, storageKey),
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    window.localStorage.setItem(storageKey, theme);
  }, [storageKey, theme]);

  const setTheme = (nextTheme: Theme) => {
    if (nextTheme === theme) {
      return;
    }

    const updateTheme = () => {
      startTransition(() => {
        setThemeState(nextTheme);
      });
    };

    const supportsMotion =
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const documentWithTransition = document as ViewTransitionDocument;

    if (supportsMotion && documentWithTransition.startViewTransition) {
      documentWithTransition.startViewTransition(updateTheme);
      return;
    }

    updateTheme();
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

export { ThemeProviderContext };
