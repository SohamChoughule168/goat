"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = ".reveal:not(.is-in), [data-reveal]:not(.is-in)";

export default function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("js");

    let io: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let frame = 0;
    let revealTimer = 0;

    const markAll = () => {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        el.classList.add("is-in");
      });
    };

    if (reduced || typeof IntersectionObserver === "undefined") {
      markAll();
      return;
    }

    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io?.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );

    const observeNew = () => {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        io?.observe(el);
      });
    };

    // Observe whatever is on the page now, then keep watching for content
    // mounted by client-side navigation or late-hydrating sections.
    observeNew();

    mutationObserver = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(observeNew);
    });
    mutationObserver.observe(document.getElementById("main") ?? document.body, {
      childList: true,
      subtree: true,
    });

    // Safety net: anything already inside the viewport is revealed even if the
    // observer misses it (older mobile browsers, restored scroll positions).
    const revealAboveFold = () => {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("is-in");
          io?.unobserve(el);
        }
      });
    };
    frame = requestAnimationFrame(revealAboveFold);
    revealTimer = window.setTimeout(revealAboveFold, 900);

    return () => {
      io?.disconnect();
      mutationObserver?.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(revealTimer);
    };
  }, [pathname]);

  return <>{children}</>;
}
