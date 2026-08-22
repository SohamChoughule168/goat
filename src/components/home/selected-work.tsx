import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import DeviceScene from "@/components/work/device-scene";
import { caseStudies } from "@/content/work";

export default function SelectedWork() {
  const featured = caseStudies[0];
  if (!featured) return null;

  return (
    <section className="section-y border-t border-border">
      <div className="shell">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal="fade" className="eyebrow mb-4 flex items-center gap-3"><span className="text-primary">◆</span> Chapter III — Selected work</p>
            <h2 data-reveal="up" className="display-2 max-w-2xl">
              Proof beats promises.
            </h2>
          </div>
          <Link
            data-reveal="up"
            href="/work"
            className="link-line hidden shrink-0 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground md:inline-flex"
          >
            All case studies <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <Link
          data-reveal="scale"
          href={`/work/${featured.slug}` as Route}
          data-cursor="Read case"
          className="group block overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 hover:border-primary/40 sheen"
        >
          <div className="relative grid md:grid-cols-[1.15fr_1fr]">
            <div className="hairline-grid relative bg-background p-7 md:p-10">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/25 blur-[100px]" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                {featured.sector} · {featured.year}
              </span>
              <DeviceScene variant="compact" className="mt-6" />
            </div>
            <div className="flex flex-col justify-between gap-8 border-t border-border bg-card p-8 md:border-l md:border-t-0 md:p-10">
              <div>
                <h3 className="display-3">{featured.client}</h3>
                <p className="lede mt-3 text-sm">{featured.summary}</p>
              </div>
              <div className="space-y-4">
                <ul className="flex flex-wrap gap-2">
                  {featured.services.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Read the case study
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>
          </div>
        </Link>

        <p
          data-reveal="fade"
          className="mt-6 flex flex-wrap items-baseline gap-x-2 text-sm text-muted-foreground"
        >
          Further engagements are covered by client confidentiality —{" "}
          <Link href="/contact" className="link-line text-foreground">
            ask us for relevant references
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

