"use client";

import { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { getScrollMotion } from "@/lib/motion/scroll";
import { DURATION, EASE } from "@/lib/motion/tokens";

/**
 * MaskReveal — image revealed through a moving mask (clip-path / scale wipe).
 *
 * Renders the image in final position (no layout shift). On fine-pointer
 * devices without reduced motion the image is initially hidden behind a mask
 * that wipes away as the section enters the viewport. Supports directional
 * wipes ("left" | "right" | "up" | "down") and a soft scale reveal.
 */
interface MaskRevealProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  direction?: "left" | "right" | "up" | "down";
  once?: boolean;
  className?: string;
}

export default function MaskReveal({
  src,
  alt,
  width,
  height,
  direction = "up",
  once = true,
  className,
}: MaskRevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  const reveal = useCallback(async () => {
    const node = ref.current;
    const mask = maskRef.current;
    if (reduced || !node || !mask) return;
    const { gsap } = await getScrollMotion();
    const ctx = gsap.context(() => {
      let fromValue: string | number = "100%";
      let axis: "x" | "y" = "y";
      switch (direction) {
        case "left":
          axis = "x";
          fromValue = "100%";
          break;
        case "right":
          axis = "x";
          fromValue = "-100%";
          break;
        case "up":
          axis = "y";
          fromValue = "100%";
          break;
        case "down":
          axis = "y";
          fromValue = "-100%";
          break;
      }
      const fromVars: Record<string, string | number> = { [axis]: fromValue };
      gsap.from(mask, {
        ...fromVars,
        duration: DURATION.reveal,
        ease: EASE.entrance,
        scrollTrigger: {
          trigger: node,
          start: "top 82%",
          end: "bottom 20%",
          toggleActions: once ? "play none none none" : "play none reverse none",
          once,
        },
      });
    });
    return () => ctx.revert();
  }, [reduced, direction, once]);

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
    <div
      ref={ref}
      className={`mask-reveal relative overflow-hidden ${className ?? ""}`}
    >
      <div
        ref={maskRef}
        className="mask-reveal-mask absolute inset-0 z-10 bg-bone pointer-events-none"
        style={{ transformOrigin: direction === "left" || direction === "right" ? "left center" : "center top" }}
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="mask-reveal-img block max-w-full h-auto"
      />
    </div>
  );
}
