"use client";

/**
 * MANIFESTO SECTION - $100M Tier
 * 
 * Combines:
 * - Sticky text reveal with scroll-driven highlighting
 * - 3D liquid metal surface that responds to scroll
 * - Spring-physics word reveals
 * - Magnetic cursor
 * 
 * The 3D scene uses SectionView to track the DOM element.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import { useGlobalScrollProgress, useSectionProgress } from "@/components/canvas/Tunnel";
import { SectionView } from "@/components/canvas/SectionView";

const ManifestoScene3D = dynamic(
  () => import("@/components/canvas/scenes/ManifestoScene").then(m => m.ManifestoScene),
  { ssr: false, loading: () => null }
);

const STATEMENTS = [
  "Templates are cheap. Attention is expensive. We engineer websites, apps and AI systems that load in a blink, rank on their own, and turn visitors into believers.",
  "Code you don't own is a liability. Every line we ship transfers 100% ownership at handover — no retainers, no lock-in.",
  "Speed isn't a feature. It's the foundation. Sub-100ms TTFB, zero layout shift, instant interaction — or we don't ship.",
  "AI isn't magic. It's infrastructure. We embed intelligence that compounds: personalization, search, generation, automation.",
  "Four practices. One studio. Web. Mobile. AI. Refurbishment. No handoffs between departments that don't exist.",
];

const HIGHLIGHT_WORDS = [
  "expensive",
  "ownership",
  "Speed",
  "foundation",
  "AI",
  "infrastructure",
  "practices",
  "studio",
];

export function Manifesto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStatement, setActiveStatement] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const globalProgress = useGlobalScrollProgress();
  const sectionProgress = useSectionProgress("manifesto");

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const springY = useSpring(textY, { stiffness: 65, damping: 25 });

  // Check for reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Mouse tracking for 3D parallax
  useEffect(() => {
    if (reducedMotion) return;
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [reducedMotion]);

  // Compute static transform for reduced motion
  const textTransform = reducedMotion ? 0 : springY;

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="manifesto-section relative section-y"
      data-component="manifesto"
      aria-labelledby="manifesto-title"
    >
      {/* 3D Background - liquid metal surface */}
      <div className="manifesto-3d absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <SectionView trackId="manifesto" lazyMount={true}>
          <ManifestoScene3D scrollProgress={globalProgress} mousePos={mousePos} />
        </SectionView>
      </div>

      <div className="manifesto-content relative z-10">
        <div className="shell">
          <div className="manifesto-header mb-12 flex items-end justify-between">
            <div>
              <p className="micro text-[var(--color-brand-500)]">The Manifesto</p>
              <h2
                id="manifesto-title"
                className="mt-4 font-semibold"
                style={{
                  fontSize: "clamp(2rem, 4.4vw, 4rem)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.03em",
                }}
              >
                We don&apos;t do <span className="gradient-text">templates.</span>
              </h2>
            </div>

            {/* Statement counter */}
            <div className="flex items-center gap-3 text-sm text-[var(--text-tertiary)]" role="status" aria-live="polite">
              <span className="w-6 h-px bg-gradient-to-r from-transparent via-[var(--color-brand-500)] to-transparent" aria-hidden="true" />
              <span className="font-mono">
                {String(activeStatement + 1).padStart(2, "0")} / {String(STATEMENTS.length).padStart(2, "0")}
              </span>
              <span className="w-6 h-px bg-gradient-to-r from-transparent via-[var(--color-brand-500)] to-transparent" aria-hidden="true" />
            </div>
          </div>

          {/* Scrolling Statements */}
          <motion.div
            className="manifesto-text-wrapper max-w-4xl"
            style={{ y: textTransform }}
            initial={reducedMotion ? false : { opacity: 0, y: 50 }}
            animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-16">
              {STATEMENTS.map((statement, i) => {
                const words = statement.split(" ");
                return (
                  <p
                    key={i}
                    className="manifesto-statement text-2xl md:text-3xl lg:text-4xl leading-snug"
                    style={{ opacity: reducedMotion ? 1 : 0, transform: reducedMotion ? "translateY(0)" : "translateY(30px)" }}
                  >
                    {words.map((word, j) => {
                      const isHighlight = HIGHLIGHT_WORDS.includes(
                        word.replace(/[.,]/g, "")
                      );
                      return (
                        <span
                          key={j}
                          className={
                            isHighlight
                              ? "highlight-word"
                              : "manifesto-word"
                          }
                        >
                          {word}{" "}
                        </span>
                      );
                    })}
                  </p>
                );
              })}
            </div>
          </motion.div>

          {/* Philosophy Pills */}
          <div className="mt-16 flex flex-wrap gap-3" role="list" aria-label="Core principles">
            {[
              "Code Ownership",
              "Business-Day Response",
              "Senior-Led Execution",
              "Four Practices",
              "Zero Handoffs",
            ].map((principle, i) => (
              <span
                key={principle}
                className="badge badge-primary"
                style={{ opacity: reducedMotion ? 1 : 0, transform: reducedMotion ? "translateY(0)" : "translateY(20px)" } as React.CSSProperties}
                role="listitem"
              >
                {principle}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
