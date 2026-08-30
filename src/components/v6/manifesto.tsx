"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useSound } from "./sound-design";
import { MagneticButton } from "./magnetic-cursor";

const MANIFESTO_STATEMENTS = [
  "Templates are cheap. Attention is expensive. We engineer websites, apps and AI systems that load in a blink, rank on their own, and turn visitors into believers.",
  "Code you don't own is a liability. Every line we ship transfers 100% ownership at handover — no retainers, no lock-in.",
  "Speed isn't a feature. It's the foundation. Sub-100ms TTFB, zero layout shift, instant interaction — or we don't ship.",
  "AI isn't magic. It's infrastructure. We embed intelligence that compounds: personalization, search, generation, automation.",
  "Four practices. One studio. Web. Mobile. AI. Refurbishment. No handoffs between departments that don't exist.",
];

const HIGHLIGHT_WORDS = ["Attention", "engineer", "believers", "ownership", "Speed", "foundation", "AI", "infrastructure", "practices", "studio", "handerfs", "lock-in", "feature", "foundation", "magic", "infrastructure", "handerfs", "departments"];

const ICONS = {
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>,
};

export default function Manifesto() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [currentStatement, setCurrentStatement] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { play } = useSound();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      root.querySelectorAll<HTMLElement>(".manifesto-word").forEach((w) => (w.style.opacity = "1"));
      return;
    }

    let cleanup = () => {};
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const words = root.querySelectorAll<HTMLElement>(".manifesto-word");
      const highlightWords = root.querySelectorAll<HTMLElement>(".manifesto-word.highlight");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          end: "bottom 45%",
          scrub: 0.4,
        },
      });

      tl.to(words, {
        opacity: 1,
        stagger: 0.045,
        ease: "none",
      });

      tl.to(highlightWords, {
        color: "var(--color-brand-500)",
        stagger: 0.045,
        ease: "none",
      }, "<");

      cleanup = () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    })();

    return () => cleanup();
  }, []);

  // Statement rotation
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      play("pop", { volume: 0.1 });
      setTimeout(() => {
        setCurrentStatement(s => (s + 1) % MANIFESTO_STATEMENTS.length);
        setTimeout(() => setIsAnimating(false), 50);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const currentText = MANIFESTO_STATEMENTS[currentStatement];
  const words = currentText.split(" ").map((word, i) => {
    const cleanWord = word.replace(/[.,]/g, '');
    const isHighlight = HIGHLIGHT_WORDS.some(h => word.includes(h));
    return (
      <span 
        key={i} 
        className={`manifesto-word${isHighlight ? " highlight" : ""}`}
        style={{ 
          opacity: isAnimating ? 0 : undefined,
          transition: "opacity 300ms ease, color 300ms ease"
        } as React.CSSProperties}
      >
        {word}{" "}
      </span>
    );
  });

  return (
    <section ref={rootRef} className="manifesto section-y" aria-label="Manifesto">
      <div className="shell">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <p className="micro text-[var(--color-brand-500)]">The Manifesto</p>
          <div className="flex items-center gap-3 text-sm text-[var(--text-tertiary)]" role="status" aria-live="polite">
            <span className="w-6 h-px bg-gradient-to-r from-transparent via-[var(--color-brand-500)] to-transparent" />
            <span>{currentStatement + 1} of {MANIFESTO_STATEMENTS.length}</span>
            <span className="w-6 h-px bg-gradient-to-r from-transparent via-[var(--color-brand-500)] to-transparent" />
          </div>
        </div>
        
        <blockquote 
          className="manifesto-text max-w-[28ch] md:max-w-[32ch] mt-6" 
          style={{ transition: "opacity 300ms ease" } as React.CSSProperties}
        >
          {words}
        </blockquote>
        
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <p className="micro text-[var(--color-brand-500)]">
            <Link href="/contact" className="link-line">ImaginarsClub, Mumbai</Link>
          </p>
          
          {/* Philosophy Pills */}
          <div className="flex flex-wrap gap-2" role="list" aria-label="Core principles">
            {[
              "Code Ownership",
              "Business-Day Response",
              "Senior-Led Execution",
              "Four Practices",
              "Zero Handoffs"
            ].map((principle, i) => (
              <span 
                key={principle} 
                className="badge badge-primary animate-scale-in-bounce"
                style={{ animationDelay: `${200 + i * 80}ms` } as React.CSSProperties}
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