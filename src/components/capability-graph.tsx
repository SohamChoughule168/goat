"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { allServices, pillars } from "@/content/services";

const W = 1040;
const H = 660;
const CX = W / 2;
const CY = H / 2 + 6;
const HUB_R = 148;
const RX = 392;
const RY = 236;

interface Node {
  slug: string;
  title: string;
  x: number;
  y: number;
  pillarIndex: number;
}

function polar(rx: number, ry: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [CX + rx * Math.cos(rad), CY + ry * Math.sin(rad)];
}

const HUB_DEGS = [45, 135, 225, 315];
const HUBS = HUB_DEGS.map((deg) => {
  const [x, y] = polar(HUB_R, HUB_R * 0.92, deg);
  return { x: Math.round(x), y: Math.round(y), deg };
});

// Proportional arc spans — more services, wider arc
const SPANS = [56, 112, 66, 32];

function buildNodes(): Node[][] {
  return pillars.map((pillar, pi) => {
    const kids = allServices.filter((s) => s.pillar === pillar.slug);
    const span = SPANS[pi];
    const step = kids.length > 1 ? span / (kids.length - 1) : 0;
    return kids.map((s, i) => {
      const angle = HUB_DEGS[pi] - span / 2 + i * step;
      const scale = i % 2 === 1 ? 1.17 : 1;
      const [x, y] = polar(RX * scale, RY * scale, angle);
      return { slug: s.slug, title: s.title, x: Math.round(x), y: Math.round(y), pillarIndex: pi };
    });
  });
}

