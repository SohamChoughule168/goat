import { stackLayers } from "@/content/institutional";
import { PACKAGES, formatINR, type PackageSlug } from "@/content/packages";

export type BlueprintLayerId =
  | "brand"
  | "website"
  | "admissions"
  | "portal"
  | "assessments"
  | "payments"
  | "communications"
  | "intelligence";

export type BlueprintInstitutionId = "coaching" | "schools" | "multi-branch" | "edtech";

export type BlueprintBottleneckId =
  | "website"
  | "enquiries"
  | "parent-updates"
  | "fees-records"
  | "branch-consistency"
  | "reporting";

export type BlueprintStartId = "exploring" | "quarter" | "month";

export type BlueprintPackageId = PackageSlug | "institutional" | "audit";

export type BlueprintExistingLayerId = Exclude<
  BlueprintLayerId,
  "assessments" | "intelligence"
>;

export interface BlueprintInstitution {
  id: BlueprintInstitutionId;
  label: string;
  detail: string;
  summary: string;
  base: BlueprintLayerId[];
}

export interface BlueprintBottleneck {
  id: BlueprintBottleneckId;
  label: string;
  short: string;
  detail: string;
  planLine: string;
  add: BlueprintLayerId[];
  layer: BlueprintLayerId;
  move: {
    title: string;
    detail: string;
  };
}

export interface BlueprintStart {
  id: BlueprintStartId;
  label: string;
  detail: string;
  note: string;
}

export interface BlueprintLayer {
  id: BlueprintLayerId;
  index: string;
  title: string;
  scope: string;
  measure: string;
}

export interface BlueprintExistingOption {
  id: BlueprintExistingLayerId;
  label: string;
}

export interface BlueprintInput {
  institution: BlueprintInstitutionId;
  bottleneck: BlueprintBottleneckId;
  existing: BlueprintExistingLayerId[];
  start: BlueprintStartId;
}

export interface BlueprintPhase {
  id: string;
  index: string;
  title: string;
  priority: boolean;
  layers: BlueprintLayer[];
}

export interface BlueprintPackage {
  id: BlueprintPackageId;
  name: string;
  price: string;
  note: string;
  reason: string;
  href: string;
}

export interface BlueprintPlan {
  headline: string;
  summary: string;
  buildLayers: BlueprintLayer[];
  connections: BlueprintLayer[];
  phases: BlueprintPhase[];
  priorityMove: {
    title: string;
    detail: string;
    layer: BlueprintLayer;
  };
  measures: string[];
  package: BlueprintPackage;
  scope: string[];
  timelineNote: string;
}

export const BLUEPRINT_LAYER_ORDER: readonly BlueprintLayerId[] = [
  "brand",
  "website",
  "admissions",
  "portal",
  "assessments",
  "payments",
  "communications",
  "intelligence",
];

const LAYER_SCOPE: Record<BlueprintLayerId, string> = {
  brand: "Identity, templates and branch rules",
  website: "Offer, course architecture and enquiry path",
  admissions: "Source tags, ownership and follow-up stages",
  portal: "Roles, records and one source of truth",
  assessments: "Question bank, scheduling and results",
  payments: "Collection, receipts and reconciliation",
  communications: "Templates, schedules and delivery records",
  intelligence: "Definitions, one view and a review cadence",
};

const LAYER_MEASURE: Record<BlueprintLayerId, string> = {
  brand: "Branch assets on approved templates",
  website: "Qualified enquiries by source",
  admissions: "Enquiry-to-counselling conversion",
  portal: "Repeat status calls per week",
  assessments: "Test turnaround time",
  payments: "Unreconciled fee lines at month end",
  communications: "Parent notices with a delivery record",
  intelligence: "Time to one trusted monthly view",
};

const stackLayerById = new Map(stackLayers.map((layer) => [layer.id, layer]));

