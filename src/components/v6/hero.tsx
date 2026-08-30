"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleField from "./particle-field";
import { useSound, useMagneticSound } from "./sound-design";
import { createCinematicTimeline, CINEMATIC_SEQUENCES } from "./cinematic-scroll";
import { MagneticButton } from "./magnetic-cursor";
import { usePerformanceMonitor, useAdaptiveQuality } from "./performance-optimizer";
import { CINEMATIC_SEQUENCES as SEQ } from "./cinematic-scroll";

gsap.registerPlugin(ScrollTrigger);

const METRICS = [
  { value: "120+", label: "Projects Delivered" },
  { value: "98%", label: "Client Retention" },
  { value: "4.9/5", label: "Clutch Rating" },
  { value: "24/7", label: "Support Coverage" },
];

const SCROLL_HINTS = [
  "Scroll to explore",
  "Discover our craft",
  "See the work",
  "Start a project",
];

const VALUE_PROPS = [
  { text: "100% code ownership at handover", icon: "check" },
  { text: "Reply within one business day", icon: "clock" },
  { text: "Senior-led — no juniors on your project", icon: "users" },
  { text: "Four practices under one roof", icon: "layers" },
];

const CASE_STUDY_HIGHLIGHT = {
  client: "PRV Financial Services",
  outcome: "Core banking platform modernization",
  metric: "99.99% uptime",
  since: "Live since April 2025",
};

