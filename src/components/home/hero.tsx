"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import gsap from "gsap";
import HeroCanvas, { type HeroPhase } from "@/components/three/hero-canvas";
import Magnetic from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";

const FACTS = ["Mumbai · Est. 2024", "Web · Mobile · AI", "Growth & Content"] as const;

const PHASE_LABEL: Record<HeroPhase, string> = {
  1: "Imagination",
  2: "Engineering",
  3: "Product",
};

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<HeroPhase>(1);
  const handlePhase = useCallback((p: HeroPhase) => setPhase(p), []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-line]",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.12,
          delay: 0.15,
        }
      );
      gsap.fromTo(
        "[data-hero-fade]",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, delay: 0.7 }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[calc(100dvh-4.25rem)] flex-col justify-end overflow-hidden"
      data-cursor=""
    >
      <HeroCanvas onPhase={handlePhase} />

      <div className="shell relative z-10 pb-14 pt-28 sm:pb-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <p data-hero-fade className="eyebrow">
            Digital studio — Mumbai, India
          </p>
          <div
            data-hero-fade
            aria-hidden="true"
            className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:flex"
          >
            <span className="text-primary">◆</span>
            <span>Phase</span>
            <span className="text-foreground">0{phase}</span>
            <span className="h-px w-6 bg-border" />
            <span key={phase} style={{ animation: "rise-in 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
              {PHASE_LABEL[phase]}
            </span>
            <span className="h-px w-6 bg-border" />
            <span className="opacity-60">Click to charge</span>
          </div>
        </div>

        <h1 className="display-1 max-w-5xl">
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-hero-line className="block will-change-transform">
              Imagination,
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-hero-line className="block font-serif font-normal italic text-primary will-change-transform">
              engineered.
            </span>
          </span>
        </h1>
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p data-hero-fade className="lede">
            A senior-led studio building websites, mobile apps and AI-driven products —
            and growing them with search, ads and content that measurably perform.
          </p>
          <div data-hero-fade className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button asChild size="lg" className="h-11 px-6 text-base">
                <Link href="/contact">
                  Start a project
                  <ArrowRight className="transition-transform duration-300 group-hover/button:translate-x-1" aria-hidden="true" />
                </Link>
              </Button>
            </Magnetic>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 px-6 text-base backdrop-blur-sm"
            >
              <Link href="/work" data-cursor="View work">
                See the work
              </Link>
            </Button>
          </div>
        </div>

        <div data-hero-fade className="mt-14 flex items-center justify-between border-t border-border pt-5">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {FACTS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <a
            href="#manifesto"
            data-cursor="Scroll"
            aria-label="Scroll to content"
            className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            Scroll
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
