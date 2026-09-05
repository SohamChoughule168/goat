"use client";

/**
 * AI LAB SECTION - $100M Tier
 * 
 * Combines:
 * - DOM content (left) - capabilities list, metrics
 * - 3D Neural Network visualization (right) - via SectionView
 * - Real-time data flow simulation
 * - Interactive node hovering
 * - Scroll-driven rotation
 */

import { useEffect, useRef, useState, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useGlobalScrollProgress } from "@/components/canvas/Tunnel";
import { SectionView } from "@/components/canvas/SectionView";

const AILabScene3D = dynamic(
  () => import("@/components/canvas/scenes/AILabScene").then(m => m.AILabScene),
  { ssr: false, loading: () => null }
);

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

export function AILab() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const globalProgress = useGlobalScrollProgress();

  // Check for reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ailab"
      className="ai-lab-section relative section-y"
      data-component="ai-lab"
      aria-labelledby="ailab-title"
    >
      <div className="shell grid lg:grid-cols-[1fr_1.25fr] gap-14 items-center">
        {/* Left: Content */}
        <div className="ai-lab-content">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="micro text-[var(--color-brand-500)]"
          >
            The AI Lab
          </motion.div>

          <motion.h2
            id="ailab-title"
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.7, delay: reducedMotion ? 0 : 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-4 font-semibold"
            style={{ fontSize: "clamp(2rem, 4.4vw, 4rem)", lineHeight: 1.04, letterSpacing: "-0.03em" }}
          >
            We don&apos;t just prompt models.<br />
            <span className="gradient-text">We build them.</span>
          </motion.h2>

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.6, delay: reducedMotion ? 0 : 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lede mt-6 max-w-[48ch] text-[var(--text-secondary)]"
          >
            End-to-end ML systems engineered into real products — retrieval
            with citations, fine-tunes on your data, vision pipelines, agents
            that act safely. From architecture to hosting to automated evals.
          </motion.p>

          {/* Stats Row */}
          <div className="mt-10 grid grid-cols-2 gap-4 max-w-md" role="list" aria-label="AI capabilities metrics">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0.01 : 0.5, delay: reducedMotion ? 0 : i * 0.08 }}
                viewport={{ once: true }}
                className="glass-strong rounded-2xl p-5 text-center"
                role="listitem"
              >
                <p className="stat-value font-mono">{s.value}</p>
                <p className="micro mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Capabilities List */}
          <ul className="mt-10 border-t border-[var(--border-subtle)] list-none p-0 m-0" role="list" aria-label="AI capabilities">
            {CAPABILITIES.map((c, i) => (
              <motion.li
                key={c.title}
                initial={reducedMotion ? false : { opacity: 0, x: 40 }}
                whileInView={reducedMotion ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                transition={{ duration: reducedMotion ? 0.01 : 0.5, delay: reducedMotion ? 0 : i * 0.06 }}
                viewport={{ once: true, margin: "-50px" }}
                className="ai-capability-item flex items-center justify-between gap-6 border-b border-[var(--border-subtle)] py-5 group hover:bg-[var(--surface-elevated-hover)] transition-colors"
                data-cursor={c.title}
                role="listitem"
              >
                <div className="flex items-center gap-4">
                  <span className="micro text-[var(--text-tertiary)]" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl glass-strong flex items-center justify-center text-[var(--color-brand-500)]" aria-hidden="true">
                      {getIcon(c.icon)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-brand-500)] transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{c.desc}</p>
                    </div>
                  </div>
                </div>
                <span className="badge badge-primary text-xs opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                  View Details
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right: 3D Scene Host */}
        <div className="ai-lab-3d relative">
          <div
            className="ai-canvas-wrap relative min-h-[500px] rounded-2xl overflow-hidden border border-[var(--border-subtle)] glass-dark"
            data-cursor="Neural Network"
            aria-label="Interactive neural network visualization"
          >
            <SectionView trackId="ailab" lazyMount={true}>
              <AILabScene3D scrollProgress={globalProgress} />
            </SectionView>

            {/* Live Status Overlay */}
            <div className="absolute left-4 top-4 flex items-center gap-2 z-10" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="micro">imaginars/ml — live</span>
            </div>
            <div className="absolute right-4 top-4 z-10" aria-hidden="true">
              <span className="badge badge-primary text-xs">WebGL</span>
            </div>
            <div className="absolute right-4 bottom-4 flex items-center gap-2 z-10" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="micro text-emerald-500">inference ready</span>
            </div>

            {/* Live metrics overlay */}
            <div className="absolute left-4 bottom-20 glass-strong p-3 rounded-xl min-w-[160px] z-10">
              <div className="flex items-end justify-end gap-1 mb-1">
                <span className="text-2xl font-mono font-bold text-[var(--color-brand-500)]">47</span>
                <span className="micro mb-2 ml-2">req/s</span>
              </div>
              <div className="flex items-end justify-end gap-1">
                <span className="text-2xl font-mono font-bold text-emerald-500">98.7%</span>
                <span className="micro mb-2 ml-2">cache hit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getIcon(name: string) {
  const iconClass = "w-[18px] h-[18px]";
  switch (name) {
    case "database":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14" /><path d="M21 5v14" /><path d="M3 12a9 3 0 0 0 18 0" /></svg>;
    case "cpu":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 4V2M15 4V2M9 20V22M15 20V22M4 9H2M22 9H24M4 15H2M22 15H24" /></svg>;
    case "eye":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "bot":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M9 11V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" /><path d="M8 15h.01M16 15h.01" /></svg>;
    case "server":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>;
    case "bar-chart":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
    default:
      return null;
  }
}
