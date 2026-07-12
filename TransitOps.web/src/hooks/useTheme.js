import { useEffect, useState } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((d) => !d) };
}
