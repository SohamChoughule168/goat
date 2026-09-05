"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import { useGlobalScrollProgress, useSectionProgress } from "@/components/canvas/Tunnel";
import { usePerformanceMonitor, useAdaptiveQuality } from "@/components/v6/performance-optimizer";

const STEPS = [
  {
    n: "01",
    title: "Discovery & Audit",
    desc: "One structured session plus a written audit: audience, success metrics, constraints, and technical baseline agreed before anything is designed.",
    meta: "Week 1",
    duration: "5 days",
    deliverables: ["Stakeholder interviews", "Technical audit", "Success metrics definition", "Content audit"],
  },
  {
    n: "02",
    title: "Strategy & Scope",
    desc: "A scoped plan with fixed milestones, timeline, content model, and a price that matches it — no metered watching.",
    meta: "Week 1–2",
    duration: "7 days",
    deliverables: ["Technical specification", "Content model", "Milestone calendar", "Fixed-price proposal"],
  },
  {
    n: "03",
    title: "Execution & Delivery",
    desc: "Weekly builds on staging from day one. You watch the product exist instead of waiting for a big reveal.",
    meta: "Week 2–8",
    duration: "6 weeks",
    deliverables: ["Weekly staging builds", "Design system delivery", "CMS configuration", "QA & accessibility audit"],
  },
  {
    n: "04",
    title: "Launch & Ownership",
    desc: "Launch measured against plan. Code, accounts, and pipelines handed over in your name, documented. Learning is effortless.",
    meta: "Launch",
    duration: "2 days",
    deliverables: ["Production deploy", "Source code & repo transfer", "Account ownership transfer", "30-day hypercare"],
  },
];

export function ProcessLine() {
  const lineRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hero3DHovered, setHero3DHovered] = useState(false);

  const globalProgress = useGlobalScrollProgress();
  const sectionProgress = useSectionProgress("process");
  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();
  const intensity = quality === "high" ? 1.0 : quality === "medium" ? 0.7 : 0.4;

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 65%", "end 50%"] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const springPathLength = useSpring(pathLength, { stiffness: 100, damping: 20 });

  // Mouse tracking for 3D parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Dynamic import for the 3D scene
  const ProcessLineScene3D = dynamic(
    () => import("@/components/canvas/scenes/ProcessLineScene").then(m => m.ProcessLineScene),
    { ssr: false, loading: () => null }
  );

  return (
    <section
      ref={containerRef}
      id="process"
      className="process-section relative section-y"
      data-component="process"
    >
      {/* 3D Background Scene */}
      <div className="hero-3d-canvas absolute inset-0 z-0 pointer-events-none">
        <ProcessLineScene3D
          scrollProgress={globalProgress}
          mousePos={mousePos}
          hovered={hero3DHovered}
          intensity={intensity}
        />
      </div>

      <div className="shell relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="micro text-[var(--color-brand-500)]">The Method</p>
            <h2 className="mt-5 font-semibold max-w-[16ch]" style={{ fontSize: "clamp(1.9rem, 3.6vw, 3.2rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              How an engagement actually runs.
            </h2>
          </div>
        </div>

        <div className="relative mt-14">
          <svg className="absolute left-[59px] top-0 h-full w-px hidden md:block" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 1 100">
            <line x1="0.5" y1="0" x2="0.5" y2="100" stroke="var(--border-subtle)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <motion.path
              ref={lineRef}
              d="M0.5 0 L0.5 100"
              stroke="var(--color-brand-500)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              fill="none"
              style={{ pathLength: springPathLength }}
            />
          </svg>

          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="process-step relative"
            >
              <div className="relative grid md:grid-cols-[120px_1fr_1fr] gap-10 py-10 border-t border-[var(--border-subtle)] first:border-t-0">
                <div className="relative">
                  <span
                    className="process-step-num text-7xl md:text-8xl font-semibold leading-none"
                    style={{ WebkitTextStroke: "1px rgba(255,255,255,0.12)", color: "transparent" }}
                  >
                    {s.n}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold">{s.title}</h3>
                  <p className="micro mt-1">{s.meta} · {s.duration}</p>
                </div>
                <div className="pr-8 md:pr-16">
                  <p className="text-[0.9375rem] leading-relaxed max-w-[52ch] text-[var(--text-secondary)]">{s.desc}</p>
                  <ul className="mt-4 flex flex-wrap gap-2 list-none p-0 m-0">
                    {s.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm glass-strong"
                      >
                        <svg className="text-emerald-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <path d="M22 4L12 14.01l-3-3" />
                        </svg>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-strong p-6 rounded-2xl text-center"
          >
            <p className="stat-value font-mono text-[var(--color-brand-500)]">~8</p>
            <p className="micro mt-1">Weeks Total</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="glass-strong p-6 rounded-2xl text-center"
          >
            <p className="stat-value font-mono text-emerald-500">1</p>
            <p className="micro mt-1">Weekly Build</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass-strong p-6 rounded-2xl text-center"
          >
            <p className="stat-value font-mono text-[var(--color-brand-secondary)]">100%</p>
            <p className="micro mt-1">Code Ownership</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="glass-strong p-6 rounded-2xl text-center"
          >
            <p className="stat-value font-mono text-amber-500">30</p>
            <p className="micro mt-1">Days Hypercare</p>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <a href="/contact" className="btn-magnetic" data-cursor="Start Project">
            Start a Project
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.85a2.1 2.1 0 0 0-2.91.85z" />
              <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}