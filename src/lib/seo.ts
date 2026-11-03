import type { Metadata } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";
import type { Pillar, Service, ServiceFaq } from "@/content/services";

export const OG_IMAGE_PATH = "/opengraph-image.png";
export const OG_IMAGE_ALT =
  "ImaginarsClub Services — websites, admissions and student systems for institutes";

export function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${normalized.endsWith("/") ? normalized : `${normalized}/`}`;
}

export function assetUrl(path: string) {
  return `${site.url}${path}`;
}

interface ArticleMeta {
  publishedTime: string;
  modifiedTime?: string;
  section?: string;
  authors?: string[];
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  article?: ArticleMeta;
}

export function createMetadata({
  title,
  description,
  path,
  ogType = "website",
  article,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": "/rss.xml" },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: "en_IN",
      type: ogType,
      images: [
        {
          url: OG_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: OG_IMAGE_ALT,
        },
      ],
      ...(article
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime ?? article.publishedTime,
            section: article.section,
            authors: article.authors,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: OG_IMAGE_PATH, alt: OG_IMAGE_ALT }],
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: ServiceFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    serviceType: service.title,
    image: assetUrl(OG_IMAGE_PATH),
    provider: { "@id": `${site.url}/#organization` },
    areaServed: [
      { "@type": "City", name: "Mumbai" },
      { "@type": "Country", name: "India" },
    ],
    url: absoluteUrl(`/services/${service.slug}`),
  };
}

export function serviceCollectionSchema(pillar: Pillar, items: Service[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(`/services/${pillar.slug}`)}#collection`,
    url: absoluteUrl(`/services/${pillar.slug}`),
    name: `${pillar.title} services`,
    description: pillar.description,
    isPartOf: { "@id": `${site.url}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((service, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: service.title,
        url: absoluteUrl(`/services/${service.slug}`),
      })),
    },
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  modifiedTime?: string;
  section?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: [assetUrl(OG_IMAGE_PATH)],
    datePublished: input.publishedTime,
    dateModified: input.modifiedTime ?? input.publishedTime,
    author: {
      "@type": "Organization",
      name: input.author ?? site.name,
      url: site.url,
    },
    publisher: { "@id": `${site.url}/#organization` },
    url: absoluteUrl(input.path),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(input.path) },
    articleSection: input.section,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${site.url}/#website` },
  };
}

export function buildGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${site.url}/#organization`,
        name: site.name,
        alternateName: site.shortName,
        url: `${site.url}/`,
        logo: {
          "@type": "ImageObject",
          url: assetUrl("/apple-icon.png"),
          width: 180,
          height: 180,
        },
        image: assetUrl(OG_IMAGE_PATH),
        email: site.email,
        telephone: site.phone,
        foundingDate: String(site.founded),
        description: site.description,
        slogan: site.tagline,
        priceRange: "₹₹",
        currenciesAccepted: "INR",
        paymentAccepted: "Bank transfer, UPI, Credit card",
        address: {
          "@type": "PostalAddress",
          streetAddress: `${site.address.line1}, ${site.address.line2}`,
          addressLocality: site.address.city,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: site.geo.lat,
          longitude: site.geo.lng,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "09:00",
            closes: "19:00",
          },
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: site.phone,
            email: site.email,
            contactType: "sales",
            areaServed: "IN",
            availableLanguage: ["English", "Hindi"],
          },
        ],
        sameAs: site.socials.map((s) => s.href),
        areaServed: [
          { "@type": "City", name: "Mumbai" },
          { "@type": "Country", name: "India" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Websites, admissions and student systems for institutes",
          numberOfItems: services.length,
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title,
              description: service.description,
              url: absoluteUrl(`/services/${service.slug}`),
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: `${site.url}/`,
        name: site.name,
        description: site.description,
        inLanguage: "en-IN",
        publisher: { "@id": `${site.url}/#organization` },
      },
    ],
  };
}
