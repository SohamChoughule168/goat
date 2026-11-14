import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const home = readFileSync("src/app/(site)/page.tsx", "utf8");
const hero = readFileSync("src/components/home/cinematic-hero.tsx", "utf8");

describe("homepage media and records copy", () => {
  it("removes the published earnings figure", () => {
    expect(home).not.toContain("₹1.84");
    expect(home).not.toContain("Fees collected");
    expect(home).not.toContain("fees and parents");
  });

  it("uses the records language in the signal bar and final CTA", () => {
    expect(home).toContain("enquiries, admissions and parents");
    expect(home).toContain("the admissions process and the reports you do not trust");
  });

  it("mounts the sequence, the instrument field, and the photo-led hero", () => {
    expect(home.includes("PremiumScrollSequence") || home.includes("InstitutionSequence")).toBe(true);
    expect(home.includes("PremiumInstrumentField") || home.includes("InstrumentField")).toBe(true);
    expect(hero).not.toContain("InstrumentStage");
    expect(hero).toContain("institutionHero");
  });
});
