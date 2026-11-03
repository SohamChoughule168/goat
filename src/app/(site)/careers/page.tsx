import type { Metadata } from "next";
import Link from "next/link";
import HeroLedger from "@/components/editorial/hero-ledger";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createMetadata({
  title: "Careers — Build With a Small Senior Team",
  description:
    "Speculative applications are open for senior builders, designers and growth practitioners. How we hire, what we look for, and how to send your work.",
  path: "/careers",
});

const TRACKS = [
  {
    title: "Web & application engineering",
    type: "Senior / contract",
    copy: "You can take a design file or a rough brief and ship a fast, accessible, maintainable build. You are comfortable owning deployment and explaining trade-offs in plain language.",
    signals: ["Next.js or equivalent", "Performance and accessibility judgement", "Client-facing communication"],
  },
  {
    title: "Product & interface design",
    type: "Senior / contract",
    copy: "You design for real content, not placeholder lorem ipsum. You can move between a marketing page and a portal, and you leave behind a system another designer can extend.",
    signals: ["Type and layout craft", "Design systems in production", "Comfort with constraint"],
  },
  {
    title: "Growth & content",
    type: "Project-based",
    copy: "You can connect search, ads and enquiries without hiding behind vanity metrics. You write clearly, test honestly and explain what you would stop doing.",
    signals: ["Local SEO and analytics", "Copy that sounds human", "Reporting without theatre"],
  },
];

const HIRING_STEPS = [
  {
    n: "01",
    title: "A note about your work",
    copy: "Send a portfolio link, the practice you work in, and one sentence about why this studio. No cover-letter template needed.",
  },
  {
    n: "02",
    title: "A paid or scoped exercise",
    copy: "For shortlisted candidates, a small, realistic exercise with a defined time box. We pay for substantive work and never ask for free speculative campaigns.",
  },
  {
    n: "03",
    title: "A conversation about how you work",
    copy: "We review the exercise together, talk through decisions and constraints, and answer your questions about the studio.",
  },
  {
    n: "04",
    title: "A trial project",
    copy: "Most collaborations start with one scoped project. Both sides learn more in three weeks of real work than in three rounds of interviews.",
  },
];

const MAILTO = `mailto:${site.email}?subject=Speculative%20application&body=Practice%3A%0APortfolio%3A%0AOne%20sentence%20on%20why%20Imaginars%3A%0A`;

export default function CareersPage() {
  return (
    <div>
      <section className="page-hero">
        <div className="shell page-hero-grid">
          <div className="page-hero-copy">
            <p data-reveal="fade" className="eyebrow">
              Careers · the short list
            </p>
            <h1 data-reveal="up" className="display-1 mt-5">
              Small team.
              <span className="font-serif font-normal italic text-primary"> Real work. No theatre.</span>
            </h1>
            <p data-reveal="up" data-reveal-delay="80" className="lede">
              We hire slowly and deliberately when the workload demands it. There is no open
              full-time role today, but we keep a short list of senior practitioners for the next
              project that needs them.
            </p>
            <div className="page-hero-actions" data-reveal="up" data-reveal-delay="140">
              <a href={MAILTO} className="btn btn-primary">
                Send a speculative note
              </a>
              <Link href="/about" className="btn btn-secondary">
                How the studio works
              </Link>
            </div>
            <p className="page-hero-note" data-reveal="fade" data-reveal-delay="200">
              <span>No open full-time role</span>
              <span>Senior / contract</span>
              <span>Reply within a week</span>
            </p>
          </div>

          <HeroLedger
            eyebrow="Hiring ledger / steps"
            value="04"
            title="steps. No gauntlet."
            rows={[
              { label: "Note", value: "Portfolio + practice" },
              { label: "Exercise", value: "Small, paid, time-boxed" },
              { label: "Conversation", value: "Decisions, not trivia" },
              { label: "Trial", value: "One scoped project" },
            ]}
            footer="No free speculative campaigns"
            slip="Careers / 04"
          />
        </div>
      </section>

      <section className="border-t border-[var(--rule)]" aria-labelledby="tracks">
        <div className="shell py-16">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.6fr] md:items-end">
            <p className="eyebrow">Open tracks</p>
            <div>
              <h2 id="tracks" className="display-2 max-w-[26ch]">
                The work we <em>keep looking for.</em>
              </h2>
              <p className="mt-5 max-w-[58ch] text-sm leading-relaxed text-[var(--ink-3)]">
                These are not job listings with a start date. They are the disciplines we
                bring in per project, and the bar we hold when we do.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-px border border-[var(--rule)] bg-[var(--rule)] lg:grid-cols-3">
            {TRACKS.map((track) => (
              <article key={track.title} className="flex flex-col bg-[var(--paper)] p-7">
                <p className="micro text-[var(--accent)]">{track.type}</p>
                <h3 className="display-3 mt-3">{track.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--ink-3)]">{track.copy}</p>
                <ul className="mt-6 space-y-2 border-t border-[var(--rule)] pt-5 text-sm">
                  {track.signals.map((signal) => (
                    <li key={signal} className="flex items-start gap-2">
                      <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                      {signal}
                    </li>
                  ))}
                </ul>
                <a
                  href={`${MAILTO}${encodeURIComponent(`\nTrack: ${track.title}`)}`}
                  className="link-line mt-5 inline-block text-sm font-medium text-[var(--accent)]"
                >
                  Apply for this track →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--rule)]" aria-labelledby="hiring">
        <div className="shell grid gap-12 py-16 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-4">How we hire</p>
            <h2 id="hiring" className="display-2">
              Four steps, <em>no gauntlet.</em>
            </h2>
            <p className="mt-5 max-w-[42ch] text-sm leading-relaxed text-[var(--ink-3)]">
              We optimise for mutual evidence, not interview stamina. If the fit is wrong,
              we say so quickly and explain why.
            </p>
          </div>
          <ol>
            {HIRING_STEPS.map((step) => (
              <li key={step.n} className="grid gap-2 border-t border-[var(--rule)] py-6 first:border-t-0 first:pt-0 sm:grid-cols-[3rem_1fr] sm:gap-5">
                <span className="font-mono text-sm text-[var(--accent)]">{step.n}</span>
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-3)]">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-[var(--rule)]">
        <div className="shell grid gap-10 py-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow mb-4">What you can expect</p>
            <h2 className="display-3">Straight answers about the deal.</h2>
          </div>
          <dl className="space-y-0">
            {[
              ["Scope before hours", "You will know what the project includes and what it pays before you start."],
              ["Senior contact", "You talk to the person making the decisions, not an account layer."],
              ["Credit where due", "Public work carries the people who made it, unless the client requires otherwise."],
              ["No performative culture", "Async by default. We protect focus time and do not confuse attendance with output."],
            ].map((row) => (
              <div key={row[0]} className="border-t border-[var(--rule)] py-5 first:border-t-0 first:pt-0">
                <dt className="font-medium">{row[0]}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-[var(--ink-3)]">{row[1]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-[var(--rule)]">
        <div className="shell py-16">
          <h2 className="display-3">No perfect match today?</h2>
          <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-[var(--ink-3)]">
            Send the note anyway. We read every message and reply within a week, even when
            the answer is &ldquo;not yet&rdquo;.
          </p>
          <a href={MAILTO} className="btn btn-primary mt-6">
            {site.email}
          </a>
        </div>
      </section>
    </div>
  );
}
