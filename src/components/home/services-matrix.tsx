"use client";

import Link from "next/link";
import { useState } from "react";
import { getServicesByPillar, pillars } from "@/content/services";

export default function ServicesMatrix() {
  const [active, setActive] = useState(0);
  const pillar = pillars[active];
  const list = getServicesByPillar(pillar.slug);

  return (
    <section className="section-y" aria-label="Practices">
      <div className="container">
        <p className="micro">Capabilities</p>
        <h2 className="mt-3 text-h2 font-semibold tracking-[var(--track-h2)]">
          18 services. Four practices.
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-[280px_1fr]">
          {/* Tab list */}
          <div role="tablist" aria-label="Practice areas" className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-0 lg:border-t lg:border-[var(--line)]" onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              setActive(a => (a + (e.key === "ArrowDown" ? 1 : pillars.length - 1)) % pillars.length);
            }
          }}>
            {pillars.map((p, i) => (
              <button key={p.slug} role="tab" id={`ptab-${p.slug}`}
                aria-selected={i === active} aria-controls={`ppanel-${p.slug}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={"text-left px-4 py-4 border-l-2 transition-colors duration-150 w-full lg:min-w-[240px] " +
                  (i === active
                    ? "border-[color:var(--blue)] text-[color:var(--text-hi)] bg-[color:var(--surface-hover)]"
                    : "border-transparent text-muted-foreground hover:text-foreground")}>
                <span className="index block">{p.index}</span>
                <span className="mt-1 block text-base font-medium">{p.title}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{list.filter(s=>s.pillar===p.slug).length} services</span>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div role="tabpanel" id={`ppanel-${pillar.slug}`} aria-labelledby={`ptab-${pillar.slug}`} className="min-h-[20rem]">
            <p className="micro">{pillar.kicker}</p>
            <p className="mt-3 text-body-lg leading-relaxed">{pillar.description}</p>
            <ul className="mt-8 space-y-1 border-t border-[var(--line)]">
              {list.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}
                    className="group flex items-baseline justify-between gap-4 py-3.5 border-b border-[var(--line)] transition-colors hover:bg-[var(--surface-hover)] px-2 -mx-2 rounded-sm">
                    <span className="text-sm font-medium group-hover:text-foreground">{s.title}</span>
                    <span className="text-xs text-muted-foreground max-w-[40ch] hidden sm:block">{s.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
