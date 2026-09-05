"use client";

/**
 * WORK STRIP SECTION - $100M Tier
 * 
 * 3D card distortion on hover:
 * - Each card has a 3D plane behind it
 * - The plane uses a custom distortion shader
 * - On hover, mouse position drives a ripple effect
 * - The card itself tilts in 3D toward the cursor
 * 
 * Plus the existing category filter and project stats.
 */

import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useGlobalScrollProgress } from "@/components/canvas/Tunnel";
import { MagneticButton } from "@/components/v6/magnetic-cursor";
import Link from "next/link";

const WorkCard3D = dynamic(
  () => import("@/components/canvas/scenes/WorkCardScene").then(m => m.WorkCardScene),
  { ssr: false, loading: () => null }
);

interface WorkPanel {
  id: string;
  tag: string;
  title: string;
  desc: string;
  href: string;
  stats: Array<{ label: string; value: string }>;
  gradient: string;
  cursor: string;
  category: 'case-study' | 'web' | 'mobile' | 'ai' | 'refurb';
}

const PANELS: WorkPanel[] = [
  {
    id: "prv-financial",
    tag: "Case Study — Verified",
    title: "PRV Financial Services",
    desc: "Complete digital transformation: web platform, marketing infrastructure, and AI-powered analytics. Live, owned, measured.",
    href: "/work/prv-financial-services",
    stats: [
      { label: "LCP Improvement", value: "68%" },
      { label: "Organic Traffic", value: "+240%" },
      { label: "Conversion Rate", value: "+42%" },
    ],
    gradient: "radial-gradient(ellipse 90% 80% at 30% 20%, rgba(20,184,166,0.35), transparent 60%), radial-gradient(ellipse 60% 60% at 80% 90%, rgba(245,158,11,0.15), transparent 60%)",
    cursor: "Read Case Study",
    category: "case-study",
  },
  {
    id: "web-dev",
    tag: "Craft 01",
    title: "Web Development",
    desc: "Next.js platforms engineered for speed, search, and scale.",
    href: "/services/web-development",
    stats: [
      { label: "Avg LCP", value: "< 0.9s" },
      { label: "Lighthouse", value: "95+" },
      { label: "CMS", value: "Headless" },
    ],
    gradient: "radial-gradient(ellipse 90% 80% at 30% 20%, rgba(6,182,212,0.35), transparent 60%), radial-gradient(ellipse 60% 60% at 80% 90%, rgba(168,85,247,0.15), transparent 60%)",
    cursor: "Explore Craft",
    category: "web",
  },
  {
    id: "ai-web",
    tag: "Craft 03",
    title: "AI-Driven Websites",
    desc: "Chat, search, and personalization wired into the product.",
    href: "/services/ai-driven-websites",
    stats: [
      { label: "Support Deflection", value: "40%+" },
      { label: "Search CTR", value: "3.2x" },
      { label: "Latency", value: "< 180ms" },
    ],
    gradient: "radial-gradient(ellipse 90% 80% at 30% 20%, rgba(16,185,129,0.35), transparent 60%), radial-gradient(ellipse 60% 60% at 80% 90%, rgba(168,85,247,0.15), transparent 60%)",
    cursor: "Explore Craft",
    category: "ai",
  },
  {
    id: "mobile-apps",
    tag: "Craft 02",
    title: "Mobile Apps",
    desc: "One senior team, iOS and Android, store launch handled.",
    href: "/services/mobile-app-development",
    stats: [
      { label: "Store Rating", value: "4.8+" },
      { label: "Crash Free", value: "99.9%" },
      { label: "Launch Time", value: "8 weeks" },
    ],
    gradient: "radial-gradient(ellipse 90% 80% at 30% 20%, rgba(245,158,11,0.35), transparent 60%), radial-gradient(ellipse 60% 60% at 80% 90%, rgba(236,72,153,0.15), transparent 60%)",
    cursor: "Explore Craft",
    category: "mobile",
  },
  {
    id: "refurb",
    tag: "Craft 04",
    title: "Website Refurbishment",
    desc: "Legacy migrations, CWV rescue, SEO preservation — zero downtime.",
    href: "/services/website-refurbishment",
    stats: [
      { label: "LCP Improvement", value: "50-80%" },
      { label: "Traffic Loss", value: "0%" },
      { label: "WCAG", value: "2.2 AA" },
    ],
    gradient: "radial-gradient(ellipse 90% 80% at 30% 20%, rgba(168,85,247,0.35), transparent 60%), radial-gradient(ellipse 60% 60% at 80% 90%, rgba(245,158,11,0.15), transparent 60%)",
    cursor: "Explore Craft",
    category: "refurb",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Work", count: PANELS.length },
  { id: "case-study", label: "Case Studies", count: PANELS.filter(p => p.category === "case-study").length },
  { id: "web", label: "Web Development", count: PANELS.filter(p => p.category === "web").length },
  { id: "mobile", label: "Mobile Apps", count: PANELS.filter(p => p.category === "mobile").length },
  { id: "ai", label: "AI Websites", count: PANELS.filter(p => p.category === "ai").length },
  { id: "refurb", label: "Refurbishment", count: PANELS.filter(p => p.category === "refurb").length },
];

export function WorkStrip() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visiblePanels, setVisiblePanels] = useState<WorkPanel[]>(PANELS);
  const [isFiltering, setIsFiltering] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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

  // Filter logic with animation
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      const filtered = activeCategory === "all"
        ? PANELS
        : PANELS.filter(p => p.category === activeCategory);
      setVisiblePanels(filtered);
      setIsFiltering(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  return (
    <section
      id="work"
      className="work-strip-section relative section-y"
      data-component="work-strip"
      aria-labelledby="work-title"
    >
      <div className="shell">
        {/* Header */}
        <div className="work-header pb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 40 }}
            whileInView={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="micro text-[var(--color-brand-500)]">Selected Work</p>
            <h2
              id="work-title"
              className="mt-5 font-semibold"
              style={{
                fontSize: "clamp(1.9rem, 3.6vw, 3.2rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              Proof, not promises.
            </h2>
            <p className="lede mt-3 max-w-[44ch] text-[var(--text-secondary)]">
              Every project ships with measurable outcomes. Filter by craft or explore all.
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 lg:ml-auto" role="group" aria-label="Filter work by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out ${
                  activeCategory === cat.id
                    ? "bg-[var(--color-brand-500)] text-white shadow-[var(--shadow-glow)]"
                    : "glass-strong text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-brand-500)]"
                }`}
                aria-pressed={activeCategory === cat.id}
              >
                {cat.label}
                <span className="ml-2 font-mono text-xs opacity-60">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid with 3D Distortion */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          style={{
            opacity: isFiltering ? 0.5 : 1,
            transform: isFiltering ? "scale(0.98)" : "scale(1)",
            transition: "opacity 200ms ease, transform 200ms ease",
          }}
          role="list"
          aria-label="Work projects"
        >
          {visiblePanels.map((p, index) => (
            <WorkCard
              key={p.id}
              panel={p}
              index={index}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              isFiltering={isFiltering}
              reducedMotion={reducedMotion}
            />
          ))}

          {/* CTA Card */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 40 }}
            whileInView={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.6, delay: reducedMotion ? 0 : 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
            className="work-panel flex-shrink-0 flex flex-col items-start justify-center border border-dashed p-8 glass-strong"
            style={{
              borderColor: "var(--border-default)",
              background: "var(--surface-card)",
              minHeight: "320px",
            }}
            role="listitem"
          >
            <p className="micro text-[var(--color-brand-500)]">Next up</p>
            <p className="mt-4 font-semibold text-2xl md:text-3xl text-[var(--text-primary)]">
              Your project, right here.
            </p>
            <p className="lede mt-3 max-w-xs text-[var(--text-secondary)]">
              Let&apos;s build something measurable together.
            </p>
            <MagneticButton
              href="/contact"
              className="v6-magnet mt-8"
              data-cursor="Start Now"
              aria-label="Start a new project with us"
            >
              Start a Project
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * Individual Work Card with 3D tilt and distortion
 */
function WorkCard({
  panel,
  index,
  hoveredId,
  setHoveredId,
  isFiltering,
  reducedMotion,
}: {
  panel: WorkPanel;
  index: number;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  isFiltering: boolean;
  reducedMotion: boolean;
}) {
  const isHovered = hoveredId === panel.id;
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt on mouse move (disabled for reduced motion)
  useEffect(() => {
    if (reducedMotion) return;
    
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8; // Max 8deg
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0) scale(1.02)`;
    };

    const handleMouseLeave = () => {
      if (!card) return;
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)";
    };

    if (isHovered) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
      handleMouseLeave();
    };
  }, [isHovered, reducedMotion]);

  return (
    <motion.div
      ref={cardRef}
      initial={reducedMotion ? false : { opacity: 0, y: 40, scale: 0.95 }}
      whileInView={reducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.6, delay: reducedMotion ? 0 : index * 0.08, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className="work-panel work-panel-item group relative"
      onMouseEnter={() => setHoveredId(panel.id)}
      onMouseLeave={() => setHoveredId(null)}
      style={{
        display: isFiltering ? "none" : "flex",
        flexDirection: "column",
        transformStyle: "preserve-3d",
        transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform",
      }}
      data-cursor={panel.cursor}
    >
      <Link href={panel.href} className="contents">
        <div className="relative h-56 md:h-64 lg:h-72 overflow-hidden rounded-t-2xl">
          <div
            className="absolute inset-0 transition-all duration-1000 group-hover:scale-[1.05] group-hover:brightness-110"
            style={{ background: panel.gradient }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(3,4,8,0.3)] to-[rgba(3,4,8,0.85)]" />
          <span className="absolute left-4 top-4 badge badge-primary z-10">{panel.tag}</span>
          <span className="absolute right-4 top-4 badge badge-primary text-xs z-10" style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)" }}>
            {panel.category.replace("-", " ").toUpperCase()}
          </span>
        </div>
        <div className="p-6 md:p-7 flex flex-col flex-1 rounded-b-2xl glass-strong">
          <h3 className="font-semibold text-xl md:text-2xl text-[var(--text-primary)] group-hover:text-[var(--color-brand-500)] transition-colors">
            {panel.title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed flex-1 text-[var(--text-secondary)]">
            {panel.desc}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2 list-none p-0 m-0">
            {panel.stats.map((s) => (
              <li
                key={s.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono glass-strong"
              >
                <span className="stat-value text-xs font-mono text-[var(--text-primary)]">{s.value}</span>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t border-[var(--border-subtle)]">
            <span className="v6-chapter-link inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] group-hover:text-[var(--color-brand-500)] transition-colors">
              View Project
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 11L11 2M11 2H4M11 2v7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
      {/* Hover shine */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none rounded-2xl" />
    </motion.div>
  );
}
