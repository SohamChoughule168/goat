import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import PillarMotif from "@/components/services/pillar-motif";
import { getServicesByPillar, pillars } from "@/content/services";

export const metadata: Metadata = createMetadata({
  title: "Services — Web, Mobile, AI, Growth & Content",
  description:
    "Eighteen services across four practices: digital product builds, performance marketing, brand and content, and AI enablement. Scoped honestly, shipped fast.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <section className="section-y pb-10">
        <div className="shell">
          <p data-reveal="fade" className="eyebrow mb-5">
            Capabilities
          </p>
          <h1 data-reveal="up" className="display-1 max-w-4xl">
            Everything a business needs to
            <span className="font-serif font-normal italic text-primary"> ship and grow.</span>
          </h1>
          <p data-reveal="up" className="lede mt-7">
            Eighteen services, four practices, one accountable team. Start with any single
            service or combine them into an end-to-end engagement — the scope is yours to set.
          </p>
        </div>
      </section>

      <nav aria-label="Practice areas" className="sticky top-[4.25rem] z-30 border-y border-border bg-background/90 ">
        <div className="shell flex gap-2 overflow-x-auto py-3">
          {pillars.map((p) => (
            <a
              key={p.slug}
              href={`#${p.slug}`}
              className="shrink-0 rounded-full border border-border px-4 py-1.5 font-mono text-[length:var(--text-micro)] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {p.index} · {p.title}
            </a>
          ))}
        </div>
      </nav>

      {pillars.map((pillar) => {
        const list = getServicesByPillar(pillar.slug);
        return (
          <section key={pillar.slug} id={pillar.slug} className="section-y relative scroll-mt-32 overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-[36%] items-center opacity-[0.16] lg:flex"
            >
              <PillarMotif pillar={pillar.slug} className="h-64 w-full" />
            </div>
            <div className="shell relative">
              <header className="mb-10 grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-end">
                <div data-reveal="up">
                  <span className="font-mono text-xs tracking-[0.35em] text-primary">
                    {pillar.index}
                  </span>
                  <h2 className="display-2 mt-2">{pillar.title}</h2>
                  <p className="mt-1 font-serif text-base italic text-muted-foreground">
                    {pillar.kicker}
                  </p>
                </div>
                <p data-reveal="up" data-reveal-delay="80" className="lede md:justify-self-end">
                  {pillar.description}
                </p>
              </header>

              <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-2">
                {list.map((service, i) => (
                  <li key={service.slug} data-reveal="up" data-reveal-delay={String((i % 2) * 60)}>
                    <Link
                      href={`/services/${service.slug}` as Route}
                      className="group flex h-full items-start justify-between gap-6 bg-background p-6 transition-colors duration-300 hover:bg-card md:p-7"
                    >
                      <div>
                        <h3 className="text-lg font-medium leading-snug">{service.title}</h3>
                        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                          {service.tagline}
                        </p>
                      </div>
                      <span
                        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                        aria-hidden="true"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </>
  );
}



