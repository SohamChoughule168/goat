"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Hero() {
  const ruleRef = useRef<SVGLineElement>(null);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const finish = () => root.classList.add("hero-done");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    let cancelled = false;
    let instance: { pause: () => void } | null = null;
    import("animejs").then(({ default: anime }) => {
      if (cancelled || !ruleRef.current) {
        finish();
        return;
      }
      instance = anime({
        targets: ruleRef.current,
        strokeDashoffset: [100, 0],
        duration: 420,
        easing: "cubicBezier(0.16, 1, 0.30, 1)",
        complete: finish,
      });
    });
    return () => {
      cancelled = true;
      instance?.pause();
    };
  }, []);

  return (
    <section ref={rootRef} data-chapter="hero" className="relative overflow-hidden">
      <div className="hero-wash" aria-hidden="true" />
      <div className="shell relative pt-[var(--section-y)] pb-[var(--section-y)]">
        <p className="micro" data-hero="0">
          ImaginarsClub Services — Mumbai
        </p>

        <svg
          viewBox="0 0 1000 2"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="mt-6 h-px w-full"
        >
          <line
            ref={ruleRef}
            x1="0"
            y1="1"
            x2="1000"
            y2="1"
            pathLength={100}
            strokeWidth="1"
            className="hero-rule"
          />
        </svg>

        <h1 className="display mt-8 max-w-[16ch]" data-hero="1">
          Imagination, engineered.
        </h1>

        <p className="lede mt-6" data-hero="2">
          Websites, mobile apps and AI products built by a senior-led studio in
          Mumbai — grown with search, ads and content that performs.
        </p>

        <div className="mt-8 flex flex-wrap gap-3" data-hero="3">
          <Link href="/contact" className="btn btn-primary">
            Start a project
          </Link>
          <Link href="/work" className="btn btn-secondary">
            See the work
          </Link>
        </div>
      </div>
    </section>
  );
}
