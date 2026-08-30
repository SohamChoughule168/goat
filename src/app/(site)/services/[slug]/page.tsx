import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/jsonld";
import FinalCta from "@/components/home/final-cta";
import PillarMotif from "@/components/services/pillar-motif";
import {
  PILLAR_SLUGS,
  getPillar,
  getServicesByPillar,
  getService,
  pillars,
  services,
} from "@/content/services";
import { breadcrumbSchema, createMetadata, faqSchema, serviceSchema } from "@/lib/seo";
import type { Service } from "@/content/services/types";

export function generateStaticParams() {
  return [
    ...PILLAR_SLUGS.map((slug) => ({ slug })),
    ...services.map((s) => ({ slug: s.slug })),
  ];
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const s = getService(slug);
  if (!s) return createMetadata({ title: "Not found", description: "", path: "/services" });
  return createMetadata({ title: s.title, description: s.tagline, path: `/services/${s.slug}` });
}

export default async function ServiceDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  // Handle pillar routes (e.g. /services/build)
  const pillarData = getPillar(slug);
  if (pillarData) {
    const pillarServices = getServicesByPillar(pillarData.slug);
    return (
      <main className="shell section-y">
        <p className="micro mb-4">Practice {pillarData.index} — {pillarData.kicker}</p>
        <h1 className="display max-w-3xl" style={{ fontSize: "var(--text-h1)", letterSpacing: "-0.03em", fontWeight: 600 }}>
          {pillarData.title}
        </h1>
        <p className="lede mt-5">{pillarData.description}</p>
        <ul className="mt-12 border-t-2 border-current">
          {pillarServices.map((s, i) => (
            <li key={s.slug} className="border-b-2 border-current/15">
              <Link href={`/services/${s.slug}`} className="group -mx-2 flex items-baseline justify-between gap-6 rounded-md px-2 py-7 transition-colors hover:bg-[color:var(--color-surface-sunken)]">
                <span className="min-w-0">
                  <span className="index block">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-1 block text-lg font-medium">{s.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{s.tagline}</span>
                </span>
                <span className="micro shrink-0">{s.timeline}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  // Handle individual service routes
  const service = getService(slug);
  if (!service) notFound();
  const pillar = getPillar(service.pillar);

  return (
    <article>
      <header className="section-y pb-10">
        <div className="shell">
          <Link
            href={`/services/${service.pillar}`}
            className="link-line mb-8 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            ← {pillar?.title} — practice {pillar?.index}
          </Link>
          <p data-reveal="fade" className="micro mb-4">
            {pillar?.kicker}
          </p>
          <h1 data-reveal="up" className="display max-w-4xl">
            {service.title}
          </h1>
          <p data-reveal="up" data-reveal-delay="80" className="mt-6 max-w-2xl font-medium text-lg text-primary">
            {service.tagline}
          </p>
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-20">
        <div className="min-w-0 space-y-16 px-6 lg:pl-[max(1.5rem,calc((100vw-1280px)/2+40px))] lg:pr-0">
          <section>
            <h2 className="text-h3 mb-4">What this is</h2>
            {service.body.map((para, i) => (
              <p key={i} className="mb-4 max-w-prose leading-relaxed text-muted-foreground">{para}</p>
            ))}
          </section>

          <section>
            <h2 className="text-h3 mb-5">What you get</h2>
            <ul className="space-y-3">
              {service.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                  <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {d}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-h3 mb-5">Timeline</h2>
            <p className="leading-relaxed text-muted-foreground">{service.timeline}</p>
          </section>

          <section>
            <h2 className="text-h3 mb-5">How it runs</h2>
            <ol className="space-y-4">
              {service.processStages.map((stage, i) => (
                <li key={i} className="flex items-baseline gap-4 border-t pt-4">
                  <span className="index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm leading-relaxed">{stage}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-h3 mb-5">Common questions</h2>
            <dl className="space-y-6">
              {service.faqs.map((f, i) => (
                <div key={i}>
                  <dt className="font-medium">{f.q}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-h3 mb-5">What this does not include</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {service.exclusions.map((e, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 text-destructive">×</span>
                  {e}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="hidden space-y-6 self-start lg:sticky lg:top-28 lg:block">
          {pillar && <PillarMotif pillar={pillar.slug} className="h-32 opacity-30" />}
          <div className="rounded-md border p-5" style={{ background: "var(--color-surface)" }}>
            <h3 className="micro mb-3">At a glance</h3>
            <dl className="space-y-2.5 text-sm">
              <div><dt className="text-muted-foreground">Practice</dt><dd>{pillar?.title}</dd></div>
              <div><dt className="text-muted-foreground">Timeline</dt><dd>{service.timeline}</dd></div>
            </dl>
            <Link href="/contact" className="btn btn-primary mt-4 w-full">Enquire about this</Link>
          </div>
          <RelatedServices currentSlug={service.slug} pillar={service.pillar} />
        </aside>
      </div>

      {/* FAQPage JSON-LD */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: service.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }} />

      <FinalCta />
    </article>
  );
}

function RelatedServices({ currentSlug, pillar }: { currentSlug: string; pillar: string }) {
  const related = getServicesByPillar(pillar as Service["pillar"])
    .filter((s) => s.slug !== currentSlug)
    .slice(0, 4);
  if (!related.length) return null;
  return (
    <div className="rounded-md border p-5">
      <h3 className="micro mb-3">Related</h3>
      <ul className="space-y-2">
        {related.map((r) => (
          <li key={r.slug}>
            <Link href={`/services/${r.slug}`} className="link-line text-sm">{r.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

