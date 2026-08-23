import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services, PILLAR_SLUGS } from "@/content/services";
import { caseStudies } from "@/content/work";
import { insights } from "@/content/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/work`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/insights`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.9 },
    { url: `${site.url}/pricing`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/process`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/trust`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/careers`, changeFrequency: "monthly", priority: 0.4 },
  ];
  for (const slug of PILLAR_SLUGS)
    entries.push({ url: `${site.url}/services/${slug}`, changeFrequency: "monthly", priority: 0.8 });
  for (const s of services)
    entries.push({ url: `${site.url}/services/${s.slug}`, changeFrequency: "monthly", priority: 0.75 });
  for (const c of caseStudies)
    entries.push({ url: `${site.url}/work/${c.slug}`, changeFrequency: "yearly", priority: 0.7 });
  for (const i of insights)
    entries.push({ url: `${site.url}/insights/${i.slug}`, lastModified: new Date(`${i.date}T00:00:00`), changeFrequency: "yearly", priority: 0.6 });
  return entries.map((e) => ({ lastModified: e.lastModified ?? now, ...e }));
}
