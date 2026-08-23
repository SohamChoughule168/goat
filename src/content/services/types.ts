export type PillarSlug = "build" | "grow" | "content" | "enable";

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface Service {
  slug: string;
  title: string;
  pillar: PillarSlug;
  tagline: string;
  description: string;
  body: string[];
  deliverables: string[];
  timeline: string;
  processStages: string[];
  exclusions: string[];
  priceBand: string;
  faqs: ServiceFaq[];
  relatedServices: string[];
  caseStudyRef?: string;
  legacySlugs?: string[];
}

export interface Pillar {
  slug: PillarSlug;
  index: string;
  title: string;
  kicker: string;
  description: string;
}
