"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

// The <html> class is the source of truth (set by the inline script in
// layout.tsx before paint). Subscribe to it so this component re-renders
// when it changes, without any state of its own.
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// On the server (and during hydration) we don't know the theme yet.
function getServerSnapshot(): Theme | null {
  return null;
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-foreground"
    >
      {/* Icon depends on the theme, so it's omitted until we know it. */}
      {theme !== null && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {theme === "dark" ? (
            // sun
            <>
              <circle cx="8" cy="8" r="3.25" />
              <path d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1M12.95 3.05l-1.06 1.06M4.11 11.89l-1.06 1.06M12.95 12.95l-1.06-1.06M4.11 4.11L3.05 3.05" />
            </>
          ) : (
            // moon
            <path d="M13.5 9.5A5.75 5.75 0 0 1 6.5 2.5a5.75 5.75 0 1 0 7 7Z" />
          )}
        </svg>
      )}
    </button>
  );
}
