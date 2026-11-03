import type { Metadata } from "next";
import Link from "next/link";
import FinalCta from "@/components/home/final-cta";
import HeroLedger from "@/components/editorial/hero-ledger";
import StudioFrame from "@/components/media/studio-frame";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createMetadata({
  title: "About the Studio",
  description:
    "ImaginarsClub Services is a senior-led digital studio in Mumbai, founded in 2024. Small on purpose, AI-native by default, honest by policy.",
  path: "/about",
});

const VALUES = [
  {
    title: "Craft over volume",
    detail:
      "We take on fewer projects than we could, so each one gets senior attention from people who actually build.",
  },
  {
    title: "Evidence over adjectives",
    detail:
      "Claims need sources. Metrics need methods. If we cannot demonstrate it, we do not put it on this site.",
  },
  {
    title: "Speed as a feature",
    detail:
      "AI-native workflows and ruthless scoping mean weeks-to-launch instead of quarters-to-meetings.",
  },
  {
    title: "Ownership always",
    detail:
      "Everything we create lives in your accounts under your control. Great partners are easy to leave.",
  },
];

const TIMELINE = [
  {
    year: "2024",
    title: "Founded in Kanjur Marg, Mumbai",
    detail:
      "Started as a compact team of practitioners who kept watching businesses choose between unreliable freelancers and slow, layered agencies.",
  },
  {
    year: "2025",
    title: "First flagship delivery",
    detail:
      "End-to-end design, build and deployment of PRV Financial Services' public website — delivered on schedule with formal client appreciation.",
  },
  {
    year: "2026",
    title: "Eighteen services, four practices",
    detail:
      "The offering matured into an integrated system spanning product builds, growth marketing, content and applied AI.",
  },
];

