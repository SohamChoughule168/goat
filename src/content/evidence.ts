export const SCOPE_VALUES = ["included", "optional", "scoped", "excluded"] as const;

export type ScopeValue = (typeof SCOPE_VALUES)[number];

export interface ScopeCell {
  state: ScopeValue;
  label: string;
}

export interface ScopeTier {
  slug: "starter" | "growth" | "pro" | "institutional";
  name: string;
  role: string;
  price: string | null;
  support: string;
}

export interface ScopeRow {
  label: string;
  note?: string;
  values: [ScopeCell, ScopeCell, ScopeCell, ScopeCell];
}

export interface ScopeGroup {
  id: "foundation" | "acquisition" | "application" | "governance";
  title: string;
  description: string;
  rows: ScopeRow[];
}

const included: ScopeCell = { state: "included", label: "Included" };
const optional: ScopeCell = { state: "optional", label: "Optional" };
const excluded: ScopeCell = { state: "excluded", label: "Not in scope" };

function cell(state: ScopeValue, label: string): ScopeCell {
  return { state, label };
}

/**
 * Prices for the three packaged tiers live in `src/content/packages.ts` and are
 * joined at render time. The institutional column is quoted after diagnosis;
 * no number is invented here.
 */
export const SCOPE_TIERS: ScopeTier[] = [
  {
    slug: "starter",
    name: "Starter",
    role: "A first credible presence",
    price: null,
    support: "14 days",
  },
  {
    slug: "growth",
    name: "Growth",
    role: "Website plus tracked enquiries",
    price: null,
    support: "30 days",
  },
  {
    slug: "pro",
    name: "Pro",
    role: "Application and portal work",
    price: null,
    support: "60 days",
  },
  {
    slug: "institutional",
    name: "Institutional",
    role: "Multi-branch groups and schools",
    price: null,
    support: "Care plan",
  },
];

export const SCOPE_GROUPS: ScopeGroup[] = [
  {
    id: "foundation",
    title: "Foundation",
    description: "The public surface: structure, design and the accessibility floor.",
    rows: [
      {
        label: "Public pages",
        values: [
          cell("included", "Up to 5"),
          cell("included", "Up to 10"),
          cell("scoped", "Custom"),
          cell("scoped", "Multi-site"),
        ],
      },
      {
        label: "Custom design and branding",
        values: [excluded, included, included, included],
      },
      {
        label: "Accessibility pass to WCAG 2.2 AA",
        note: "Keyboard, focus order, contrast and semantics checked before launch.",
        values: [included, included, included, included],
      },
      {
        label: "Performance budget measured on 4G",
        note: "LCP, CLS and INP budgets agreed before design and measured before launch.",
        values: [included, included, included, included],
      },
      {
        label: "Content model and page jobs",
        values: [
          cell("optional", "Basic"),
          included,
          included,
          cell("included", "Per branch"),
        ],
      },
      {
        label: "Local SEO foundation",
        values: [
          cell("included", "Basic"),
          included,
          included,
          cell("included", "Branch-level"),
        ],
      },
    ],
  },
  {
    id: "acquisition",
    title: "Acquisition",
    description: "The path from a public visit to a named, owned enquiry.",
    rows: [
      {
        label: "Enquiry form and WhatsApp",
        values: [included, included, included, included],
      },
      {
        label: "Source-tagged lead tracking",
        values: [excluded, included, included, included],
      },
      {
        label: "Analytics and Search Console",
        values: [excluded, included, included, included],
      },
      {
        label: "Branch and campus pages",
        values: [excluded, excluded, optional, included],
      },
      {
        label: "Paid search and social setup",
        values: [excluded, optional, optional, included],
      },
    ],
  },
  {
    id: "application",
    title: "Application",
    description: "The modules that replace manual work behind the public site.",
    rows: [
      {
        label: "Student portal and login",
        values: [excluded, optional, cell("included", "In scope"), included],
      },
      {
        label: "Admin panel and content management",
        values: [excluded, excluded, included, included],
      },
      {
        label: "Assessments and question bank",
        values: [excluded, optional, optional, included],
      },
      {
        label: "Fee payments and receipts",
        values: [excluded, optional, optional, included],
      },
      {
        label: "Multi-branch management",
        values: [excluded, excluded, optional, included],
      },
    ],
  },
  {
    id: "governance",
    title: "Governance",
    description: "The terms that make the build accountable after launch.",
    rows: [
      {
        label: "Written scope and architecture",
        values: [included, included, included, included],
      },
      {
        label: "Weekly staging reviews",
        values: [included, included, included, included],
      },
      {
        label: "Handover pack and runbook",
        values: [included, included, included, included],
      },
      {
        label: "Support after launch",
        values: [
          cell("included", "14 days"),
          cell("included", "30 days"),
          cell("included", "60 days"),
          cell("scoped", "Care plan"),
        ],
      },
      {
        label: "Named owner per seam",
        values: [excluded, excluded, included, included],
      },
      {
        label: "Quarterly review",
        values: [excluded, excluded, optional, included],
      },
    ],
  },
];

