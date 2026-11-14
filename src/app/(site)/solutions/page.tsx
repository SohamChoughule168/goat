import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import MosslineTelemetry from "@/components/motion/MosslineTelemetry";
import { createMetadata } from "@/lib/seo";
import { audienceSolutions, referenceArchitectures } from "@/content/institutional";

export const metadata: Metadata = createMetadata({
  title: "Solutions by institution type",
  description:
    "Reference architectures for coaching classes, schools, multi-branch groups and edtech teams, built from the same eight operating layers.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
      <section className="inst-section" aria-labelledby="solutions-title">
        <div className="inst-shell">
          <p className="inst-label">Solutions</p>
          <h1 id="solutions-title" className="inst-display-l mt-5 max-w-[16ch]">
            One platform. Four <span className="inst-serif">realities.</span>
          </h1>
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end">
            <p className="inst-lede max-w-[48ch]">
              The layers are shared. The order, the integrations and the governance change
              with the institution.
            </p>
            <p className="inst-body max-w-[42ch] text-[0.9375rem]">
              These are reference architectures, not fixed packages. We scope the version
              that matches your branches, calendar and team.
            </p>
          </div>
        </div>
      </section>

      <section className="inst-section-tight" aria-labelledby="reference-title">
        <div className="inst-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="inst-label">Reference architectures</p>
              <h2 id="reference-title" className="inst-h2 mt-5">
                The same layers, assembled differently.
              </h2>
            </div>
            <Link href="/platform" className="inst-link">
              Read the platform note
              <ArrowUpRight size={14} strokeWidth={1.5} className="inst-link-arrow" />
            </Link>
          </div>

          <div className="reference-grid">
            {referenceArchitectures.map((architecture) => (
              <article key={architecture.id} className="reference-card">
                <p className="inst-num text-[0.625rem] text-[var(--ink-4)]">
                  {architecture.index}
                </p>
                <h3>{architecture.title}</h3>
                <p>{architecture.description}</p>
                <div className="reference-system">
                  {architecture.system.map((layer) => (
                    <span key={layer}>{layer}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16">
            <MosslineTelemetry />
          </div>
        </div>
      </section>

      <section className="inst-section" aria-labelledby="audiences-title">
        <div className="inst-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="inst-label">By institution type</p>
              <h2 id="audiences-title" className="inst-h2 mt-5 max-w-[18ch]">
                Find the version that sounds like your week.
              </h2>
            </div>
            <Link href="/estimate" className="inst-link">
              Scope a version
              <ArrowUpRight size={14} strokeWidth={1.5} className="inst-link-arrow" />
            </Link>
          </div>

          <div className="preview-rows mt-10">
            {audienceSolutions.map((audience) => (
              <article key={audience.id} id={audience.id} className="preview-row scroll-mt-24">
                <span className="inst-num text-[0.625rem] text-[var(--ink-4)]">
                  {audience.index}
                </span>
                <div>
                  <h2>{audience.title}</h2>
                  <p>
                    <span className="font-medium text-[var(--ink-2)]">The problem. </span>
                    {audience.problem}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--ink-2)]">The response. </span>
                    {audience.response}
                  </p>
                  <div className="preview-system">
                    {audience.system.map((layer) => (
                      <span key={layer}>{layer}</span>
                    ))}
                  </div>
                  <Link
                    href={`/contact?intent=${audience.id}`}
                    className="inst-link mt-4 inline-flex"
                  >
                    Discuss this setup
                    <ArrowUpRight size={13} strokeWidth={1.5} className="inst-link-arrow" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta" aria-labelledby="solutions-cta">
        <div className="inst-shell final-cta-inner">
          <div>
            <p className="inst-label">Next step</p>
            <h2 id="solutions-cta" className="inst-h2 mt-5 max-w-[20ch]">
              Start with the layer that is leaking <span className="inst-serif">now.</span>
            </h2>
          </div>
          <div className="final-cta-actions">
            <Link href="/book" className="inst-btn">
              Book a working session
            </Link>
            <Link href="/platform" className="inst-btn inst-btn-ghost">
              Read the platform note
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
