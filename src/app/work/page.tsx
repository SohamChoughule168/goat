import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SystemArchitecture from "@/components/work/system-architecture";
import { createMetadata } from "@/lib/seo";
import { caseStudies } from "@/content/work";

export const metadata: Metadata = createMetadata({
  title: "Work — Case Studies With Sources",
  description: "Selected engagements with verifiable outcomes.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <section className="section-y pb-12">
        <div className="shell">
          <p className="micro mb-5">Selected work</p>
          <h1 className="display max-w-4xl">Case studies you can check.</h1>
          <p className="lede mt-7 max-w-[55ch] text-muted-foreground">
            We only publish work the client has approved, with claims that trace to a public source.
          </p>
        </div>
      </section>
      <section className="pb-20">
        <div className="shell space-y-6">
          {caseStudies.map((cs) => (
            <Link key={cs.slug} href={`/work/${cs.slug}`}
              className="group block overflow-hidden rounded-md border border-[color:var(--color-border)] transition-colors duration-300 hover:border-[color:var(--color-border-interactive)]">
              <article className="grid md:grid-cols-[1fr_1fr]">
                <div className="relative flex items-center justify-center p-8 md:p-10" style={{ background: "var(--paper-dim, var(--color-surface-sunken))" }}>
                  <SystemArchitecture layers={[
                    { label: "Design System", sub: "Typography / Colour / Components" },
                    { label: "Next.js Application", sub: "Server-rendered" },
                    { label: "Deployment Pipeline", sub: "CI/CD + Monitoring" },
                  ]} className="w-full max-w-sm opacity-50 text-muted-foreground" />
                </div>
                <div className="flex flex-col justify-between gap-6 border-t border-[color:var(--color-border)] p-8 md:border-l md:border-t-0 md:p-10">
                  <div>
                    <span className="font-mono text-[length:var(--text-micro)] uppercase tracking-[0.3em] text-muted-foreground">{cs.sector} / {cs.year}</span>
                    <h2 className="mt-4 text-xl font-semibold">{cs.client}</h2>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{cs.summary}</p>
                  </div>
                  <div className="space-y-4">
                    <ul className="flex flex-wrap gap-2">{cs.services.map((s) => (<li key={s} className="rounded-full border border-[color:var(--color-border)] px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s}</li>))}</ul>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">Read the case study <ArrowUpRight aria-hidden /></span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
          <div className="rounded-md border border-dashed border-[color:var(--color-border)] p-8 md:p-10">
            <h2 className="text-h3 font-semibold">More engagements exist.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">Much of our delivery happens under confidentiality. Ask for anonymised examples.</p>
            <Link href="/contact" className="link-line mt-5 inline-block text-sm font-medium text-primary">Request references</Link>
          </div>
        </div>
      </section>
    </>
  );
}
