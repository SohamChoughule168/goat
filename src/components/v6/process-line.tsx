"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ProcessStep {
  n: string;
  title: string;
  desc: string;
  meta: string;
  deliverables: string[];
  duration: string;
  icon: React.ReactNode;
  color: string;
}

const STEPS: ProcessStep[] = [
  {
    n: "01",
    title: "Discovery & Audit",
    desc: "One structured session plus a written audit: audience, success metrics, constraints, and technical baseline agreed before anything is designed.",
    meta: "Week 1",
    duration: "5 days",
    deliverables: ["Stakeholder interviews", "Technical audit", "Success metrics definition", "Content audit"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
        <path d="M11 8v6l3 3" />
      </svg>
    ),
    color: "#6366F1",
  },
  {
    n: "02",
    title: "Strategy & Scope",
    desc: "A scoped plan with fixed milestones, timeline, content model, and a price that matches it — no metered watching.",
    meta: "Week 1–2",
    duration: "7 days",
    deliverables: ["Technical specification", "Content model", "Milestone calendar", "Fixed-price proposal"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    color: "#06B6D4",
  },
  {
    n: "03",
    title: "Execution & Delivery",
    desc: "Weekly builds on staging from day one. You watch the product exist instead of waiting for a big reveal.",
    meta: "Week 2–8",
    duration: "6 weeks",
    deliverables: ["Weekly staging builds", "Design system delivery", "CMS configuration", "QA & accessibility audit"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
    color: "#10B981",
  },
  {
    n: "04",
    title: "Launch & Ownership",
    desc: "Launch measured against plan. Code, accounts, and pipelines handed over in your name, documented. Learning is effortless.",
    meta: "Launch",
    duration: "2 days",
    deliverables: ["Production deploy", "Source code & repo transfer", "Account ownership transfer", "30-day hypercare"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    color: "#F59E0B",
  },
];

const ICONS = {
  CheckIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  ),
  ClockIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  RocketIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c1.26-1.5.5-3.74-2-5z" />
      <path d="M12 15h.01" />
      <path d="M12 12h.01" />
      <path d="M12 9h.01" />
      <path d="M12 6h.01" />
      <path d="M15.09 13.19a9 9 0 0 1 6.39 6.39c.96.96 1.52 2.24.99 3.56a6.97 6.97 0 0 1-11.13-2.76c-.33-.9-.5-1.87-.43-2.85" />
      <path d="M22 19.9c-.7-.7-1.4-1.4-2.1-2.1" />
    </svg>
  ),
};

export default function ProcessLine() {
  const rootRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !lineRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lineRef.current.style.strokeDashoffset = "0";
      return;
    }

    let cleanup = () => {};
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const line = lineRef.current!;
      const len = line.getTotalLength();
      line.style.strokeDasharray = String(len);
      line.style.strokeDashoffset = String(len);

      const ctx = gsap.context(() => {
        // Line draw animation
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 65%", end: "bottom 70%", scrub: 0.5 },
        });

        // Step items reveal
        gsap.utils.toArray<HTMLElement>(".process-step-item").forEach((item, i) => {
          gsap.fromTo(item, { opacity: 0, x: -40 }, {
            opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 82%" },
          });
          
          // Track active step
          ScrollTrigger.create({
            trigger: item,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => setActiveStep(i),
            onEnterBack: () => setActiveStep(i),
          });
        });
      }, root);
      cleanup = () => ctx.revert();
    })();

    return () => cleanup();
  }, []);

  return (
    <section ref={rootRef} className="v6-section border-t border-[var(--border-subtle)]" aria-label="Our Process">
      <div className="shell">
        <p className="v6-label">The Method</p>
        <h2 className="mt-5 font-semibold max-w-[16ch]" style={{ fontSize: "clamp(1.9rem, 3.6vw, 3.2rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
          How an engagement actually runs.
        </h2>

        {/* Timeline Overview */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s.n} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              i <= activeStep 
                ? "bg-[var(--brand-primary)]/20 border border-[var(--brand-primary)]/30 text-[var(--text-primary)]" 
                : "glass-strong text-[var(--text-tertiary)] border border-[var(--border-subtle)]"
            }`}>
              <span className="index font-mono">{s.n}</span>
              <span className="font-medium text-sm">{s.title}</span>
              <ICONS.ClockIcon className="text-[var(--text-muted)]" />
              <span className="font-mono text-xs text-[var(--text-muted)]">{s.duration}</span>
            </div>
          ))}
        </div>

        <div className="relative mt-14">
          {/* Vertical line */}
          <svg className="absolute left-[59px] top-0 h-full w-px hidden md:block" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 1 100">
            <line x1="0.5" y1="0" x2="0.5" y2="100" stroke="var(--border-subtle)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path ref={lineRef} d="M0.5 0 L0.5 100" stroke="var(--brand-primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" fill="none" />
          </svg>

          {STEPS.map((s, index) => (
            <div key={s.n} className="process-step-item relative group">
              <div className="relative">
                <span className="index text-sm font-mono">{s.n}</span>
                {/* Timeline dot */}
                <div className="absolute -left-[59px] top-1 hidden md:block">
                  <div className="relative w-[13px] h-[13px]">
                    {/* Outer pulse ring */}
                    <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
                      index <= activeStep 
                        ? `border-[${s.color}] animate-pulse-glow` 
                        : "border-[var(--border-subtle)]"
                    }`} style={{ animationDelay: `${index * 0.5}s` }} />
                    {/* Inner dot */}
                    <div className={`absolute inset-1 rounded-full bg-[var(--bg-primary)] border-2 transition-all duration-500 ${
                      index <= activeStep 
                        ? `border-[${s.color}] bg-[${s.color}]` 
                        : "border-[var(--border-subtle)]"
                    }`} />
                    {/* Checkmark when complete */}
                    {index < activeStep && (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                        <ICONS.CheckIcon />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-6 md:gap-8">
                <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110" style={{ 
                  background: `${s.color}15`, 
                  border: `1px solid ${s.color}30`,
                  color: s.color 
                }}>
                  {s.icon}
                </div>
                
                <div className="flex-1 min-w-0 pr-8 md:pr-16">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                    <span className="badge badge-primary text-xs" style={{ 
                      background: `${s.color}20`, 
                      borderColor: `${s.color}40`, 
                      color: s.color 
                    }}>
                      {s.meta}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
                      <ICONS.ClockIcon />
                      <span className="font-mono">{s.duration}</span>
                    </span>
                  </div>
                  
                  <p className="text-[0.9375rem] leading-relaxed max-w-[52ch]" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                  
                  <ul className="mt-4 flex flex-wrap gap-2 list-none p-0 m-0">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm glass-strong">
                        <ICONS.CheckIcon className="text-[var(--success)]" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Connecting line to next step */}
              {index < STEPS.length - 1 && (
                <div className="absolute left-[64.5px] top-[40px] bottom-0 w-px bg-[var(--border-subtle)]" />
              )}
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="glass-strong p-6 rounded-2xl text-center stagger-children animate">
            <p className="stat-value font-mono" style={{ color: "var(--brand-primary)" }}>~8</p>
            <p className="micro mt-1">Weeks Total</p>
          </div>
          <div className="glass-strong p-6 rounded-2xl text-center stagger-children animate" style={{ animationDelay: "100ms" }}>
            <p className="stat-value font-mono" style={{ color: "var(--success)" }}>1</p>
            <p className="micro mt-1">Weekly Build</p>
          </div>
          <div className="glass-strong p-6 rounded-2xl text-center stagger-children animate" style={{ animationDelay: "200ms" }}>
            <p className="stat-value font-mono" style={{ color: "var(--brand-secondary)" }}>100%</p>
            <p className="micro mt-1">Code Ownership</p>
          </div>
          <div className="glass-strong p-6 rounded-2xl text-center stagger-children animate" style={{ animationDelay: "300ms" }}>
            <p className="stat-value font-mono" style={{ color: "var(--brand-accent)" }}>30</p>
            <p className="micro mt-1">Days Hypercare</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a href="/contact" className="v6-magnet inline-flex" data-cursor="Start Project">
            <span>Start a Project</span>
            <ICONS.RocketIcon />
          </a>
        </div>
      </div>
    </section>
  );
}