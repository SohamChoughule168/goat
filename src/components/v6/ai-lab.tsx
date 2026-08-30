"use client";

import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSound, useMagneticSound } from "./sound-design";
import { MagneticButton } from "./magnetic-cursor";

const AiLabWebGL = lazy(() => import("./ai-lab-webgl").then(m => ({ default: m.default })));

const CAPABILITIES = [
  { title: "RAG Systems", desc: "Retrieval with citations & hallucination guardrails", icon: "database" },
  { title: "Fine-tuning", desc: "Models shaped on your proprietary data", icon: "cpu" },
  { title: "Vision Pipelines", desc: "Detection, OCR, inspection at scale", icon: "eye" },
  { title: "Agent Frameworks", desc: "LLMs that plan, act, and self-correct", icon: "bot" },
  { title: "Model Serving", desc: "Low-latency hosting with autoscaling", icon: "server" },
  { title: "Evals & Observability", desc: "Automated evals, drift detection, cost tracking", icon: "bar-chart" },
];

const STATS = [
  { value: "40%+", label: "Support Deflection" },
  { value: "3x", label: "Search Conversion" },
  { value: "<200ms", label: "P95 Latency" },
  { value: "SOC2", label: "Data Handling" },
];

const ICONS: Record<string, React.ReactNode> = {
  database: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14" /><path d="M21 5v14" /><path d="M3 12a9 3 0 0 0 18 0" /></svg>,
  cpu: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 4V2M15 4V2M9 20V22M15 20V22M4 9H2M22 9H24M4 15H2M22 15H24" /></svg>,
  eye: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  bot: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M9 11V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" /><path d="M8 15h.01M16 15h.01" /></svg>,
  server: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>,
  "bar-chart": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
};

export default function AiLab() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const { play } = useSound();
  const { onEnter: onMagneticEnter, onClick } = useMagneticSound();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = () => {};
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const items = root.querySelectorAll<HTMLElement>(".ai-capability-item");
        items.forEach((item, i) => {
          gsap.fromTo(item, 
            { opacity: 0, x: 40 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
              delay: i * 0.08,
            }
          );
        });

        const statItems = root.querySelectorAll<HTMLElement>(".ai-stat-item");
        statItems.forEach((item, i) => {
          gsap.fromTo(item,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: root,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
              delay: i * 0.06,
            }
          );
        });
      }, root);
      cleanup = () => ctx.revert();
    })();

    return () => cleanup();
  }, []);

  return (
    <section ref={rootRef} className="ai-lab section-y" aria-label="AI and ML Capabilities">
      <div className="shell grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20 items-center">
        <div>
          <p className="micro text-[var(--color-brand-500)]">The AI Lab</p>
          <h2 className="mt-6 font-semibold" style={{ fontSize: "clamp(2rem, 4.4vw, 4rem)", lineHeight: 1.04, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            We don&rsquo;t just prompt models.<br />
            <span className="gradient-text">We build them.</span>
          </h2>
          <p className="lede mt-6 max-w-[48ch]" style={{ color: "var(--text-secondary)" }}>
            End-to-end ML systems engineered into real products — retrieval with citations,
            fine-tunes on your data, vision pipelines, agents that act safely.
            From architecture to hosting to automated evals.
          </p>

          {/* Stats Row */}
          <div className="mt-10 grid grid-cols-2 gap-6" role="list" aria-label="AI Lab Metrics">
            {STATS.map((s, i) => (
              <div key={s.label} className="ai-stat-item glass-strong p-5 rounded-2xl text-center animate-reveal" style={{ animationDelay: `${i * 100}ms` } as React.CSSProperties}>
                <p className="stat-value font-mono">{s.value}</p>
                <p className="micro mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <ul className="mt-10 border-t border-[var(--border-subtle)] list-none p-0 m-0" role="list" aria-label="AI Capabilities">
            {CAPABILITIES.map((c, i) => (
              <li key={c.title} className="ai-capability-item flex items-baseline justify-between gap-6 border-b border-[var(--border-subtle)] py-5 group">
                <div className="flex items-baseline gap-4">
                  <span className="micro font-mono">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl glass-strong" style={{ color: "var(--color-brand-500)" }}>
                      {ICONS[c.icon]}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold transition-colors group-hover:text-[var(--color-brand-500)]" style={{ color: "var(--text-primary)" }}>{c.title}</h3>
                      <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>{c.desc}</p>
                    </div>
                  </div>
                </div>
                <span className="badge badge-primary" style={{ opacity: 0, transform: "translateX(8px)", transition: "all 300ms var(--ease-out)" }}>
                  View Details
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="relative" data-cursor="Neural Network">
          <div className="ai-canvas-wrap" style={{ minHeight: 480, borderRadius: 20 }}>
            <Suspense fallback={<div className="w-full h-full bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--surface-secondary)]" />}>
              <AiLabWebGL intensity={inView ? 1.0 : 0.3} />
            </Suspense>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(20,184,166,0.03)] to-transparent" />
          </div>
          
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse-glow" style={{ background: "var(--color-success-500)" }} />
            <span className="micro font-mono">imaginars/ml — live</span>
          </div>
          <div className="absolute right-4 top-4 flex items-center gap-2 opacity-70">
            <span className="badge badge-primary text-xs">WebGL</span>
          </div>
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--color-success-500)" }} />
            <span className="micro font-mono text-[var(--color-success-500)]">inference ready</span>
          </div>
          <div className="absolute left-4 bottom-4 opacity-30">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 10 10" strokeDasharray="30" className="animate-rotate-slow" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          
          {/* Live metrics overlay */}
          <div className="absolute left-4 bottom-20 glass-strong p-3 rounded-xl text-right" style={{ minWidth: 160 }}>
            <div className="flex items-end justify-end gap-1 mb-1">
              <span className="stat-value text-2xl font-mono" style={{ color: "var(--color-brand-500)" }}>47</span>
              <span className="micro mb-2 ml-2">req/s</span>
            </div>
            <div className="flex items-end justify-end gap-1">
              <span className="stat-value text-2xl font-mono" style={{ color: "var(--color-success-500)" }}>98.7%</span>
              <span className="micro mb-2 ml-2">cache hit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}