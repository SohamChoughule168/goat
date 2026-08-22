"use client";

import { useEffect, type ReactNode } from "react";

const SELECTOR =
  ".reveal:not(.is-in), .field-wipe:not(.is-in), [data-lines]:not(.is-in)";

export default function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("js");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(SELECTOR)
    );

    if (reduced) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    // A fully clipped element (.field-wipe) reports zero intersection area,
    // so the observer targets its parent instead and the open-state CSS
    // keys off `.is-in > .field-wipe`.
    const observed = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    for (const el of els) {
      if (el.classList.contains("field-wipe")) {
        const parent = el.parentElement;
        if (parent && !observed.has(parent)) {
          observed.add(parent);
          io.observe(parent);
        }
        continue;
      }
      if (!observed.has(el)) {
        observed.add(el);
        io.observe(el);
      }
    }

    return () => io.disconnect();
  }, []);

  return <>{children}</>;
}
