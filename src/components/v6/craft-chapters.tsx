"use client";

import Link from "next/link";
import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSound, useMagneticSound } from "./sound-design";
import { MagneticButton } from "./magnetic-cursor";

const CraftWebGL = lazy(() => import("./craft-webgl").then(m => ({ default: m.default })));

interface Craft {
  num: string;
  title: string;
  desc: string;
  longDesc: string;
  items: string[];
  outcomes: string[];
  href: string;
  cursor: string;
  icon: React.ReactNode;
  color: string;
  webglType: 'grid' | 'flow' | 'neural' | 'reconstruct';
}

const CRAFTS: Craft[] = [
  {
    num: "01",
    title: "Web Development",
    desc: "High-performance web platforms engineered for speed, search visibility, and conversion.",
    longDesc: "We build Next.js platforms, e-commerce engines, and content-rich web applications that load in sub-second speeds and rank organically. Every line of code is written by senior engineers who own the outcome.",
    items: ["Next.js 15 + React 19 platforms", "Headless CMS (Sanity, Contentful, Strapi)", "E-commerce (Shopify Plus, Medusa, BigCommerce)", "Progressive Web Apps", "Core Web Vitals optimization", "SEO-first architecture"],
    outcomes: ["Sub-1s LCP", "90+ Lighthouse", "WCAG 2.2 AA", "Zero-downtime deploys"],
    href: "/services/web-development",
    cursor: "Explore Web Dev",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h6M9 15h6M9 12h4" />
      </svg>
    ),
    color: "#14b8a6",
    webglType: 'grid',
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
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="7" />
        <path d="M12 18h.01" />
      </svg>
    ),
    color: "#06b6d4",
    webglType: 'flow',
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
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    color: "#10b981",
    webglType: 'neural',
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
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12M19 10H5M12 21v-6" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    color: "#f59e0b",
    webglType: 'reconstruct',
  },
];

function CraftChapterContent({ craft }: { craft: Craft }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const { onEnter: onMagneticEnter, onClick } = useMagneticSound();
  const magneticRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article ref={ref} className="craft-chapter" style={{ borderTopColor: "var(--border-subtle)" }}>
      <div className="shell craft-chapter-inner">
        <div className="relative">
          <span className="craft-chapter-num" aria-hidden="true" style={{ WebkitTextStroke: `1px rgba(255,255,255,0.12)` }}>{craft.num}</span>
          <div className="absolute -top-4 -right-4 w-16 h-16 opacity-10 animate-float" style={{ color: craft.color }} aria-hidden="true">
            {craft.icon}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="badge badge-primary" style={{ backgroundColor: `${craft.color}20`, borderColor: `${craft.color}40`, color: craft.color }}>
              {craft.num}  {craft.title}
            </span>
          </div>
          <h2 className="craft-chapter-title">{craft.title}</h2>
          <p className="craft-chapter-desc mt-5">{craft.longDesc}</p>
          <ul className="craft-chapter-list mt-8 stagger-children animate">
            {craft.items.map((it, i) => (
              <li key={it} style={{ animationDelay: `${i * 60}ms` } as React.CSSProperties}>{it}</li>
            ))}
          </ul>
          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] stagger-children animate" style={{ animationDelay: "200ms" } as React.CSSProperties}>
            <p className="micro mb-3">Measured Outcomes</p>
            <ul className="flex flex-wrap gap-3 list-none p-0 m-0">
              {craft.outcomes.map((o) => (
                <li key={o} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-tertiary)" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-scale-in" style={{ background: "var(--color-success-500)", animationDelay: `${100}ms` } as React.CSSProperties} />
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <MagneticButton
            href={craft.href}
            className="craft-chapter-link mt-8 inline-flex stagger-children animate"
            style={{ animationDelay: "300ms" } as React.CSSProperties}
            data-cursor={craft.cursor}
            onClick={onClick}
          >
            <span className="link-line">Explore {craft.title}</span>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M2 11L11 2M11 2H4M11 2v7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticButton>
        </div>
      </div>
      
      {/* WebGL Visualization */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[40vw] max-w-[500px] h-[40vw] max-h-[500px] opacity-0 translate-x-10 transition-all duration-1000 ease-out pointer-events-none"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(20px)" } as React.CSSProperties}>
        <Suspense fallback={<div className="w-full h-full" />}>
          <CraftWebGL type={craft.webglType} color={craft.color} />
        </Suspense>
      </div>
    </article>
  );
}

export default function CraftChapters() {
  const rootRef = useRef<HTMLDivElement>(null);

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
        const chapters = gsap.utils.toArray<HTMLElement>(".craft-chapter");
        chapters.forEach((ch, i) => {
          if (i === chapters.length - 1) return;
          gsap.to(ch.querySelector(".craft-chapter-inner"), {
            scale: 0.96,
            opacity: 0.4,
            filter: "blur(2px)",
            ease: "none",
            scrollTrigger: {
              trigger: chapters[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          });
        });
      }, root);
      cleanup = () => ctx.revert();
    })();

    return () => cleanup();
  }, []);

  return (
    <div ref={rootRef} className="craft" aria-label="Our Crafts">
      {CRAFTS.map((c) => (
        <CraftChapterContent key={c.num} craft={c} />
      ))}
    </div>
  );
}