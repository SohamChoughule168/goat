import { describe, expect, it } from "vitest";
import {
  institutionFrames,
  institutionHero,
  institutionLayers,
} from "@/content/institution";

describe("institution content", () => {
  it("keeps the four visible layers and the deliberate index gap", () => {
    expect(institutionLayers.map((layer) => layer.index)).toEqual([
      "01",
      "02",
      "03",
      "08",
    ]);
    expect(institutionLayers.map((layer) => layer.title)).toEqual([
      "Brand",
      "Website",
      "Admissions",
      "Intelligence",
    ]);
  });

  it("keeps the hero still at a 4:5 ratio", () => {
    expect(institutionHero.width / institutionHero.height).toBeCloseTo(0.8, 2);
    expect(institutionHero.srcSet).toContain("720w");
    expect(institutionHero.srcSet).toContain("1200w");
  });

  it("publishes five 16:9 frames with real captions", () => {
    expect(institutionFrames).toHaveLength(5);
    for (const frame of institutionFrames) {
      expect(frame.width / frame.height).toBeCloseTo(16 / 9, 2);
      expect(frame.srcSet).toContain("800w");
      expect(frame.srcSet).toContain("1600w");
      expect(frame.alt.length).toBeGreaterThan(20);
      expect(frame.stage.length).toBeGreaterThan(3);
      expect(frame.caption.length).toBeGreaterThan(30);
      expect(frame.caption).not.toContain("₹");
    }
  });
});
