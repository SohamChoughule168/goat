"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { institutionHero } from "@/content/institution";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import TextSplit from "@/components/motion/text-split";

/**
 * Cinematic Hero — V4 premium hero.
 *
 * Layers:
 *   - Base: full-bleed paper photo with slow Ken Burns scroll drift
 *   - Accent: cropped cinema texture glowing behind the paper
 *   - Overlay: soft ink plume accent
 *   - Mesh: subtle radial gradient mesh for atmosphere
 *
 * Typography:
 *   - Headline split per-word for a sequential cinematic reveal
 *   - Lede, proof line, CTAs revealed in sequence
 *
 * Interaction:
 *   - Primary CTA is magnetic (fine pointer only, disabled under reduced motion)
 *   - All copy is server-rendered HTML first; motion is progressive enhancement
 *   - No WebGL — pure CSS + gsap via the shared scroll controller
 *   - Liquid glass panels with specular highlights
 */
export default function CinematicHero() {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);

  // Scroll-driven Ken Burns + depth on the base image
  useEffect(() => {
    if (reduced || !imgRef.current) return;
    const img = imgRef.current;
    const accent = accentRef.current;
    const mesh = meshRef.current;
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const scale = 1 + scrolled * 0.00015;
      const translateY = scrolled * 0.05;
      img.style.transform = `scale(${Math.min(scale, 1.15)}) translateY(${translateY}px)`;
      if (accent) {
        accent.style.transform = `translateY(${scrolled * 0.03}px)`;
        accent.style.opacity = String(Math.min(0.4 + scrolled * 0.0004, 0.6));
      }
      if (mesh) {
        mesh.style.transform = `translateY(${scrolled * 0.08}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reduced]);

  // Magnetic CTA (fine pointer only)
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [mag, setMag] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (reduced || !btnRef.current) return;
    const btn = btnRef.current;
    const handleMove = (event: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      const dist = Math.hypot(x, y);
      const force = Math.max(0, 1 - dist / 140);
      setMag({ x: x * force * 0.4, y: y * force * 0.4 });
    };
    const handleLeave = () => setMag({ x: 0, y: 0 });
    btn.addEventListener("pointermove", handleMove, { passive: true });
    btn.addEventListener("pointerleave", handleLeave);
    return () => {
      btn.removeEventListener("pointermove", handleMove);
      btn.removeEventListener("pointerleave", handleLeave);
    };
  }, [reduced]);

  // Reveal animation on mount with staggered delays
  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Parallax for the mesh layer
  useEffect(() => {
    if (reduced || !meshRef.current) return;
    const mesh = meshRef.current;
    const handleScroll = () => {
      const scrolled = window.scrollY;
      mesh.style.transform = `translateY(${scrolled * 0.1}px) scale(${1 + scrolled * 0.00005})`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reduced]);

  return (
    <section className="cinematic-hero" aria-labelledby="home-hero">
      {/* Atmospheric mesh gradient background */}
      <div className="cinematic-mesh" ref={meshRef} aria-hidden="true" />

      <div className="cinematic-bg" />

      <div className="cinematic-layers">
        {/* Texture accent behind the paper — subtle depth, no WebGL. */}
        <div
          ref={accentRef}
          className="cinematic-layer cinematic-layer-accent"
          aria-hidden="true"
        >
          <img
            src="/media/institution/hero-texture-accent.webp"
            alt=""
            width={900}
            height={1350}
            loading="lazy"
            decoding="async"
            className="cinematic-accent-img"
          />
        </div>
        <img
          ref={imgRef}
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

      {/* Specular highlight sweep on hero bg */}
      <div className="cinematic-specular" aria-hidden="true" />

      <div className="inst-shell cinematic-shell">
        <div className="cinematic-copy">
          <p
            className={`inst-label cinematic-label-reveal ${revealed ? "revealed" : ""}`}
            style={{ transitionDelay: "0ms" }}
          >
            Independent studio / Mumbai / Est. 2024
          </p>
          <h1
            id="home-hero"
            className={`inst-display-monument cinematic-headline cinematic-headline-reveal ${revealed ? "revealed" : ""}`}
            style={{ transitionDelay: "100ms" }}
          >
            <TextSplit variant="word" inlineClass="ts-line">One system.</TextSplit>
            <div style={{ transitionDelay: "200ms" }}>
              <TextSplit variant="word" inlineClass="ts-line inst-serif">
                Every branch.
              </TextSplit>
            </div>
          </h1>
          <p
            className={`inst-lede cinematic-lede cinematic-lede-reveal ${revealed ? "revealed" : ""}`}
            style={{ transitionDelay: "300ms" }}
          >
            We design and build the public site, admissions path and student systems that
            institutes actually run on. One accountable team, from diagnosis to handover.
          </p>
          <p className={`cinematic-proof cinematic-proof-reveal ${revealed ? "revealed" : ""}`}
            style={{ transitionDelay: "400ms" }}>
            <span className="cinematic-proof-dot" aria-hidden="true" />
            Verified build: PRV Financial Services, live since April 2025.
          </p>
          <div className="cinematic-actions" style={{ transitionDelay: "500ms" }}>
            <Link
              href="/#fit-check"
              className="inst-btn cinematic-btn cinematic-btn-primary btn-magnetic specular"
              ref={btnRef}
              style={
                reduced
                  ? {}
                  : {
                      transform: `translate(${mag.x}px, ${mag.y}px)`,
                      transition: reduced ? "none" : "transform 0.12s cubic-bezier(.34,1.56,.64,1)",
                    }
              }
            >
              <span className="btn-content">
                Check fit in 60 seconds
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: 8, flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <span className="btn-shine specular" aria-hidden="true" />
            </Link>
            <Link
              href="/work"
              className="inst-btn inst-btn-ghost cinematic-btn cinematic-btn-secondary glass-liquid"
            >
              See the proof
            </Link>
          </div>
        </div>

        <aside className="cinematic-plate glass-liquid" aria-label="The operating layers: four of eight operating layers">
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
                <dd key={`${layer.index}-def`} className="cinematic-legend-meta cinematic-legend-reveal">
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
        <div className="cinematic-ledger-item cinematic-ledger-reveal">
          <dt className="cinematic-ledger-label">Operating layers</dt>
          <dd className="cinematic-ledger-value">01 — 08</dd>
        </div>
        <div className="cinematic-ledger-item cinematic-ledger-reveal" style={{ transitionDelay: "80ms" }}>
          <dt className="cinematic-ledger-label">Capabilities</dt>
          <dd className="cinematic-ledger-value">18</dd>
        </div>
        <div className="cinematic-ledger-item cinematic-ledger-reveal" style={{ transitionDelay: "160ms" }}>
          <dt className="cinematic-ledger-label">Accessibility target</dt>
          <dd className="cinematic-ledger-value">WCAG 2.2 AA</dd>
        </div>
        <div className="cinematic-ledger-item cinematic-ledger-reveal" style={{ transitionDelay: "240ms" }}>
          <dt className="cinematic-ledger-label">Ownership</dt>
          <dd className="cinematic-ledger-value">100% yours</dd>
        </div>
      </dl>
    </section>
  );
}