export const BLUEPRINT_LAYERS: BlueprintLayer[] = BLUEPRINT_LAYER_ORDER.map((id) => {
  const source = stackLayerById.get(id);
  if (!source) {
    throw new Error(`Blueprint layer "${id}" is missing from stackLayers.`);
  }

  return {
    id,
    index: source.index,
    title: source.title,
    scope: LAYER_SCOPE[id],
    measure: LAYER_MEASURE[id],
  };
});

const layerById = new Map(BLUEPRINT_LAYERS.map((layer) => [layer.id, layer]));

export const BLUEPRINT_INSTITUTIONS: BlueprintInstitution[] = [
  {
    id: "coaching",
    label: "Coaching institute",
    detail: "Classes, batches and test prep, from one centre to a few.",
    summary:
      "A front office where course interest becomes a tracked admission, and the batch record stays usable after the call.",
    base: ["website", "admissions", "communications"],
  },
  {
    id: "schools",
    label: "School",
    detail: "A K–12 school with sections, parents and a busy office.",
    summary:
      "A public front door and a parent-facing record that reduce the questions the office answers twice.",
    base: ["website", "admissions", "portal", "communications"],
  },
  {
    id: "multi-branch",
    label: "Multi-branch group",
    detail: "Two or more campuses sharing a name and a standard.",
    summary:
      "One brand and one reporting vocabulary, with branch-level operation still visible to the people running it.",
    base: ["brand", "website", "admissions", "intelligence"],
  },
  {
    id: "edtech",
    label: "Edtech team",
    detail: "A cohort-led product with learner accounts and online tests.",
    summary:
      "A learner account that connects onboarding, assessments, payments and the cohort view.",
    base: ["website", "portal", "assessments", "payments"],
  },
];

export const BLUEPRINT_BOTTLENECKS: BlueprintBottleneck[] = [
  {
    id: "website",
    label: "The public site undersells",
    short: "Site-first",
    detail: "The offer, faculty and proof are hard to read before a conversation.",
    planLine: "The public page is doing too little work before the first conversation.",
    add: ["website", "admissions"],
    layer: "website",
    move: {
      title: "Fix the public offer before the traffic.",
      detail:
        "One page that states the programme, the proof and the next step — then measure what it produces.",
    },
  },
  {
    id: "enquiries",
    label: "Enquiries go cold",
    short: "Admissions-first",
    detail: "There is no single owner or next action after the first call.",
    planLine: "Interest arrives, then sits in several inboxes without a named owner.",
    add: ["admissions", "communications", "intelligence"],
    layer: "admissions",
    move: {
      title: "Put every enquiry on one owned path.",
      detail:
        "A source tag, an owner and a next action from first contact. Do this before buying more traffic.",
    },
  },
  {
    id: "parent-updates",
    label: "Parents keep calling",
    short: "Parent communications",
    detail: "Routine updates live in personal WhatsApp threads and memory.",
    planLine: "Routine updates depend on individual staff phones rather than a record.",
    add: ["communications", "portal"],
    layer: "communications",
    move: {
      title: "Move routine updates off personal phones.",
      detail:
        "Templates, a schedule and a delivery record for the notices parents actually ask about.",
    },
  },
  {
    id: "fees-records",
    label: "Fees don't reconcile",
    short: "Fee operations",
    detail: "Receipts and student records are assembled by hand at month end.",
    planLine: "The fee record is reconstructed manually, so the month-end number is always in question.",
    add: ["payments", "portal"],
    layer: "payments",
    move: {
      title: "Make the fee record close without assembly.",
      detail:
        "One collection path, receipts at source and an instalment view accounts can reconcile.",
    },
  },
  {
    id: "branch-consistency",
    label: "Branches look unrelated",
    short: "Brand governance",
    detail: "Every campus improvises its own site, deck and tone.",
    planLine: "Local teams are producing their own versions because the centre has no usable system.",
    add: ["brand", "communications", "intelligence"],
    layer: "brand",
    move: {
      title: "Give every branch the same rules.",
      detail:
        "Approved marks, templates and a governance model local teams can use without asking.",
    },
  },
  {
    id: "reporting",
    label: "Reports disagree",
    short: "Reporting",
    detail: "Leadership gets a different truth from each team.",
    planLine: "The numbers are not trusted because the definitions were never settled.",
    add: ["intelligence", "admissions"],
    layer: "intelligence",
    move: {
      title: "Agree what the numbers mean.",
      detail:
        "Definitions first, then one view of enquiries, cohorts and fees that leadership can trust.",
    },
  },
];

