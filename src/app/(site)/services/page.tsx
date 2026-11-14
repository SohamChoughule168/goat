import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import PillarMotif from "@/components/services/pillar-motif";
import HeroLedger from "@/components/editorial/hero-ledger";
import NectarlineWorld from "@/components/three/NectarlineWorld";
import { FooterCTA } from "@/components/home/final-cta";
import { getServicesByPillar, pillars } from "@/content/services";

export const metadata: Metadata = createMetadata({
  title: "Services — web, mobile, AI and growth",
  description:
    "Eighteen services across four practices: digital product builds, performance marketing, brand and content, and AI enablement. Fixed quotes, shipped fast.",
  path: "/services",
});

const SYSTEM_LAYERS = [
  {
    title: "Foundation",
    copy:
      "Course and fee pages that answer the questions parents actually ask: syllabus, timings, faculty, results, location, and what it costs. If the basics are missing, no amount of advertising fixes it.",
    tags: ["Course architecture", "Fee clarity", "Local SEO"],
    meta: "Weeks 1–2 / Foundation",
  },
  {
    title: "Public surface",
    copy:
      "A fast website, a complete Google Business profile, and photographs that look like the classroom a parent will actually walk into. Consistency here is what makes a small institute feel established.",
    tags: ["Website", "Google Business", "Photography"],
    meta: "Weeks 2–4 / Visibility",
  },
  {
    title: "Conversion",
    copy:
      "Course-specific enquiry forms, WhatsApp routing, and a follow-up record so no parent waits three days for a call back. Every enquiry has an owner and a next action.",
    tags: ["Landing pages", "WhatsApp", "Lead tracking"],
    meta: "Weeks 3–5 / Enquiry",
  },
  {
    title: "Operations",
    copy:
      "Portals, online tests, fee collection and broadcasts that remove repeated admin instead of adding another dashboard. Built one module at a time, only when the institute is ready to use it.",
    tags: ["Portal", "Tests", "Payments"],
    meta: "Ongoing / Operations",
  },
];

const STANDARDS = [
  {
    index: "01",
    title: "A scope you can hold us to.",
    copy:
      "Deliverables, timeline and payment milestones are agreed in writing before kickoff. If something falls outside that scope, it is quoted separately — never quietly absorbed into the invoice.",
    note: "Fixed in writing",
  },
  {
    index: "02",
    title: "One accountable owner.",
    copy:
      "You get a named point of contact who can answer for strategy, build and handover. No passing between departments, no account manager who disappears after the pitch.",
    note: "One thread",
  },
  {
    index: "03",
    title: "No invisible work.",
    copy:
      "A weekly progress note, a staging link you can open at any time, and a decision record for anything that changes direction. You should never have to ask what is happening.",
    note: "Everything documented",
  },
];

