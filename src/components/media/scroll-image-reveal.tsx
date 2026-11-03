"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface ScrollImageRevealProps {
  src: string;
  srcSet?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  revealDelay?: number;
}

/**
 * Image that reveals on scroll using clip-path animation.
 * Pure CSS clip-path — no canvas, no WebGL, no 3D objects.
 * Respects reduced motion (shows immediately).
 */
const ScrollImageReveal = forwardRef<HTMLDivElement, ScrollImageRevealProps>(({
  src,
  srcSet,
  alt,
  width,
  height,
  className,
  revealDelay = 0,
}, ref) => {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  useEffect(() => {
    if (reduced || !innerRef.current) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(innerRef.current);
    return () => observer.disconnect();
  }, [reduced]);

  const revealStyle = {
    clipPath: revealed ? "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" : "polygon(0 0, 100% 0, 100% 0%, 0% 0%)",
    transition: `clip-path 0.8s var(--ease-state) ${revealDelay}s`,
  };

  return (
    <div
      ref={el => {
        innerRef.current = el;
        if (ref) {
          if (typeof ref === "function") ref(el);
          else if (ref && "current" in ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      }}
      className={`scroll-image-reveal ${className || ""}`}
      style={{ position: "relative", overflow: "hidden", ...revealStyle }}
    >
      <img
        src={src}
        srcSet={srcSet}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="block w-full h-auto object-cover"
        style={{
          transform: revealed ? "scale(1)" : "scale(1.05)",
          transition: `transform 0.8s var(--ease-state) ${revealDelay}s`,
        }}
      />
      <div className="absolute inset-0 bg-[var(--bone)]" />
    </div>
  );
});

ScrollImageReveal.displayName = "ScrollImageReveal";

export default ScrollImageReveal;
