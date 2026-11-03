"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ThemeChoice = "system" | "light" | "dark";
const KEY = "imaginars-theme";
const OPTIONS: { value: ThemeChoice; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];
const NEXT: Record<ThemeChoice, ThemeChoice> = {
  system: "light",
  light: "dark",
  dark: "system",
};
const ICONS = { system: Monitor, light: Sun, dark: Moon } as const;

function resolve(choice: ThemeChoice): "dark" | "light" {
  return choice === "dark" ||
    (choice === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
    ? "dark"
    : "light";
}

function apply(choice: ThemeChoice) {
  const target = resolve(choice);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vt = (
    document as Document & { startViewTransition?: (cb: () => void) => void }
  ).startViewTransition;
  if (!reduced && typeof vt === "function") {
    vt.call(document, () => {
      document.documentElement.dataset.theme = target;
    });
    return;
  }
  document.documentElement.dataset.theme = target;
}

export default function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

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

  const current = mounted ? choice : "system";
  const Icon = ICONS[current];
  const label = OPTIONS.find((o) => o.value === current)?.label ?? "System";

  return (
    <>
      {/* Phone: one tap target, icon reflects the current preference. */}
      <button
        type="button"
        aria-label={`Colour theme: ${label}. Activate to change.`}
        title={`Theme: ${label}`}
        onClick={() => update(NEXT[choice])}
        className="theme-cycle inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-[color:var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--paper-2)] hover:text-[color:var(--color-text)] sm:hidden"
      >
        <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>

      {/* Desktop: one quiet trigger, one short menu. */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Colour theme: ${label}. Change theme.`}
            className="hidden h-8 items-center gap-1 rounded-[var(--radius-xs)] px-1.5 text-[color:var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--paper-2)] hover:text-[color:var(--color-text)] sm:inline-flex"
          >
            <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
            <ChevronDown size={12} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-44 rounded-[var(--radius-sm)] border border-[color:var(--color-border)] bg-[var(--color-surface-raised)] p-1 text-[color:var(--color-text)] ring-0 shadow-[0_10px_30px_-20px_rgba(20,19,15,0.45)]"
        >
          <p className="micro px-2 pb-1 pt-1.5">Appearance</p>
          <div role="group" aria-label="Colour theme">
            {OPTIONS.map((opt) => {
              const active = mounted && choice === opt.value;
              const OptIcon = ICONS[opt.value];
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    update(opt.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-[var(--radius-xs)] px-2 py-2 text-left text-xs transition-colors duration-150 hover:bg-[var(--paper-2)]"
                >
                  <OptIcon
                    size={14}
                    strokeWidth={1.75}
                    className="text-[color:var(--color-text-muted)]"
                    aria-hidden="true"
                  />
                  <span>{opt.label}</span>
                  <Check
                    size={13}
                    strokeWidth={1.75}
                    className={
                      "ml-auto text-[var(--accent)] transition-opacity " +
                      (active ? "opacity-100" : "opacity-0")
                    }
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
