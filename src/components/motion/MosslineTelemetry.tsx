"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface HotspotData {
  id: string;
  label: string;
  value: string;
  metric: string;
  x: number; // percentage
  y: number; // percentage
}

const HOTSPOTS: HotspotData[] = [
  { id: "hs1", label: "Enquiry Velocity", value: "+38.4%", metric: "Meta Ads & WhatsApp routing", x: 18, y: 35 },
  { id: "hs2", label: "Admissions SLA", value: "14 mins", metric: "Median response time", x: 42, y: 58 },
  { id: "hs3", label: "Parent Retention", value: "96.2%", metric: "Daily portal active rate", x: 68, y: 28 },
  { id: "hs4", label: "Fee Reconciliation", value: "100%", metric: "Zero orphaned bank deposits", x: 84, y: 62 },
];

const STATS = [
  { id: "enquiries", to: 1248, label: "Daily Enquiries Routed", suffix: "+" },
  { id: "branches", to: 38, label: "Institute Branches Live", suffix: "" },
  { id: "uptime", to: 99.9, label: "System Core Uptime", suffix: "%", dec: 1 },
  { id: "latency", to: 14, label: "Sec Median API Response", suffix: "s" },
];

export default function MosslineTelemetry() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>("hs1");
  const [counts, setCounts] = useState<Record<string, number>>({
    enquiries: 0,
    branches: 0,
    uptime: 0,
    latency: 0,
  });
  const [animated, setAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sparklineRef = useRef<SVGPolylineElement>(null);

  // 3D Perspective Tilt on Card Hover
  const handleCardMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  };

  const handleCardLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)";
  };

  // Trigger Count-up on scroll view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated) {
          setAnimated(true);

          // Animate SVG sparkline
          if (sparklineRef.current) {
            sparklineRef.current.style.transition = "stroke-dashoffset 1.6s cubic-bezier(0.2, 0.7, 0.2, 1)";
            sparklineRef.current.style.strokeDashoffset = "0";
          }

          // Count up
          const duration = 1600;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            setCounts({
              enquiries: Math.round(1248 * ease),
              branches: Math.round(38 * ease),
              uptime: parseFloat((99.9 * ease).toFixed(1)),
              latency: Math.round(14 * ease),
            });

            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[#111914] p-6 text-[var(--ink)] shadow-2xl lg:p-10"
    >
      {/* Background ambient grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(198, 243, 92, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(198, 243, 92, 0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 items-center rounded bg-[#c6f35c] px-2 font-mono text-[0.625rem] font-bold uppercase tracking-wider text-[#10291a]">
              Mossline Telemetry
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-4)]">
              Field Telemetry & Hotspot Matrix
            </span>
          </div>
          <h3 className="mt-3 text-2xl font-medium tracking-tight text-white lg:text-3xl">
            Live telemetry from <span className="font-serif italic text-[#c6f35c]">every active branch.</span>
          </h3>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-[var(--ink-3)] lg:text-sm">
          Telemetry is sampled continuously across enquiry funnels, fee settlements, and student portal heartbeats.
          Tap any hotspot below to inspect the live telemetry point.
        </p>
      </div>

      {/* Interactive Telemetry Hotspot Field */}
      <div className="relative my-8 h-72 w-full rounded-xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden">
        {/* Radar scanline animation */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(198, 243, 92, 0.35) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Hotspots */}
        {HOTSPOTS.map((hs) => {
          const isActive = activeHotspot === hs.id;
          return (
            <div
              key={hs.id}
              onClick={() => setActiveHotspot(isActive ? null : hs.id)}
              style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 hover:scale-110"
            >
              {/* Pulsing Dot */}
              <div className="relative flex items-center justify-center">
                <span className="absolute h-6 w-6 animate-ping rounded-full bg-[#c6f35c]/40" />
                <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#c6f35c] text-[10px] font-bold text-[#10291a] shadow-lg">
                  +
                </span>
              </div>

              {/* Expanding Label Pill */}
              <div
                className={`mt-2 whitespace-nowrap rounded-md border border-white/15 bg-black/80 px-2.5 py-1.5 shadow-xl backdrop-blur-md transition-all duration-300 ${
                  isActive ? "scale-100 opacity-100" : "scale-90 opacity-80"
                }`}
              >
                <div className="font-mono text-[0.625rem] uppercase tracking-wider text-[var(--ink-3)]">
                  {hs.label}
                </div>
                <div className="font-mono text-xs font-semibold text-[#c6f35c]">
                  {hs.value}
                </div>
                {isActive && (
                  <div className="mt-1 font-mono text-[0.5625rem] text-[var(--ink-4)] border-t border-white/10 pt-1">
                    {hs.metric}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3D Perspective Tilt Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Enquiry Velocity */}
        <div
          onPointerMove={handleCardMove}
          onPointerLeave={handleCardLeave}
          className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.625rem] uppercase tracking-wider text-[#c6f35c]">
              [01 Intake Velocity]
            </span>
            <ArrowUpRight className="h-4 w-4 text-[var(--ink-3)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#c6f35c]" />
          </div>
          <h4 className="mt-4 text-lg font-medium text-white">
            Lead routing with zero orphan drop
          </h4>
          <p className="mt-2 text-xs leading-relaxed text-[var(--ink-3)]">
            Incoming WhatsApp enquiries, Meta Ads, and walk-in tokens bind to a single student definition in under 14 seconds.
          </p>
        </div>

        {/* Card 2: Drawing Sparkline Telemetry */}
        <div
          onPointerMove={handleCardMove}
          onPointerLeave={handleCardLeave}
          className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.625rem] uppercase tracking-wider text-[#a2ecd8]">
              [02 Admission Yield]
            </span>
            <span className="rounded bg-[#a2ecd8]/15 px-2 py-0.5 font-mono text-[0.625rem] font-semibold text-[#a2ecd8]">
              +28% QoQ
            </span>
          </div>
          <h4 className="mt-4 text-lg font-medium text-white">
            Live cohort conversion chart
          </h4>
          {/* Animated SVG Sparkline */}
          <svg viewBox="0 0 220 50" className="mt-3 h-12 w-full overflow-visible">
            <polyline
              ref={sparklineRef}
              points="0,42 30,38 60,39 90,28 120,31 150,18 180,14 214,6"
              fill="none"
              stroke="#c6f35c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 240, strokeDashoffset: 240 }}
            />
            <circle cx="90" cy="28" r="3" fill="#fff" />
            <circle cx="150" cy="18" r="3" fill="#fff" />
            <circle cx="214" cy="6" r="4" fill="#c6f35c" />
          </svg>
          <div className="mt-2 flex justify-between font-mono text-[0.5625rem] text-[var(--ink-4)]">
            <span>Q1 INTAKE</span>
            <span>Q2 ENROLMENT</span>
            <span>Q3 BATCH COMPLETE</span>
          </div>
        </div>

        {/* Card 3: Governance */}
        <div
          onPointerMove={handleCardMove}
          onPointerLeave={handleCardLeave}
          className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.625rem] uppercase tracking-wider text-[#c6f35c]">
              [03 Multi-Branch Control]
            </span>
            <ArrowUpRight className="h-4 w-4 text-[var(--ink-3)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#c6f35c]" />
          </div>
          <h4 className="mt-4 text-lg font-medium text-white">
            Single institutional audit ledger
          </h4>
          <p className="mt-2 text-xs leading-relaxed text-[var(--ink-3)]">
            Branch, source and counselor remain attached from enquiry to final leaving certificate across campuses.
          </p>
        </div>
      </div>

      {/* Animated Count-up Statistics Row */}
      <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.id}>
            <div className="text-3xl font-medium tracking-tight text-white lg:text-4xl">
              {counts[stat.id] !== undefined
                ? stat.dec
                  ? counts[stat.id].toFixed(1)
                  : counts[stat.id].toLocaleString("en-IN")
                : stat.to}
              <span className="text-[#c6f35c]">{stat.suffix}</span>
            </div>
            <div className="mt-1 font-mono text-[0.6875rem] uppercase tracking-wider text-[var(--ink-4)]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