export const BLUEPRINT_STARTS: BlueprintStart[] = [
  {
    id: "exploring",
    label: "Exploring",
    detail: "No fixed date",
    note: "The sequence can start when the diagnosis is agreed. No date is assumed.",
  },
  {
    id: "quarter",
    label: "Next quarter",
    detail: "A normal planning window",
    note: "A realistic window for a scoped build and a handover. The sequence matters more than the date.",
  },
  {
    id: "month",
    label: "This month",
    detail: "A tight window",
    note: "A tight window. Start with one layer and keep the rest as a written next phase.",
  },
];

export const BLUEPRINT_EXISTING_OPTIONS: BlueprintExistingOption[] = [
  { id: "brand", label: "Brand system" },
  { id: "website", label: "Public website" },
  { id: "admissions", label: "Admissions tracking" },
  { id: "portal", label: "Student portal" },
  { id: "payments", label: "Fee payments" },
  { id: "communications", label: "Parent communications" },
];

export const DEFAULT_BLUEPRINT_INPUT: BlueprintInput = {
  institution: "coaching",
  bottleneck: "enquiries",
  existing: [],
  start: "quarter",
};

export const FIT_LAYER_TO_BOTTLENECK: Record<string, BlueprintBottleneckId> = {
  brand: "branch-consistency",
  website: "website",
  admissions: "enquiries",
  portal: "fees-records",
  intelligence: "reporting",
};

const BLUEPRINT_PHASES: {
  id: string;
  title: string;
  layers: BlueprintLayerId[];
}[] = [
  { id: "foundation", title: "Foundation", layers: ["brand", "website"] },
  { id: "conversion", title: "Conversion", layers: ["admissions", "communications"] },
  { id: "operations", title: "Operations", layers: ["portal", "assessments", "payments"] },
  { id: "intelligence", title: "Intelligence", layers: ["intelligence"] },
];

const APPLICATION_LAYERS: BlueprintLayerId[] = ["portal", "assessments", "payments"];
const CONVERSION_LAYERS: BlueprintLayerId[] = [
  "brand",
  "admissions",
  "communications",
  "intelligence",
];

export function isBlueprintLayer(value: string): value is BlueprintLayerId {
  return (BLUEPRINT_LAYER_ORDER as readonly string[]).includes(value);
}

export function isBlueprintExistingLayer(
  value: string,
): value is BlueprintExistingLayerId {
  return BLUEPRINT_EXISTING_OPTIONS.some((option) => option.id === value);
}

export function isBlueprintBottleneck(
  value: string,
): value is BlueprintBottleneckId {
  return BLUEPRINT_BOTTLENECKS.some((option) => option.id === value);
}

export function isBlueprintInstitution(
  value: string,
): value is BlueprintInstitutionId {
  return BLUEPRINT_INSTITUTIONS.some((option) => option.id === value);
}

export function isBlueprintStart(value: string): value is BlueprintStartId {
  return BLUEPRINT_STARTS.some((option) => option.id === value);
}

export function getBlueprintLayer(id: BlueprintLayerId): BlueprintLayer {
  const layer = layerById.get(id);
  if (!layer) {
    throw new Error(`Unknown blueprint layer "${id}".`);
  }
  return layer;
}

