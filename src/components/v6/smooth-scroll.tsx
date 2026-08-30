"use client";

import { useEffect, useState } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReady(true);
      return;
    }
    let lenis: import("lenis").default | null = null;
    let raf = 0;
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1.0 });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      setReady(true);
      raf = requestAnimationFrame(function loop(t) {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      });
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      (window as unknown as { __lenis?: unknown }).__lenis = undefined;
    };
  }, []);

  return <>{ready ? children : <div style={{ minHeight: "100svh" }} aria-hidden="true" />}</>;
}
