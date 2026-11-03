import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("src/components/home/command-center.tsx", "utf8");

describe("command centre records view", () => {
  it("publishes no rupee symbol or earnings language", () => {
    expect(source).not.toContain("₹");
    expect(source.toLowerCase()).not.toContain("fees");
    expect(source.toLowerCase()).not.toContain("receipt");
    expect(source.toLowerCase()).not.toContain("collected");
    expect(source.toLowerCase()).not.toContain("billed");
  });

  it("ships the records tab and its KPI labels", () => {
    expect(source).toContain('"records"');
    expect(source).toContain("Documents issued");
    expect(source).toContain("Attendance logged");
    expect(source).toContain("Active batches");
    expect(source).toContain("Records complete");
  });

  it("keeps the illustrative-data disclaimer", () => {
    expect(source).toContain("Illustrative interface / sample figures");
    expect(source).toContain("Not client data");
  });
});
