import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { caseStudies } from "@/content/work";

export const metadata: Metadata = createMetadata({
  title: "Work — Case Studies With Sources",
  description:
    "Selected engagements with verifiable outcomes. Every case study links to live sites and public delivery records — no invented metrics.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <section className="section-y pb-12">
        <div className="shell">
          <p data-reveal="fade" className="eyebrow mb-5">
            Selected work
          </p>
          <h1 data-reveal="up" className="display-1 max-w-4xl">
            Case studies you can
            <span className="font-serif font-normal italic text-primary"> check.</span>
          </h1>
          <p data-reveal="up" className="lede mt-7">
            We only publish work the client has approved, with claims that trace to a
            public source. If an engagement is under confidentiality, we say so instead
            of inventing a substitute.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="shell space-y-6">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              data-reveal="scale"
              href={`/work/${cs.slug}` as Route}
              className="group block overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 hover:border-primary/40"
            >
              <article className="grid md:grid-cols-[1.15fr_1fr]">
                <div className="relative min-h-56 bg-background p-6 md:min-h-80 md:p-10">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                    {cs.sector} · {cs.year}
                  </span>
                  <p className="mt-8 font-display text-4xl font-medium tracking-tight md:text-5xl">PRV<span className="text-primary">.</span></p><p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">Live since April 2025</p>
                </div>
                <div className="flex flex-col justify-between gap-8 border-t border-border p-8 md:border-l md:border-t-0 md:p-10">
                  <div>
                    <h2 className="display-3">{cs.client}</h2>
                    <p className="lede mt-3 text-sm">{cs.summary}</p>
                  </div>
                  <div className="space-y-4">
                    <ul className="flex flex-wrap gap-2">
                      {cs.services.map((s) => (
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
              </article>
            </Link>
          ))}

          <div
            data-reveal="up"
            className="rounded-xl border border-dashed border-border bg-background/40 p-8 md:p-10"
          >
            <h2 className="display-3">More engagements exist. This page is short by design.</h2>
            <p className="lede mt-4 max-w-2xl text-sm">
              Much of our delivery happens under client confidentiality or as white-label
              work for agencies — and we treat those obligations as absolute. Ask us
              directly and we&apos;ll share anonymised examples and references relevant to
              your project.
            </p>
            <Link
              href="/contact"
              className="link-line mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
            >
              Request references <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

