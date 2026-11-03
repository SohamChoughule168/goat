import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * V3 integrity guards.
 *
 * These tests protect the promise the site makes on /trust: only verified
 * records are published. They fail if invented proof, external generation
 * endpoints, or the private creative resource library ever leak back in.
 */

const files = readdirSync("src", { recursive: true })
  .map((f) => (typeof f === "string" ? f.replace(/\\/g, "/") : ""))
  .filter((f) => /\.(tsx?|css)$/.test(f))
  // The guard files are allowed to name the things they forbid.
  .filter((f) => !f.startsWith("__tests__/"));

const contents = files.map(
  (f) => [f, readFileSync(`src/${f}`, "utf8")] as const,
);

const home = contents.find(([f]) => f === "app/(site)/page.tsx")?.[1] ?? "";

const offending = (pattern: RegExp) =>
  contents.filter(([, text]) => pattern.test(text)).map(([f]) => f);

describe("V3 — integrity and curation guards", () => {
  it("publishes no invented testimonials, client names or results", () => {
    expect(
      offending(
        /Rajesh Kumar|Priya Sharma|Amit Patel|Delhi Public|North Branch School|GrowthHub|300% increase|200% faster/,
      ),
    ).toEqual([]);
  });

  it("references no external generation APIs or public API keys", () => {
    expect(
      offending(/muapi|api\.kie\.ai|NEXT_PUBLIC_[A-Z_]*KEY|Bearer \$\{/i),
    ).toEqual([]);
  });

  it("keeps the private creative resource library out of the site", () => {
    expect(offending(/higgsfield/i)).toEqual([]);
  });

  it("does not remount retired demo sections on the homepage", () => {
    const retired = [
      "HiggsfieldStudio",
      "MCPSkillsShowcase",
      "TestimonialCards",
      "BeforeAfterShowcase",
      "ClientPortalDashboard",
      "PremiumFeatures",
      "GlassCards",
      "AppleShowcase",
      "ServicesBento",
      "FeaturedGrid",
      "ImageGallery3D",
      "Video3DParallax",
      "ImageStack3D",
      "ScrollSyncedImages",
      "DepthParallaxHero",
      "ScrollRevealGrid",
      "InfiniteMarquee",
      "SplitScroll",
      "PinSection",
      "GradientMesh",
      "TextScramble",
      "BeforeAfterSlider",
      "InstitutionHero",
    ];
    for (const name of retired) {
      expect(home).not.toContain(name);
    }
  });

  it("draws the operating field with Canvas 2D", () => {
    const field =
      contents.find(([f]) => f === "components/home/instrument-field.tsx")?.[1] ??
      "";
    expect(field).toContain('getContext("2d")');
    expect(field).toContain("readInstrumentPalette");
  });
});
