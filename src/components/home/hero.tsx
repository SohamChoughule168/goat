"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import ImaginationEngine from "@/components/hero/engine";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const finish = () => el.classList.add("hero-done");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    const raf = requestAnimationFrame(() => requestAnimationFrame(finish));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden min-h-[calc(100dvh-72px)]" data-chapter="hero">
      <ImaginationEngine className="z-0" />
      <div className="shell relative z-10 pt-[var(--field-y)] pb-32">

        <p className="micro reveal">ImaginarsClub Services — Mumbai</p>

        <h1 data-lines aria-label="Imagination, engineered."
          className="mt-10 font-semibold"
          style={{
            fontFamily: "var(--font-sans-stack)",
            fontSize: "clamp(2.75rem, 6.2vw, 7rem)",
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            textWrap: "balance",
            color: "var(--color-text)",
          }}
        >
          <span className="line-mask"><span style={{ "--i": 0 } as React.CSSProperties}>Imagination,</span></span>
          <span className="line-mask"><span style={{ "--i": 1 } as React.CSSProperties}>engineered.</span></span>
        </h1>

        <p className="lede mt-8 reveal max-w-[46ch]" style={{ "--i": 2 } as React.CSSProperties}>
          Websites, mobile apps and AI products built by a senior-led studio
          in Mumbai — grown with search, ads and content that performs.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 reveal" style={{ "--i": 3 } as React.CSSProperties}>
          <Link href="/contact" className="btn btn-primary">Start a project</Link>
          <Link href="/work" className="btn btn-secondary">See the work</Link>
        </div>
      </div>
    </section>
  );
}
