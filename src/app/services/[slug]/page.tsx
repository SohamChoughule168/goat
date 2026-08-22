import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/jsonld";
import PillarView from "@/components/services/pillar-view";
import ServiceView from "@/components/services/service-view";
import {
  PILLAR_SLUGS,
  getPillar,
  getService,
  pillars,
  services,
} from "@/content/services";
import { breadcrumbSchema, createMetadata, faqSchema, serviceSchema } from "@/lib/seo";

export function generateStaticParams() {
  return [
    ...PILLAR_SLUGS.map((slug) => ({ slug })),
    ...services.map((s) => ({ slug: s.slug })),
  ];
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const pillar = getPillar(slug);
  if (pillar) {
    return createMetadata({
      title: `${pillar.title} — ${pillar.kicker}`,
      description: pillar.description,
      path: `/services/${pillar.slug}`,
    });
  }
  const service = getService(slug);
  if (service) {
    return createMetadata({
      title: service.title,
      description: service.tagline,
      path: `/services/${service.slug}`,
    });
  }
  return createMetadata({ title: "Not found", description: "", path: "/services" });
}

export default async function ServiceOrPillarPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const pillar = getPillar(slug);

  if (pillar) {
    return (
      <>
        <PillarView pillar={pillar} />
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: pillar.title, path: `/services/${pillar.slug}` },
          ])}
        />
      </>
    );
  }

  const service = getService(slug);
  if (service) {
    const parent = pillars.find((p) => p.slug === service.pillar);
    return (
      <>
        <ServiceView service={service} />
        <JsonLd
          data={[
            serviceSchema(service),
            faqSchema(service.faqs),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              ...(parent
                ? [{ name: parent.title, path: `/services/${parent.slug}` }]
                : []),
              { name: service.title, path: `/services/${service.slug}` },
            ]),
          ]}
        />
      </>
    );
  }

  notFound();
}
