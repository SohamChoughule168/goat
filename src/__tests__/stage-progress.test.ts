import { describe, expect, it } from "vitest";
import { sectionProgress, stageIndex } from "@/lib/motion/stage-progress";

describe("stage progress", () => {
  it("maps overall progress to a frame index", () => {
    expect(stageIndex(0, 5)).toBe(0);
    expect(stageIndex(0.19, 5)).toBe(0);
    expect(stageIndex(0.2, 5)).toBe(1);
    expect(stageIndex(0.79, 5)).toBe(3);
    expect(stageIndex(1, 5)).toBe(4);
  });

  it("clamps progress outside the section", () => {
    expect(stageIndex(-1, 5)).toBe(0);
    expect(stageIndex(2, 5)).toBe(4);
    expect(stageIndex(0.5, 0)).toBe(0);
    expect(stageIndex(0.5, 1)).toBe(0);
  });

  it("measures section travel, not viewport position", () => {
    expect(sectionProgress(0, 4000, 1000)).toBe(0);
    expect(sectionProgress(-1500, 4000, 1000)).toBe(0.5);
    expect(sectionProgress(-3000, 4000, 1000)).toBe(1);
    expect(sectionProgress(-9000, 4000, 1000)).toBe(1);
  });

  it("treats a section shorter than the viewport as complete once it reaches the top", () => {
    expect(sectionProgress(200, 600, 1000)).toBe(0);
    expect(sectionProgress(0, 600, 1000)).toBe(1);
    expect(sectionProgress(-200, 600, 1000)).toBe(1);
  });
});
