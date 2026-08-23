"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import ImaginationEngine from "@/components/hero/engine";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("hero-done");
      return;
    }
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("hero-done")));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden min-h-[calc(100dvh-72px)]" data-chapter="hero">
      <ImaginationEngine className="z-0" />

      {/* Subtle grid overlay for technical texture */}
      <div aria-hidden="true" className="absolute inset-0 z-[1] opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
        backgroundSize: "80px 64px",
      }} />

      <div className="shell relative z-10 pt-[clamp(48px,8vh,96px)] pb-24">
        <p className="micro reveal">ImaginarsClub Services — Mumbai</p>

        <h1 data-lines aria-label="Imagination, engineered."
          className="mt-12"
          style={{
            fontFamily: "var(--font-sans-stack)",
            fontWeight: 600,
            fontSize: "clamp(2.75rem, 6.5vw, 7rem)",
            letterSpacing: "-0.035em",
            lineHeight: 1.0,
            textWrap: "balance",
            color: "var(--text-hi)",
          }}
        >
          <span className="line-mask"><span style={{"--i":0} as React.CSSProperties}>Imagination,</span></span>
          <span className="line-mask"><span style={{"--i":1} as React.CSSProperties}>engineered.</span></span>
        </h1>

        <p className="lede mt-8 reveal max-w-[50ch]" style={{"--i":2} as React.CSSProperties}>
          Websites, mobile apps and AI products built by a senior-led studio
          in Mumbai — grown with search, ads and content that performs.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 reveal" style={{"--i":3} as React.CSSProperties}>
          <Link href="/contact" className="btn btn-primary">Start a project</Link>
          <Link href="/work" className="btn btn-secondary">See the work</Link>
        </div>

        {/* Proof metrics */}
        <div className="mt-20 grid grid-cols-3 gap-6 border-t border-[var(--line)] pt-8 max-w-xl">
          {[
            { v: "2024", l: "Founded" },
            { v: "18", l: "Services" },
            { v: "<24h", l: "Response time" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-mono text-lg font-medium text-[color:var(--blue)]">{s.v}</p>
              <p className="micro mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Type-as-graphic cropped at viewport right edge */}
      <div className="type-graphic-wrap absolute bottom-0 left-0 right-0 pointer-events-none select-none" aria-hidden="true">
        <span className="type-graphic">IMAGINARS</span>
      </div>
    </section>
  );
}
