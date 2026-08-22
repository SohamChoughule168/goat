import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { getServicesByPillar, pillars } from "@/content/services";

export default function Pillars() {
  return (
    <section className="section-y">
      <div className="shell">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal="fade" className="eyebrow mb-4">
              What we do
            </p>
            <h2 data-reveal="up" className="display-2 max-w-2xl">
              Four practices. One standard.
            </h2>
          </div>
          <Link
            data-reveal="up"
            href="/services"
            className="link-line hidden shrink-0 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground md:inline-flex"
          >
            All 18 services <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {pillars.map((p, i) => {
            const count = getServicesByPillar(p.slug).length;
            return (
              <li key={p.slug} data-reveal="up" data-reveal-delay={String(i * 70)}>
                <Link
                  href={`/services/${p.slug}` as Route}
                  className="group relative flex h-full flex-col justify-between gap-10 bg-background p-7 transition-colors duration-300 hover:bg-card md:p-9"
                >
                  <div>
                    <span className="font-mono text-[11px] tracking-[0.3em] text-primary">
                      {p.index}
                    </span>
                    <h3 className="mt-3 display-3">{p.title}</h3>
                    <p className="mt-1 font-serif text-sm italic text-muted-foreground">
                      {p.kicker}
                    </p>
                    <p className="lede mt-4 max-w-md text-sm">{p.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {count} services
                    </span>
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                      aria-hidden="true"
                    >
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/services"
          className="link-line mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground sm:hidden"
        >
          All 18 services <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
