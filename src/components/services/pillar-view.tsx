import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import PillarMotif from "@/components/services/pillar-motif";
import { getServicesByPillar, type Pillar } from "@/content/services";

export default function PillarView({ pillar }: { pillar: Pillar }) {
  const list = getServicesByPillar(pillar.slug);
  return (
    <>
      <section className="section-y relative overflow-hidden">
        <span
          className="pointer-events-none absolute -top-10 right-0 select-none font-display text-[26vw] font-medium leading-none text-foreground/[0.04] md:text-[18rem]"
          aria-hidden="true"
        >
          {pillar.index}
        </span>
        <div className="shell relative">
          <p data-reveal="fade" className="eyebrow mb-5">
            Practice {pillar.index} — {pillar.kicker}
          </p>
          <h1 data-reveal="up" className="display-1 max-w-4xl">
            {pillar.title}
            <span className="text-primary">.</span>
          </h1>
          <p data-reveal="up" className="lede mt-7 max-w-2xl">
            {pillar.description}
          </p>
        </div>
      </section>

      <section aria-hidden="true" className="relative overflow-hidden border-y border-border bg-card/20">
        <div className="shell relative py-8 md:py-10">
          <PillarMotif pillar={pillar.slug} className="h-36 md:h-48" />
        </div>
      </section>

      <section className="pb-24">
        <div className="shell">
          <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-2">
            {list.map((service, i) => (
              <li key={service.slug} data-reveal="up" data-reveal-delay={String((i % 2) * 60)}>
                <Link
                  href={`/services/${service.slug}` as Route}
                  className="group flex h-full items-start justify-between gap-6 bg-background p-6 transition-colors duration-300 hover:bg-card md:p-8"
                >
                  <div>
                    <h2 className="text-lg font-medium leading-snug">{service.title}</h2>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {service.tagline}
                    </p>
                  </div>
                  <span
                    className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                    aria-hidden="true"
                  >
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div
            data-reveal="fade"
            className="mt-12 flex flex-wrap items-center gap-5 rounded-xl border border-border bg-card/40 p-7"
          >
            <p className="max-w-md text-sm text-muted-foreground">
              Not sure which service fits? Describe the problem — we&apos;ll map it to the
              smallest engagement that solves it.
            </p>
            <Link
              href="/contact"
              className="link-line ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary"
            >
              Get a recommendation <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

