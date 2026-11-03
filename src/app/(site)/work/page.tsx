import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CasePlate from "@/components/evidence/case-plate";
import EvidenceHeader from "@/components/evidence/evidence-header";
import { createMetadata } from "@/lib/seo";
import { caseStudies } from "@/content/work";

export const metadata: Metadata = createMetadata({
  title: "Work — Case Studies With Sources",
  description:
    "Selected engagements with verifiable outcomes. One public case study, solution blueprints, and a clear line between proof and possibility.",
  path: "/work",
});

const PROOF_STANDARDS = [
  {
    index: "01",
    title: "Published with permission.",
    copy:
      "Every client name and screenshot on this page has been approved for publication. Nothing is shown because it looks good in a deck.",
    note: "Client-approved",
  },
  {
    index: "02",
    title: "Claims trace to a source.",
    copy:
      "We separate what was delivered from what we hope it achieves. Outcome claims link to the live site or a public delivery record, not a private screenshot.",
    note: "Source-linked",
  },
  {
    index: "03",
    title: "Gaps stay visible.",
    copy:
      "Most of our work is confidential. We say that plainly instead of filling the page with invented logos, borrowed mockups or vague result percentages.",
    note: "No invented proof",
  },
];

const BLUEPRINTS = [
  {
    tier: "Blueprint 01 · Growth",
    name: "The credible institute site",
    href: "/pricing?package=growth#builder",
    problem:
      "A parent lands on the site, cannot tell which batches are running, what they cost, or whether the faculty is real — and leaves for a competitor with clearer answers.",
    includes: [
      "Course and batch pages",
      "Faculty and results proof",
      "Source-tagged enquiry forms",
      "Local SEO foundation",
    ],
    measure:
      "Every enquiry is answered, and you can see which course page produced it.",
  },
  {
    tier: "Blueprint 02 · Pro + modules",
    name: "The student portal",
    href: "/pricing?package=pro#builder",
    problem:
      "The front office answers the same questions every day — timings, results, downloads, fee status — while parents wait on a phone line.",
    includes: [
      "Student accounts and profiles",
      "Results and downloads",
      "Online tests",
      "Fee collection and receipts",
    ],
    measure:
      "Fewer routine calls, and every fee payment leaves a receipt the institute can reconcile.",
  },
  {
    tier: "Blueprint 03 · Starter",
    name: "The local business presence",
    href: "/pricing?package=starter#builder",
    problem:
      "A small business needs to look established online and capture nearby demand, but does not need a platform it will never log into.",
    includes: [
      "Five focused pages",
      "Map and directions",
      "WhatsApp enquiries",
      "Basic on-page SEO",
    ],
    measure:
      "A visitor can judge credibility and make contact within one screen.",
  },
];

const NDA_ITEMS = [
  "Sector and engagement type",
  "Scope and modules delivered",
  "Timeline and handover format",
  "Anonymised delivery artefacts",
  "A call with the person who built it",
];

const CHECKS = [
  {
    title: "The site is live.",
    detail: "prvfinancialservices.com is public and can be opened from this page.",
  },
  {
    title: "The delivery record is public.",
    detail: "The studio published the engagement on its verified LinkedIn page.",
  },
  {
    title: "The timeline is stated.",
    detail: "Shipped April 2025, with formal client appreciation for timeliness.",
  },
  {
    title: "The handover is real.",
    detail: "The client controls the site and the deployment pipeline after launch.",
  },
];

