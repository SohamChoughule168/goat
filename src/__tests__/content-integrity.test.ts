import { describe, expect, it } from "vitest";
import { PILLAR_SLUGS, pillars, services } from "@/content/services";
import { insights } from "@/content/insights";
import { caseStudies } from "@/content/work";
import { site } from "@/content/site";

describe("services content integrity", () => {
  it("has the full migrated catalogue of 18 services", () => {
    expect(services).toHaveLength(18);
  });

  it("has unique service slugs and titles", () => {
    const slugs = services.map((s) => s.slug);
    const titles = services.map((s) => s.title);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("uses kebab-case slugs", () => {
    for (const s of services) {
      expect(s.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("assigns every service to a valid pillar", () => {
    for (const s of services) {
      expect(PILLAR_SLUGS).toContain(s.pillar);
    }
  });

  it("gives every pillar at least one service", () => {
    for (const p of pillars) {
      expect(services.some((s) => s.pillar === p.slug)).toBe(true);
    }
  });

  it("requires substance in deliverables and FAQs", () => {
    for (const s of services) {
      expect(s.tagline.length).toBeGreaterThan(10);
      expect(s.deliverables.length).toBeGreaterThanOrEqual(4);
      expect(s.faqs.length).toBeGreaterThanOrEqual(2);
      for (const faq of s.faqs) {
        expect(faq.q.endsWith("?")).toBe(true);
        expect(faq.a.length).toBeGreaterThan(40);
      }
    }
  });
});

describe("insights content integrity", () => {
  it("has unique kebab-case slugs", () => {
    const slugs = insights.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("uses known categories only", () => {
    const known = new Set(["AI & Technology", "SEO & Search", "Web Development", "Digital Marketing"]);
    for (const i of insights) {
      expect(known.has(i.category)).toBe(true);
    }
  });

  it("has parseable dates not in the future and complete bodies", () => {
    for (const i of insights) {
      const date = new Date(`${i.date}T00:00:00`);
      expect(Number.isNaN(date.getTime())).toBe(false);
      expect(date.getTime()).toBeLessThanOrEqual(Date.now());
      expect(i.readingTime).toMatch(/^\d+ min$/);
      expect(i.body.length).toBeGreaterThan(3);
      expect(i.excerpt.length).toBeGreaterThan(20);
    }
  });
});

describe("case study integrity — no fabricated claims ship", () => {
  it("publishes only verified case studies with proof links", () => {
    expect(caseStudies.length).toBeGreaterThan(0);
    for (const cs of caseStudies) {
      expect(cs.status).toBe("verified");
      expect(cs.proof.links.length).toBeGreaterThan(0);
      for (const link of cs.proof.links) {
        expect(link.href.startsWith("https://")).toBe(true);
      }
      expect(cs.results.length).toBeGreaterThan(0);
      expect(cs.year).toBeGreaterThanOrEqual(2020);
      expect(cs.year).toBeLessThanOrEqual(2100);
    }
  });
});

describe("site config integrity", () => {
  it("keeps contact data consistent across surfaces", () => {
    expect(site.phone).toMatch(/^\+91 \d{5} \d{5}$/);
    const phoneDigits = site.phone.replace(/\D/g, "");
    expect(site.whatsapp).toBe(`https://wa.me/${phoneDigits}`);
    expect(site.phoneHref).toBe(site.phone.replace(/\s/g, ""));
    expect(site.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(site.url.startsWith("https://")).toBe(true);
  });

  it("has unique navigation routes", () => {
    const hrefs = site.nav.map((n) => n.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of hrefs) {
      expect(href.startsWith("/")).toBe(true);
    }
  });
});
