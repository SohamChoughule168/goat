import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Service } from "@/content/services";
import { getPillar, getServicesByPillar } from "@/content/services";

const ENGAGEMENT = [
  {
    title: "Scope",
    detail: "A short discovery cycle produces a fixed scope, timeline and price. No open-ended retainers by default.",
  },
  {
    title: "Execute",
    detail: "Work happens in reviewable increments on staging — you always know where things stand.",
  },
  {
    title: "Measure & hand over",
    detail: "Outcomes are reported against the agreed metrics, then everything is handed to you with documentation.",
  },
];

export default function ServiceView({ service }: { service: Service }) {
  const pillar = getPillar(service.pillar);
  const related = getServicesByPillar(service.pillar)
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  return (
    <>
      <section className="section-y pb-14">
        <div className="shell">
          <Link
            href={`/services/${service.pillar}` as Route}
            className="link-line mb-8 inline-flex items-center gap-2 font-mono text-[length:var(--text-micro)] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {pillar?.title} — practice {pillar?.index}
          </Link>
          <h1 data-reveal="up" className="display-1 max-w-4xl">
            {service.title}
          </h1>
          <p
            data-reveal="up"
            data-reveal-delay="80"
            className="mt-6 max-w-2xl font-serif text-xl italic leading-relaxed text-primary sm:text-2xl"
          >
            {service.tagline}
          </p>
          <p data-reveal="up" data-reveal-delay="140" className="lede mt-6 max-w-2xl">
            {service.description}
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="shell grid gap-12 py-16 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <h2 data-reveal="fade" className="display-3 lg:sticky lg:top-28 lg:self-start">
            What you get
          </h2>
          <ol className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {service.deliverables.map((d, i) => (
              <li key={d} data-reveal="up" data-reveal-delay={String((i % 2) * 50)}>
                <div className="flex h-full items-start gap-4 bg-background p-5 md:p-6">
                  <span className="mt-0.5 font-mono text-xs text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-border bg-[color:var(--surface-1)]">
        <div className="shell grid gap-10 py-16 md:grid-cols-3 md:gap-8">
          {ENGAGEMENT.map((step, i) => (
            <div key={step.title} data-reveal="up" data-reveal-delay={String(i * 60)}>
              <span className="font-mono text-[length:var(--text-micro)] tracking-[0.3em] text-muted-foreground">
                Step {i + 1}
              </span>
              <h2 className="mt-2 display-3">{step.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <h2 data-reveal="fade" className="display-3 lg:sticky lg:top-28 lg:self-start">
            Common questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {service.faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border">
          <div className="shell py-14">
            <p data-reveal="fade" className="eyebrow mb-6">
              Often combined with
            </p>
            <ul className="flex flex-wrap gap-3">
              {related.map((r) => (
                <li key={r.slug} data-reveal="up">
                  <Link
                    href={`/services/${r.slug}` as Route}
                    className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary"
                  >
                    {r.title}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden border-t border-border">
        <div className="hairline-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="shell relative flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
          <div data-reveal="up">
            <h2 className="display-3">Have this problem?</h2>
            <p className="lede mt-2 text-sm">
              Send us the context — you&apos;ll have a scoped answer within one business day.
            </p>
          </div>
          <Link
            data-reveal="up"
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Discuss this service
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}


