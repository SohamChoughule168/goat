import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { services, PILLAR_SLUGS } from "@/content/services";
import { caseStudies } from "@/content/work";
import { insights } from "@/content/insights";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.9 },
    { url: absoluteUrl("/book"), changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/quote"), changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/work"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/craft"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/platform"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/solutions"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/blueprint"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/insights"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/pricing"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/faq"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/process"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/trust"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/estimate"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/careers"), changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/legal/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/legal/terms"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/legal/cookies"), changeFrequency: "yearly", priority: 0.2 },
  ];
  for (const slug of PILLAR_SLUGS)
    entries.push({ url: absoluteUrl(`/services/${slug}`), changeFrequency: "monthly", priority: 0.8 });
  for (const s of services)
    entries.push({ url: absoluteUrl(`/services/${s.slug}`), changeFrequency: "monthly", priority: 0.75 });
  for (const c of caseStudies)
    entries.push({ url: absoluteUrl(`/work/${c.slug}`), changeFrequency: "yearly", priority: 0.7 });
  for (const i of insights)
    entries.push({
      url: absoluteUrl(`/insights/${i.slug}`),
      lastModified: i.date,
      changeFrequency: "yearly",
      priority: 0.6,
    });
  return entries;
}
