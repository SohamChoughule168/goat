"use client";

import { useEffect, useRef } from "react";
import type { PillarSlug } from "@/content/services";

const draw = (delay: number) =>
  ({ "--md": `${delay.toFixed(2)}s` } as React.CSSProperties);

function BuildMotif() {
  return (
    <svg viewBox="0 0 400 240" fill="none" className="h-full w-full">
      <path data-motif style={draw(0.1)} d="M10 190 H110 V120 H200 V70 H300" pathLength={100} stroke="currentColor" strokeWidth="1.5" />
      <path data-motif style={draw(0.35)} d="M40 225 H170 V165 H260 V115 H390" pathLength={100} stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <path data-motif style={draw(0.55)} d="M70 30 H160 V85 H250" pathLength={100} stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <rect data-motif style={draw(0.8)} x="296" y="58" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" pathLength={100} />
      <rect data-motif style={draw(0.95)} x="256" y="158" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" pathLength={100} />
      <rect data-motif style={draw(0.95)} x="246" y="81" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" pathLength={100} />
      <rect data-float data-motif style={draw(1.05)} x="310" y="96" width="64" height="48" rx="5" stroke="currentColor" strokeWidth="1.8" pathLength={100} />
      <path data-motif style={draw(1.25)} d="M320 108 h44 M320 118 h30 M320 128 h38" stroke="currentColor" strokeWidth="1.2" pathLength={100} opacity="0.6" />
      <circle data-float cx="200" cy="120" r="4" fill="currentColor" opacity="0.8" />
      <circle data-float cx="110" cy="190" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function GrowMotif() {
  return (
    <svg viewBox="0 0 400 240" fill="none" className="h-full w-full">
      <path data-motif style={draw(0.05)} d="M20 210 H385 M20 210 V26" stroke="currentColor" strokeWidth="1.2" opacity="0.5" pathLength={100} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          data-motif
          style={draw(0.15 + i * 0.12)}
          d={`M${60 + i * 52} 210 V${210 - [46, 74, 62, 104, 92, 142][i]}`}
          stroke="currentColor"
          strokeWidth="2"
          pathLength={100}
          opacity={i === 5 ? 0.95 : 0.55}
        />
      ))}
      <path data-motif style={draw(0.95)} d="M42 168 C90 150 120 122 165 106 S255 66 295 54 S345 44 368 36" stroke="currentColor" strokeWidth="2" pathLength={100} />
      <path data-motif style={draw(1.25)} d="M352 32 L372 34 L360 50" stroke="currentColor" strokeWidth="2" pathLength={100} />
      <path data-float data-motif style={draw(1.4)} d="M164 98 l6 -6 6 6 -6 6 z" fill="currentColor" stroke="none" pathLength={100} />
      <path data-float data-motif style={draw(1.5)} d="M288 46 l6 -6 6 6 -6 6 z" fill="currentColor" stroke="none" pathLength={100} />
    </svg>
  );
}

function ContentMotif() {
  const wave = Array.from({ length: 16 }, (_, i) => {
    const x = 24 + i * 22;
    const h = [14, 30, 48, 26, 56, 40, 18, 52, 34, 60, 28, 46, 20, 54, 32, 12][i];
    return { x, h };
  });
  return (
    <svg viewBox="0 0 400 240" fill="none" className="h-full w-full">
      <rect data-motif style={draw(0.1)} x="36" y="34" width="196" height="126" rx="10" stroke="currentColor" strokeWidth="1.8" pathLength={100} />
      <path data-motif style={draw(0.5)} d="M112 76 L162 97 L112 118 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" pathLength={100} />
      <path data-motif style={draw(0.75)} d="M258 60 C300 34 340 40 384 26" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 6" pathLength={100} opacity="0.6" />
      {wave.map((w, i) => (
        <path
          key={i}
          data-motif
          style={draw(0.55 + i * 0.05)}
          d={`M${w.x} ${205 - w.h / 2} V${205 + w.h / 2}`}
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          pathLength={100}
          opacity={i % 4 === 0 ? 0.95 : 0.5}
        />
      ))}
      <circle data-float cx="232" cy="97" r="4" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function EnableMotif() {
  return (
    <svg viewBox="0 0 400 240" fill="none" className="h-full w-full">
      <path data-motif style={draw(0.05)} d="M200 78 L236 110 L222 152 L178 152 L164 110 Z" stroke="currentColor" strokeWidth="1.8" pathLength={100} />
      <path data-motif style={draw(0.3)} d="M200 84 L228 111 L216 147 L184 147 L172 111 Z" stroke="currentColor" strokeWidth="1" opacity="0.4" pathLength={100} />
      <path data-motif style={draw(0.5)} d="M164 110 H92" stroke="currentColor" strokeWidth="1.3" pathLength={100} opacity="0.7" />
      <path data-motif style={draw(0.6)} d="M236 110 L316 62" stroke="currentColor" strokeWidth="1.3" pathLength={100} opacity="0.7" />
      <path data-motif style={draw(0.7)} d="M222 152 L330 176" stroke="currentColor" strokeWidth="1.3" pathLength={100} opacity="0.7" />
      <path data-motif style={draw(0.8)} d="M178 152 L104 196" stroke="currentColor" strokeWidth="1.3" pathLength={100} opacity="0.7" />
      <path data-motif style={draw(0.9)} d="M200 78 V30" stroke="currentColor" strokeWidth="1.3" pathLength={100} opacity="0.7" />
      <circle data-float cx="80" cy="62" r="11" stroke="currentColor" strokeWidth="1.5" />
      <circle data-float cx="330" cy="52" r="13" stroke="currentColor" strokeWidth="1.5" />
      <circle data-float cx="342" cy="180" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle data-float cx="94" cy="204" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle data-float cx="200" cy="18" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="128" cy="110" r="3" fill="currentColor" opacity="0.8" />
      <circle cx="276" cy="86" r="3" fill="currentColor" opacity="0.8" />
      <circle data-float cx="200" cy="115" r="5" fill="currentColor" />
    </svg>
  );
}

const BODIES = {
  build: BuildMotif,
  grow: GrowMotif,
  content: ContentMotif,
  enable: EnableMotif,
} as const;

export default function PillarMotif({
  pillar,
  className = "",
  hue,
}: {
  pillar: PillarSlug;
  className?: string;
  hue?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Body = BODIES[pillar];
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`motif ${className}`}
      style={hue ? { color: hue } : undefined}
    >
      <Body />
    </div>
  );
}
