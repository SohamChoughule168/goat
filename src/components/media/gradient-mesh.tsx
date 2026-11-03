"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

/**
 * Gradient Mesh — animated subtle gradient background.
 * Pure CSS animation — no WebGL, no canvas.
 */
export default function GradientMesh() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced || !containerRef.current) return;

    const container = containerRef.current;
    let frame = 0;

    const update = () => {
      const time = Date.now() * 0.001;
      const x = 50 + Math.sin(time * 0.5) * 15;
      const y = 50 + Math.cos(time * 0.3) * 15;
      container.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(31, 58, 216, 0.04), transparent 40%), radial-gradient(circle at ${100 - x}% ${100 - y}%, rgba(167, 102, 42, 0.03), transparent 40%)`;
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      className="gradient-mesh"
      style={{
        position: "fixed",
        inset: "0",
        zIndex: "-1",
        pointerEvents: "none",
      }}
    />
  );
}
