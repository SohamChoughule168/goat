"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { institutionHero, institutionLayers } from "@/content/institution";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

/**
 * Enhanced hero with layered 3D images.
 *
 * The hero image is split into a base layer and two overlay layers that shift
 * with scroll (parallax) and respond to pointer movement (3D tilt). All
 * transforms are pure CSS — no WebGL, no 3D models, just images in 3D space.
 */
export default function InstitutionHero() {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced || !frameRef.current) return;
    const handleMove = (event: MouseEvent) => {
      const rect = frameRef.current!.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      setPointer({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reduced]);

  const tiltX = pointer.y * -8;
  const tiltY = pointer.x * 8;

  return (
    <section className="hero-inst hero-3d" aria-labelledby="home-hero">
      <div className="inst-shell hero-inst-inner">
        <div className="hero-inst-copy">
          <p className="inst-label hero-label-reveal">Independent studio / Mumbai / Est. 2024</p>
          <h1 id="home-hero" className="inst-display-xl hero-inst-headline hero-headline-reveal">
            One system.
            <br />
            <span className="inst-serif">Every branch.</span>
          </h1>
          <p className="inst-lede hero-inst-sub hero-lede-reveal">
            We design and build the public site, admissions path and student systems that
            institutes actually run on. One accountable team, from diagnosis to handover.
          </p>
          <p className="hero-inst-proof hero-proof-reveal">
            <span className="hero-inst-proof-dot" aria-hidden="true" />
            Verified build: PRV Financial Services, live since April 2025.
          </p>
          <div className="hero-inst-actions hero-actions-reveal">
            <Link href="/#fit-check" className="inst-btn hero-btn-reveal">
              Check fit in 60 seconds
            </Link>
            <Link href="/work" className="inst-btn inst-btn-ghost hero-btn-reveal">
              See the proof
            </Link>
          </div>
        </div>

        <aside
          className="hero-inst-plate"
          aria-label="The operating layers: four of eight operating layers"
        >
          <div className="hero-inst-plate-head">
            <span className="inst-label">The operating layers</span>
            <span className="inst-num text-[0.625rem] uppercase tracking-[0.12em] text-[var(--ink-3)]">
              01 — 08
            </span>
          </div>

          <figure className="hero-image-frame" ref={frameRef} style={{ "--tilt-x": tiltX, "--tilt-y": tiltY } as React.CSSProperties}>
            <div className="hero-image-layer hero-image-base">
              <img
                src={institutionHero.src}
                srcSet={institutionHero.srcSet}
                sizes="(max-width: 1023px) 90vw, 40vw"
                width={institutionHero.width}
                height={institutionHero.height}
                alt={institutionHero.alt}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <div className="hero-image-layer hero-image-overlay-1">
              <img
                src="/media/institution/hero-desk-1200.webp"
                alt="Layered paper sheets in morning light"
                width={1200}
                height={1500}
                loading="lazy"
                decoding="async"
                className="hero-image-overlay-img"
              />
            </div>
            <div className="hero-image-layer hero-image-overlay-2">
              <img
                src="/media/institution/hero-desk-1200.webp"
                alt="Paper texture detail"
                width={1200}
                height={1500}
                loading="lazy"
                decoding="async"
                className="hero-image-overlay-img"
              />
            </div>
          </figure>

          <dl className="layer-legend hero-legend-reveal">
            {institutionLayers.map((layer) => (
              <>
                <dt key={layer.id + "-term"} className="layer-label" data-tone={layer.tone}>
                  <span className="layer-label-swatch" aria-hidden="true" />
                  <span className="layer-label-index">{layer.index}</span>
                  <span className="layer-label-title">{layer.title}</span>
                </dt>
                <dd key={layer.id + "-def"} className="layer-meta">
                  {layer.meta}
                </dd>
              </>
            ))}
          </dl>

          <p className="mt-5 max-w-[38ch] text-[0.8125rem] leading-relaxed text-[var(--ink-3)] hero-caption-reveal">
            Four of eight layers, from brand to intelligence.
          </p>
        </aside>
      </div>

      <dl className="inst-shell hero-inst-ledger hero-ledger-reveal">
        <div className="hero-inst-ledger-item">
          <dt className="hero-inst-ledger-label">Operating layers</dt>
          <dd className="hero-inst-ledger-value">01 — 08</dd>
        </div>
        <div className="hero-inst-ledger-item">
          <dt className="hero-inst-ledger-label">Capabilities</dt>
          <dd className="hero-inst-ledger-value">18</dd>
        </div>
        <div className="hero-inst-ledger-item">
          <dt className="hero-inst-ledger-label">Accessibility target</dt>
          <dd className="hero-inst-ledger-value">WCAG 2.2 AA</dd>
        </div>
        <div className="hero-inst-ledger-item">
          <dt className="hero-inst-ledger-label">Ownership</dt>
          <dd className="hero-inst-ledger-value">100% yours</dd>
        </div>
      </dl>
    </section>
  );
}
