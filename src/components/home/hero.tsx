"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import HeroCanvas from "@/components/three/hero-canvas";
import { Button } from "@/components/ui/button";

const FACTS = ["Mumbai · Est. 2024", "Web · Mobile · AI", "Growth & Content"] as const;

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

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
    >
      <HeroCanvas />

      <div className="shell relative z-10 pb-14 pt-28 sm:pb-20">
        <p data-hero-fade className="eyebrow mb-6">
          Digital studio — Mumbai, India
        </p>
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
            <Button asChild size="lg" className="h-11 px-6 text-base">
              <Link href="/contact">Start a project</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 px-6 text-base backdrop-blur-sm"
            >
              <Link href="/work">See the work</Link>
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
