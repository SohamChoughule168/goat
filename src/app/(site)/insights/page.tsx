import type { Metadata } from "next";
import Link from "next/link";
import { FooterCTA } from "@/components/home/final-cta";
import HeroLedger from "@/components/editorial/hero-ledger";
import { JsonLd } from "@/components/seo/jsonld";
import { absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { insights } from "@/content/insights";
import { site } from "@/content/site";
import { InsightsClient } from "./InsightsClient";

const INSIGHTS_DESCRIPTION =
  "Practical notes on web performance, AI-assisted delivery, search visibility and working with digital studios — written by the people who do the work.";

export const metadata: Metadata = createMetadata({
  title: "Insights",
  description: INSIGHTS_DESCRIPTION,
  path: "/insights",
});

const EDITORIAL_STANDARDS = [
  {
    index: "01",
    title: "Grounded in delivery.",
    copy:
      "Every note starts from a problem we have seen on a real engagement — a slow page, a missing answer, an enquiry nobody owned. No scraped summaries or generic advice.",
    note: "From client work",
  },
  {
    index: "02",
    title: "Plain language only.",
    copy:
      "If a recommendation needs a glossary to survive, it is not ready to publish. We explain the trade-off, the cost and the case where the advice does not apply.",
    note: "No jargon",
  },
  {
    index: "03",
    title: "No guaranteed outcomes.",
    copy:
      "We do not promise rankings, virality or a fixed return. These notes describe what we have learned and what we would test next — not what will happen for you.",
    note: "No false promises",
  },
];

const READING_PATHS = [
  {
    index: "01",
    title: "I run a coaching institute.",
    copy:
      "Start with the questions your front office answers every day, then decide which modules are actually worth adding.",
    links: [
      { label: "The institute website checklist", href: "/insights/coaching-institute-website-checklist" },
      { label: "Writing a better brief", href: "/insights/write-a-brief-that-builds-a-better-website" },
    ],
  },
  {
    index: "02",
    title: "I need more enquiries.",
    copy:
      "Visibility is only half the problem. Read how search is changing, then make sure the page a parent lands on is fast enough to keep them.",
    links: [
      { label: "GEO and AI search", href: "/insights/generative-engine-optimization-guide" },
      { label: "Speed as a sales feature", href: "/insights/website-performance-that-converts" },
    ],
  },
  {
    index: "03",
    title: "I am rebuilding a website.",
    copy:
      "The decisions made before visual design determine whether the rebuild lasts. These three notes cover the foundations.",
    links: [
      { label: "Design tokens", href: "/insights/design-tokens-and-design-systems" },
      { label: "Accessibility as advantage", href: "/insights/accessibility-as-business-advantage" },
      { label: "AI in web development", href: "/insights/ai-in-web-development-practical-view" },
    ],
  },
];

export default function InsightsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell page-hero-grid">
          <div className="page-hero-copy">
            <p data-reveal="fade" className="eyebrow">
              Field notes · {insights.length} published
            </p>
            <h1 data-reveal="up" className="display-1 mt-5">
              Notes from the
              <span className="font-serif font-normal italic text-primary"> workbench.</span>
            </h1>
            <p data-reveal="up" data-reveal-delay="80" className="lede">
              Practical writing on web performance, search, AI-assisted delivery and the
              unglamorous decisions that make a small business website work. Written by the people
              doing the work — not a content farm.
            </p>
            <div className="page-hero-actions" data-reveal="up" data-reveal-delay="140">
              <a href="#library" className="btn btn-primary">
                Browse the notes
              </a>
              <Link href="/contact" className="btn btn-secondary">
                Suggest a topic
              </Link>
            </div>
            <p className="page-hero-note" data-reveal="fade" data-reveal-delay="200">
              <span>No sponsored posts</span>
              <span>No AI-generated filler</span>
              <span>No guaranteed outcomes</span>
            </p>
          </div>

          <HeroLedger
            eyebrow="Editorial ledger / 2026"
            value={String(insights.length).padStart(2, "0")}
            title="field notes. No filler, no forecasts."
            rows={[
              { label: "Published", value: `${insights.length} notes` },
              { label: "Scope", value: "Web · Search · AI · Education" },
              { label: "Authors", value: "Team ImaginarsClub" },
              { label: "Basis", value: "Client work + delivery" },
            ]}
            footer="Mumbai · Updated October 2026"
            slip="Field notes / 07"
          />
        </div>
      </section>

      <InsightsClient />

      <section className="section-y border-t border-[var(--rule)]" aria-labelledby="editorial-standard">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
            <div data-reveal="up">
              <p className="eyebrow">Editorial rule</p>
              <h2 id="editorial-standard" className="display-2 mt-4 max-w-[17ch]">
                Written after the work, not before it.
              </h2>
            </div>
            <p className="lede" data-reveal="up" data-reveal-delay="80">
              There is enough generic advice on the internet. These notes exist to document what we
              have actually tested, what it cost, and where the advice stops being true.
            </p>
          </div>

          <div className="standard-grid mt-12">
            {EDITORIAL_STANDARDS.map((standard, index) => (
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

      <section className="section-y border-t border-[var(--rule)]" aria-labelledby="reading-paths">
        <div className="shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div data-reveal="up">
            <p className="eyebrow">Reading paths</p>
            <h2 id="reading-paths" className="display-2 mt-4 max-w-[15ch]">
              Three ways in.
            </h2>
            <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-[var(--ink-3)]">
              If you do not want to browse all {insights.length} notes, pick the path that sounds
              like your week.
            </p>
          </div>

          <div className="reading-paths" data-reveal="up" data-reveal-delay="80">
            {READING_PATHS.map((path) => (
              <article key={path.index} className="reading-path">
                <span>{path.index}</span>
                <div>
                  <h3>{path.title}</h3>
                  <p>{path.copy}</p>
                </div>
                <div>
                  <p>
                    {path.links.map((link) => (
                      <Link key={link.href} href={link.href}>
                        {link.label} <span aria-hidden="true">↗</span>
                      </Link>
                    ))}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${absoluteUrl("/insights")}#collection`,
            url: absoluteUrl("/insights"),
            name: "Insights",
            description: INSIGHTS_DESCRIPTION,
            inLanguage: "en-IN",
            isPartOf: { "@id": `${site.url}/#website` },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: insights.length,
              itemListElement: insights.map((post, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: absoluteUrl(`/insights/${post.slug}`),
                name: post.title,
              })),
            },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
          ]),
        ]}
      />
      <FooterCTA />
    </>
  );
}
