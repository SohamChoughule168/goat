import { describe, expect, it } from "vitest";
import { stackLayers } from "@/content/institutional";
import { PACKAGES, formatINR } from "@/content/packages";
import {
  BLUEPRINT_BOTTLENECKS,
  BLUEPRINT_EXISTING_OPTIONS,
  BLUEPRINT_INSTITUTIONS,
  BLUEPRINT_LAYER_ORDER,
  BLUEPRINT_LAYERS,
  BLUEPRINT_STARTS,
  DEFAULT_BLUEPRINT_INPUT,
  FIT_LAYER_TO_BOTTLENECK,
  buildBlueprintPlan,
  formatBlueprintBrief,
  isBlueprintBottleneck,
  isBlueprintInstitution,
  isBlueprintLayer,
  isBlueprintStart,
  readBlueprintParams,
  type BlueprintInput,
} from "@/content/blueprint";

function input(overrides: Partial<BlueprintInput> = {}): BlueprintInput {
  return { ...DEFAULT_BLUEPRINT_INPUT, ...overrides };
}

describe("blueprint layer model", () => {
  it("mirrors the institutional stack order", () => {
    expect(BLUEPRINT_LAYER_ORDER).toEqual(stackLayers.map((layer) => layer.id));
    expect(BLUEPRINT_LAYERS.map((layer) => layer.id)).toEqual(
      stackLayers.map((layer) => layer.id),
    );
    expect(BLUEPRINT_LAYERS.map((layer) => layer.index)).toEqual(
      stackLayers.map((layer) => layer.index),
    );
    expect(BLUEPRINT_LAYERS.map((layer) => layer.title)).toEqual(
      stackLayers.map((layer) => layer.title),
    );
  });

  it("has unique option IDs and valid layer references", () => {
    const institutionIds = BLUEPRINT_INSTITUTIONS.map((item) => item.id);
    const bottleneckIds = BLUEPRINT_BOTTLENECKS.map((item) => item.id);
    const startIds = BLUEPRINT_STARTS.map((item) => item.id);

    expect(new Set(institutionIds).size).toBe(institutionIds.length);
    expect(new Set(bottleneckIds).size).toBe(bottleneckIds.length);
    expect(new Set(startIds).size).toBe(startIds.length);

    for (const institution of BLUEPRINT_INSTITUTIONS) {
      expect(institution.base.length).toBeGreaterThan(0);
      for (const id of institution.base) expect(isBlueprintLayer(id)).toBe(true);
    }

    for (const bottleneck of BLUEPRINT_BOTTLENECKS) {
      expect(isBlueprintLayer(bottleneck.layer)).toBe(true);
      expect(bottleneck.add).toContain(bottleneck.layer);
      for (const id of bottleneck.add) expect(isBlueprintLayer(id)).toBe(true);
    }

    for (const option of BLUEPRINT_EXISTING_OPTIONS) {
      expect(isBlueprintLayer(option.id)).toBe(true);
    }

    for (const [layer, bottleneck] of Object.entries(FIT_LAYER_TO_BOTTLENECK)) {
      expect(isBlueprintLayer(layer)).toBe(true);
      expect(isBlueprintBottleneck(bottleneck)).toBe(true);
    }
  });
});

