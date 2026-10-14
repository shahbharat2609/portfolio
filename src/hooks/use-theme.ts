import { useCallback, useEffect, useState } from "react";

const storageKey = "bs:theme";

export function useTheme() {
  const [night, setNight] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", night);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", night ? "#0A0F24" : "#3C6CB4");
    try {
      localStorage.setItem(storageKey, night ? "night" : "day");
    } catch {
      return;
    }
  }, [night]);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), 1300);
    setNight((value) => !value);
  }, []);

  return { night, toggle };
}
