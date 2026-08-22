"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type RevealKind = "up" | "fade" | "scale" | "left" | "right";

const FROM: Record<RevealKind, gsap.TweenVars> = {
  up: { y: 28, opacity: 0 },
  fade: { opacity: 0 },
  scale: { scale: 0.96, opacity: 0 },
  left: { x: -32, opacity: 0 },
  right: { x: 32, opacity: 0 },
};

const EASE = "power3.out";
const DURATION = 0.9;
const ANCHOR_OFFSET = -88;

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scanReveals() {
  document
    .querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-init])")
    .forEach((el) => {
      el.dataset.revealInit = "1";
      if (prefersReduced()) return;
      const raw = el.dataset.reveal as RevealKind;
      const kind: RevealKind = raw && raw in FROM ? raw : "up";
      const delay = Number(el.dataset.revealDelay ?? 0);
      gsap.set(el, { ...FROM[kind], willChange: "transform,opacity" });
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(el, {
            y: 0,
            x: 0,
            scale: 1,
            opacity: 1,
            duration: DURATION,
            delay,
            ease: EASE,
            clearProps: "willChange",
          }),
      });
    });
}

export default function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (prefersReduced()) return;

    let cancelled = false;
    let lenis: import("lenis").default | null = null;
    let rafFn: ((time: number) => void) | null = null;

    const onAnchorClick = (e: MouseEvent) => {
      if (!lenis) return;
      const anchor = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        "a[href^='#']"
      );
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: ANCHOR_OFFSET });
    };

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      rafFn = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(rafFn);
      document.addEventListener("click", onAnchorClick);
    });

    return () => {
      cancelled = true;
      document.removeEventListener("click", onAnchorClick);
      if (rafFn) gsap.ticker.remove(rafFn);
      lenis?.destroy();
    };
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      scanReveals();
    }, 60);
    return () => {
      window.clearTimeout(id);
      document.querySelectorAll<HTMLElement>("[data-reveal-init]").forEach((el) => {
        delete el.dataset.revealInit;
      });
    };
  }, [pathname]);

  return <>{children}</>;
}
