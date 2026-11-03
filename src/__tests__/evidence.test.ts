import { describe, expect, it } from "vitest";
import {
  PROCESS_STAGES,
  SCOPE_GROUPS,
  SCOPE_TIERS,
  SCOPE_VALUES,
  STACK_SEAMS,
} from "@/content/evidence";
import { stackLayers, trustCommitments } from "@/content/institutional";
import { PACKAGES } from "@/content/packages";

const layerIndexes = new Set(stackLayers.map((layer) => layer.index));

describe("scope matrix", () => {
  it("has the three packages plus an institutional column", () => {
    expect(SCOPE_TIERS.map((tier) => tier.slug)).toEqual([
      ...PACKAGES.map((item) => item.slug),
      "institutional",
    ]);
  });

  it("gives every row exactly one value per tier", () => {
    for (const group of SCOPE_GROUPS) {
      expect(group.rows.length).toBeGreaterThan(0);
      for (const row of group.rows) {
        expect(row.values).toHaveLength(SCOPE_TIERS.length);
        for (const cell of row.values) {
          expect(SCOPE_VALUES).toContain(cell.state);
          expect(cell.label.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("covers foundation, acquisition, application and governance", () => {
    expect(SCOPE_GROUPS.map((group) => group.id)).toEqual([
      "foundation",
      "acquisition",
      "application",
      "governance",
    ]);
  });

  it("has rows that differ and rows that stay constant", () => {
    const rows = SCOPE_GROUPS.flatMap((group) => group.rows);
    expect(rows.some((row) => new Set(row.values.map((cell) => cell.label)).size > 1)).toBe(true);
    expect(rows.some((row) => new Set(row.values.map((cell) => cell.label)).size === 1)).toBe(true);
  });

  it("keeps row labels unique across the matrix", () => {
    const labels = SCOPE_GROUPS.flatMap((group) => group.rows.map((row) => row.label));
    expect(new Set(labels).size).toBe(labels.length);
  });
});

describe("process stages", () => {
  it("keeps the four-phase sequence", () => {
    expect(PROCESS_STAGES.map((stage) => stage.n)).toEqual(["01", "02", "03", "04"]);
  });

  it("writes every field the timeline renders", () => {
    for (const stage of PROCESS_STAGES) {
      for (const value of [
        stage.title,
        stage.duration,
        stage.summary,
        stage.whatHappens,
        stage.clientDoes,
        stage.youReceive,
        stage.pitfalls,
      ]) {
        expect(value.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("system map seams", () => {
  it("connects real layers without repeating a seam", () => {
    const seen = new Set<string>();
    for (const seam of STACK_SEAMS) {
      expect(layerIndexes.has(seam.after)).toBe(true);
      expect(seen.has(seam.after)).toBe(false);
      seen.add(seam.after);
      expect(seam.label.trim().length).toBeGreaterThan(0);
      expect(seam.detail.trim().length).toBeGreaterThan(0);
    }
  });

  it("places a seam between layers rather than after the last one", () => {
    for (const seam of STACK_SEAMS) {
      expect(seam.after).not.toBe(stackLayers.at(-1)?.index);
    }
  });
});

describe("trust seal", () => {
  it("has six commitments for the six seal ticks", () => {
    expect(trustCommitments).toHaveLength(6);
  });
});