export default function WorkPage() {
  const record = caseStudies[0];

  return (
    <>
      <EvidenceHeader
        index="01"
        label="Work"
        title={
          <>
            Case studies <span className="inst-serif">you can check.</span>
          </>
        }
        lede="We publish work the client has approved, with claims that trace to a public source. One verified case study is worth more than a wall of anonymous logos — so that is what this page leads with."
        meta={[
          { label: "Public records", value: "01" },
          { label: "Last published", value: "April 2025" },
          { label: "Sector", value: "Financial services" },
          { label: "Confidential", value: "NDA on request" },
        ]}
        status="Verified record"
        actions={
          <>
            <a href="#case-record" className="inst-btn">
              Read the record
            </a>
            <Link href="/contact" className="inst-btn inst-btn-ghost">
              Request references
            </Link>
          </>
        }
        note={["Public case study / 01", "Blueprints / 03", "NDA work / on request"]}
      />

      <section
        id="case-record"
        className="inst-section ev-anchor"
        aria-labelledby="case-record-title"
      >
        <div className="inst-shell">
          <div className="ev-section-head">
            <div>
              <p className="inst-label">Verified engagement / 01</p>
              <h2 id="case-record-title" className="inst-h2 mt-4">
                A financial services site, delivered end to end.
              </h2>
            </div>
            <p>
              The only engagement we can currently publish in full: a public website, a live
              client, and a delivery record that can be checked from outside this studio.
            </p>
          </div>

          {record ? (
            <>
              <div className="ev-case">
                <figure className="ev-case-plate">
                  <CasePlate />
                  <figcaption>
                    <span>Plate 01 — Delivery section</span>
                    <span>PRV / 2025 / Verified</span>
                  </figcaption>
                </figure>

                <div className="ev-case-file">
                  <div className="ev-case-file-top">
                    <span className="ev-micro">Case file / 01</span>
                    <span className="inst-tag">Verified</span>
                  </div>

                  <h3 className="ev-case-title">{record.client}</h3>
                  <p className="ev-case-meta">
                    {record.sector} · {record.year} · {record.services.join(" / ")}
                  </p>
                  <p className="ev-case-summary">{record.summary}</p>

                  <dl className="ev-case-results">
                    {record.results.map((result) => (
                      <div key={result.label}>
                        <dt>{result.label}</dt>
                        <dd>
                          {result.value}
                          {result.note ? (
                            <span className="ev-case-note">{result.note}</span>
                          ) : null}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="ev-case-tags">
                    {record.stack.map((item) => (
                      <span key={item} className="inst-tag">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="ev-case-links">
                    <Link
                      href={`/work/${record.slug}`}
                      className="inst-link"
                    >
                      Read the full case study
                      <ArrowUpRight aria-hidden className="inst-link-arrow h-3.5 w-3.5" />
                    </Link>
                    {record.proof.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inst-link"
                      >
                        {link.label}
                        <ArrowUpRight aria-hidden className="inst-link-arrow h-3.5 w-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ev-case-notes">
                <div>
                  <h3>The challenge</h3>
                  <p>{record.challenge}</p>
                </div>
                <div>
                  <h3>The approach</h3>
                  <ol>
                    {record.approach.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="ev-exec">
                {record.execution.map((step, index) => (
                  <article key={step.title}>
                    <span className="inst-num">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{step.title}</h3>
                    <p>{step.detail}</p>
                  </article>
                ))}
              </div>

              <div className="ev-check">
                <div>
                  <p className="inst-label">Check ledger</p>
                  <p className="inst-body mt-4 text-[0.9375rem]">{record.proof.note}</p>
                  <p className="inst-body mt-3 text-[0.8125rem]">
                    This record claims delivery, not business outcomes. We publish what the client
                    approved: the build, the timeline and the handover.
                  </p>
                  <div className="ev-case-links">
                    {record.proof.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inst-link"
                      >
                        {link.label}
                        <ArrowUpRight aria-hidden className="inst-link-arrow h-3.5 w-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
                <ul>
                  {CHECKS.map((check, index) => (
                    <li key={check.title}>
                      <span className="inst-num">{String(index + 1).padStart(2, "0")}</span>
                      <span>
                        <strong>{check.title}</strong>
                        {check.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section className="inst-section" aria-labelledby="proof-standard">
        <div className="inst-shell">
          <div className="ev-section-head">
            <div>
              <p className="inst-label">The proof standard</p>
              <h2 id="proof-standard" className="inst-h2 mt-4">
                What gets published, and what does not.
              </h2>
            </div>
            <p>
              A portfolio is an argument, not a gallery. These are the rules we use to decide
              whether an engagement earns a place on this page.
            </p>
          </div>

          <div className="ev-rules">
            {PROOF_STANDARDS.map((standard) => (
              <article key={standard.index} className="ev-rule">
                <span className="inst-num">{standard.index}</span>
                <h3>{standard.title}</h3>
                <p>{standard.copy}</p>
                <span className="ev-rule-note">{standard.note}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="inst-section" aria-labelledby="blueprints">
        <div className="inst-shell">
          <div className="ev-section-head">
            <div>
              <p className="inst-label">Solution blueprints</p>
              <h2 id="blueprints" className="inst-h2 mt-4">
                The three builds we are asked for <span className="inst-serif">most often.</span>
              </h2>
            </div>
            <p>
              These are not case studies. They are starting points drawn from repeat engagements,
              with the modules and outcome measures we recommend before anyone opens a design
              file. Each one starts from a real operational problem.
            </p>
          </div>

          <div className="ev-blueprints">
            {BLUEPRINTS.map((blueprint) => (
              <Link key={blueprint.name} href={blueprint.href} className="ev-blueprint">
                <div className="ev-blueprint-meta">
                  <span>{blueprint.tier}</span>
                  <span>Illustrative</span>
                </div>
                <h3>{blueprint.name}</h3>
                <p>{blueprint.problem}</p>
                <ul>
                  {blueprint.includes.map((item) => (
                    <li key={item}>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="ev-blueprint-signal">{blueprint.measure}</p>
                <span className="ev-blueprint-link">
                  Configure this build <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="inst-section" aria-labelledby="nda-work">
        <div className="inst-shell">
          <div className="ev-cta">
            <div>
              <p className="inst-label">Beyond this page</p>
              <h2 id="nda-work" className="inst-h2 mt-4">
                More work exists. Most of it is under NDA.
              </h2>
              <p className="mt-5">
                We can usually share the shape of a confidential engagement — the sector, the
                scope, the timeline and the artefacts delivered — without naming the client or
                exposing their data. If you need more than that, ask and we will tell you what is
                possible.
              </p>
              <div className="ev-actions">
                <Link href="/contact" className="inst-btn">
                  Request anonymised examples
                </Link>
                <Link href="/process" className="inst-btn inst-btn-ghost">
                  See how we work
                </Link>
              </div>
            </div>
            <ul className="ev-nda-list">
              {NDA_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
