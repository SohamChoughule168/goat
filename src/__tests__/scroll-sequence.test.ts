import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("src/components/media/scroll-sequence.tsx", "utf8");

describe("scroll sequence contract", () => {
  it("server-renders every caption and image", () => {
    expect(source).toContain("figcaption");
    expect(source).toContain("frame.caption");
    expect(source).toContain("frame.alt");
    expect(source).toContain("frame.srcSet");
  });

  it("uses the shared progress hook and no second scroll owner", () => {
    expect(source).toContain("useStageProgress");
    expect(source).not.toContain("lenis");
    expect(source).not.toContain("ScrollTrigger");
  });

  it("does not mark inactive frames aria-hidden", () => {
    expect(source).not.toContain("aria-hidden={index");
  });
});
