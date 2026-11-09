"use client";

import { useEffect, useCallback } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { getScrollMotion } from "@/lib/motion/scroll";
import { DURATION, EASE } from "@/lib/motion/tokens";

/**
 * RevealController — mounts once (typically in the root layout) and animates
 * every element carrying `data-reveal` as it enters the viewport.
 *
 * Supported attributes:
 *   data-reveal="up" | "fade"   — motion style (slide up, or scale-up emerge)
 *   data-reveal-delay="N"       — stagger delay in ms
 *
 * Every element renders in its final state in the HTML and stays fully
 * visible (opacity: 1) at all times, so nothing shifts, the copy survives
 * without JavaScript, and axe never sees a low-contrast hidden state. With
 * `prefers-reduced-motion` the controller is a no-op and all content is
 * visible immediately.
 *
 * Uses the shared gsap / ScrollTrigger / Lenis controller with gsap.context()
 * cleanup.
 */
export default function RevealController() {
  const reduced = useReducedMotion();

  const reveal = useCallback(async () => {
    if (reduced) return;
    const { gsap } = await getScrollMotion();
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const style =
          el.dataset.reveal === "fade"
            ? { scale: 0.94, opacity: 1 }
            : { y: 24, opacity: 1 };
        const delayMs = Number(el.dataset.revealDelay ?? "0");
        gsap.from(el, {
          ...style,
          duration: DURATION.reveal,
          ease: EASE.entrance,
          delay: delayMs / 1000,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "bottom 10%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });
    });
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    reveal().then((revert) => {
      cleanup = revert;
    });
    return () => {
      cleanup?.();
    };
  }, [reveal]);

  return null;
}
