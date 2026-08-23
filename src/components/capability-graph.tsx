"use client";

import { useEffect, useRef, useState } from "react";
import { allServices, pillars } from "@/content/services";

const CX = 480;
const CY = 340;
const HUB_R = 168;
const NODE_R = 300;

interface Node {
  slug: string;
  title: string;
  x: number;
  y: number;
  pillarIndex: number;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function buildNodes(): Node[][] {
  return pillars.map((pillar, pi) => {
    const hubAngle = pi * 90;
    const kids = allServices.filter((s) => s.pillar === pillar.slug);
    const spread = 64;
    const step = kids.length > 1 ? spread / (kids.length - 1) : 0;
    const baseAngle = hubAngle - spread / 2;
    return kids.map((s, i) => {
      const angle = baseAngle + i * step;
      const [x, y] = polar(CX, CY, NODE_R, angle);
      return { slug: s.slug, title: s.title, x: Math.round(x), y: Math.round(y), pillarIndex: pi };
    });
  });
}

const HUBS = pillars.map((_, pi) => {
  const [x, y] = polar(CX, CY, HUB_R, pi * 90);
  return { x: Math.round(x), y: Math.round(y) };
});

const ALL_NODES = buildNodes();

export default function CapabilityGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const [activePillar, setActivePillar] = useState<number | null>(null);
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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative mx-auto max-w-[960px]" data-lines>
      {/* Screen-reader accessible list */}
      <ul className="sr-only">
        {ALL_NODES.flat().map((n) => (
          <li key={n.slug}>
            <a href={`/services/${n.slug}`}>{n.title}</a>
          </li>
        ))}
      </ul>

      {/* Visual graph */}
      <svg viewBox="0 0 960 720" aria-hidden="true" className="w-full">
        {/* Connectors */}
        {ALL_NODES.map((group, gi) =>
          group.map((n) => {
            const hub = HUBS[gi];
            const mx = (hub.x + n.x) / 2;
            const my = (hub.y + n.y) / 2;
            const cx = mx + (CX - mx) * 0.4;
            const cy = my + (CY - my) * 0.4;
            const isActive = activePillar === null || activePillar === gi;
            return (
              <path
                key={"c-" + n.slug}
                d={`M${hub.x},${hub.y} Q${cx},${cy} ${n.x},${n.y}`}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="1"
                opacity={isActive ? 0.6 : 0.15}
                className={
                  loaded ? "cg-line" : ""
                }
                style={{
                  strokeDasharray: 600,
                  strokeDashoffset: loaded ? 0 : 600,
                  transition: `stroke-dashoffset 900ms var(--ease-decel) ${gi * 40}ms, opacity 300ms`,
                }}
              />
            );
          })
        )}

        {/* Hub circles */}
        {HUBS.map((h, i) => (
          <circle
            key={"h-" + i}
            cx={h.x}
            cy={h.y}
            r={activePillar === null || activePillar === i ? 7 : 5}
            fill="var(--color-accent)"
            opacity={activePillar === null || activePillar === i ? 1 : 0.3}
            style={{ transition: "all 300ms var(--ease-decel)" }}
          />
        ))}

        {/* Centre wordmark */}
        <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle"
          fontSize={20} fontWeight={600} fill="var(--color-text)" fontFamily="var(--font-sans)">
          Imaginars
        </text>

        {/* Service nodes + labels */}
        {ALL_NODES.map((group, gi) =>
          group.map((n) => {
            const isActive = activePillar === null || activePillar === gi;
            return (
              <g key={"n-" + n.slug}>
                <circle cx={n.x} cy={n.y} r={4.5}
                  fill={isActive ? "var(--color-accent)" : "var(--color-surface)"}
                  stroke="var(--color-border-interactive)"
                  strokeWidth={1.5}
                  opacity={isActive ? 1 : 0.35}
                  style={{ transition: "all 300ms var(--ease-decel)" }}
                />
                <text x={n.x} y={n.y - 12} textAnchor="middle" fontSize={11}
                  fontFamily="var(--font-mono)" letterSpacing="0.08em"
                  fill={isActive ? "var(--color-text)" : "var(--color-text-subtle)"}
                  opacity={isActive ? 1 : 0}
                  style={{ transition: "opacity 300ms" }}>
                  {n.title}
                </text>
              </g>
            );
          })
        )}
      </svg>

      {/* Accessible links overlay */}
      <div className="absolute inset-0 hidden md:block" aria-hidden="true">
        {ALL_NODES.map((group, gi) =>
          group.map((n) => (
            <a
              key={"a-" + n.slug}
              href={`/services/${n.slug}`}
              data-cursor="View"
              onMouseEnter={() => setActivePillar(gi)}
              onMouseLeave={() => setActivePillar(null)}
              onFocus={() => setActivePillar(gi)}
              onBlur={() => setActivePillar(null)}
              className="absolute block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ left: `${(n.x / 960) * 100}%`, top: `${(n.y / 720) * 100}%` }}
              tabIndex={0}
              aria-label={n.title}
            />
          ))
        )}
      </div>
    </div>
  );
}
