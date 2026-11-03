import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Route } from "next";
import { JsonLd } from "@/components/seo/jsonld";
import { FooterCTA } from "@/components/home/final-cta";
import HeroLedger from "@/components/editorial/hero-ledger";
import PillarMotif from "@/components/services/pillar-motif";
import {
  PILLAR_SLUGS,
  getPillar,
  getServicesByPillar,
  getService,
  services,
} from "@/content/services";
import type { Pillar, Service } from "@/content/services/types";
import { site } from "@/content/site";
import { caseStudies } from "@/content/work";
import {
  breadcrumbSchema,
  createMetadata,
  faqSchema,
  serviceCollectionSchema,
  serviceSchema,
} from "@/lib/seo";

const PILLAR_HERO: Record<Pillar["slug"], string> = {
  build: "Built to be used.",
  grow: "Run as a system.",
  content: "Made to be remembered.",
  enable: "Applied, not hyped.",
};

const PILLAR_APPROACH: Record<Pillar["slug"], { title: string; copy: string }> = {
  build: {
    title: "Structure before surface.",
    copy:
      "A build is a system, not a set of screens. We agree the pages, the job each page has to do and the action it must produce before visual design begins — then engineer the result to stay fast, legible and maintainable after handover.",
  },
  grow: {
    title: "Accountable, not busy.",
    copy:
      "Growth work is only useful if it changes a number you care about. Every channel reports against the same definitions, spend follows evidence, and the reporting says what happened plainly — including when something did not work.",
  },
  content: {
    title: "A system, not one-offs.",
    copy:
      "Content compounds when the format, tone and templates are defined. We build the operating rhythm first, then produce assets that still look like you six months later — across video, thumbnails, events and brand collaborations.",
  },
  enable: {
    title: "Bounded, evaluated, owned.",
    copy:
      "AI is useful when it is applied to a specific workflow with a measurable result. We scope one process at a time, build an evaluation set and a fallback path, and keep a person accountable for the outcome before anything reaches a customer.",
  },
};

const PILLAR_PRINCIPLES: Record<Pillar["slug"], { title: string; copy: string }[]> = {
  build: [
    {
      title: "Blueprint before build.",
      copy: "Sitemap, page jobs and conversion paths are agreed before visual design starts.",
    },
    {
      title: "Speed is part of the design.",
      copy: "Performance budgets are checked during the build, not after launch.",
    },
    {
      title: "You leave with ownership.",
      copy: "Code, hosting, analytics and documentation are handed over in your name.",
    },
  ],
  grow: [
    {
      title: "One measurement language.",
      copy: "Every channel reports against the same definitions, so comparisons mean something.",
    },
    {
      title: "Budget follows evidence.",
      copy: "Spend moves toward what is working; it does not stay parked because it was in the plan.",
    },
    {
      title: "No guaranteed rankings.",
      copy: "Search and platform outcomes are influenced, not controlled. We report honestly.",
    },
  ],
  content: [
    {
      title: "System before assets.",
      copy: "Templates, type and tone are defined so the work still looks like you later.",
    },
    {
      title: "Platform-native.",
      copy: "A vertical cut is not a resized landscape edit. Each format gets its own composition.",
    },
    {
      title: "Consistency compounds.",
      copy: "The tenth asset should be faster to make and stronger than the first.",
    },
  ],
  enable: [
    {
      title: "One workflow at a time.",
      copy: "We automate a bounded, measurable process rather than a vague ambition.",
    },
    {
      title: "Evaluate before deploy.",
      copy: "A test set and a fallback path exist before anything reaches a customer.",
    },
    {
      title: "Human review stays.",
      copy: "AI drafts, routes or scores; a person remains accountable for the outcome.",
    },
  ],
};

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
  const pillar = getPillar(slug);
  if (pillar) {
    return createMetadata({
      title: `${pillar.title} — ${pillar.kicker}`,
      description: pillar.metaDescription,
      path: `/services/${pillar.slug}`,
    });
  }
  const service = getService(slug);
  if (!service) return createMetadata({ title: "Not found", description: "", path: "/services" });
  return createMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const pillar = getPillar(slug);

  if (pillar) return <PillarPage pillar={pillar} />;

  const service = getService(slug);
  if (!service) notFound();

  const servicePillar = getPillar(service.pillar);
  if (!servicePillar) notFound();

  return <ServicePage service={service} pillar={servicePillar} />;
}

