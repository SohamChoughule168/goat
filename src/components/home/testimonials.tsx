"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { MagneticButton } from "@/components/v6/magnetic-cursor";
import dynamic from "next/dynamic";
import { useGlobalScrollProgress, useSectionProgress } from "@/components/canvas/Tunnel";
import { usePerformanceMonitor, useAdaptiveQuality } from "@/components/v6/performance-optimizer";

const TESTIMONIALS = [
  {
    id: "1",
    quote: "ImaginarsClub didn't just build our platform — they engineered our growth. The team's ability to translate complex requirements into a scalable architecture saved us 6 months of iteration.",
    author: "Priya Sharma",
    role: "CTO, FinTech Startup (Series B)",
    initials: "PS",
    color: "#14b8a6",
    metric: "Time to Market",
    metricValue: "40% faster"
  },
  {
    id: "2",
    quote: "The AI search implementation reduced our support tickets by 40% in the first month. Their RAG implementation with citations is production-grade, not a demo.",
    author: "Rajesh Kumar",
    role: "VP Engineering, SaaS Platform (Series A)",
    initials: "RK",
    color: "#06b6d4",
    metric: "Support Deflection",
    metricValue: "42%"
  },
  {
    id: "3",
    quote: "They migrated our legacy PHP monolith to a modern Next.js stack with zero downtime and zero traffic loss. The SEO preservation was flawless.",
    author: "Anjali Mehta",
    role: "VP Product, E-commerce Brand (₹500Cr+)",
    initials: "AM",
    color: "#10b981",
    metric: "Traffic Preservation",
    metricValue: "100%"
  },
  {
    id: "4",
    quote: "The mobile app they built hit 4.9 stars on both stores within 3 months. Offline-first architecture means our field teams never lose data.",
    author: "Vikram Singh",
    role: "Founder, Logistics Platform",
    initials: "VS",
    color: "#f59e0b",
    metric: "App Store Rating",
    metricValue: "4.9/5"
  },
  {
    id: "5",
    quote: "Their RAG system with medical citations achieved 94% accuracy on clinical queries. HIPAA-compliant from day one.",
    author: "Dr. Kavya Nair",
    role: "CTO, HealthTech AI Startup",
    initials: "KN",
    color: "#a855f7",
    metric: "Clinical Accuracy",
    metricValue: "94%"
  },
  {
    id: "6",
    quote: "Website refurbishment that increased course enrollments by 67%. Core Web Vitals went from red to green across all pages.",
    author: "Arjun Patel",
    role: "VP Growth, EdTech Platform",
    initials: "AP",
    color: "#ec4899",
    metric: "Enrollment Increase",
    metricValue: "67%"
  }
];

const CATEGORIES = [
  { id: "all", label: "All", count: TESTIMONIALS.length },
  { id: "ai", label: "AI", count: TESTIMONIALS.filter(t => t.author.includes("Dr.") || t.role.includes("AI") || t.metricValue.includes("40%") || t.metricValue.includes("94%")).length },
  { id: "mobile", label: "Mobile", count: TESTIMONIALS.filter(t => t.role.includes("Founder") || t.role.includes("Logistics")).length },
  { id: "refurb", label: "Refurb", count: TESTIMONIALS.filter(t => t.metricValue.includes("67%") || t.role.includes("EdTech")).length },
  { id: "case-study", label: "Case Study", count: 1 },
];

