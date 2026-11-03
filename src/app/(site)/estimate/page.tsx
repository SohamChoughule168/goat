import type { Metadata } from "next";
import Link from "next/link";
import HeroLedger from "@/components/editorial/hero-ledger";
import { createMetadata } from "@/lib/seo";
import { EstimateClient } from "./EstimateClient";

export const metadata: Metadata = createMetadata({
  title: "Scope Estimator — Indicative Website Budget",
  description:
    "Answer four questions and get an indicative price band based on our published package prices. No email required to see the range.",
  path: "/estimate",
});

const COST_DRIVERS = [
  {
    index: "01",
    title: "Scope size.",
    copy:
      "A single landing page and a ten-page marketing site are different builds. Page count, templates, content migration and whether a login exists move the band more than anything else.",
  },
  {
    index: "02",
    title: "Deadline pressure.",
    copy:
      "A flexible timeline lets work run in sequence. An event or admission deadline compresses review cycles and pulls other work forward, which is why the ASAP multiplier exists.",
  },
  {
    index: "03",
    title: "Integrations.",
    copy:
      "Payments, portals, CRM sync and custom modules are scoped after the public site. They are not hidden in a package price, and they are not guessed at here.",
  },
];

const INCLUDED = [
  "Design and build for the agreed pages",
  "Responsive layouts and browser checks",
  "Enquiry form and WhatsApp/contact links",
  "Basic on-page SEO and analytics setup where included",
  "The support window stated on the package",
  "A written scope before work starts",
];

const EXCLUDED = [
  "Domain and hosting fees",
  "Paid advertising or media spend",
  "Photography, video or illustration",
  "Long-form copy beyond the agreed pages",
  "Third-party software subscriptions",
  "Ongoing care after the support window",
];

export default function EstimatePage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell page-hero-grid">
          <div className="page-hero-copy">
            <p data-reveal="fade" className="eyebrow">
              Scope estimator · 2026
            </p>
            <h1 data-reveal="up" className="display-1 mt-5">
              A price band
              <span className="font-serif font-normal italic text-primary"> before the call.</span>
            </h1>
            <p data-reveal="up" data-reveal-delay="80" className="lede">
              Four questions. No email wall. The estimator uses our published package bands and
              adjusts for practice, scope and timeline — so you can budget before anyone asks for
              your phone number.
            </p>
            <div className="page-hero-actions" data-reveal="up" data-reveal-delay="140">
              <a href="#estimator" className="btn btn-primary">
                Start the estimator
              </a>
              <Link href="/pricing" className="btn btn-secondary">
                See published prices
              </Link>
            </div>
            <p className="page-hero-note" data-reveal="fade" data-reveal-delay="200">
              <span>No email required</span>
              <span>No auto-follow-up</span>
              <span>Indicative, not a quote</span>
            </p>
          </div>

          <HeroLedger
            eyebrow="Estimate ledger / inputs"
            value="04"
            title="questions. One honest band."
            rows={[
              { label: "Basis", value: "Published prices" },
              { label: "Adjusts", value: "Practice, scope, time" },
              { label: "Output", value: "Budget band" },
              { label: "Quote", value: "Fixed after scope" },
            ]}
            footer="No email required to see the band"
            slip="Estimate / 04"
          />
        </div>
      </section>

      <section id="estimator" className="section-y scroll-mt-24 border-t border-[var(--rule)]">
        <EstimateClient />
      </section>

      <section className="section-y border-t border-[var(--rule)]" aria-labelledby="cost-drivers">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
            <div data-reveal="up">
              <p className="eyebrow">What moves the band</p>
              <h2 id="cost-drivers" className="display-2 mt-4 max-w-[18ch]">
                Three variables. <em>Nothing mystical.</em>
              </h2>
            </div>
            <p className="lede" data-reveal="up" data-reveal-delay="80">
              Most price confusion comes from comparing package names without comparing scope. These
              are the three inputs that change a real quote.
            </p>
          </div>

          <div className="standard-grid mt-12">
            {COST_DRIVERS.map((driver, index) => (
              <article
                key={driver.index}
                className="standard-card"
                data-reveal="up"
                data-reveal-delay={String(index * 70)}
              >
                <span className="standard-index">{driver.index}</span>
                <h3>{driver.title}</h3>
                <p>{driver.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y border-t border-[var(--rule)]" aria-labelledby="band-boundaries">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
            <div data-reveal="up">
              <p className="eyebrow">Clear boundaries</p>
              <h2 id="band-boundaries" className="display-2 mt-4 max-w-[17ch]">
                What the band <em>includes.</em>
              </h2>
            </div>
            <p className="lede" data-reveal="up" data-reveal-delay="80">
              The estimator covers the public build, not the entire cost of running a business
              online. Here is the line, stated before you ask.
            </p>
          </div>

          <div className="fit-grid mt-12">
            <div data-reveal="up">
              <p className="micro mb-4 text-[var(--accent)]">Inside the band</p>
              <ul className="fit-list">
                {INCLUDED.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div data-reveal="up" data-reveal-delay="80">
              <p className="micro mb-4 text-[var(--ink-3)]">Outside the band</p>
              <ul className="fit-list fit-list-muted">
                {EXCLUDED.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="mt-12 flex flex-col gap-5 border border-[var(--rule)] bg-[var(--paper-2)] p-6 sm:flex-row sm:items-center sm:justify-between"
            data-reveal="up"
          >
            <p className="max-w-[58ch] text-sm leading-relaxed text-[var(--ink-3)]">
              Care plans are monthly and optional. Domain and hosting are quoted separately so you
              can keep them in your own name. If the band looks wrong for your scope, send the brief
              — we will correct it.
            </p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">
                Send the brief
              </Link>
              <Link href="/pricing" className="btn btn-secondary">
                See packages
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
