"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import dynamic from "next/dynamic";

const ParticleField = dynamic(() => import("./particle-field"), { ssr: false });

const WORD = "IMAGINARS";

function PreloaderContent() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showOrb, setShowOrb] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTimeout(() => {
        setDone(true);
        document.documentElement.classList.add("v6-loaded");
      }, 0);
      return;
    }

    const root = rootRef.current;
    if (!root) return;
    document.documentElement.classList.remove("v6-loaded");

    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();

    const letters = root.querySelectorAll<HTMLElement>(".preloader-name span");

    letters.forEach((l, i) => {
      l.style.transition = `transform 900ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 80}ms`;
      requestAnimationFrame(() => (l.style.transform = "translateY(0)"));
    });

    setTimeout(() => setShowOrb(true), 100);
    setTimeout(() => setShowParticles(true), 300);

    const t0 = performance.now();
    let raf = 0;

    function tick(now: number) {
      const t = Math.min(1, (now - t0 - 400) / 2400);
      const eased = 1 - Math.pow(1 - t, 4);
      setCount(Math.round(eased * 100));
      if (barRef.current) barRef.current.style.transform = `scaleX(${eased})`;

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setCount(100);
        setTimeout(() => {
          setDone(true);
          document.documentElement.classList.add("v6-loaded");
          window.dispatchEvent(new CustomEvent("v6:enter"));
          lenis?.start();
        }, 500);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (done) return <div ref={rootRef} className="preloader done" aria-hidden="true" style={{ pointerEvents: "none" }} />;

  return (
    <div ref={rootRef} className="preloader" role="status" aria-label="Loading ImaginarsClub">
      <div className="preloader-bg" aria-hidden="true">
        {showOrb && <div className="preloader-orb" aria-hidden="true" />}
        {showParticles && <ParticleField className="preloader-particles" intensity={0.5} />}
      </div>
      <div className="preloader-content" aria-hidden="true">
        <div className="preloader-name">
          {WORD.split("").map((c, i) => (
            <span key={i} style={{ transitionDelay: `${i * 80}ms` } as React.CSSProperties}>{c}</span>
          ))}
        </div>
        <div className="preloader-bar" aria-hidden="true"><i ref={barRef} /></div>
        <p className="preloader-count" aria-live="off">{String(count).padStart(3, "0")}%</p>
        <p className="preloader-hint">Initializing build environment...</p>
      </div>
    </div>
  );
}

export default function Preloader() {
  return (
    <Suspense fallback={<div className="preloader" />}>
      <PreloaderContent />
    </Suspense>
  );
}