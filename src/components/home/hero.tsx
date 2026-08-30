"use client";

/**
 * HERO SECTION - $100M Tier
 * 
 * Architecture:
 * - DOM content (left) with text, CTAs, metrics
 * - 3D Scene (right/background) with crystallized monolith
 * - Tunnel-rat connects scroll position to 3D camera
 * - Magnetic cursor reveals hover states
 * - Lenis smooth scroll integration
 * - Spring-physics motion (Framer Motion)
 * - View Transitions API on navigation
 */

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useGlobalScrollProgress, useGlobalScrollVelocity } from "@/components/canvas/Tunnel";
import { MagneticButton } from "@/components/v6/magnetic-cursor";
import { usePerformanceMonitor, useAdaptiveQuality } from "@/components/v6/performance-optimizer";
import dynamic from "next/dynamic";

// Dynamic import for the 3D scene - client-side only
const HeroScene3D = dynamic(
  () => import("@/components/canvas/scenes/HeroScene").then(m => m.HeroScene),
  { ssr: false, loading: () => null }
);

const METRICS = [
  { value: "120+", label: "Projects Delivered" },
  { value: "98%", label: "Client Retention" },
  { value: "4.9/5", label: "Clutch Rating" },
  { value: "24/7", label: "Support Coverage" },
];

const VALUE_PROPS = [
  { text: "100% code ownership at handover", icon: "check" },
  { text: "Reply within one business day", icon: "clock" },
  { text: "Senior-led — no juniors on your project", icon: "users" },
  { text: "Four practices under one roof", icon: "layers" },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hero3DHovered, setHero3DHovered] = useState(false);

  const globalProgress = useGlobalScrollProgress();
  const globalVelocity = useGlobalScrollVelocity();
  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();

  const { scrollY } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const springY = useSpring(heroY, { stiffness: 100, damping: 30 });

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

  const intensity = quality === "high" ? 1.0 : quality === "medium" ? 0.7 : 0.4;

  return (
    <section
      ref={containerRef}
      id="hero"
      className="hero-section relative min-h-screen overflow-hidden"
      data-component="hero"
    >
      {/* 3D Background Scene */}
      <div className="hero-3d-canvas absolute inset-0 z-0 pointer-events-none">
        <HeroScene3D
          scrollProgress={globalProgress}
          mousePos={mousePos}
          hovered={hero3DHovered}
          intensity={intensity}
        />
      </div>

      {/* DOM Content */}
      <motion.div
        ref={heroTextRef}
        className="hero-content relative z-10 min-h-screen flex items-center"
        style={{ opacity: heroOpacity, y: springY }}
      >
        <div className="shell">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            {/* Left Column: Text */}
            <div className="hero-text max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="hero-kicker mb-6"
              >
                <span className="badge badge-primary">Digital Studio</span>
                <span className="text-[var(--text-tertiary)] ml-3 text-sm tracking-wider uppercase">
                  ImaginarsClub — Mumbai · Founded 2024
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hero-title text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight"
              >
                We build digital<br />
                products <span className="gradient-text">that scale.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lede mt-6 max-w-xl text-lg text-[var(--text-secondary)]"
              >
                Websites, mobile applications, and AI-powered platforms —
                engineered end-to-end by a senior-led studio. No departments.
                No handoffs. Just the people who ship.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10 grid grid-cols-2 gap-4 max-w-xl"
              >
                {VALUE_PROPS.map((prop, i) => (
                  <div
                    key={i}
                    className="glass-strong rounded-xl p-4 flex items-start gap-3"
                    data-cursor={prop.text}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/20 border border-emerald-500/30 flex-shrink-0">
                      <CheckIcon />
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-snug">
                      {prop.text}
                    </p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <MagneticButton
                  href="/contact"
                  className="btn-magnetic"
                  data-cursor="Start Project"
                >
                  Start a Project
                  <ArrowIcon />
                </MagneticButton>
                <MagneticButton
                  href="/work"
                  className="btn btn-secondary"
                  data-cursor="View Work"
                >
                  View Our Work
                </MagneticButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-10 glass-strong rounded-2xl p-4 flex items-center gap-3 max-w-md"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <ShieldIcon />
                </div>
                <div>
                  <p className="micro text-emerald-400">Verified Case Study</p>
                  <p className="font-semibold text-sm">PRV Financial Services · 99.99% uptime</p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hero-metrics"
            >
              <div className="grid grid-cols-2 gap-6 max-w-sm ml-auto">
                {METRICS.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    className="metric-item"
                  >
                    <p className="text-3xl md:text-4xl font-bold tabular-nums text-[var(--text-primary)]">
                      {m.value}
                    </p>
                    <p className="micro mt-1">{m.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="scroll-hint absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="micro">Scroll to explore</span>
          <div className="w-px h-14 bg-gradient-to-b from-transparent via-[var(--color-brand-500)] to-transparent animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
}

// SVG Icons
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
