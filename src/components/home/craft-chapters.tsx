"use client";

/**
 * CRAFT CHAPTERS SECTION - $100M Tier
 * 
 * Combines:
 * - DOM content (left) - service descriptions
 * - 3D Service Primitives scene (right) via SectionView
 * - Sticky chapter list
 * - Scroll-driven 3D alignment to grid
 */

import { useEffect, useRef, useState, Suspense } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useGlobalScrollProgress, useSectionProgress } from "@/components/canvas/Tunnel";
import { SectionView } from "@/components/canvas/SectionView";
import { MagneticButton } from "@/components/v6/magnetic-cursor";

const CraftChaptersScene3D = dynamic(
  () => import("@/components/canvas/scenes/CraftChaptersScene").then(m => m.CraftChaptersScene),
  { ssr: false, loading: () => null }
);

const CRAFTS = [
  {
    num: "01",
    title: "Web Development",
    desc: "High-performance web platforms engineered for speed, search visibility, and conversion.",
    longDesc: "We build Next.js platforms, e-commerce engines, and content-rich web applications that load in sub-second speeds and rank organically. Every line of code is written by senior engineers who own the outcome.",
    items: ["Next.js 15 + React 19 platforms", "Headless CMS (Sanity, Contentful, Strapi)", "E-commerce (Shopify Plus, Medusa, BigCommerce)", "Progressive Web Apps", "Core Web Vitals optimization", "SEO-first architecture"],
    outcomes: ["Sub-1s LCP", "90+ Lighthouse", "WCAG 2.2 AA", "Zero-downtime deploys"],
    href: "/services/web-development",
    cursor: "Explore Web Dev",
  },
  {
    num: "02",
    title: "Mobile App Development",
    desc: "Native-feel iOS and Android apps from a single senior team. Store launch included.",
    longDesc: "React Native and Expo applications with offline-first architecture, push notifications, analytics, and App Store / Play Store deployment handled end-to-end. One codebase, two native experiences.",
    items: ["React Native / Expo", "iOS & Android from single codebase", "Offline-first with WatermelonDB", "Push notifications (FCM/APNs)", "App Store & Play Store deployment", "Analytics (Amplitude, Mixpanel)", "OTA updates (CodePush)"],
    outcomes: ["4.8+ App Store rating", "Sub-2s cold start", "99.9% crash-free", "Featured placements"],
    href: "/services/mobile-app-development",
    cursor: "Explore Mobile",
  },
  {
    num: "03",
    title: "AI-Driven Websites",
    desc: "Interfaces that adapt, answer, and sell while you sleep. AI wired into the product, not bolted on.",
    longDesc: "We integrate LLMs, RAG pipelines, vector search, and fine-tuned models directly into your product — chat assistants, semantic search, personalized content, automated workflows. Measured lift, not demos.",
    items: ["RAG with citations & guardrails", "Semantic search (vector DB)", "AI chat & support agents", "Dynamic personalization", "Content generation pipelines", "GEO / AEO optimization", "Model fine-tuning & hosting"],
    outcomes: ["40%+ support deflection", "3x search conversion", "Sub-200ms latency", "SOC2-ready data handling"],
    href: "/services/ai-driven-websites",
    cursor: "Explore AI Web",
  },
  {
    num: "04",
    title: "Website Refurbishment",
    desc: "We rebuild what's slowing you down without losing what already works. SEO preserved, CWV rescued.",
    longDesc: "Legacy migrations, design system implementation, Core Web Vitals rescue, SEO preservation, and technical debt elimination. We ship incremental improvements so your business never pauses.",
    items: ["Legacy to Next.js migrations", "Design system implementation", "Core Web Vitals rescue", "SEO preservation & growth", "Accessibility remediation (WCAG 2.2)", "Technical debt elimination", "Zero-downtime cutover"],
    outcomes: ["50-80% LCP improvement", "Zero traffic loss", "WCAG 2.2 AA", "Zero-downtime cutover"],
    href: "/services/website-refurbishment",
    cursor: "Explore Refurb",
  },
];

export function CraftChapters() {
  const [activeChapter, setActiveChapter] = useState(0);
  const globalProgress = useGlobalScrollProgress();
  const chapterProgress = useSectionProgress("craft-chapters");

  return (
    <section
      id="craft-chapters"
      className="craft-chapters-section relative"
      data-component="craft-chapters"
    >
      {/* Background 3D Scene - fixed to section */}
      <div className="craft-3d-container absolute inset-0 pointer-events-none">
        <SectionView trackId="craft-chapters" lazyMount={true}>
          <CraftChaptersScene3D scrollProgress={globalProgress} />
        </SectionView>
      </div>

      {/* Content */}
      <div className="craft-content relative z-10">
        <div className="shell">
          <div className="craft-header mb-16 text-center">
            <p className="micro text-[var(--color-brand-500)]">What We Do</p>
            <h2
              className="mt-4 font-semibold mx-auto"
              style={{
                fontSize: "clamp(2rem, 4.4vw, 4rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
                maxWidth: "20ch",
              }}
            >
              Four practices, one studio. <span className="gradient-text">Zero handoffs.</span>
            </h2>
          </div>

          {/* Sticky Chapter List */}
          <div className="craft-chapters-list">
            {CRAFTS.map((c, i) => (
              <motion.div
                key={c.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                viewport={{ once: true, margin: "-50px" }}
                className={`craft-chapter-item relative grid lg:grid-cols-[80px_1fr] gap-8 py-12 border-t border-[var(--border-subtle)] ${
                  i === CRAFTS.length - 1 ? "border-b" : ""
                }`}
                onMouseEnter={() => setActiveChapter(i)}
              >
                <span
                  className="craft-chapter-num text-7xl md:text-8xl font-semibold leading-none"
                  style={{
                    WebkitTextStroke: "1px rgba(255,255,255,0.12)",
                    color: "transparent",
                  }}
                >
                  {c.num}
                </span>

                <div className="craft-chapter-content">
                  <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">{c.title}</h3>
                  <p className="lede mt-4 max-w-[60ch] text-[var(--text-secondary)]">{c.longDesc}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {c.items.map((it) => (
                      <span
                        key={it}
                        className="px-3 py-1.5 rounded-full border border-[var(--border-strong)] text-xs text-[var(--text-tertiary)] uppercase tracking-wider"
                      >
                        {it}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <p className="micro mb-2">Measured Outcomes</p>
                    <div className="flex flex-wrap gap-3">
                      {c.outcomes.map((o) => (
                        <div key={o} className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {o}
                        </div>
                      ))}
                    </div>
                  </div>

                  <MagneticButton
                    href={c.href}
                    className="craft-chapter-link mt-6 inline-flex items-center gap-2"
                    data-cursor={c.cursor}
                  >
                    Explore {c.title}
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 11L11 2M11 2H4M11 2v7" />
                    </svg>
                  </MagneticButton>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