const PRACTICES = [
  {
    title: "Build",
    copy: "Websites, student portals, online tests, fee collection and custom applications.",
    href: "/services#build",
  },
  {
    title: "Grow",
    copy: "Local search, Meta advertising, analytics and lead tracking that ties spend to enquiries.",
    href: "/services#grow",
  },
  {
    title: "Content",
    copy: "Copy, photography direction, video edits and the proof that makes a small institute credible.",
    href: "/services#content",
  },
  {
    title: "Enable",
    copy: "AI assistants, WhatsApp workflows and internal tools that remove repeated admin work.",
    href: "/services#enable",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell page-hero-grid">
          <div className="page-hero-copy">
            <p data-reveal="fade" className="eyebrow">
              About · the studio
            </p>
            <h1 data-reveal="up" className="display-1 mt-5">
              Small on purpose.
              <span className="font-serif font-normal italic text-primary"> Senior by default.</span>
            </h1>
            <p data-reveal="up" data-reveal-delay="80" className="lede">
              ImaginarsClub Services is a digital studio founded in {site.founded} in Mumbai, India.
              We exist because businesses deserve a partner that ships like a product team and
              reports like an auditor.
            </p>
            <div className="page-hero-actions" data-reveal="up" data-reveal-delay="140">
              <Link href="/contact" className="btn btn-primary">
                Talk to the studio
              </Link>
              <Link href="/process" className="btn btn-secondary">
                How we work
              </Link>
            </div>
            <p className="page-hero-note" data-reveal="fade" data-reveal-delay="200">
              <span>Founded {site.founded}</span>
              <span>Mumbai, India</span>
              <span>Senior-led</span>
            </p>
          </div>

          <HeroLedger
            eyebrow="Studio ledger / facts"
            value="04"
            title="practices. One accountable team."
            rows={[
              { label: "Founded", value: String(site.founded) },
              { label: "Base", value: "Kanjur Marg East, Mumbai" },
              { label: "Practices", value: "Build · Grow · Content · Enable" },
              { label: "Model", value: "Senior-led, small core" },
            ]}
            footer="No headcount counters. Meet the people instead."
            slip="About / 04"
          />
        </div>
      </section>

      <section className="border-t border-[var(--rule)]" aria-label="Inside the studio">
        <div className="shell studio-band">
          <StudioFrame />
        </div>
      </section>

      <section className="border-t border-[var(--rule)]">
        <div className="shell grid gap-14 py-16 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <h2 data-reveal="fade" className="display-3 lg:sticky lg:top-28 lg:self-start">
            The story so far
          </h2>
          <ol className="space-y-0">
            {TIMELINE.map((t, i) => (
              <li
                key={t.year}
                data-reveal="up"
                data-reveal-delay={String(i * 60)}
                className="grid gap-2 border-t border-[var(--rule)] py-7 first:border-t-0 first:pt-0 sm:grid-cols-[6rem_1fr] sm:gap-8"
              >
                <span className="font-mono text-sm tracking-[0.25em] text-primary">{t.year}</span>
                <div>
                  <h3 className="text-base font-medium">{t.title}</h3>
                  <p className="lede mt-2 text-sm">{t.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-[var(--rule)]" aria-labelledby="about-practices">
        <div className="shell grid gap-12 py-16 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-4">Where the work goes</p>
            <h2 id="about-practices" className="display-2">
              Four practices, one <em>accountable team.</em>
            </h2>
            <p className="lede mt-5 max-w-[42ch]">
              Most clients meet us through a website build. Some stay for the growth, content and
              systems that make the website worth having.
            </p>
            <Link href="/services" className="link-line mt-6 inline-block text-sm font-medium text-primary">
              See all services →
            </Link>
          </div>
          <ul className="grid gap-px border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-2">
            {PRACTICES.map((practice) => (
              <li key={practice.title} className="bg-[var(--paper)] p-7">
                <h3 className="text-lg font-medium">{practice.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-3)]">{practice.copy}</p>
                <Link href={practice.href} className="link-line mt-4 inline-block text-xs font-medium text-primary">
                  Explore →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-[var(--rule)]" aria-labelledby="what-we-dont-do">
        <div className="shell grid gap-10 py-16 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-4">Boundaries</p>
            <h2 id="what-we-dont-do" className="display-2">
              What we <em>don&apos;t</em> do.
            </h2>
          </div>
          <dl className="space-y-0">
            {[
              {
                term: "Guarantee rankings or admissions",
                detail: "No honest studio controls Google or your market. We build the foundation and report what changes.",
              },
              {
                term: "Lock you into our platform",
                detail: "Everything ships on accounts you own, with documentation. Leaving should be boring.",
              },
              {
                term: "Hide work behind a sales layer",
                detail: "The people you meet in the first call are the people doing the work. No handoff to a mystery team.",
              },
              {
                term: "Sell features you will not use",
                detail: "If a module does not remove a real problem, we say so — even when it costs us the line item.",
              },
            ].map((item) => (
              <div key={item.term} className="grid gap-1 border-t border-[var(--rule)] py-5 first:border-t-0 first:pt-0 sm:grid-cols-[1fr_1.3fr] sm:gap-8">
                <dt className="font-medium">{item.term}</dt>
                <dd className="text-sm leading-relaxed text-[var(--ink-3)]">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-y border-[var(--rule)] bg-[var(--paper-2)]">
        <div className="shell py-16 md:py-20">
          <div className="mb-12 max-w-2xl">
            <p data-reveal="fade" className="eyebrow mb-4">
              How we operate
            </p>
            <h2 data-reveal="up" className="display-2">
              Four commitments we can be held to.
            </h2>
          </div>
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <li key={v.title} data-reveal="up" data-reveal-delay={String(i * 50)}>
                <span className="font-mono text-xs text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 display-3">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-3)]">{v.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div data-reveal="up">
            <h2 className="display-3">How we&apos;re staffed</h2>
            <p className="lede mt-4">
              A deliberately compact core of senior practitioners, extended by a vetted network of
              specialists assembled per project. You meet the people doing your work before you sign
              anything — and nobody senior &quot;oversights&quot; your project from a distance.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-3)]">
              We publish no headcount counters or years-of-experience arithmetic. Meet us instead —
              the first call is free and unscripted.
            </p>
          </div>
          <div
            data-reveal="up"
            data-reveal-delay="100"
            className="border border-[var(--rule-strong)] bg-[var(--paper-2)] p-8"
          >
            <h3 className="eyebrow mb-4">Studio facts</h3>
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between gap-6 border-b border-[var(--rule)] pb-4">
                <dt className="text-[var(--ink-3)]">Founded</dt>
                <dd>{site.founded}</dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-[var(--rule)] pb-4">
                <dt className="text-[var(--ink-3)]">Base</dt>
                <dd>Kanjur Marg East, Mumbai</dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-[var(--rule)] pb-4">
                <dt className="text-[var(--ink-3)]">Practices</dt>
                <dd>Build · Grow · Content · Enable</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-[var(--ink-3)]">Response time</dt>
                <dd>&lt; 1 business day</dd>
              </div>
            </dl>
            <Link href="/contact" className="link-line mt-6 inline-block text-sm text-primary">
              Talk to the studio →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--rule)]">
        <div className="shell grid gap-8 py-14 md:grid-cols-[1fr_auto] md:items-end md:gap-16">
          <div>
            <p className="eyebrow mb-4">The workshop</p>
            <h2 className="display-3">The method is on the page.</h2>
            <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-[var(--ink-3)]">
              Eleven stations document how this site is built — including two that are deliberately
              unfinished. Craft proof, not client proof.
            </p>
          </div>
          <Link href="/craft" className="link-line text-sm font-medium text-primary">
            Open the workshop →
          </Link>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
