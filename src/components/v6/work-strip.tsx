"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Route } from "next";

interface WorkPanel {
  id: string;
  tag: string;
  title: string;
  desc: string;
  href: Route;
  stats: Array<{ label: string; value: string }>;
  gradient: string;
  cursor: string;
  category: 'case-study' | 'web' | 'mobile' | 'ai' | 'refurb';
  metrics?: {
    lcp?: string;
    traffic?: string;
    conversion?: string;
    rating?: string;
  };
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
    metrics: { lcp: "68%", traffic: "+240%", conversion: "+42%" },
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

export default function WorkStrip() {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [visiblePanels, setVisiblePanels] = useState<WorkPanel[]>(PANELS);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setIsFiltering(true);
    setTimeout(() => {
      const filtered = activeCategory === "all" 
        ? PANELS 
        : PANELS.filter(p => p.category === activeCategory);
      setVisiblePanels(filtered);
      setIsFiltering(false);
      
      // Animate in new panels
      if (gridRef.current) {
        const items = gridRef.current.querySelectorAll<HTMLElement>(".work-panel-item");
        gsap.fromTo(items,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "back.out(1.2)",
          }
        );
      }
    }, 200);
  }, [activeCategory]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = () => {};
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Header reveal
        gsap.fromTo(root.querySelector<HTMLElement>(".work-header"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: root,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Grid items stagger reveal
        const items = root.querySelectorAll<HTMLElement>(".work-panel-item");
        gsap.fromTo(items,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: root,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }, root);
      cleanup = () => ctx.revert();
    })();

    return () => cleanup();
  }, []);

  const filteredPanels = activeCategory === "all" ? PANELS : PANELS.filter(p => p.category === activeCategory);

  return (
    <section ref={rootRef} className="work-strip section-y" aria-label="Selected Work">
      <div className="shell pb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="work-header">
          <p className="micro text-[var(--color-brand-500)]">Selected Work</p>
          <h2 className="mt-5 font-semibold" style={{ fontSize: "clamp(1.9rem, 3.6vw, 3.2rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            Proof, not promises.
          </h2>
          <p className="lede mt-3 max-w-[44ch]" style={{ color: "var(--text-secondary)" }}>
            Every project ships with measurable outcomes. Filter by craft or explore all.
          </p>
        </div>
        
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

      <div 
        ref={gridRef} 
        className="flex-1 w-full p-4 lg:p-0"
        role="list"
        aria-label="Work projects"
      >
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          style={{ 
            opacity: isFiltering ? 0.5 : 1,
            transform: isFiltering ? "scale(0.98)" : "scale(1)",
            transition: "opacity 200ms ease, transform 200ms ease"
          } as React.CSSProperties}
        >
          {visiblePanels.map((p, index) => (
            <Link
              key={p.id}
              href={p.href}
              className="work-panel-item work-panel group relative overflow-hidden"
              data-cursor={p.cursor}
              role="listitem"
              style={{ 
                animationDelay: `${index * 60}ms`,
                display: isFiltering ? "none" : "flex"
              } as React.CSSProperties}
            >
              <div className="relative h-56 md:h-64 lg:h-72 overflow-hidden">
                <div className="absolute inset-0 transition-all duration-1000 group-hover:scale-[1.03] group-hover:brightness-110" style={{ background: p.gradient }} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(3,4,8,0.3)] to-[rgba(3,4,8,0.85)]" />
                <span className="absolute left-4 top-4 badge badge-primary z-10">{p.tag}</span>
                
                {/* Category badge */}
                <span className="absolute right-4 top-4 badge badge-primary text-xs z-10" style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)" }}>
                  {p.category.replace("-", " ").toUpperCase()}
                </span>
              </div>
              <div className="p-6 md:p-7 flex flex-col flex-1">
                <h3 className="font-semibold text-xl md:text-2xl group-hover:text-[var(--color-brand-500)] transition-colors" style={{ color: "var(--text-primary)" }}>{p.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>{p.desc}</p>
                <ul className="mt-5 flex flex-wrap gap-2 list-none p-0 m-0">
                  {p.stats.map((s) => (
                    <li key={s.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono glass-strong">
                      <span className="stat-value text-xs font-mono" style={{ color: "var(--text-primary)" }}>{s.value}</span>
                      <span>{s.label}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-4 border-t border-[var(--border-subtle)]">
                  <Link href={p.href} className="v6-chapter-link inline-flex" data-cursor={p.cursor}>
                    <span className="link-line">View Project</span>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                      <path d="M2 11L11 2M11 2H4M11 2v7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Hover shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            </Link>
          ))}
          
          {/* CTA Panel - Always visible */}
          <div className="work-panel flex-shrink-0 flex flex-col items-start justify-center border border-dashed p-8 glass-strong" style={{ borderColor: "var(--border-default)", background: "var(--surface-card)", minHeight: "320px" }}>
            <p className="micro text-[var(--color-brand-500)]">Next up</p>
            <p className="mt-4 font-semibold text-2xl md:text-3xl" style={{ color: "var(--text-primary)" }}>Your project, right here.</p>
            <p className="lede mt-3 max-w-xs" style={{ color: "var(--text-secondary)" }}>
              Let&apos;s build something measurable together.
            </p>
            <a href="/contact" className="v6-magnet mt-8" data-cursor="Start Now">Start a Project</a>
            
            {/* Animated border */}
            <div className="absolute inset-0 border-2 rounded-2xl pointer-events-none" style={{ 
              borderImage: "var(--gradient-brand) 1",
              opacity: 0.5 
            }} />
          </div>
        </div>
      </div>
    </section>
  );
}