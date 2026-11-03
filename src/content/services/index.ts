import type { Pillar, PillarSlug, Service } from "./types";
import { buildServices } from "./build";
import { growServices } from "./grow";
import { contentServices } from "./content";
import { enableServices } from "./enable";

export { buildServices, growServices, contentServices, enableServices };

export const pillars: Pillar[] = [
  {
    slug: "build",
    index: "01",
    title: "Build",
    kicker: "Digital products",
    description: "Websites, web apps and mobile apps engineered to load fast, rank well and convert.",
    metaDescription:
      "Websites, web apps and mobile apps engineered to load fast, rank well and convert. Four build services, scoped in writing with a fixed quote.",
  },
  {
    slug: "grow",
    index: "02",
    title: "Grow",
    kicker: "Performance marketing",
    description: "Search, paid media and answer-engine visibility run as an accountable system.",
    metaDescription:
      "Search, paid media and answer-engine visibility run as one accountable system. Eight growth services, each scoped in writing with a fixed quote.",
  },
  {
    slug: "content",
    index: "03",
    title: "Content & Brand",
    kicker: "Story and identity",
    description: "Video, design assets, brand systems and collaborations.",
    metaDescription:
      "Video, design assets, brand systems and collaborations. Four content and brand services, scoped in writing with a fixed quote and clear handover.",
  },
  {
    slug: "enable",
    index: "04",
    title: "Enable",
    kicker: "AI and operations",
    description: "Applied AI integration and operational support.",
    metaDescription:
      "Applied AI integration and operational support, bounded and evaluated before deployment. Two enablement services, scoped in writing with a fixed quote.",
  },
];

export const allServices: Service[] = [
  ...buildServices,
  ...growServices,
  ...contentServices,
  ...enableServices,
];

export const services = allServices;

export type { PillarSlug, Service, ServiceFaq, Pillar } from "./types";

export const PILLAR_SLUGS: PillarSlug[] = pillars.map((p) => p.slug);

export function getPillar(slug: string): Pillar | undefined {
  return pillars.find((p) => p.slug === slug);
}

export function getServicesByPillar(pillar: PillarSlug): Service[] {
  return allServices.filter((s) => s.pillar === pillar);
}

export function getService(slug: string): Service | undefined {
  return allServices.find((s) => s.slug === slug);
}
