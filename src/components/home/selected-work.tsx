"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/content/work";

const BARS = [34, 48, 42, 60, 55, 72, 66, 84, 78, 92, 88, 100];

export default function SelectedWork() {
  const ref = useRef<HTMLElement>(null);
  const cs = caseStudies[0];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("is-in"); io.disconnect(); } },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!cs) return null;

  return (
    <section ref={ref} className="section-y border-t border-[var(--line)]" aria-label="Evidence">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16 items-center">

          {/* LEFT — narrative */}
          <div>
            <p className="micro"><span className="kicker-rule" aria-hidden="true" />Evidence</p>
            <h2 className="mt-4 font-semibold" style={{ fontSize: "var(--text-h2)", lineHeight: 1.08, letterSpacing: "-0.02em", color: "var(--text-hi)" }}>
              Named work,<br />verifiable.
            </h2>
            <p className="lede mt-5 text-sm max-w-[44ch]">
              One case study published means one case study checked. Further
              engagements sit under client confidentiality — ask for references.
            </p>
            <Link href="/work" className="link-line mt-8 inline-block text-sm font-medium" style={{ color: "var(--text-hi)" }}>
              All case studies
            </Link>
          </div>

          {/* RIGHT — browser artifact */}
          <Link href={`/work/${cs.slug}` as Route} className="group block" data-cursor="Read">
            <div className="artifact overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
              {/* Chrome bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--line)] bg-[var(--surface-sunken)]">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="mock-dot" style={{ background: "var(--text-subtle)", opacity: 0.35 }} />
                  <span className="mock-dot" style={{ background: "var(--text-subtle)", opacity: 0.35 }} />
                  <span className="mock-dot" style={{ background: "var(--text-subtle)", opacity: 0.35 }} />
                </span>
                <span className="mx-auto flex items-center gap-2 rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1 font-mono text-[10px]" style={{ color: "var(--text-subtle)" }}>
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <rect x="2" y="5" width="8" height="6" rx="1.5" /><path d="M4 5V3.8a2.2 2.2 0 014.4 0V5" />
                  </svg>
                  prv-finserv · dashboard
                </span>
                <span className="w-[3.25rem]" aria-hidden="true" />
              </div>

              {/* Dashboard body */}
              <div className="p-5 md:p-6 bg-[var(--surface)]">
                {/* Metric row */}
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {cs.results.slice(0, 3).map((r, i) => (
                    <div key={r.label} className="rounded-lg border border-[var(--line)] p-3.5 md:p-4"
                      style={{ transitionDelay: `${i * 90}ms` }}>
                      <p className="micro" style={{ fontSize: "0.5625rem", letterSpacing: "0.12em" }}>{r.label}</p>
                      <p className="mt-1.5 font-mono text-base md:text-xl font-medium tabular-nums" style={{ color: i === 2 ? "var(--green)" : "var(--text-hi)" }}>
                        {r.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="mt-4 rounded-lg border border-[var(--line)] p-4">
                  <div className="flex items-center justify-between">
                    <p className="micro" style={{ fontSize: "0.5625rem", letterSpacing: "0.12em" }}>Organic sessions · 12 mo</p>
                    <span className="flex items-center gap-1.5 font-mono text-[10px]" style={{ color: "var(--green)" }}>
                      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--green)" }} />
                      LIVE
                    </span>
                  </div>
                  <div className="mt-3 flex h-24 items-end gap-1.5 md:h-28" aria-hidden="true">
                    {BARS.map((v, i) => (
                      <div key={i} className="spark-bar flex-1 rounded-sm"
                        style={{
                          height: `${v}%`,
                          background: i >= BARS.length - 3
                            ? "linear-gradient(180deg, var(--blue-hover), var(--blue))"
                            : "color-mix(in oklab, var(--blue) 42%, transparent)",
                          transitionDelay: `${i * 45}ms`,
                        }} />
                    ))}
                  </div>
                </div>

                {/* Footer strip */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
                    {cs.services.map((s) => (
                      <li key={s} className="rounded-full border border-[var(--line-strong)] px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em]" style={{ color: "var(--text-subtle)" }}>
                        {s}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--blue-hover)" }}>
                    Read the case study
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </div>

            {/* Caption */}
            <p className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-semibold text-[0.9375rem]" style={{ color: "var(--text-hi)" }}>{cs.client}</span>
              <span className="micro">{cs.sector} · {cs.year}</span>
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
