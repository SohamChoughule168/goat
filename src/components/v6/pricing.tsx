"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";

interface PricingTier {
  name: string;
  description: string;
  price: { monthly: number; yearly: number };
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
  color: string;
  valueAnchor: string;
  idealFor: string;
}

const TIERS: PricingTier[] = [
  {
    name: "Launch",
    description: "For early-stage products validating market fit",
    price: { monthly: 8000, yearly: 6500 },
    features: [
      "Next.js platform (up to 20 pages)",
      "Headless CMS setup (Sanity/Contentful)",
      "Core Web Vitals optimization",
      "Basic SEO setup",
      "Staging + production environments",
      "30-day hypercare",
      "100% code ownership at handover",
      "Reply within 1 business day",
    ],
    cta: "Start Project",
    href: "/contact?tier=launch",
    color: "#06B6D4",
    valueAnchor: "₹25L–₹50L project scope",
    idealFor: "Startups & MVPs",
  },
  {
    name: "Scale",
    description: "For growing businesses needing performance & AI",
    price: { monthly: 18000, yearly: 15000 },
    features: [
      "Everything in Launch",
      "AI chat / search integration",
      "RAG with citations & guardrails",
      "Personalization engine",
      "Advanced analytics (GA4 + custom)",
      "A/B testing framework",
      "99.9% uptime SLA",
      "Priority support (4hr response)",
      "Quarterly performance reviews",
    ],
    cta: "Start Project",
    href: "/contact?tier=scale",
    popular: true,
    color: "#6366F1",
    valueAnchor: "₹50L–₹1Cr project scope",
    idealFor: "Growth-stage companies",
  },
  {
    name: "Enterprise",
    description: "For organizations needing custom architecture & compliance",
    price: { monthly: 45000, yearly: 38000 },
    features: [
      "Everything in Scale",
      "Custom AI model fine-tuning",
      "Multi-region deployment",
      "SOC2 / ISO 27001 readiness",
      "Dedicated infrastructure",
      "Custom SLA & penalties",
      "On-premise deployment option",
      "Dedicated success manager",
      "Quarterly architecture reviews",
      "Security audit included",
    ],
    cta: "Contact Sales",
    href: "/contact?tier=enterprise",
    color: "#10B981",
    valueAnchor: "₹1Cr+ project scope",
    idealFor: "Large enterprises",
  },
];

const COMPARISON_FEATURES = [
  { key: "codeOwnership", label: "100% Code Ownership", included: [true, true, true] },
  { key: "responseTime", label: "Business-Day Response", included: [true, true, true] },
  { key: "seniorLed", label: "Senior-Led Team", included: [true, true, true] },
  { key: "cms", label: "Headless CMS", included: [true, true, true] },
  { key: "cwv", label: "Core Web Vitals Optimization", included: [true, true, true] },
  { key: "seo", label: "SEO-First Architecture", included: [true, true, true] },
  { key: "ai", label: "AI Integration (RAG, Chat, Search)", included: [false, true, true] },
  { key: "personalization", label: "Dynamic Personalization", included: [false, true, true] },
  { key: "analytics", label: "Advanced Analytics & A/B Testing", included: [false, true, true] },
  { key: "sla", label: "99.9% Uptime SLA", included: [false, true, true] },
  { key: "compliance", label: "SOC2 / ISO 27001 Readiness", included: [false, false, true] },
  { key: "customModel", label: "Custom AI Model Fine-tuning", included: [false, false, true] },
  { key: "dedicated", label: "Dedicated Success Manager", included: [false, false, true] },
  { key: "onPremise", label: "On-Premise Deployment Option", included: [false, false, true] },
];