export default function CapabilityGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          setLoaded(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ALL_NODES = buildNodes();

  return (
    <div ref={ref} className="artifact overflow-hidden" data-lines>
      {/* Panel header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[var(--line)]">
        <p className="micro" style={{ color: "var(--text-hi)", opacity: 0.9 }}>
          <span className="kicker-rule" aria-hidden="true" />The studio system
        </p>
        <p className="font-mono text-[10px] tracking-[0.15em]" style={{ color: "var(--text-subtle)" }}>
          HOVER A PRACTICE TO TRACE ITS SERVICES
        </p>
      </div>

      <div className="relative px-2 pb-2 pt-4 md:px-6">
        {/* Screen-reader list */}
        <ul className="sr-only">
          {ALL_NODES.flat().map((n) => (
            <li key={n.slug}><a href={`/services/${n.slug}`}>{n.title}</a></li>
          ))}
        </ul>

        <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="w-full">
          <defs>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.4" />
              <stop offset="60%" stopColor="var(--blue)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Orbit rings */}
          <g style={{ opacity: 0.6 }}>
            <ellipse cx={CX} cy={CY} rx={HUB_R} ry={HUB_R * 0.92} fill="none" stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2 6" />
          </g>
          <g className={loaded ? "orbit-ring reverse" : ""} style={{ opacity: 0.4 }}>
            <ellipse cx={CX} cy={CY} rx={RX * 1.09} ry={RY * 1.09} fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="1 7" />
          </g>

          {/* Core glow */}
          <circle cx={CX} cy={CY} r={120} fill="url(#coreGlow)" className="core-pulse" />

          {/* Connectors hub→node */}
          {ALL_NODES.map((group, gi) =>
            group.map((n) => {
              const hub = HUBS[gi];
              const mx = (hub.x + n.x) / 2;
              const my = (hub.y + n.y) / 2;
              const qx = mx + (CX - mx) * 0.3;
              const qy = my + (CY - my) * 0.3;
              const dim = active !== null && active !== gi;
              return (
                <path
                  key={"c-" + n.slug}
                  d={`M${hub.x},${hub.y} Q${qx},${qy} ${n.x},${n.y}`}
                  fill="none"
                  stroke={active === gi ? "var(--blue-hover)" : "var(--line-strong)"}
                  strokeWidth={active === gi ? 1.4 : 1}
                  opacity={dim ? 0.1 : active === gi ? 0.8 : 0.4}
                  className={loaded ? "cg-line" : ""}
                  style={{ transition: "opacity 300ms var(--ease-out), stroke 300ms" }}
                />
              );
            })
          )}

          {/* Spokes core→hub */}
          {HUBS.map((h, i) => {
            const dim = active !== null && active !== i;
            return (
              <line
                key={"s-" + i}
                x1={CX} y1={CY} x2={h.x} y2={h.y}
                stroke={active === i ? "var(--blue-hover)" : "var(--line-strong)"}
                strokeWidth={active === i ? 1.4 : 1}
                opacity={dim ? 0.12 : 0.5}
                className={loaded ? "cg-line" : ""}
                style={{ transition: "opacity 300ms var(--ease-out), stroke 300ms" }}
              />
            );
          })}

          {/* Core */}
          <g>
            <circle cx={CX} cy={CY} r={46} fill="var(--surface-raised)" stroke="var(--line-strong)" strokeWidth="1" />
            <circle cx={CX} cy={CY} r={46} fill="none" stroke="var(--blue)" strokeOpacity="0.35" strokeWidth="1" className="core-pulse" />
            <text x={CX} y={CY - 4} textAnchor="middle" dominantBaseline="middle"
              fontSize="17" fontWeight="600" letterSpacing="-0.02em" fill="var(--text-hi)">
              Imaginars
            </text>
            <text x={CX} y={CY + 15} textAnchor="middle" fontSize="8.5" fontFamily="var(--font-mono-stack, monospace)"
              letterSpacing="0.22em" fill="var(--text-subtle)">
              SYSTEM
            </text>
          </g>

          {/* Hubs + labels */}
          {HUBS.map((h, i) => {
            const on = active === null || active === i;
            const p = pillars[i];
            const lx = h.x + (h.x > CX ? 16 : h.x < CX ? -16 : 0);
            const anchor = h.x > CX ? "start" : h.x < CX ? "end" : "middle";
            const ly = h.y < CY ? h.y - 18 : h.y + 26;
            return (
              <g key={"h-" + i}
                 onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
                 style={{ cursor: "pointer" }}>
                <circle cx={h.x} cy={h.y} r={20} fill="transparent" />
                {on && (
                  <circle cx={h.x} cy={h.y} r={15} fill="none" stroke="var(--blue)" strokeOpacity="0.3" strokeWidth="1" />
                )}
                <circle
                  cx={h.x} cy={h.y}
                  r={on ? 8 : 5.5}
                  fill={on ? "var(--blue)" : "var(--surface)"}
                  stroke="var(--blue)"
                  strokeWidth="1.5"
                  opacity={on ? 1 : 0.4}
                  style={{ transition: "all 280ms var(--ease-out)" }}
                />
                <text x={lx} y={ly} textAnchor={anchor}
                  fontSize="11.5" fontWeight="600" letterSpacing="0.08em"
                  fontFamily="var(--font-mono-stack, monospace)"
                  fill={on ? "var(--text-hi)" : "var(--text-subtle)"}
                  style={{ transition: "fill 280ms" }}>
                  {p.title.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Service nodes + labels (smart placement) */}
          {ALL_NODES.map((group, gi) =>
            group.map((n) => {
              const on = active === null || active === gi;
              const above = n.y < CY;
              const ly = above ? n.y - 12 : n.y + 20;
              return (
                <g key={"n-" + n.slug} className={loaded ? "cg-node" : ""}
                   style={{ transitionDelay: `${300 + gi * 90}ms` }}>
                  <circle
                    cx={n.x} cy={n.y} r={on ? 5 : 3.5}
                    fill={active === gi ? "var(--blue-hover)" : "var(--surface-raised)"}
                    stroke={on ? "var(--blue)" : "var(--text-subtle)"}
                    strokeWidth="1.25"
                    opacity={on ? 1 : 0.3}
                    style={{ transition: "all 260ms var(--ease-out)" }}
                  />
                  <text
                    x={n.x} y={ly}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight={active === gi ? 600 : 400}
                    fontFamily="var(--font-mono-stack, monospace)"
                    letterSpacing="0.04em"
                    fill={on ? "var(--text-body)" : "var(--text-subtle)"}
                    opacity={on ? (active === gi ? 1 : 0.85) : 0.35}
                    pointerEvents="none"
                    style={{ transition: "fill 260ms, opacity 260ms" }}
                  >
                    {n.title}
                  </text>
                </g>
              );
            })
          )}

          {/* Interaction hit areas */}
          {ALL_NODES.map((group, gi) =>
            group.map((n) => (
              <circle
                key={"hit-" + n.slug}
                cx={n.x} cy={n.y} r={18}
                fill="transparent"
                onMouseEnter={() => setActive(gi)}
                onMouseLeave={() => setActive(null)}
              />
            ))
          )}
        </svg>

        {/* Accessible overlay links */}
        <div className="absolute inset-0 hidden md:block pointer-events-none">
          {ALL_NODES.map((group, gi) =>
            group.map((n) => (
              <a
                key={"a-" + n.slug}
                href={`/services/${n.slug}`}
                onMouseEnter={() => setActive(gi)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(gi)}
                onBlur={() => setActive(null)}
                className="pointer-events-auto absolute block h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }}
                aria-label={n.title}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer legend */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-[var(--line)] px-6 py-3.5">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {pillars.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === i ? null : i)}
              className="flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer"
              style={{ color: active === null || active === i ? "var(--text-hi)" : "var(--text-subtle)", transition: "color 200ms" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--blue)", opacity: active === null || active === i ? 1 : 0.35 }} />
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase">{p.title}</span>
              <span className="index">{String(allServices.filter((s) => s.pillar === p.slug).length).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <Link href="/services" className="link-line font-mono text-[10px] tracking-[0.12em] uppercase" style={{ color: "var(--text-subtle)" }}>
          All services →
        </Link>
      </div>
    </div>
  );
}