function ServicePage({ service, pillar }: { service: Service; pillar: Pillar }) {
  const pillarServices = getServicesByPillar(pillar.slug);
  const serviceIndex = Math.max(
    1,
    pillarServices.findIndex((s) => s.slug === service.slug) + 1
  );
  const related = getRelatedServices(service);
  const caseStudy = service.caseStudyRef
    ? caseStudies.find((study) => study.slug === service.caseStudyRef)
    : undefined;
  const liveProof = caseStudy?.proof.links[0];

  return (
    <article className="service-detail">
      <section className="page-hero">
        <div className="shell page-hero-grid">
          <div className="page-hero-copy">
            <nav className="service-crumbs" aria-label="Breadcrumb">
              <ol>
                <li>
                  <Link href="/services">Services</Link>
                </li>
                <li>
                  <Link href={`/services/${pillar.slug}` as Route}>{pillar.title}</Link>
                </li>
                <li>
                  <span aria-current="page">{service.title}</span>
                </li>
              </ol>
            </nav>

            <p data-reveal="fade" className="eyebrow">
              Service dossier · {pillar.index} / {pillar.title}
            </p>
            <h1 data-reveal="up" className="display-1 mt-5">
              {service.title}
            </h1>
            <p data-reveal="up" data-reveal-delay="80" className="lede">
              {service.tagline}
            </p>
            <div className="page-hero-actions" data-reveal="up" data-reveal-delay="140">
              <Link
                href={`/quote/?service=${encodeURIComponent(pillar.title)}&brief=${encodeURIComponent(
                  `I'd like a written quote for ${service.title}.`,
                )}`}
                className="btn btn-primary"
              >
                Request a written quote
              </Link>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                Message on WhatsApp
              </a>
            </div>
            <p className="page-hero-note" data-reveal="fade" data-reveal-delay="200">
              <span>{pillar.title} practice</span>
              <span>Scoped in writing</span>
              <span>Mumbai · remote</span>
            </p>
          </div>

          <HeroLedger
            eyebrow={`Service dossier / ${pillar.title}`}
            value={String(service.deliverables.length).padStart(2, "0")}
            title="deliverables, defined before work starts."
            rows={[
              { label: "Practice", value: `${pillar.index} · ${pillar.title}` },
              { label: "Format", value: "Fixed scope" },
              { label: "Handover", value: "Full ownership" },
              { label: "Commercial", value: "Scoped quote" },
            ]}
            footer="Scope agreed in writing before work starts"
            slip={`${pillar.index} / ${String(serviceIndex).padStart(2, "0")}`}
          />
        </div>
      </section>

      <section className="service-facts" aria-label="At a glance">
        <dl className="shell service-facts-grid">
          <div className="service-fact">
            <dt>Practice</dt>
            <dd>
              {pillar.index} · {pillar.title}
            </dd>
          </div>
          <div className="service-fact">
            <dt>Timeline</dt>
            <dd>{service.timeline}</dd>
          </div>
          <div className="service-fact">
            <dt>Commercial</dt>
            <dd>Written quote before work</dd>
          </div>
          <div className="service-fact">
            <dt>Next step</dt>
            <dd>A short scoping call</dd>
          </div>
        </dl>
      </section>

      <div className="shell service-layout section-y">
        <main className="service-main">
          <section className="service-section" aria-labelledby="service-brief">
            <p className="micro">01 / Brief</p>
            <h2 id="service-brief" className="display-3 mt-3">
              The brief.
            </h2>
            <div className="service-copy mt-6">
              {service.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="service-section" aria-labelledby="service-deliverables">
            <p className="micro">02 / Deliverables</p>
            <h2 id="service-deliverables" className="display-3 mt-3">
              What you get.
            </h2>
            <ol className="service-deliverables">
              {service.deliverables.map((item, index) => (
                <li key={item} className="service-deliverable">
                  <span className="service-deliverable-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="service-section" aria-labelledby="service-process">
            <p className="micro">03 / Process</p>
            <h2 id="service-process" className="display-3 mt-3">
              How it runs.
            </h2>
            <ol className="service-flow">
              {service.processStages.map((stage, index) => (
                <li key={stage}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <p>{stage}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="service-section" aria-labelledby="service-boundary">
            <p className="micro">04 / Boundary</p>
            <h2 id="service-boundary" className="display-3 mt-3">
              What is not included.
            </h2>
            <div className="service-boundary">
              <div className="service-boundary-intro">
                <p>
                  If a requirement sits outside this list, it gets scoped and quoted separately —
                  never quietly absorbed into the project.
                </p>
                <Link href={`/services/${pillar.slug}` as Route} className="link-line">
                  See the {pillar.title} practice
                </Link>
              </div>
              <ul className="service-boundary-list">
                {service.exclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="service-section" aria-labelledby="service-commercials">
            <p className="micro">05 / Commercials</p>
            <h2 id="service-commercials" className="display-3 mt-3">
              What it costs.
            </h2>
            <div className="service-commercial">
              <div>
                <p className="micro">Quoted after a scoped audit</p>
                <p className="service-commercial-band">{service.priceBand}</p>
              </div>
              <ul className="service-commercial-terms">
                <li>Scope, deliverables and price are agreed in writing before work starts.</li>
                <li>Payment milestones are tied to delivery, not calendar dates.</li>
                <li>
                  Third-party costs — media spend, licences or hosting — are quoted separately
                  where they apply.
                </li>
              </ul>
            </div>
          </section>

          <section className="service-section" aria-labelledby="service-faq">
            <p className="micro">06 / Questions</p>
            <h2 id="service-faq" className="display-3 mt-3">
              Common questions.
            </h2>
            <div className="mt-6">
              {service.faqs.map((faq) => (
                <details key={faq.q} className="service-faq">
                  <summary>
                    <span>{faq.q}</span>
                    <span className="service-faq-plus" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          {caseStudy && (
            <section className="service-section" aria-labelledby="service-case">
              <p className="micro">Verified engagement</p>
              <h2 id="service-case" className="display-3 mt-3">
                Proof, not a promise.
              </h2>
              <div className="service-case-card">
                <div>
                  <p className="micro">
                    {caseStudy.sector} · {caseStudy.year}
                  </p>
                  <h3 className="mt-3">{caseStudy.client}</h3>
                  <p className="service-case-summary">{caseStudy.summary}</p>
                  <div className="service-case-links">
                    <Link
                      href={`/work/${caseStudy.slug}` as Route}
                      className="link-line inline-flex items-center gap-2"
                    >
                      Read the case record <span aria-hidden="true">→</span>
                    </Link>
                    {liveProof && (
                      <a
                        href={liveProof.href}
                        target="_blank"
                        rel="noreferrer"
                        className="link-line inline-flex items-center gap-2"
                      >
                        {liveProof.label} <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </div>
                <dl className="service-case-results">
                  {caseStudy.results.map((result) => (
                    <div key={result.label}>
                      <dt>{result.label}</dt>
                      <dd>{result.value}</dd>
                      {result.note && <p>{result.note}</p>}
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          )}
        </main>

        <aside className="service-aside" aria-label="Service summary">
          <PillarMotif pillar={pillar.slug} className="service-aside-motif" />

          <div className="service-panel">
            <p className="micro">At a glance</p>
            <dl className="service-panel-rows">
              <div>
                <dt>Practice</dt>
                <dd>
                  {pillar.index} · {pillar.title}
                </dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd>{service.timeline}</dd>
              </div>
              <div>
                <dt>Commercial</dt>
                <dd>Scoped quote</dd>
              </div>
            </dl>
            <Link
              href={`/quote/?service=${encodeURIComponent(pillar.title)}&brief=${encodeURIComponent(
                `I'd like a written quote for ${service.title}.`,
              )}`}
              className="btn btn-primary"
            >
              Request a written quote
            </Link>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="service-panel-link"
            >
              WhatsApp <span aria-hidden="true">↗</span>
            </a>
          </div>

          {caseStudy && (
            <div className="service-panel">
              <p className="micro">Verified proof</p>
              <p className="service-panel-case">{caseStudy.client}</p>
              <Link
                href={`/work/${caseStudy.slug}` as Route}
                className="service-panel-link"
              >
                Read the case record <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}

          {related.length > 0 && (
            <div className="service-panel">
              <p className="micro">Related services</p>
              <ul className="service-related">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/services/${item.slug}` as Route}>
                      <span>{item.title}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <JsonLd data={serviceSchema(service)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Services", path: "/services" },
          { name: pillar.title, path: `/services/${pillar.slug}` },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />
      <JsonLd data={faqSchema(service.faqs)} />

      <FooterCTA />
    </article>
  );
}

