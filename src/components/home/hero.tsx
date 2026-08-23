"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import ImaginationEngine from "@/components/hero/engine";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  // Subtle parallax on module panel via cursor
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ry = { v: 0 };
    const rx = { v: 0 };
    let raf = 0;
    function onMove(e: MouseEvent) {
      const rect = panel!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        panel!.style.transform = `perspective(1200px) rotateY(${px * 6}deg) rotateX(${py * -4}deg)`;
      });
    }
    function reset() {
      cancelAnimationFrame(raf);
      panel!.style.transform = "perspective(1200px)";
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    panel!.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("mousemove", onMove);
      panel!.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden min-h-[calc(100dvh-72px)]" data-chapter="hero">
      <ImaginationEngine className="z-0" />

      {/* Warm ambient glow */}
      <div aria-hidden="true" className="absolute right-[10%] top-[20%] h-[500px] w-[500px] rounded-full opacity-[0.06] blur-[100px]"
        style={{ background: "var(--gold)" }} />

      <div className="shell relative z-10 pt-[clamp(48px,8vh,96px)] pb-16">
        <p className="micro reveal">ImaginarsClub Services — Mumbai</p>

        <h1 data-lines aria-label="Imagination, engineered."
          className="mt-10"
          style={{
            fontWeight: 600,
            fontSize: "clamp(2.75rem, 6.2vw, 7rem)",
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            textWrap: "balance",
            color: "var(--text-hi)",
          }}
        >
          <span className="line-mask"><span style={{"--i":0} as React.CSSProperties}>Imagination,</span></span>
          <span className="line-mask"><span style={{"--i":1} as React.CSSProperties}>engineered.</span></span>
        </h1>

        <p className="lede mt-8 max-w-[48ch] reveal" style={{"--i":2} as React.CSSProperties}>
          Websites, mobile apps and AI products built by a senior-led studio
          in Mumbai — grown with search, ads and content that performs.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 reveal" style={{"--i":3} as React.CSSProperties}>
          <Link href="/contact" className="btn btn-primary">Start a project</Link>
          <Link href="/work" className="btn btn-secondary">See the work</Link>
        </div>
      </div>

      {/* Studio OS Module Panel — the visual centerpiece */}
      <div className="shell relative z-10 pb-24">
        <div ref={panelRef} className="module-panel mx-auto max-w-[780px]" aria-hidden="true">
          <div className="module-bar">
            <span className="dot bg-[#FF5F57]" /><span className="dot bg-[#FEBC2E]" /><span className="dot bg-[#28C840]" />
            <span className="ml-auto font-mono text-[10px] tracking-[0.15em] text-muted-foreground">studio.os — live</span>
          </div>
          <div className="module-body grid grid-cols-4 gap-px">
            <ModuleCell label="Build" count="04" items={["Next.js","React Native","Flutter"]} active />
            <ModuleCell label="Grow" count="08" items={["SEO / GEO","Meta Ads","SEM"]} />
            <ModuleCell label="Content" count="04" items={["Video","Thumbnails","Brand"]} />
            <ModuleCell label="Enable" count="02" items={["Google AI","Talent"]} />
          </div>
          <div className="module-status">
            <StatusDot label="Response time" value="<24h" />
            <StatusDot label="Ownership" value="100%" />
            <StatusDot label="Practices" value="04" />
            <StatusDot label="Uptime" value="99.9%" pulse />
          </div>
        </div>
      </div>
    </section>
  );
}

function ModuleCell({ label, count, items, active }: { label: string; count: string; items: string[]; active?: boolean }) {
  return (
    <div className={`module-cell ${active ? "module-cell--active" : ""}`}>
      <span className="index">{count}</span>
      <span className="module-cell-title">{label}</span>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function StatusDot({ label, value, pulse }: { label: string; value: string; pulse?: boolean }) {
  return (
    <div className="status-item">
      <span className={`status-dot ${pulse ? "pulse" : ""}`} />
      <span className="micro">{label}</span>
      <span className="font-mono text-xs">{value}</span>
    </div>
  );
}