function packageFor(
  institution: BlueprintInstitution,
  buildLayers: BlueprintLayer[],
): BlueprintPackage {
  const buildIds = buildLayers.map((layer) => layer.id);

  if (buildIds.length === 0) {
    return {
      id: "audit",
      name: "Systems audit",
      price: "Scoped in writing",
      note: "A fixed-fee diagnosis. No build is assumed.",
      reason:
        "The listed layers already exist. The next useful step is a diagnosis, not another build.",
      href: "/contact/?intent=systems-audit",
    };
  }

  const hasApplication = buildIds.some((id) => APPLICATION_LAYERS.includes(id));
  const hasConversion = buildIds.some((id) => CONVERSION_LAYERS.includes(id));
  const isInstitutional =
    institution.id === "multi-branch" &&
    buildIds.length >= 4 &&
    (hasApplication || buildIds.includes("intelligence"));

  if (isInstitutional) {
    return {
      id: "institutional",
      name: "Institutional engagement",
      price: "From ₹3,00,000",
      note: "A governed multi-branch rollout, scoped in writing.",
      reason:
        "The build crosses branches and needs a shared reporting layer, so it moves beyond a single-site package.",
      href: "/contact/?intent=institutional",
    };
  }

  const id: PackageSlug = hasApplication ? "pro" : hasConversion ? "growth" : "starter";
  const tier = PACKAGES.find((item) => item.slug === id);

  if (!tier) {
    throw new Error(`Package "${id}" is missing from PACKAGES.`);
  }

  return {
    id: tier.slug,
    name: tier.name,
    price: formatINR(tier.price),
    note:
      id === "starter"
        ? "The published starting point for a public site."
        : id === "growth"
          ? "The published starting point for a public site plus a conversion layer."
          : "The published starting point for a public site plus an application module.",
    reason:
      id === "pro"
        ? "The sequence includes a portal, assessment or payment module."
        : id === "growth"
          ? "The sequence includes admissions, communications, brand or reporting work."
          : "The sequence is a public-site scope.",
    href: `/estimate/?package=${tier.slug}#estimator`,
  };
}

function scopeFor(buildLayers: BlueprintLayer[]): string[] {
  const hasApplication = buildLayers.some((layer) =>
    APPLICATION_LAYERS.includes(layer.id),
  );

  return [
    "A fixed price before the diagnosis is agreed.",
    hasApplication
      ? "Data migration from an existing ERP, or modules outside the agreed sequence."
      : "Portal, assessment or payment modules that are not in this sequence.",
    "Tool licences, ad spend and ongoing content production, unless written into scope.",
  ];
}

export function buildBlueprintPlan(input: BlueprintInput): BlueprintPlan {
  const institution =
    BLUEPRINT_INSTITUTIONS.find((item) => item.id === input.institution) ??
    BLUEPRINT_INSTITUTIONS[0];
  const bottleneck =
    BLUEPRINT_BOTTLENECKS.find((item) => item.id === input.bottleneck) ??
    BLUEPRINT_BOTTLENECKS[0];
  const start =
    BLUEPRINT_STARTS.find((item) => item.id === input.start) ?? BLUEPRINT_STARTS[1];

  const existing = new Set<BlueprintLayerId>(
    input.existing.filter(isBlueprintExistingLayer),
  );
  const relevant = new Set<BlueprintLayerId>([...institution.base, ...bottleneck.add]);
  const buildLayers = BLUEPRINT_LAYER_ORDER.filter(
    (id) => relevant.has(id) && !existing.has(id),
  ).map(getBlueprintLayer);
  const connections = BLUEPRINT_LAYER_ORDER.filter(
    (id) => relevant.has(id) && existing.has(id),
  ).map(getBlueprintLayer);

  const buildIds = new Set(buildLayers.map((layer) => layer.id));
  const phases: BlueprintPhase[] = BLUEPRINT_PHASES.map((phase) => ({
    ...phase,
    layers: phase.layers.filter((id) => buildIds.has(id)).map(getBlueprintLayer),
  }))
    .filter((phase) => phase.layers.length > 0)
    .map((phase, index) => ({
      id: phase.id,
      index: String(index + 1).padStart(2, "0"),
      title: phase.title,
      priority: buildIds.has(bottleneck.layer) && phase.layers.some((layer) => layer.id === bottleneck.layer),
      layers: phase.layers,
    }));

  const measures = buildLayers
    .slice(0, 3)
    .map((layer) => layer.measure);
  if (measures.length < 3) {
    for (const layer of connections) {
      if (measures.length >= 3) break;
      if (!measures.includes(layer.measure)) measures.push(layer.measure);
    }
  }
  for (const fallback of [
    "One agreed definition of an enquiry",
    "One reconciled month-end fee view",
    "One named owner for each decision",
  ]) {
    if (measures.length >= 3) break;
    if (!measures.includes(fallback)) measures.push(fallback);
  }

  return {
    headline: `${institution.label} / ${bottleneck.short}`,
    summary: `${institution.summary} ${bottleneck.planLine}`,
    buildLayers,
    connections,
    phases,
    priorityMove: {
      title: bottleneck.move.title,
      detail: bottleneck.move.detail,
      layer: getBlueprintLayer(bottleneck.layer),
    },
    measures,
    package: packageFor(institution, buildLayers),
    scope: scopeFor(buildLayers),
    timelineNote: start.note,
  };
}

