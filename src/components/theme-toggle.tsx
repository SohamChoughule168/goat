"use client";

import { useCallback, useEffect, useState } from "react";

type ThemeChoice = "system" | "light" | "dark";
const KEY = "imaginars-theme";
const OPTIONS: { value: ThemeChoice; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

function resolve(choice: ThemeChoice): "dark" | "light" {
  return choice === "dark" ||
    (choice === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
    ? "dark"
    : "light";
}

function apply(choice: ThemeChoice) {
  const target = resolve(choice);
  if (
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.documentElement.dataset.theme = target;
    return;
  }
  document.startViewTransition(() => {
    document.documentElement.dataset.theme = target;
  });
}

export default function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const stored = localStorage.getItem(KEY) as ThemeChoice | null;
      if (stored === "light" || stored === "dark" || stored === "system") {
        setChoice(stored);
        apply(stored);
      }
      setMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const update = useCallback((next: ThemeChoice) => {
    setChoice(next);
    localStorage.setItem(KEY, next);
    apply(next);
  }, []);

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="theme-seg inline-flex items-center gap-0.5 rounded-[var(--radius-sm)] border border-[color:var(--color-border)] p-0.5"
    >
      {OPTIONS.map((opt) => {
        const active = mounted && choice === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            tabIndex={active || !mounted ? 0 : -1}
            id={"theme-" + opt.value}
          onClick={() => update(opt.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const idx = OPTIONS.findIndex((o) => o.value === choice);
                const next =
                  OPTIONS[
                    (idx + (e.key === "ArrowRight" ? 1 : OPTIONS.length - 1)) %
                      OPTIONS.length
                  ];
                update(next.value);
                document.getElementById("theme-" + next.value)?.focus();
              }
            }}
            className={
              "rounded-[var(--radius-xs)] px-2 py-1 text-xs font-medium transition-colors duration-150 " +
              (active
                ? "bg-[color:var(--color-accent)] text-[color:var(--color-accent-fg)]"
                : "text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]")
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

