"use client";

import { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { getScrollMotion } from "@/lib/motion/scroll";
import { DURATION, EASE, MIN_STAGGER } from "@/lib/motion/tokens";

/**
 * ScrollReveal — entrance choreography for page sections.
 *
 * Children render in their final position in the HTML (no layout shift).
 * On fine-pointer devices without reduced motion, they fade/slide up as the
 * section enters the viewport using the shared gsap / ScrollTrigger controller
 * with gsap.context() cleanup. With reduced motion, children stay in place
 * and nothing animates.
 *
 * Variant "section" animates the wrapper once.
 * Variant "grid" staggers direct element children as they enter.
 */
interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: "section" | "grid";
  stagger?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  variant = "section",
  stagger = MIN_STAGGER,
  once = true,
}: ScrollRevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const reveal = useCallback(async () => {
    const node = ref.current;
    if (reduced || !node) return;
    const { gsap } = await getScrollMotion();
    const ctx = gsap.context(() => {
      const targets =
        variant === "grid"
          ? Array.from(node.children).filter(
              (child): child is Element => child.nodeType === 1,
            )
          : [node];
      gsap.from(targets, {
        y: 24,
        opacity: 1,
        duration: DURATION.reveal,
        ease: EASE.entrance,
        stagger: variant === "grid" ? stagger : 0,
        delay: 0,
        once,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          end: "bottom 20%",
          toggleActions: once ? "play none none none" : "play none reverse none",
          once,
        },
      });
    });
    return () => ctx.revert();
  }, [reduced, variant, stagger, once]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    reveal().then((revert) => {
      cleanup = revert;
    });
    return () => {
      cleanup?.();
    };
  }, [reveal]);

  return (
    <div ref={ref} className="scroll-reveal" data-reveal-container>
      {children}
    </div>
  );
}
