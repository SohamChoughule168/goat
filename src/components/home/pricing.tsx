"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/v6/magnetic-cursor";
import dynamic from "next/dynamic";
import { useGlobalScrollProgress } from "@/components/canvas/Tunnel";
import { usePerformanceMonitor, useAdaptiveQuality } from "@/components/v6/performance-optimizer";

const TIERS = [
  {
    name: "Launch",
    description: "For early-stage products validating market fit",
    monthly: 8000,
    yearly: 6500,
    features: [
      "Next.js platform (up to 20 pages)",
      "Headless CMS setup (Sanity/Contentful)",
      "Core Web Vitals optimization",
      "Basic SEO setup",
      "Staging + production environments",
      "30-day hypercare",
      "100% code ownership",
    ],
    outcomes: ["Sub-1s LCP", "90+ Lighthouse", "WCAG 2.2 AA", "Zero-downtime deploys"],
    ideal: "Startups & MVPs",
  },
  {
    name: "Scale",
    description: "For growing businesses needing performance & AI",
    monthly: 18000,
    yearly: 15000,
    popular: true,
    features: [
      "Everything in Launch",
      "AI chat / search integration",
      "RAG with citations",
      "Personalization engine",
      "Advanced analytics (GA4 + custom)",
      "A/B testing framework",
      "99.9% uptime SLA",
      "Priority support (4hr response)",
    ],
    outcomes: ["40%+ support deflection", "3x search conversion", "Sub-200ms latency", "SOC2-ready"],
    ideal: "Growth-stage companies",
  },
  {
    name: "Enterprise",
    description: "For organizations needing custom architecture & compliance",
    monthly: 45000,
    yearly: 38000,
    features: [
      "Everything in Scale",
      "Custom AI model fine-tuning",
      "Multi-region deployment",
      "SOC2 / ISO 27001 readiness",
      "Dedicated infrastructure",
      "Custom SLA & penalties",
      "On-premise deployment option",
      "Dedicated success manager",
    ],
    outcomes: ["50-80% LCP improvement", "Zero traffic loss", "WCAG 2.2 AA", "Zero-downtime cutover"],
    ideal: "Large enterprises",
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hero3DHovered, setHero3DHovered] = useState(false);

  const globalProgress = useGlobalScrollProgress();
  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();
  const intensity = quality === "high" ? 1.0 : quality === "medium" ? 0.7 : 0.4;

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
  const PricingScene3D = dynamic(
    () => import("@/components/canvas/scenes/PricingScene").then(m => m.PricingScene),
    { ssr: false, loading: () => null }
  );

  return (
    <section id="pricing" className="pricing-section relative section-y" data-component="pricing">
      {/* 3D Background Scene */}
      <div className="hero-3d-canvas absolute inset-0 z-0 pointer-events-none">
        <PricingScene3D
          scrollProgress={globalProgress}
          mousePos={mousePos}
          hovered={hero3DHovered}
          intensity={intensity}
        />
      </div>

      <div className="shell relative z-10">
        <div className="section-header text-center">
          <span className="section-badge">Transparent pricing</span>
          <h2 className="section-title">Simple, predictable investment</h2>
          <p className="section-subtitle">
            No metered billing. No hidden fees. Fixed price, fixed scope, fixed timeline.
            Yearly plans include 2 months free.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium transition-colors ${!yearly ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}>Monthly</span>
          <button
            onClick={() => setYearly(!yearly)}
            className="relative w-11 h-6 rounded-full bg-[var(--border-default)] data-[active=true]:bg-[var(--color-brand-500)] transition-colors"
            data-active={yearly}
            aria-label="Toggle billing period"
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${yearly ? "translate-x-5" : ""}`} />
          </button>
          <span className={`text-sm font-medium transition-colors ${yearly ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}>Yearly</span>
          <span className="badge badge-primary ml-2 text-xs">Save 18%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`pricing-card relative ${tier.popular ? "featured" : ""}`}
              style={{
                borderColor: tier.popular ? "var(--color-brand-500)" : "var(--border-subtle)",
              }}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-10">
                  <span className="badge badge-primary animate-pulse-glow" style={{ backgroundColor: "var(--color-brand-500)", borderColor: "var(--color-brand-500)", padding: "4px 12px" }}>
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <span className="badge" style={{ backgroundColor: `${"var(--color-brand-500)"}20`, borderColor: `${"var(--color-brand-500)"}40`, color: "var(--color-brand-500)" }}>
                  {tier.name}
                </span>
              </div>

              <div className="mb-4 p-3 rounded-xl glass-strong border border-[var(--border-subtle)]">
                <p className="micro text-[var(--color-brand-500)] mb-1">Typical Project Scope</p>
                <p className="font-semibold text-[var(--text-primary)]">{tier.ideal}</p>
              </div>

              <h3 className="text-2xl font-semibold mb-2 text-[var(--text-primary)]">{tier.name}</h3>
              <p className="text-sm mb-8 text-[var(--text-tertiary)]">{tier.description}</p>

              <div className="mb-8">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="stat-value" style={{ color: "var(--text-primary)" }}>
                    ₹{(yearly ? tier.yearly : tier.monthly).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[var(--text-tertiary)]">/mo</span>
                </div>
                <p className="text-sm text-[var(--text-tertiary)]">
                  {yearly ? `Billed yearly — ₹${tier.monthly.toLocaleString("en-IN")}/mo monthly` : `Monthly — ₹${tier.yearly.toLocaleString("en-IN")}/mo yearly (save 18%)`}
                </p>
              </div>

              <div className="mb-6 p-3 rounded-xl" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}>
                <p className="micro text-[var(--text-tertiary)] mb-2">Ideal for</p>
                <p className="font-semibold text-[var(--text-primary)]">{tier.ideal}</p>
              </div>

              <ul className="feature-list mb-10">
                {tier.features.map((f) => (
                  <li key={f}>
                    <svg className="text-[var(--color-success-500)] group-hover:scale-110 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <path d="M22 4L12 14.01l-3-3" />
                    </svg>
                    <span className="text-[var(--text-secondary)]">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                <p className="micro mb-2">Measured Outcomes</p>
                <div className="flex flex-wrap gap-2">
                  {tier.outcomes.map((o) => (
                    <div key={o} className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {o}
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={`/contact?tier=${tier.name.toLowerCase()}`}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-center transition-all mt-6 block ${
                  tier.popular
                    ? "bg-[var(--color-brand-500)] text-[var(--text-inverse)] shadow-[var(--shadow-glow)]"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
                }`}
                data-cursor={tier.popular ? "Start" : "Contact"}
              >
                {tier.popular ? "Start Project" : "Contact Sales"}
              </a>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm mb-4 text-[var(--text-tertiary)]">
            Need something different? <a href="/contact" className="link-line" style={{ color: "var(--color-brand-500)" }}>Custom scope</a>
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            All prices in INR. GST extra. Custom scopes welcome. 100% code ownership guaranteed at handover.
          </p>
        </div>
      </div>
    </section>
  );
}