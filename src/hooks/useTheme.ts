import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const KEY = "rcsi-theme";

const getInitial = (): Theme => {
  // Always force light mode — ignore system preference and stored value
  if (typeof window !== "undefined") {
    document.documentElement.classList.remove("dark");
    localStorage.setItem(KEY, "light");
  }
  return "light";
};

const apply = (t: Theme) => {
  const root = document.documentElement;
  if (t === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getInitial);

  useEffect(() => {
    apply(theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
};