export interface ProcessStage {
  n: string;
  title: string;
  duration: string;
  summary: string;
  whatHappens: string;
  clientDoes: string;
  youReceive: string;
  pitfalls: string;
}

export const PROCESS_STAGES: ProcessStage[] = [
  {
    n: "01",
    title: "Discovery",
    duration: "Week 1",
    summary: "Understand the business before proposing a build.",
    whatHappens:
      "A structured session plus a written audit of your current state. We crawl the existing site or review the brief, measure performance on real devices, and map the competitive landscape.",
    clientDoes:
      "Shares access to existing accounts, introduces us to anyone whose input matters, and answers questions about audiences and goals.",
    youReceive:
      "A shared-vocabulary document: audiences defined, success metrics agreed, constraints documented.",
    pitfalls:
      "Skipping this to save time is the most common cause of scope creep later.",
  },
  {
    n: "02",
    title: "Strategy",
    duration: "Weeks 1–2",
    summary: "Turn findings into a scoped, priced plan.",
    whatHappens:
      "We produce a scoped plan: sitemap, content model, technical approach, milestone schedule and fixed quote. Every item traces back to a discovery finding.",
    clientDoes:
      "Reviews the plan, asks questions, and approves (or requests changes) within five working days.",
    youReceive:
      "A written scope of work with milestones, deliverables and payment terms. This is the contract.",
    pitfalls:
      "Vague briefs at this stage resurface mid-project as change requests.",
  },
  {
    n: "03",
    title: "Execution",
    duration: "Weeks 2–6+",
    summary: "Build in weekly, reviewable increments.",
    whatHappens:
      "Working software appears on staging in weekly increments. Each increment is reviewable, testable and reversible. You provide feedback asynchronously via shared documents.",
    clientDoes:
      "Reviews staging builds, provides content by agreed deadlines, responds to async questions within one business day.",
    youReceive:
      "A product that exists and improves each week, plus progress notes explaining what changed and why.",
    pitfalls:
      "Delayed content or feedback is the number-one cause of timeline slip.",
  },
  {
    n: "04",
    title: "Ownership",
    duration: "Post-launch",
    summary: "Launch, measure, then hand over every asset.",
    whatHappens:
      "We measure against discovery metrics, fix what data exposes, then hand over everything: repositories, hosting accounts, analytics, pipelines, documentation.",
    clientDoes:
      "Confirms the handover checklist and changes the passwords we were given during the engagement.",
    youReceive:
      "Full ownership of every asset created for you, plus documentation your next developer can read.",
    pitfalls:
      "Staying dependent on an agency after launch is a design flaw, not a business model.",
  },
];

export interface StackSeam {
  after: string;
  label: string;
  detail: string;
}

export const STACK_SEAMS: StackSeam[] = [
  {
    after: "02",
    label: "Enquiry object",
    detail: "Source, owner and stage are defined once, so the site and the pipeline agree.",
  },
  {
    after: "03",
    label: "Student record",
    detail: "An accepted enquiry becomes the same learner record the portal and assessments read.",
  },
  {
    after: "05",
    label: "Result event",
    detail: "An attempt publishes one result the portal and the parent update can both use.",
  },
  {
    after: "06",
    label: "Fee ledger",
    detail: "Every receipt reconciles to one ledger, whichever channel collected the money.",
  },
  {
    after: "07",
    label: "Message log",
    detail: "Delivery is recorded against the student, not against a staff phone.",
  },
];
