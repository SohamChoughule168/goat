import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { JsonLd } from "@/components/seo/jsonld";
import DeviceScene from "@/components/work/device-scene";
import FinalCta from "@/components/home/final-cta";
import { caseStudies, getCaseStudy } from "@/content/work";
import { breadcrumbSchema, createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const cs = getCaseStudy(slug);
  if (!cs) return createMetadata({ title: "Not found", description: "", path: "/work" });
  return createMetadata({
    title: `${cs.client} — Case Study`,
    description: cs.summary,
    path: `/work/${cs.slug}`,
  });
}

export default async function CaseStudyPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <>
      <article>
        <header className="section-y pb-12">
          <div className="shell">
            <Link
              href="/work"
              className="link-line mb-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              All work
            </Link>
            <p data-reveal="fade" className="eyebrow mb-4">
              {cs.sector} · {cs.year}
            </p>
            <h1 data-reveal="up" className="display-1 max-w-4xl">
              {cs.client}
            </h1>
            <p data-reveal="up" data-reveal-delay="80" className="lede mt-7 max-w-2xl text-lg">
              {cs.summary}
            </p>
          </div>
        </header>

        <section className="relative overflow-hidden border-b border-border bg-card/20">
          <div className="shell grid items-center gap-10 py-14 lg:grid-cols-[1.25fr_1fr]">
            <DeviceScene variant="full" />
            <div>
              <p data-reveal="fade" className="eyebrow mb-4">The environment</p>
              <h2 data-reveal="up" className="display-3">A public face for a regulated business.</h2>
              <p data-reveal="up" data-reveal-delay="80" className="lede mt-4 text-sm">
                The engagement covered the full arc — structure, design language,
                engineering and deployment. The interface shown here is an illustrative
                reconstruction of the system&apos;s character; visit the live site for the real thing.
              </p>
              <a
                data-reveal="up"
                data-reveal-delay="140"
                href={cs.proof.links[0]?.href ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
              >
                Open the live website <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card/30">
          <dl className="shell grid gap-8 py-12 sm:grid-cols-3">
            {cs.results.map((r, i) => (
              <div key={r.label} data-reveal="up" data-reveal-delay={String(i * 60)}>
                <dt className="eyebrow">{r.label}</dt>
                <dd className="mt-3 display-3">{r.value}</dd>
                {r.note && (
                  <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">{r.note}</dd>
                )}
              </div>
            ))}
          </dl>
        </section>

        <section className="py-16 md:py-20">
          <div className="shell grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
              <div>
                <h2 className="eyebrow mb-4">Services</h2>
                <ul className="flex flex-wrap gap-2">
                  {cs.services.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="eyebrow mb-4">Stack</h2>
                <ul className="space-y-1.5 font-mono text-xs text-muted-foreground">
                  {cs.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                <h2 className="eyebrow mb-3 text-primary">Proof</h2>
                <p className="text-xs leading-relaxed text-muted-foreground">{cs.proof.note}</p>
                <ul className="mt-4 space-y-2">
                  {cs.proof.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        {l.label}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <div className="min-w-0 space-y-16">
              <section data-reveal="up">
                <h2 className="display-2">The challenge</h2>
                <p className="lede mt-5">{cs.challenge}</p>
              </section>

              <section data-reveal="up">
                <h2 className="display-2">The approach</h2>
                <ol className="mt-6 space-y-5">
                  {cs.approach.map((a, i) => (
                    <li key={i} className="flex items-start gap-4 border-t border-border pt-5 first:border-t-0 first:pt-0">
                      <span className="font-mono text-sm tracking-[0.25em] text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="lede text-base">{a}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section data-reveal="up">
                <h2 className="display-2">Execution</h2>
                <div className="mt-6 space-y-px overflow-hidden rounded-xl border border-border bg-border">
                  {cs.execution.map((e) => (
                    <div key={e.title} className="bg-background p-6 md:p-7">
                      <h3 className="font-medium">{e.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section data-reveal="up">
                <h2 className="display-2">Result &amp; status</h2>
                <ul className="mt-6 space-y-3">
                  {cs.results.map((r) => (
                    <li key={r.label} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <p className="text-sm leading-relaxed">
                        <strong className="font-medium">{r.value}</strong>{" "}
                        <span className="text-muted-foreground">— {r.note ?? r.label}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </section>
      </article>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: `${cs.client} website`,
            about: cs.summary,
            dateCreated: String(cs.year),
            creator: { "@id": "https://www.imaginarsclubservices.com/#organization" },
            genre: cs.sector,
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: cs.client, path: `/work/${cs.slug}` },
          ]),
        ]}
      />
      <FinalCta />
    </>
  );
}
