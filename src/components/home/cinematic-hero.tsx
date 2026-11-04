"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { institutionHero } from "@/content/institution";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

/**
 * Cinematic Hero — Apple-grade hero with multi-layer photo composition,
 * Ken Burns scroll effect, and smooth text reveals.
 *
 * Layers:
 *   - Base: full-bleed hero image with slow Ken Burns scale
 *   - Overlay 1: textured paper layer that drifts with scroll
 *   - Overlay 2: ink plume accent that floats and scales
 * All pure CSS transforms — no WebGL, no 3D models.
 */
export default function CinematicHero() {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  // Scroll-driven Ken Burns on the hero image
  useEffect(() => {
    if (!reduced) {
      const img = document.querySelector(".cinematic-base-img");
      const handleScroll = () => {
        const scrolled = window.scrollY;
        const scale = 1 + scrolled * 0.00015;
        const translateY = scrolled * 0.05;
        if (img) {
          (img as HTMLElement).style.transform = `scale(${Math.min(scale, 1.15)}) translateY(${translateY}px)`;
        }
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [reduced]);

  // Reveal animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="cinematic-hero" aria-labelledby="home-hero">
      <div className="cinematic-bg" />
      
      <div className="cinematic-layers">
        <img
          src={institutionHero.src}
          srcSet={institutionHero.srcSet}
          sizes="(max-width: 1023px) 100vw, 1200px"
          width={institutionHero.width}
          height={institutionHero.height}
          alt={institutionHero.alt}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={`cinematic-base-img cinematic-layer cinematic-layer-base ${reduced ? "cinematic-reduced" : ""}`}
        />
        <div className="cinematic-layer cinematic-layer-overlay-1" />
        <div className="cinematic-layer cinematic-layer-overlay-2" />
      </div>

      <div className="inst-shell cinematic-shell">
        <div className="cinematic-copy">
          <p
            className={`inst-label cinematic-label-reveal ${revealed ? "revealed" : ""}`}
          >
            Independent studio / Mumbai / Est. 2024
          </p>
          <h1 id="home-hero" className={`inst-display-xl cinematic-headline cinematic-headline-reveal ${revealed ? "revealed" : ""}`}>
            One system.
            <br />
            <span className="inst-serif">Every branch.</span>
          </h1>
          <p
            className={`inst-lede cinematic-lede cinematic-lede-reveal ${revealed ? "revealed" : ""}`}
          >
            We design and build the public site, admissions path and student systems that
            institutes actually run on. One accountable team, from diagnosis to handover.
          </p>
          <p className={`cinematic-proof cinematic-proof-reveal ${revealed ? "revealed" : ""}`}>
            <span className="cinematic-proof-dot" aria-hidden="true" />
            Verified build: PRV Financial Services, live since April 2025.
          </p>
          <div className="cinematic-actions">
            <Link href="/#fit-check" className="inst-btn cinematic-btn cinematic-btn-primary">
              Check fit in 60 seconds
              <span className="btn-shine" />
            </Link>
            <Link href="/work" className="inst-btn inst-btn-ghost cinematic-btn cinematic-btn-secondary">
              See the proof
            </Link>
          </div>
        </div>

        <aside className="cinematic-plate" aria-label="The operating layers: four of eight operating layers">
          <div className="cinematic-plate-head">
            <span className="inst-label">The operating layers</span>
            <span className="inst-num text-[0.625rem] uppercase tracking-[0.12em] text-[var(--ink-3)]">
              01 — 08
            </span>
          </div>

          <dl className="cinematic-layer-legend">
            {[
              { index: "01", title: "Brand", meta: "Identity and governance" },
              { index: "02", title: "Website", meta: "Public front door" },
              { index: "03", title: "Admissions", meta: "Enquiry to enrolment" },
              { index: "04", title: "Intelligence", meta: "One reporting layer" },
            ].map((layer) => (
              <Fragment key={layer.index}>
                <dt className="cinematic-legend-item cinematic-legend-reveal">
                  <span className="cinematic-legend-index">{layer.index}</span>
                  <span className="cinematic-legend-title">{layer.title}</span>
                </dt>
                <dd className="cinematic-legend-meta cinematic-legend-reveal">
                  {layer.meta}
                </dd>
              </Fragment>
            ))}
          </dl>

          <p className="cinematic-caption mt-6 max-w-[38ch] text-[0.8125rem] leading-relaxed text-[var(--ink-3)]">
            Four of eight layers, from brand to intelligence.
          </p>
        </aside>
      </div>

      <dl className="inst-shell cinematic-ledger cinematic-ledger-reveal">
        <div className="cinematic-ledger-item">
          <dt className="cinematic-ledger-label">Operating layers</dt>
          <dd className="cinematic-ledger-value">01 — 08</dd>
        </div>
        <div className="cinematic-ledger-item">
          <dt className="cinematic-ledger-label">Capabilities</dt>
          <dd className="cinematic-ledger-value">18</dd>
        </div>
        <div className="cinematic-ledger-item">
          <dt className="cinematic-ledger-label">Accessibility target</dt>
          <dd className="cinematic-ledger-value">WCAG 2.2 AA</dd>
        </div>
        <div className="cinematic-ledger-item">
          <dt className="cinematic-ledger-label">Ownership</dt>
          <dd className="cinematic-ledger-value">100% yours</dd>
        </div>
      </dl>
    </section>
  );
}
