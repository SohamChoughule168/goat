"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import ImaginationEngine from "@/components/hero/engine";

const PRACTICES = [
  { index: "01", title: "Build", count: "04", desc: "Websites · Apps · AI products", href: "/services/build" },
  { index: "02", title: "Grow", count: "08", desc: "SEO · SEM · Social · Google Business", href: "/services/grow" },
  { index: "03", title: "Content & Brand", count: "04", desc: "Video · Thumbnails · Brand systems", href: "/services/content" },
  { index: "04", title: "Enable", count: "02", desc: "Google AI · Talent acquisition", href: "/services/enable" },
];

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("hero-done");
      return;
    }
    // Staged entrance: hairline → headline masks → lede → CTAs → console
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("hero-done")));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Console parallax — subtle depth response to cursor
  useEffect(() => {
    const panel = consoleRef.current;
    if (!panel) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    function onMove(e: MouseEvent) {
      const rect = panel!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        panel!.style.transform = `perspective(1200px) rotateY(${px * 5}deg) rotateX(${py * -3}deg)`;
      });
    }
    function reset() {
      cancelAnimationFrame(rafId);
      panel!.style.transform = "";
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    panel!.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("mousemove", onMove);
      panel!.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <section ref={rootRef} className={`relative overflow-hidden min-h-[calc(100dvh-72px)] ${""}`} data-chapter="hero">
      {/* Ambient layers */}
      <ImaginationEngine className="z-0 opacity-[0.35]" />
      <div aria-hidden="true" className="absolute inset-0 z-[1] opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
        backgroundSize: "80px 64px",
      }} />
      <div aria-hidden="true" className="absolute right-[5%] top-[15%] h-[420px] w-[420px] rounded-full opacity-[0.05] blur-[100px]"
        style={{ background: "var(--gold)" }} />

      <div className="shell relative z-10 pt-[clamp(48px,8vh,96px)] pb-[var(--space-10)]">
        {/* Two-column: massive type left, capability console right */}
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-12 items-start">

          {/* LEFT — Voice */}
          <div>
            <p className="micro reveal" style={{ "--i": 0 } as React.CSSProperties}>
              ImaginarsClub Services — Mumbai
            </p>

            {/* Hairline draws across */}
            <div className="mt-6 mb-8 h-px w-full overflow-hidden" aria-hidden="true">
              <div className="hero-rule h-full w-full origin-left"
                style={{
                  background: "linear-gradient(90deg, var(--blue), transparent)",
                  transform: "scaleX(0)",
                  transition: "transform 600ms cubic-bezier(0.16,1,0.3,1) 200ms",
                }}
                data-hero-rule
              />
            </div>

            <h1 data-lines aria-label="Imagination, engineered."
              className="display max-w-[14ch] mt-0 pt-0"
              style={{ fontSize: "clamp(3rem, 7vw, 7.5rem)", lineHeight: 0.95 }}
            >
              <span className="line-mask"><span style={{"--i":0} as React.CSSProperties}>Imagination,</span></span>
              <span className="line-mask"><span style={{"--i":1} as React.CSSProperties}>engineered.</span></span>
            </h1>

            <p className="lede mt-8 reveal max-w-[48ch]" style={{"--i":4} as React.CSSProperties}>
              Websites, mobile apps and AI products built by a senior-led
              studio in Mumbai — grown with search, ads and content
              that measurably performs.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 reveal" style={{"--i":5} as React.CSSProperties}>
              <Link href="/contact" className="btn btn-primary group relative overflow-hidden">
                Start a project
              </Link>
              <Link href="/work" className="btn btn-secondary">See the work</Link>
            </div>
          </div>

          {/* RIGHT — Capability Console */}
          <div ref={consoleRef} className="console-panel reveal hidden lg:block" style={{"--i":6} as React.CSSProperties}>
            <ConsoleHeader />
            <PracticeGrid />
            <StatusBar />
          </div>
        </div>

        {/* Proof metrics strip */}
        <div className="reveal mt-20 grid grid-cols-3 gap-6 border-t border-[var(--line)] pt-8 max-w-xl" style={{"--i":7} as React.CSSProperties}>
          {[
            { v: "2024", l: "Founded" },
            { v: "18", l: "Services" },
            { v: "<24h", l: "Response time" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-mono text-lg font-medium" style={{ color: "var(--blue)" }}>{s.v}</p>
              <p className="micro mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Type-as-graphic cropped at right edge */}
      <div className="type-graphic-wrap absolute bottom-0 left-0 right-0 pointer-events-none select-none z-[2]" aria-hidden="true">
        <span className="type-graphic">IMAGINARS</span>
      </div>
    </section>
  );
}

function ConsoleHeader() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line)] bg-[var(--surface-sunken)] rounded-t-lg">
      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
      <span className="ml-auto font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
        imaginars.os
      </span>
    </div>
  );
}

function PracticeGrid() {
  const PRACTICES = [
    { idx: "01", name: "Build", count: 4, desc: "Web · Apps · AI", href: "/services/build" },
    { idx: "02", name: "Grow", count: 8, desc: "SEO · SEM · Meta · GEO", href: "/services/grow" },
    { idx: "03", name: "Content", count: 4, desc: "Video · Brand · Events", href: "/services/content" },
    { idx: "04", name: "Enable", count: 2, desc: "Google AI · Talent", href: "/services/enable" },
  ];
  return (
    <div className="grid grid-cols-2 gap-px p-1">
      {PRACTICES.map((p) => (
        <Link key={p.idx} href={p.href}
          className="group block p-4 rounded-md border border-transparent transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[var(--surface-hover)]">
          <span className="index">{p.idx}</span>
          <span className="block mt-2 font-semibold text-sm">{p.name}</span>
          <span className="block text-xs text-muted-foreground mt-0.5">{p.desc}</span>
          <span className="inline-flex items-center gap-1 mt-3 text-[10px] font-mono text-accent">
            {p.count} SERVICES
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 8L8 2M8 2H3M8 2V7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}

function StatusBar() {
  return (
    <div className="grid grid-cols-4 gap-px border-t border-[var(--line)] bg-[var(--line)]">
      {[
        { label: "Response", value: "<24h", live: true },
        { label: "Ownership", value: "100%", live: false },
        { label: "Practices", value: "04", live: false },
        { label: "Status", value: "ACTIVE", live: true },
      ].map((s) => (
        <div key={s.label} className="flex items-center gap-1.5 px-2 py-2 bg-[var(--surface-sunken)]">
          <span className={`w-1.5 h-1.5 rounded-full ${s.live ? "bg-green-400 animate-pulse" : "bg-muted-foreground/40"}`} />
          <span className="text-[9px] font-mono text-muted-foreground">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
