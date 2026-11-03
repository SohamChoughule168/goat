import { describe, expect, it } from "vitest";
import { handoverPlates } from "@/content/trust";

describe("handover plates", () => {
  it("publishes four artefacts in order", () => {
    expect(handoverPlates.map((plate) => plate.index)).toEqual(["01", "02", "03", "04"]);
    expect(handoverPlates.map((plate) => plate.title)).toEqual([
      "The diagnosis",
      "The scope",
      "The runbook",
      "The keys",
    ]);
  });

  it("writes a real body for every plate and no money", () => {
    for (const plate of handoverPlates) {
      expect(plate.body.length).toBeGreaterThan(40);
      expect(plate.body).not.toContain("₹");
    }
  });
});
