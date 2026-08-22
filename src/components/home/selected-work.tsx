import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/content/work";

export default function SelectedWork() {
  const cs = caseStudies[0];
  if (!cs) return null;

  return (
    <section className="section-y border-t border-border" aria-label="Evidence">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <p className="micro">Evidence</p>
            <h2 className="display-2 mt-4">Named work, verifiable.</h2>
            <p className="lede mt-5 text-sm">
              One case study published means one case study checked. Further
              engagements sit under client confidentiality — ask for references.
            </p>
            <Link
              href="/work"
              className="link-line mt-8 inline-block text-sm font-medium text-[color:var(--text-1)]"
            >
              All case studies
            </Link>
          </div>

          <div className="surface--lit card-interactive p-7 md:p-9">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="font-medium text-[color:var(--text-1)]" style={{ fontSize: "var(--text-h3)" }}>
                {cs.client}
              </h3>
              <p className="micro">
                {cs.sector} · {cs.year}
              </p>
            </div>
            <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
              {cs.summary}
            </p>

            <dl className="mt-6 grid gap-3 border-t border-border pt-5 text-sm">
              {cs.results.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-4">
                  <dt className="micro">{r.label}</dt>
                  <dd className="text-right text-muted-foreground">{r.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
              <ul className="flex flex-wrap gap-2">
                {cs.services.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-border px-3 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {s}
                  </li>
                ))}
              </ul>
              <Link
                href={`/work/${cs.slug}` as Route}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--accent-brand)]"
              >
                Read the case study
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
