"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ImaginationEngine from "@/components/hero/engine";
import { pillars, allServices } from "@/content/services";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("hero-done");
      return;
    }
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("hero-done")));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden min-h-[calc(100dvh-72px)]" data-chapter="hero">
      {/* Ambient layers */}
      <ImaginationEngine className="z-0 opacity-[0.55]" />
      <div aria-hidden="true" className="absolute inset-0 z-[1] opacity-[0.05] dark:opacity-[0.06]" style={{
        backgroundImage: "linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
        backgroundSize: "88px 72px",
        maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, #000 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, #000 40%, transparent 100%)",
      }} />
      <div aria-hidden="true" className="absolute right-[8%] top-[10%] h-[480px] w-[480px] rounded-full opacity-[0.07] blur-[120px] hidden dark:block"
        style={{ background: "var(--blue)" }} />
      {/* Light-mode atmosphere: soft indigo wash */}
      <div aria-hidden="true" className="absolute left-[10%] top-[20%] h-[520px] w-[720px] rounded-full opacity-[0.5] blur-[140px] dark:hidden"
        style={{ background: "radial-gradient(ellipse at center, color-mix(in oklab, var(--blue) 9%, transparent), transparent 70%)" }} />

      <div className="shell relative z-10 pt-[clamp(56px,9vh,110px)] pb-24">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16 items-start">

          {/* LEFT — Voice */}
          <div>
            <p className="micro reveal" style={{ "--i": 0 } as React.CSSProperties}>
              ImaginarsClub Services — Mumbai
            </p>

            <div className="mt-6 mb-8 h-px w-full overflow-hidden" aria-hidden="true">
              <div className="hero-rule-line" data-hero-rule />
            </div>

            <h1 data-lines aria-label="Imagination, engineered."
              className="max-w-[13ch] mt-0 pt-0 font-semibold"
              style={{ fontSize: "clamp(3.25rem, 7.5vw, 7.75rem)", lineHeight: 0.94, letterSpacing: "-0.035em", color: "var(--text-hi)" }}
            >
              <span className="line-mask"><span style={{ "--i": 0 } as React.CSSProperties}>Imagination,</span></span>
              <span className="line-mask"><span style={{ "--i": 1 } as React.CSSProperties} className="text-gradient">engineered.</span></span>
            </h1>

            <p className="lede mt-8 reveal max-w-[46ch]" style={{ "--i": 4 } as React.CSSProperties}>
              Websites, mobile apps and AI products built by a senior-led studio —
              then grown with search, ads and content that measurably performs.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 reveal" style={{ "--i": 5 } as React.CSSProperties}>
              <Link href="/contact" className="btn btn-primary">Start a project</Link>
              <Link href="/work" className="btn btn-secondary">See the work</Link>
            </div>

            {/* Proof metrics integrated under CTAs */}
            <div className="reveal mt-14 grid grid-cols-3 gap-6 border-t border-[var(--line)] pt-7 max-w-md" style={{ "--i": 6 } as React.CSSProperties}>
              {[
                { v: "18", l: "Services" },
                { v: "04", l: "Practices" },
                { v: "<24h", l: "Response" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-mono text-xl font-medium tabular-nums" style={{ color: "var(--text-hi)" }}>{s.v}</p>
                  <p className="micro mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Practice Explorer */}
          <PracticeExplorer />
        </div>
      </div>

      {/* Type-as-graphic cropped at bottom edge */}
      <div className="type-graphic-wrap absolute bottom-0 left-0 right-0 pointer-events-none select-none z-[2]" aria-hidden="true">
        <span className="type-graphic">IMAGINARS</span>
      </div>
    </section>
  );
}

function PracticeExplorer() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="artifact reveal hidden lg:block" style={{ "--i": 6 } as React.CSSProperties} data-hero-staged>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)]">
        <p className="micro" style={{ color: "var(--text-hi)", opacity: 0.9 }}>Capabilities</p>
        <p className="font-mono text-[10px] tracking-[0.15em]" style={{ color: "var(--text-subtle)" }}>
          {allServices.length} SERVICES / {pillars.length} PRACTICES
        </p>
      </div>

      {/* Rows */}
      <div role="list">
        {pillars.map((p, i) => {
          const kids = allServices.filter((s) => s.pillar === p.slug);
          const isOpen = open === i;
          return (
            <div key={p.slug} role="listitem" className="px-row" data-open={isOpen}>
              <button
                type="button"
                className="px-head"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                onMouseEnter={() => setOpen(i)}
              >
                <span className="index">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold leading-tight" style={{ color: "var(--text-hi)" }}>
                    {p.title}
                  </span>
                  <span className="block text-xs mt-0.5" style={{ color: "var(--text-subtle)" }}>{p.kicker}</span>
                </span>
                <span className="index shrink-0" style={{ color: isOpen ? "var(--blue-hover)" : undefined }}>
                  {String(kids.length).padStart(2, "0")}
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                  className="shrink-0 self-center transition-transform duration-300"
                  style={{ transform: isOpen ? "rotate(45deg)" : "none", stroke: isOpen ? "var(--blue-hover)" : "var(--text-subtle)" }}
                  strokeWidth="1.5">
                  <path d="M6 1v10M1 6h10" strokeLinecap="round" />
                </svg>
              </button>
              <div className="px-services">
                <div>
                  <ul className="flex flex-wrap gap-2 px-4 pb-4 pt-1 list-none m-0 p-0">
                    {kids.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/services/${s.slug}`} className="px-chip">{s.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer ticker */}
      <div className="border-t border-[var(--line)] px-0 py-2.5 bg-[var(--surface-sunken)] ticker-mask">
        <div className="ticker-inner">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex gap-10 shrink-0" aria-hidden={dup === 1}>
              {["Web platforms", "Mobile apps", "AI products", "SEO & GEO", "Paid media", "Video & brand"].map((t) => (
                <span key={t} className="flex items-center gap-2 whitespace-nowrap font-mono text-[10px] tracking-[0.12em] uppercase" style={{ color: "var(--text-subtle)" }}>
                  <span className="w-1 h-1 rounded-full" style={{ background: "var(--green)" }} />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
