import { describe, expect, it } from "vitest";
import nextConfig, { legacyServiceMap } from "../../next.config";
import { PILLAR_SLUGS, services } from "@/content/services";

const serviceSlugs = new Set(services.map((s) => s.slug));
const liveSegments = new Set<string>([...serviceSlugs, ...PILLAR_SLUGS]);

describe("legacy redirect map ↔ content layer", () => {
  it("redirects every declared legacy slug to a live service page", () => {
    for (const [legacySlug, target] of Object.entries(legacyServiceMap)) {
      expect(
        services.some((s) => s.legacySlugs?.includes(legacySlug)),
        `legacy slug "${legacySlug}" is mapped in next.config but no service claims it`
      ).toBe(true);
      expect(
        liveSegments.has(target),
        `legacy "/services/${legacySlug}" redirects to unknown route "/${target}"`
      ).toBe(true);
    }
  });

  it("has a redirect for every legacy slug claimed by content", () => {
    const mapped = new Set(Object.keys(legacyServiceMap));
    for (const service of services) {
      for (const legacy of service.legacySlugs ?? []) {
        expect(
          mapped.has(legacy),
          `service "${service.slug}" declares legacy "${legacy}" but next.config never redirects it`
        ).toBe(true);
      }
    }
  });

  it("never shadows a live route with a redirect", () => {
    for (const legacySlug of Object.keys(legacyServiceMap)) {
      expect(liveSegments.has(legacySlug), `"${legacySlug}" is both a live segment and a redirect source`).toBe(false);
    }
  });

  it("keeps legacy targets unique per source", () => {
    const sources = Object.keys(legacyServiceMap);
    expect(new Set(sources).size).toBe(sources.length);
  });
});

describe("global redirects", () => {
  it("maps the old site architecture to the new one", async () => {
    const redirects = await nextConfig.redirects!();
    const bySource = new Map(redirects.map((r) => [r.source, r.destination]));

    expect(bySource.get("/portfolio")).toBe("/work");
    expect(bySource.get("/blog")).toBe("/insights");
    expect(bySource.get("/blog/:slug")).toBe("/insights");

    for (const [legacy] of Object.entries(legacyServiceMap)) {
      expect(bySource.has(`/services/${legacy}`)).toBe(true);
    }
  });

  it("uses permanent (301) redirects to preserve SEO equity", async () => {
    const redirects = await nextConfig.redirects!();
    for (const r of redirects) {
      expect(r.permanent).toBe(true);
    }
  });
});