export function Testimonials() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hero3DHovered, setHero3DHovered] = useState(false);

  const globalProgress = useGlobalScrollProgress();
  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();
  const intensity = quality === "high" ? 1.0 : quality === "medium" ? 0.7 : 0.4;

  const filtered = activeCategory === "all"
    ? TESTIMONIALS
    : TESTIMONIALS.filter((_, i) => {
        if (activeCategory === "case-study") return i === 0;
        return true;
      });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % filtered.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [filtered.length]);

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
  const TestimonialScene3D = dynamic(
    () => import("@/components/canvas/scenes/TestimonialScene").then(m => m.TestimonialScene),
    { ssr: false, loading: () => null }
  );

  const goTo = (index: number) => {
    if (index < 0 || index >= filtered.length) return;
    setCurrent(index);
  };

  const next = () => goTo((current + 1) % filtered.length);
  const prev = () => goTo((current - 1 + filtered.length) % filtered.length);

  return (
    <section id="testimonials" className="testimonials-section relative section-y" data-component="testimonials">
      {/* 3D Background Scene */}
      <div className="hero-3d-canvas absolute inset-0 z-0 pointer-events-none">
        <TestimonialScene3D
          scrollProgress={globalProgress}
          mousePos={mousePos}
          hovered={hero3DHovered}
          intensity={intensity}
        />
      </div>

      <div className="shell relative z-10">
        <div className="section-header text-center">
          <span className="section-badge">Trusted by builders</span>
          <h2 className="section-title">Shipped with them. Trusted by them.</h2>
          <p className="section-subtitle">Real outcomes from teams who shipped with us.</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mt-8 mb-6" role="group" aria-label="Filter testimonials">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setCurrent(0); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out ${
                activeCategory === cat.id
                  ? "bg-[var(--color-brand-500)] text-white shadow-[var(--shadow-glow)]"
                  : "glass-strong text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              aria-pressed={activeCategory === cat.id}
            >
              {cat.label}
              <span className="ml-2 font-mono text-xs opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>

        <div className="relative mt-12">
          <div
            className="card-grid transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStart === null) return;
              const diff = touchStart - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 50) {
                if (diff > 0) next();
                else prev();
              }
              setTouchStart(null);
            }}
          >
            {filtered.map((t, index) => (
              <article
                key={t.id}
                className="testimonial-card group relative overflow-hidden"
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(ellipse at top right, ${t.color}15, transparent 60%)` }} />
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex -space-x-2">
                      <svg className="w-10 h-10 text-[var(--color-brand-500)] opacity-30 group-hover:opacity-100 transition-opacity" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.017 21v-7.386c0-4.233-5.141-6.53-6.989-6.923l.012.024c-2.597-.723-4.48-2.573-4.48-4.92 0-3.866 3.135-7 7-7s7 3.134 7 7c0 2.435-1.753 4.314-4.305 4.879v2.052H12v6h4.983c.36-.657.73-1.287 1.11-1.924l.229-.404c.152-.274.28-.556.39-.84.12-.3.217-.61.29-.93.08-.326.14-.658.18-.995.04-.33.06-.66.07-1.008.01-.325.01-.65.01-.974 0-2.757-2.243-5-5-5s-5 2.243-5 5c0 .333.037.655.105.974.04.325.08.65.12.98.069.322.16.62.26.93.11.294.217.56.39.83.11.294.217.56.39.83.11.294.217.56.39.83.11.294.217.56.39.83.11.294.217.56.39.83.11.294.217.56.39.83.116.34 1.56 0.64 1" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-[var(--text-primary)] leading-relaxed mb-6 text-base md:text-lg">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: `linear-gradient(135deg, ${t.color} 0%, ${t.color}dd 100%)`, color: "white" }}>
                          {t.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">{t.author}</p>
                          <p className="text-sm text-[var(--text-tertiary)]">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-[var(--text-tertiary)]">
                        <svg className="w-4 h-4 text-emerald-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <path d="M22 4L12 14.01l-3-3" />
                        </svg>
                        <span className="font-mono text-emerald-500">{t.metricValue}</span>
                        <span>{t.metric}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-10">
            {filtered.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-[var(--color-brand-500)] w-8 shadow-[var(--shadow-glow)]"
                    : "bg-[var(--border-default)] hover:bg-[var(--border-strong)]"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === current ? "true" : "false"}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-[var(--border-subtle)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="stat-value font-mono text-[var(--color-brand-500)]">120+</p>
              <p className="micro mt-1">Projects Delivered</p>
            </div>
            <div>
              <p className="stat-value font-mono text-emerald-500">98%</p>
              <p className="micro mt-1">Client Retention</p>
            </div>
            <div>
              <p className="stat-value font-mono text-[var(--color-brand-secondary)]">4.9/5</p>
              <p className="micro mt-1">Clutch Rating</p>
            </div>
            <div>
              <p className="stat-value font-mono text-amber-500">24/7</p>
              <p className="micro mt-1">Support Coverage</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}