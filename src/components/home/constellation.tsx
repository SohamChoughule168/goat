"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight, Braces, Clapperboard, Cpu, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { LogoMark } from "@/components/brand/logo";
import { getServicesByPillar, pillars } from "@/content/services";
import { PILLAR_HUES } from "@/lib/forge";

const NODE_POS = [
  { x: 15, y: 24 },
  { x: 75, y: 10 },
  { x: 81, y: 68 },
  { x: 19, y: 77 },
];
const CORE = { x: 47, y: 46 };

const ICONS = [Braces, TrendingUp, Clapperboard, Cpu];

const TOOL_TAGS = [
  ["Next.js", "React Native", "Flutter", "Three.js"],
  ["GA4 + GTM", "Meta Ads", "Search Console", "Semrush"],
  ["Premiere Pro", "After Effects", "Figma", "Photoshop"],
  ["Gemini / Vertex", "Google AI Studio", "n8n", "Apps Script"],
];

export default function CapabilityConstellation() {
  const [active, setActive] = useState(0);
  const [interaction, setInteraction] = useState<"auto" | "hover" | "locked">("auto");
  const panelRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (interaction !== "auto") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setActive((a) => (a + 1) % pillars.length);
    }, 4600);
    return () => window.clearInterval(id);
  }, [interaction]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      panel,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
    );
  }, [active]);

  const lock = () => setInteraction("locked");
  const hoverOn = () => setInteraction((m) => (m === "locked" ? m : "hover"));
  const hoverOff = () => setInteraction((m) => (m === "hover" ? "auto" : m));

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (active + 1) % pillars.length;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (active - 1 + pillars.length) % pillars.length;
    if (next !== null) {
      e.preventDefault();
      lock();
      setActive(next);
      rootRef.current
        ?.querySelector<HTMLElement>(`#ctab-${pillars[next].slug}`)
        ?.focus();
    }
  };

  const pillar = pillars[active];
  const services = getServicesByPillar(pillar.slug);
  const ActiveIcon = ICONS[active];

  return (
    <section className="section-y relative overflow-hidden" data-chapter="capabilities">
      <div className="shell">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal="fade" className="eyebrow mb-4 flex items-center gap-3">
              <span className="text-primary">◆</span> Chapter II — Capabilities
            </p>
            <h2 data-reveal="up" className="display-2 max-w-2xl">
              Four practices.
              <span className="font-serif font-normal italic text-primary"> One system.</span>
            </h2>
            <div className="spectral-line mt-6" aria-hidden="true" />
          </div>
          <p data-reveal="up" className="lede max-w-sm text-sm">
            Hover a node to see how each practice works and what it ships. Every
            capability connects back to the same engineering standard.
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div
            ref={rootRef}
            className="relative mx-auto hidden h-[420px] w-full max-w-[540px] md:block"
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
            onFocus={lock}
            onPointerDown={lock}
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
            >
              {NODE_POS.map((n, i) => (
                <line
                  key={`ln-${i}`}
                  x1={CORE.x}
                  y1={CORE.y}
                  x2={n.x + 6}
                  y2={n.y + 5}
                  pathLength={100}
                  strokeDasharray={100}
                  style={{ stroke: i === active ? PILLAR_HUES[pillars[i].slug] : undefined }}
                  className={`transition-opacity duration-500 ${i === active ? "constellation-line-active" : "constellation-line"}`}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              <ellipse
                cx={CORE.x}
                cy={CORE.y}
                rx={38}
                ry={36}
                fill="none"
                strokeDasharray="3 5"
                className="constellation-orbit"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div
              aria-hidden="true"
              className="absolute left-[47%] top-[46%] -translate-x-1/2 -translate-y-1/2"
              style={{ animation: "core-pulse 3.2s ease-in-out infinite" }}
            >
              <LogoMark className="h-16 w-16 text-foreground" />
              <div className="absolute inset-0 -z-10 rounded-full bg-primary/25 blur-2xl" />
            </div>

            <div role="tablist" aria-label="Practice areas" onKeyDown={onKeyDown}>
              {pillars.map((p, i) => {
                const Icon = ICONS[i];
                const isActive = i === active;
                const hue = PILLAR_HUES[p.slug];
                return (
                  <button
                    key={p.slug}
                    id={`ctab-${p.slug}`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="constellation-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => { lock(); setActive(i); }}
                    onMouseEnter={() => { setInteraction((m) => (m === "locked" ? m : "hover")); setActive(i); }}
                    style={{
                      left: `${NODE_POS[i].x}%`,
                      top: `${NODE_POS[i].y}%`,
                      transform: isActive ? "translate(-50%,-50%) scale(1.06)" : "translate(-50%,-50%)",
                      ...(isActive
                        ? { borderColor: hue, color: hue, boxShadow: `0 0 36px ${hue}59, inset 0 0 16px ${hue}1f` }
                        : {}),
                    }}
                    className={`group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 rounded-full border bg-background/85 px-4 py-2.5 backdrop-blur-md transition-all duration-300 ${
                      isActive ? "" : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="whitespace-nowrap text-sm font-medium">{p.title}</span>
                    <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: isActive ? hue : undefined }}>
                      {p.index}
                    </span>
                  </button>
                );
              })}
            </div>

            <span
              aria-hidden="true"
              className="absolute left-[30%] top-[64%] h-1 w-1 rounded-full bg-primary/70"
              style={{ animation: `core-pulse ${3 + active * 0.4}s ease-in-out infinite` }}
            />
            <span
              aria-hidden="true"
              className="absolute left-[66%] top-[52%] h-1.5 w-1.5 rounded-full bg-chart-2/70"
              style={{ animation: `core-pulse ${3.6 + active * 0.3}s ease-in-out infinite` }}
            />
          </div>

          <div ref={panelRef} id="constellation-panel" role="tabpanel" aria-labelledby={`ctab-${pillar.slug}`}>
            <div className="glass relative overflow-hidden rounded-xl p-7 md:p-9">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${PILLAR_HUES[pillar.slug]}, transparent)` }}
              />
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] tracking-[0.32em]" style={{ color: PILLAR_HUES[pillar.slug] }}>
                  PRACTICE {pillar.index}
                </span>
                <ActiveIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="mt-4 display-3">{pillar.title}</h3>
              <p className="mt-1 font-serif text-base italic text-muted-foreground">{pillar.kicker}</p>
              <p className="lede mt-4 text-sm">{pillar.description}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {services.slice(0, 4).map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}` as Route}
                      className="inline-block rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
                {services.length > 4 && (
                  <li className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground">
                    +{services.length - 4} more
                  </li>
                )}
              </ul>

              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {TOOL_TAGS[active].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {services.length} services
                </span>
                <Link
                  href={`/services/${pillar.slug}` as Route}
                  className="link-line inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                  data-cursor="Explore"
                >
                  Explore practice <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="mt-5 flex justify-center gap-3 lg:justify-start" role="presentation">
              {pillars.map((p, i) => (
                <button
                  key={`dot-${p.slug}`}
                  onClick={() => { lock(); setActive(i); }}
                  aria-label={`Show practice ${p.title}`}
                  style={{ color: PILLAR_HUES[p.slug] }}
                  className={`transition-all duration-300 ${
                    i === active ? "scale-125" : "opacity-40 hover:opacity-90"
                  }`}
                >
                  ◆
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="snap-x snap-mandatory -mx-5 flex gap-4 overflow-x-auto px-5 pb-4 md:hidden">
          {pillars.map((p, i) => {
            const Icon = ICONS[i];
            const list = getServicesByPillar(p.slug);
            return (
              <article
                key={p.slug}
                className="w-[82vw] max-w-sm shrink-0 snap-center rounded-xl border border-border bg-card/50 p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-primary">{p.index}</span>
                  <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-lg font-medium">{p.title}</h3>
                <p className="mt-1 font-serif text-sm italic text-muted-foreground">{p.kicker}</p>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {list.length} services
                </p>
                <Link
                  href={`/services/${p.slug}` as Route}
                  className="link-line mt-4 inline-flex items-center gap-1.5 text-sm text-primary"
                >
                  Explore <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