const TEASER_FAQS = [
  {
    q: "Can we start with one service?",
    a: "Yes. Many clients begin with a website or a single campaign, then add modules once the foundation is working. Starting narrow is usually the cheaper way to test fit.",
  },
  {
    q: "Do you work with institutes outside Mumbai?",
    a: "Yes. We are based in Mumbai and work remotely across India and internationally, with scheduled calls and written updates.",
  },
  {
    q: "How do you price a custom requirement?",
    a: "We map the requirement to the closest package or module, then quote the difference in writing. If the fit is poor, we will say so before you spend anything.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell page-hero-grid">
          <div className="page-hero-copy">
            <p data-reveal="fade" className="eyebrow">
              Capabilities · Four practices
            </p>
            <h1 data-reveal="up" className="display-1 mt-5">
              The website is the start.
              <span className="font-serif font-normal italic text-primary">
                {" "}
                The business is the brief.
              </span>
            </h1>
            <p data-reveal="up" data-reveal-delay="80" className="lede">
              Eighteen services, four practices, one accountable team. Start with any single
              service or combine them into an end-to-end engagement — the scope is yours to set.
            </p>
            <div className="page-hero-actions" data-reveal="up" data-reveal-delay="140">
              <Link href="/pricing#builder" className="btn btn-primary">
                Configure a package
              </Link>
              <Link href="/work" className="btn btn-secondary">
                See solution blueprints
              </Link>
            </div>
            <p className="page-hero-note" data-reveal="fade" data-reveal-delay="200">
              <span>Kanjur Marg, Mumbai</span>
              <span>Remote across India</span>
              <span>Reply in one business day</span>
            </p>
          </div>

          <HeroLedger
            eyebrow="Studio index / 2026"
            value="18"
            title="services. Four practices. One accountable team."
            rows={[
              { label: "Practices", value: "Build · Grow · Content · Enable" },
              { label: "Entry point", value: "Single service or end-to-end" },
              { label: "Engagement", value: "Scope → Execute → Hand over" },
              { label: "Public proof", value: "PRV Financial — verified" },
            ]}
            footer="Mumbai · Replies within one business day"
            slip="04 / 18"
          />
        </div>
      </section>

      <section className="section-y border-t border-[var(--rule)]" aria-labelledby="connected-system">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-end">
            <div data-reveal="up">
              <p className="eyebrow">The connected system</p>
              <h2 id="connected-system" className="display-2 mt-4 max-w-[17ch]">
                Most institutes do not need more tools.
                <em> They need the handoffs to work.</em>
              </h2>
            </div>
            <p className="lede" data-reveal="up" data-reveal-delay="80">
              A website that sends enquiries to a phone nobody checks is not a system. We build
              four layers in order, so each one can carry the next — and so you can stop at any
              layer that already works.
            </p>
          </div>

          <ol className="system-stack mt-12">
            {SYSTEM_LAYERS.map((layer, index) => (
              <li
                key={layer.title}
                className="system-layer"
                data-reveal="up"
                data-reveal-delay={String(index * 70)}
              >
                <div className="system-layer-rail" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i />
                </div>
                <div>
                  <h3>{layer.title}</h3>
                  <p>{layer.copy}</p>
                  <div className="system-layer-tags">
                    {layer.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <p className="system-layer-meta">{layer.meta}</p>
              </li>
            ))}
          </ol>

          <NectarlineWorld />
        </div>
      </section>

      <section className="pb-14" aria-labelledby="institute-stack">
        <div className="shell">
          <div className="grid gap-px border border-border bg-border lg:grid-cols-[1.15fr_1fr]">
            <div className="bg-background p-8 md:p-10">
              <p className="eyebrow mb-4">For coaching &amp; tuition institutes</p>
              <h2 id="institute-stack" className="display-2 max-w-[22ch]">
                Modules priced one at a time. <em>No forced bundle.</em>
              </h2>
              <p className="mt-5 max-w-[54ch] text-sm leading-relaxed text-muted-foreground">
                Add these to a new or existing website. Each module is scoped on its own, with
                the price and dependency stated up front. You do not need all six on day one.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/pricing#builder" className="btn btn-primary">
                  Configure a package
                </Link>
                <Link href="/faq" className="btn btn-secondary">
                  Read module FAQs
                </Link>
              </div>
            </div>
            <ul className="grid gap-px bg-border sm:grid-cols-2">
              {[
                ["Student portal", "₹15,000"],
                ["Online tests", "₹12,000"],
                ["Fee payments", "₹10,000"],
                ["WhatsApp broadcast", "₹5,000 + ₹1,000/mo"],
                ["AI admissions assistant", "₹10,000/mo"],
                ["Multi-branch setup", "₹15,000"],
              ].map(([name, price]) => (
                <li key={name} className="bg-background p-5">
                  <p className="text-sm font-medium">{name}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {price}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <nav
        aria-label="Practice areas"
        className="sticky top-[4.25rem] z-30 border-y border-border bg-background/85 backdrop-blur-md"
      >
        <div className="shell flex flex-wrap gap-2 py-3">
          {pillars.map((p) => (
            <a
              key={p.slug}
              href={`#${p.slug}`}
              className="inline-flex min-h-9 items-center rounded-full border border-border px-3.5 py-1.5 font-mono text-[length:var(--text-micro)] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {p.index} · {p.title}
            </a>
          ))}
        </div>
      </nav>

      {pillars.map((pillar) => {
        const list = getServicesByPillar(pillar.slug);
        return (
          <section
            key={pillar.slug}
            id={pillar.slug}
            className="section-y relative scroll-mt-32 overflow-hidden"
          >
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

      <section className="section-y border-t border-[var(--rule)]" aria-labelledby="operating-standard">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
            <div data-reveal="up">
              <p className="eyebrow">Operating standard</p>
              <h2 id="operating-standard" className="display-2 mt-4 max-w-[18ch]">
                Three promises we can actually keep.
              </h2>
            </div>
            <p className="lede" data-reveal="up" data-reveal-delay="80">
              Craft is subjective. Process does not have to be. These are the working conditions
              on every engagement, whether it is a two-week Starter build or a multi-module
              institute system.
            </p>
          </div>

          <div className="standard-grid mt-12">
            {STANDARDS.map((standard, index) => (
              <article
                key={standard.index}
                className="standard-card"
                data-reveal="up"
                data-reveal-delay={String(index * 80)}
              >
                <span className="index micro">{standard.index}</span>
                <h3>{standard.title}</h3>
                <p>{standard.copy}</p>
                <span className="standard-note">{standard.note}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y border-t border-[var(--rule)]" aria-labelledby="service-questions">
        <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div data-reveal="up">
            <p className="eyebrow">Before you choose</p>
            <h2 id="service-questions" className="display-2 mt-4 max-w-[16ch]">
              The questions we hear first.
            </h2>
            <p className="mt-5 max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
              The full list covers packages, ownership, portals, payments and timelines. If your
              question is not there, send it directly — we answer plainly.
            </p>
            <Link href="/faq" className="btn btn-secondary mt-7">
              Read all FAQs
            </Link>
          </div>

          <div className="border-t border-[var(--rule)]" data-reveal="up" data-reveal-delay="80">
            {TEASER_FAQS.map((item) => (
              <details key={item.q} className="group border-b border-[var(--rule)] py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <span className="font-serif text-xl leading-snug">{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="mt-1 font-mono text-sm text-primary transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <FooterCTA />
    </>
  );
}