const ICONS = {
  CheckIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  ),
  MinusIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
    </svg>
  ),
};

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    // Animate cards on mount
    const cards = document.querySelectorAll<HTMLElement>('.pricing-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 40, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".pricing-section",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [yearly]);

  const formatPrice = (price: number) => "₹" + price.toLocaleString("en-IN");

  return (
    <section className="v6-section border-t border-[var(--border-subtle)] pricing-section" aria-label="Pricing">
      <div className="shell">
        <div className="section-header">
          <span className="section-badge">Transparent pricing</span>
          <h2 className="section-title">Simple, predictable investment</h2>
          <p className="section-subtitle">
            No metered billing. No hidden fees. Fixed price, fixed scope, fixed timeline.
            Yearly plans include 2 months free. All prices in INR. GST extra.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium transition-colors ${!yearly ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}>Monthly</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={yearly}
              onChange={(e) => setYearly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--border-default)] rounded-full peer peer-checked:bg-[var(--brand-primary)] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300" />
          </label>
          <span className={`text-sm font-medium transition-colors ${yearly ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}>Yearly</span>
          <span className="badge badge-primary ml-2 text-xs">Save 18%</span>
        </div>

        {/* Pricing Cards */}
        <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
          {TIERS.map((tier, index) => (
            <article
              key={tier.name}
              className={`pricing-card relative ${tier.popular ? "featured" : ""} stagger-children animate`}
              style={{ 
                borderColor: tier.popular ? tier.color : "var(--border-subtle)",
                animationDelay: `${index * 100}ms`
              }}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-10">
                  <span className="badge badge-primary animate-pulse-glow" style={{ backgroundColor: tier.color, borderColor: tier.color, padding: "4px 12px", animationDuration: "2s" }}>
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <span className="badge" style={{ backgroundColor: `${tier.color}20`, borderColor: `${tier.color}40`, color: tier.color }}>
                  {tier.name}
                </span>
              </div>

              {/* Value Anchor */}
              <div className="mb-4 p-3 rounded-xl glass-strong border border-[var(--border-subtle)]">
                <p className="micro text-[var(--brand-primary)] mb-1">Typical Project Scope</p>
                <p className="font-semibold text-[var(--text-primary)]">{tier.valueAnchor}</p>
              </div>

              <h3 className="text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{tier.name}</h3>
              <p className="text-sm mb-6" style={{ color: "var(--text-tertiary)" }}>{tier.description}</p>

              <div className="mb-8">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="stat-value" style={{ color: "var(--text-primary)" }}>{yearly ? formatPrice(tier.price.yearly) : formatPrice(tier.price.monthly)}</span>
                  <span style={{ color: "var(--text-tertiary)" }}>/mo</span>
                </div>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  {yearly ? `Billed yearly — ${formatPrice(tier.price.monthly)}/mo monthly` : `Monthly — ${formatPrice(tier.price.yearly)}/mo yearly (save 18%)`}
                </p>
              </div>

              <div className="mb-6 p-3 rounded-xl" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}>
                <p className="micro text-[var(--text-tertiary)] mb-2">Ideal for</p>
                <p className="font-semibold text-[var(--text-primary)]">{tier.idealFor}</p>
              </div>

              <ul className="feature-list mb-10 stagger-children animate" style={{ animationDelay: "200ms" }}>
                {tier.features.map((f) => (
                  <li key={f} className="group">
                    <ICONS.CheckIcon className="text-[var(--success)] group-hover:scale-110 transition-transform" />
                    <span style={{ color: "var(--text-secondary)" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <a href={tier.href} className={`w-full py-4 px-6 rounded-xl font-semibold text-center transition-all relative overflow-hidden ${tier.popular ? `bg-[${tier.color}] text-white hover:opacity-90 shadow-[var(--shadow-glow)]` : "bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"}`}
                style={{ borderColor: tier.popular ? "transparent" : "var(--border-subtle)" }}
                data-cursor={tier.cta}
              >
                {tier.cta}
                {tier.popular && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                )}
              </a>
            </article>
          ))}
        </div>

        {/* Comparison Table Toggle */}
        <div className="text-center mt-10">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-strong border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] transition-all"
          >
            <span className="font-medium">{showComparison ? "Hide" : "Show"} Full Comparison</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showComparison ? "rotate-180" : ""}`}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* Comparison Table */}
        {showComparison && (
          <div className="mt-10 overflow-x-auto animate-reveal">
            <table className="w-full text-left" role="table">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="pb-3 font-semibold text-[var(--text-tertiary)]">Feature</th>
                  {TIERS.map((tier) => (
                    <th key={tier.name} className="pb-3 text-center font-semibold" style={{ color: tier.color }}>{tier.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((feature, i) => (
                  <tr key={feature.key} className={`${i % 2 === 0 ? "bg-[var(--bg-tertiary)]/50" : ""} border-b border-[var(--border-subtle)]/50`}>
                    <td className="py-4 font-medium" style={{ color: "var(--text-secondary)" }}>{feature.label}</td>
                    {feature.included.map((inc, ti) => (
                      <td key={ti} className="py-4 text-center">
                        {inc ? (
                          <ICONS.CheckIcon className="mx-auto text-[var(--success)]" />
                        ) : (
                          <ICONS.MinusIcon className="mx-auto" style={{ color: "var(--text-muted)" }} />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>
            Need something different? <Link href="/contact" className="link-line" style={{ color: "var(--brand-primary)" }}>Custom scope</Link>
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            All prices in INR. GST extra. Custom scopes welcome. 100% code ownership guaranteed at handover.
          </p>
        </div>
      </div>
    </section>
  );
}