describe("blueprint plan", () => {
  it("builds the default coaching plan as a growth sequence", () => {
    const plan = buildBlueprintPlan(DEFAULT_BLUEPRINT_INPUT);

    expect(plan.buildLayers.map((layer) => layer.id)).toEqual([
      "website",
      "admissions",
      "communications",
      "intelligence",
    ]);
    expect(plan.connections).toEqual([]);
    expect(plan.phases.map((phase) => phase.index)).toEqual(["01", "02", "03"]);
    expect(plan.phases.map((phase) => phase.title)).toEqual([
      "Foundation",
      "Conversion",
      "Intelligence",
    ]);
    expect(plan.phases.find((phase) => phase.priority)?.id).toBe("conversion");
    expect(plan.package.id).toBe("growth");
    expect(plan.package.price).toBe(formatINR(59999));
    expect(plan.package.href).toBe("/estimate/?package=growth#estimator");
    expect(plan.priorityMove.layer.id).toBe("admissions");
    expect(plan.measures).toHaveLength(3);
    expect(plan.summary).toContain("A front office");
    expect(plan.summary).toContain("Interest arrives");
  });

  it("recommends the public-site package when only the website is new", () => {
    const plan = buildBlueprintPlan(
      input({
        institution: "coaching",
        bottleneck: "website",
        existing: ["admissions", "communications"],
      }),
    );

    expect(plan.buildLayers.map((layer) => layer.id)).toEqual(["website"]);
    expect(plan.connections.map((layer) => layer.id)).toEqual([
      "admissions",
      "communications",
    ]);
    expect(plan.package.id).toBe("starter");
    expect(plan.package.price).toBe(formatINR(29999));
    expect(plan.measures).toHaveLength(3);
  });

  it("moves a multi-branch sequence into an institutional engagement", () => {
    const plan = buildBlueprintPlan({
      institution: "multi-branch",
      bottleneck: "branch-consistency",
      existing: [],
      start: "quarter",
    });

    expect(plan.buildLayers.map((layer) => layer.id)).toEqual([
      "brand",
      "website",
      "admissions",
      "communications",
      "intelligence",
    ]);
    expect(plan.package.id).toBe("institutional");
    expect(plan.package.price).toBe("From ₹3,00,000");
    expect(plan.package.href).toBe("/contact/?intent=institutional");
  });

  it("recommends Pro when an application module is in the build", () => {
    const plan = buildBlueprintPlan({
      institution: "edtech",
      bottleneck: "parent-updates",
      existing: [],
      start: "month",
    });

    expect(plan.buildLayers.map((layer) => layer.id)).toContain("portal");
    expect(plan.package.id).toBe("pro");
    expect(plan.package.price).toBe(formatINR(149999));
    expect(plan.scope.some((line) => line.startsWith("Data migration"))).toBe(true);
  });

  it("falls back to an audit when every relevant layer already exists", () => {
    const plan = buildBlueprintPlan({
      institution: "schools",
      bottleneck: "parent-updates",
      existing: [
        "brand",
        "website",
        "admissions",
        "portal",
        "payments",
        "communications",
      ],
      start: "exploring",
    });

    expect(plan.buildLayers).toEqual([]);
    expect(plan.package.id).toBe("audit");
    expect(plan.package.price).toBe("Scoped in writing");
    expect(plan.measures).toHaveLength(3);
    expect(plan.timelineNote).toContain("No date is assumed");
  });

  it("phases every build layer exactly once", () => {
    const plan = buildBlueprintPlan(
      input({ institution: "schools", bottleneck: "fees-records" }),
    );
    const phased = plan.phases.flatMap((phase) =>
      phase.layers.map((layer) => layer.id),
    );

    expect([...phased].sort()).toEqual(
      [...plan.buildLayers.map((layer) => layer.id)].sort(),
    );
    expect(new Set(phased).size).toBe(phased.length);
    expect(plan.phases.map((phase) => phase.title)).toEqual([
      "Foundation",
      "Conversion",
      "Operations",
    ]);
    expect(plan.package.id).toBe("pro");
  });
});

describe("blueprint parameters", () => {
  it("reads a fit-layer priority and repeated existing layers", () => {
    const parsed = readBlueprintParams(
      "?priority=admissions&type=schools&start=month&have=website,admissions&have=communications,assessments",
    );

    expect(parsed).toEqual({
      institution: "schools",
      bottleneck: "enquiries",
      existing: ["website", "admissions", "communications"],
      start: "month",
    });
  });

  it("maps fit layers that have no direct bottleneck ID", () => {
    expect(readBlueprintParams("?priority=brand").bottleneck).toBe(
      "branch-consistency",
    );
    expect(readBlueprintParams("?priority=intelligence").bottleneck).toBe(
      "reporting",
    );
  });

  it("ignores unknown values and keeps safe defaults", () => {
    const parsed = readBlueprintParams(
      "?priority=unknown&type=unknown&start=unknown&have=unknown,assessments",
    );

    expect(parsed).toEqual({
      institution: "coaching",
      bottleneck: "enquiries",
      existing: [],
      start: "quarter",
    });
    expect(isBlueprintInstitution("schools")).toBe(true);
    expect(isBlueprintStart("month")).toBe(true);
  });
});

describe("blueprint brief", () => {
  it("writes a sendable working draft without placeholder values", () => {
    const brief = formatBlueprintBrief(DEFAULT_BLUEPRINT_INPUT);

    expect(brief).toContain("working draft, not a quote");
    expect(brief).toContain("Institution: Coaching institute");
    expect(brief).toContain("Priority: Enquiries go cold");
    expect(brief).toContain("Window: Next quarter");
    expect(brief).toContain("Already in place: None recorded");
    expect(brief).toContain("First move: Put every enquiry on one owned path.");
    expect(brief).toContain("Closest package: Growth (₹59,999)");
    expect(brief).toContain("I would like to review this sequence with the studio.");
    expect(brief).not.toContain("undefined");
  });

  it("lists existing layers and the connect set", () => {
    const brief = formatBlueprintBrief(
      input({ existing: ["website", "admissions"] }),
    );

    expect(brief).toContain("Already in place: Public website, Admissions tracking");
    expect(brief).toContain("Connect: Website, Admissions");
  });

  it("keeps package prices aligned with the published tiers", () => {
    for (const slug of ["starter", "growth", "pro"] as const) {
      const tier = PACKAGES.find((item) => item.slug === slug);
      expect(tier).toBeDefined();
      expect(formatINR(tier!.price)).toMatch(/^₹/);
    }
  });
});