function PillarPage({ pillar }: { pillar: Pillar }) {
  const pillarServices = getServicesByPillar(pillar.slug);
  const approach = PILLAR_APPROACH[pillar.slug];
  const principles = PILLAR_PRINCIPLES[pillar.slug];

  return (
    <article className="pillar-detail">
      <section className="page-hero">
        <div className="shell page-hero-grid">
          <div className="page-hero-copy">
            <nav className="service-crumbs" aria-label="Breadcrumb">
              <ol>
                <li>
                  <Link href="/services">Services</Link>
                </li>
                <li>
                  <span aria-current="page">{pillar.title}</span>
                </li>
              </ol>
            </nav>

            <p data-reveal="fade" className="eyebrow">
              Practice {pillar.index} · {pillar.kicker}
            </p>
            <h1 data-reveal="up" className="display-1 mt-5">
              {pillar.title}{" "}
              <span className="font-serif font-normal italic text-primary block">
                {PILLAR_HERO[pillar.slug]}
              </span>
            </h1>
            <p data-reveal="up" data-reveal-delay="80" className="lede">
              {pillar.description}
            </p>
            <div className="page-hero-actions" data-reveal="up" data-reveal-delay="140">
              <Link
                href={`/quote/?service=${encodeURIComponent(pillar.title)}`}
                className="btn btn-primary"
              >
                Request a written quote
              </Link>
              <Link href="/pricing" className="btn btn-secondary">
                See published prices
              </Link>
            </div>
            <p className="page-hero-note" data-reveal="fade" data-reveal-delay="200">
              <span>{pillarServices.length} services</span>
              <span>One standard</span>
              <span>Mumbai · remote</span>
            </p>
          </div>

          <HeroLedger
            eyebrow={`Practice dossier / ${pillar.index}`}
            value={String(pillarServices.length).padStart(2, "0")}
            title={`services in the ${pillar.title} practice.`}
            rows={[
              { label: "Focus", value: pillar.kicker },
              { label: "Entry", value: "Single service or system" },
              { label: "Cycle", value: "Scope → build → handover" },
              { label: "Commercial", value: "Scoped quote" },
            ]}
            footer="Scope agreed in writing before work starts"
            slip={`${pillar.index} / 04`}
          />
        </div>
      </section>

      <section className="section-y border-t border-[var(--rule)]" aria-labelledby="pillar-services">
        <div className="shell">
          <div className="pillar-section-head">
            <div>
              <p className="eyebrow">Inside the practice</p>
              <h2 id="pillar-services" className="display-2 mt-4">
                {pillarServices.length} services. <em>One standard.</em>
              </h2>
            </div>
            <p className="lede">
              Start with a single service or connect several into one system. Every engagement gets
              a written scope, a named next step and a handover you own.
            </p>
          </div>

          <ol className="pillar-service-list">
            {pillarServices.map((service, index) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}` as Route}
                  className="pillar-service-row"
                >
                  <span className="pillar-service-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="pillar-service-main">
                    <span className="pillar-service-title">{service.title}</span>
                    <span className="pillar-service-tagline">{service.tagline}</span>
                  </span>
                  <span className="pillar-service-time">{service.timeline}</span>
                  <span className="pillar-service-action">
                    Scoped quote <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y border-t border-[var(--rule)]" aria-labelledby="pillar-approach">
        <div className="shell pillar-approach">
          <div className="pillar-approach-art">
            <PillarMotif pillar={pillar.slug} className="h-full" />
            <p className="micro">Practice map / {pillar.index}</p>
          </div>
          <div>
            <p className="eyebrow">How this practice works</p>
            <h2 id="pillar-approach" className="display-2 mt-4">
              {approach.title}
            </h2>
            <p className="lede mt-5">{approach.copy}</p>
          </div>
        </div>

        <div className="shell">
          <div className="standard-grid pillar-principles">
            {principles.map((principle, index) => (
              <article key={principle.title} className="standard-card">
                <span className="index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={serviceCollectionSchema(pillar, pillarServices)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Services", path: "/services" },
          { name: pillar.title, path: `/services/${pillar.slug}` },
        ])}
      />

      <FooterCTA />
    </article>
  );
}

function getRelatedServices(service: Service): Service[] {
  const seen = new Set([service.slug]);
  const related: Service[] = [];

  for (const slug of service.relatedServices) {
    if (seen.has(slug)) continue;
    const item = getService(slug);
    if (!item) continue;
    seen.add(slug);
    related.push(item);
    if (related.length >= 4) return related;
  }

  for (const item of getServicesByPillar(service.pillar)) {
    if (related.length >= 4) break;
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    related.push(item);
  }

  return related;
}
