"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

export interface StageProgressOptions {
  count: number;
  onIndex: (index: number) => void;
}

/** Map a 0–1 section progress to a zero-based frame index. */
export function stageIndex(progress: number, count: number): number {
  if (count <= 1) return 0;
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.min(count - 1, Math.floor(clamped * count));
}

/** Measure how far a section has travelled through the viewport. */
export function sectionProgress(top: number, height: number, viewport: number): number {
  if (height <= viewport) return top <= 0 ? 1 : 0;
  const travel = Math.max(1, height - viewport);
  return Math.min(1, Math.max(0, -top / travel));
}

/**
 * Publish a section's scroll progress as `--stage-progress` without taking
 * ownership of smooth scrolling. Lenis and ScrollTrigger stay in
 * `src/lib/motion/scroll.ts`; this hook only reads native scroll position.
 */
export function useStageProgress(
  ref: RefObject<HTMLElement | null>,
  { count, onIndex }: StageProgressOptions,
): void {
  const onIndexRef = useRef(onIndex);

  useEffect(() => {
    onIndexRef.current = onIndex;
  }, [onIndex]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let attached = false;
    let lastIndex = -1;

    const update = () => {
      const rect = element.getBoundingClientRect();
      const progress = sectionProgress(rect.top, rect.height, window.innerHeight);
      element.style.setProperty("--stage-progress", progress.toFixed(4));

      const index = stageIndex(progress, count);
      if (index !== lastIndex) {
        lastIndex = index;
        onIndexRef.current(index);
      }
    };

    const schedule = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    const attach = () => {
      if (attached) return;
      attached = true;
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
      schedule();
    };

    const detach = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) attach();
              else detach();
            },
            { rootMargin: "200px 0px" },
          );

    if (observer) observer.observe(element);
    else attach();

    return () => {
      observer?.disconnect();
      detach();
      element.style.removeProperty("--stage-progress");
    };
  }, [ref, count]);
}