export function readBlueprintParams(search: string): BlueprintInput {
  const params = new URLSearchParams(search);
  const rawPriority = params.get("priority") ?? "";
  const priority = isBlueprintBottleneck(rawPriority)
    ? rawPriority
    : FIT_LAYER_TO_BOTTLENECK[rawPriority];

  const rawType = params.get("type") ?? "";
  const institution = isBlueprintInstitution(rawType)
    ? rawType
    : DEFAULT_BLUEPRINT_INPUT.institution;

  const rawStart = params.get("start") ?? "";
  const start = isBlueprintStart(rawStart) ? rawStart : DEFAULT_BLUEPRINT_INPUT.start;

  const existing = Array.from(
    new Set(
      params
        .getAll("have")
        .flatMap((value) => value.split(","))
        .map((value) => value.trim())
        .filter(isBlueprintExistingLayer),
    ),
  );

  return {
    institution,
    bottleneck: priority ?? DEFAULT_BLUEPRINT_INPUT.bottleneck,
    existing,
    start,
  };
}

export function formatBlueprintBrief(
  input: BlueprintInput,
  plan: BlueprintPlan = buildBlueprintPlan(input),
): string {
  const institution =
    BLUEPRINT_INSTITUTIONS.find((item) => item.id === input.institution) ??
    BLUEPRINT_INSTITUTIONS[0];
  const bottleneck =
    BLUEPRINT_BOTTLENECKS.find((item) => item.id === input.bottleneck) ??
    BLUEPRINT_BOTTLENECKS[0];
  const start =
    BLUEPRINT_STARTS.find((item) => item.id === input.start) ?? BLUEPRINT_STARTS[1];
  const existingLabels = input.existing
    .map((id) => BLUEPRINT_EXISTING_OPTIONS.find((option) => option.id === id)?.label)
    .filter(Boolean);

  return [
    "Institution blueprint — working draft, not a quote.",
    `Institution: ${institution.label}`,
    `Priority: ${bottleneck.label}`,
    `Window: ${start.label}`,
    `Already in place: ${existingLabels.length > 0 ? existingLabels.join(", ") : "None recorded"}`,
    `Build sequence: ${
      plan.buildLayers.length > 0
        ? plan.buildLayers.map((layer) => layer.title).join(", ")
        : "No new layer recommended"
    }`,
    `Connect: ${
      plan.connections.length > 0
        ? plan.connections.map((layer) => layer.title).join(", ")
        : "None recorded"
    }`,
    `First move: ${plan.priorityMove.title}`,
    `Closest package: ${plan.package.name} (${plan.package.price})`,
    `Measures: ${plan.measures.join("; ")}`,
    `Excludes: ${plan.scope.join(" ")}`,
    "I would like to review this sequence with the studio.",
  ].join("\n");
}