const ICONS = {
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>,
  clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  layers: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
};

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollHintIndex, setScrollHintIndex] = useState(0);
  const [showValueProps, setShowValueProps] = useState(false);
  const [showCaseStudy, setShowCaseStudy] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  
  const { play } = useSound();
  const { onEnter: onMagneticEnter, onClick } = useMagneticSound();
  const { quality, fps } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();
  
  const heroTlRef = useRef<gsap.core.Timeline | null>(null);
  const valuePropRefs = useRef<(HTMLDivElement | null)[]>([]);
  const caseStudyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { root.classList.add("is-in"); setHeroReady(true); return; }

    function enter() {
      requestAnimationFrame(() => root?.classList.add("is-in"));
      play("pop", { volume: 0.2 });
    }
    if (document.documentElement.classList.contains("v6-loaded")) {
      requestAnimationFrame(() => { root.classList.add("is-in"); play("pop", { volume: 0.2 }); });
    } else {
      window.addEventListener("v6:enter", enter, { once: true });
    }

    // Stagger value props reveal
    setTimeout(() => setShowValueProps(true), 1800);
    setTimeout(() => setShowCaseStudy(true), 2400);
    setTimeout(() => setHeroReady(true), 3000);

    // Scroll hint rotation
    let hintInterval: NodeJS.Timeout;
    const hintEl = root.querySelector(".scroll-hint-text");
    if (!reduced && hintEl) {
      hintInterval = setInterval(() => {
        setScrollHintIndex(i => (i + 1) % SCROLL_HINTS.length);
      }, 3500);
    }

    // Cinematic entrance timeline
    heroTlRef.current = CINEMATIC_SEQUENCES.heroEntrance({
      kicker: ".hero-kicker",
      title: ".hero-title .line-mask span",
      subtitle: ".hero-subtitle",
      cta: ".hero-cta-group .btn-magnetic, .hero-cta-group .btn",
      metrics: ".hero-metrics .metric-item",
      scrollHint: ".scroll-hint"
    });

    // Parallax + fade on scroll
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        const p = Math.min(1, y / vh);
        if (contentRef.current) {
          contentRef.current.style.transform = `translateY(${p * -100}px)`;
          contentRef.current.style.opacity = String(1 - p * 1.4);
        }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("v6:enter", enter);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      clearInterval(hintInterval);
      heroTlRef.current?.kill();
    };
  }, [play]);

  const scrollHintClass = "scroll-hint absolute bottom-8 z-10";

  return (
    <section ref={rootRef} className="hero" data-chapter="hero" aria-label="Hero">
      {/* Adaptive background based on performance */}
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      
      {/* Particle field - adaptive count */}
      {!shouldReduceParticles && (
        <ParticleField className="hero-canvas" intensity={quality === "high" ? 1.0 : 0.6} />
      )}
      
      <div className="grain" aria-hidden="true" />

      <div ref={contentRef} className="hero-inner">
        <div className="shell">
          <p className="hero-kicker micro animate-reveal" style={{ "--d": "0ms" } as React.CSSProperties}>
            <span className="badge badge-primary" style={{ marginRight: 12 }}>Digital Studio</span>
            ImaginarsClub — Mumbai · Founded 2024
          </p>

          <h1 className="hero-title display mt-6 max-w-[11ch]" data-lines aria-label="We build digital products that scale.">
            <span className="line-mask"><span style={{ "--i": 0 } as React.CSSProperties}>We build digital</span></span>
            <span className="line-mask"><span style={{ "--i": 1 } as React.CSSProperties}>products</span></span>
            <span className="line-mask"><span className="gradient-text" style={{ "--i": 2 } as React.CSSProperties}>that scale.</span></span>
          </h1>

          <p className="hero-subtitle lede mt-6 max-w-[48ch]" style={{ "--d": "500ms" } as React.CSSProperties}>
            Websites, mobile applications, and AI-powered platforms — engineered end-to-end by a senior-led studio.
            No departments. No handoffs. Just the people who ship.
          </p>

          {/* Value Props - Cinematic Reveal */}
          <div className="mt-10" style={{ "--d": "700ms" } as React.CSSProperties} role="list" aria-label="Our guarantees">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {VALUE_PROPS.map((prop, i) => (
                <div 
                  key={prop.text} 
                  className="glass-strong p-4 md:p-5 rounded-2xl text-left transition-all duration-500 ease-out magnetic-item"
                  data-cursor={prop.text}
                  style={{ 
                    opacity: showValueProps ? 1 : 0, 
                    transform: showValueProps ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${i * 120}ms`
                  } as React.CSSProperties}
                  role="listitem"
                  ref={(el) => {
                    valuePropRefs.current[i] = el;
                    if (el) {
                      (window as any).registerMagnetic?.(el, {
                        strength: 0.3,
                        radius: 100
                      });
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                      {ICONS[prop.icon as keyof typeof ICONS]}
                    </div>
                    <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">{prop.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Case Study Highlight */}
          {showCaseStudy && (
            <div className="mt-10 transition-all duration-700 ease-out" style={{ opacity: showCaseStudy ? 1 : 0, transform: showCaseStudy ? "translateY(0)" : "translateY(24px)" }}>
              <div className="glass-strong p-5 md:p-6 rounded-2xl border border-emerald-500/20 relative overflow-hidden magnetic-item" data-cursor="Read Case Study" ref={(el) => {
                caseStudyRef.current = el;
                if (el) {
                  (window as any).registerMagnetic?.(el, {
                    strength: 0.3,
                    radius: 100
                  });
                }
              }}>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10" aria-hidden="true" />
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <p className="micro text-emerald-400">Verified Case Study</p>
                      <p className="font-semibold text-[var(--text-primary)]">{CASE_STUDY_HIGHLIGHT.client}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <span>{CASE_STUDY_HIGHLIGHT.metric}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400" aria-hidden="true">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                      <span className="micro">{CASE_STUDY_HIGHLIGHT.since}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400" aria-hidden="true">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <path d="M12 22V12" />
                      </svg>
                      <span>{CASE_STUDY_HIGHLIGHT.outcome}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="hero-cta-group mt-10 flex flex-wrap gap-4" style={{ "--d": "950ms" } as React.CSSProperties}>
            <MagneticButton 
              onClick={onClick}
              className="group"
              data-cursor="Start Project"
            >
              <span>Start a Project</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </MagneticButton>
            <Link href="/work" className="btn btn-secondary group" style={{ height: 56, borderRadius: 999, paddingInline: 32 }}>
              View Our Work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform ml-2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="hero-metrics mt-10" style={{ "--d": "1100ms" } as React.CSSProperties}>
          <div className="grid grid-cols-2 gap-x-10 gap-y-6 text-right">
            {METRICS.map((m) => (
              <div key={m.label} className="flex flex-col items-end gap-1 metric-item animate-reveal delay-100">
                <p className="font-mono text-2xl md:text-3xl tabular-nums font-bold" style={{ color: "var(--text-primary)" }}>{m.value}</p>
                <p className="micro">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance indicator (dev only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50 glass-strong p-3 rounded-xl text-xs font-mono" style={{ pointerEvents: "none" }}>
          <div>FPS: {fps}</div>
          <div>Quality: {quality}</div>
        </div>
      )}
    </section>
  );
}