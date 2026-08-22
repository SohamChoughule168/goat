import type { Metadata } from "next";
import Link from "next/link";
import FinalCta from "@/components/home/final-cta";
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
      "Claims need sources. Metrics need methods. If we can't demonstrate it, we don't put it on this site.",
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

export default function AboutPage() {
  return (
    <>
      <section className="section-y pb-12">
        <div className="shell">
          <p data-reveal="fade" className="eyebrow mb-5">
            About
          </p>
          <h1 data-reveal="up" className="display-1 max-w-4xl">
            Small on purpose.
            <br />
            <span className="font-serif font-normal italic text-primary">Senior by default.</span>
          </h1>
          <p data-reveal="up" className="lede mt-8 max-w-2xl text-lg">
            ImaginarsClub Services is a digital studio founded in {site.founded} in Mumbai,
            India. We exist because businesses deserve a partner that ships like a product
            team and reports like an auditor.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
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
                className="grid gap-2 border-t border-border py-7 first:border-t-0 first:pt-0 sm:grid-cols-[6rem_1fr] sm:gap-8"
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

      <section className="border-y border-border bg-[color:var(--paper-dim)]">
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
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.detail}</p>
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
              A deliberately compact core of senior practitioners, extended by a vetted
              network of specialists assembled per project. You meet the people doing your
              work before you sign anything — and nobody senior &quot;oversights&quot;
              your project from a distance.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We publish no headcount counters or years-of-experience arithmetic. Meet us
              instead — the first call is free and unscripted.
            </p>
          </div>
          <div
            data-reveal="up"
            data-reveal-delay="100"
            className="rounded-xl border border-border bg-card/40 p-8"
          >
            <h3 className="eyebrow mb-4">Studio facts</h3>
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between gap-6 border-b border-border pb-4">
                <dt className="text-muted-foreground">Founded</dt>
                <dd>{site.founded}</dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-border pb-4">
                <dt className="text-muted-foreground">Base</dt>
                <dd>Kanjur Marg East, Mumbai</dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-border pb-4">
                <dt className="text-muted-foreground">Practices</dt>
                <dd>Build · Grow · Content · Enable</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Response time</dt>
                <dd>&lt; 1 business day</dd>
              </div>
            </dl>
            <Link href="/contact" className="link-line mt-6 inline-block text-sm text-primary">
              Talk to the studio →
            </Link>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}


