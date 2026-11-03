import { PACKAGES, formatINR, type PackageSlug } from "@/content/packages";

export type FitLayerId =
  | "brand"
  | "website"
  | "admissions"
  | "portal"
  | "intelligence";

export type FitPackage = PackageSlug | "institutional";

export type FitBandId = "foundation" | "connected" | "compound";

export interface FitOption {
  value: string;
  label: string;
  detail: string;
  score: number;
  layer?: FitLayerId;
}

export interface FitQuestion {
  id: "shape" | "enquiries" | "fees" | "updates" | "first-fix";
  index: string;
  prompt: string;
  help: string;
  options: FitOption[];
}

export interface FitAnswers {
  [questionId: string]: string;
}

export interface FitBand {
  id: FitBandId;
  label: string;
  summary: string;
}

export interface FitBottleneck {
  id: FitLayerId;
  label: string;
  detail: string;
}

export interface FitPackageRecommendation {
  slug: FitPackage;
  name: string;
  price: string;
  note: string;
  href: string;
}

export interface FitResult {
  score: number;
  maxScore: number;
  band: FitBand;
  bottleneck: FitBottleneck;
  package: FitPackageRecommendation;
}

export const FIT_QUESTIONS: FitQuestion[] = [
  {
    id: "shape",
    index: "01",
    prompt: "What does the institution look like today?",
    help: "Count campuses, branches and online cohorts that share one brand.",
    options: [
      {
        value: "single",
        label: "One campus",
        detail: "A single physical location and one front office.",
        score: 0,
      },
      {
        value: "multi",
        label: "A few branches",
        detail: "Two to five locations, loosely shared systems.",
        score: 1,
      },
      {
        value: "group",
        label: "A school group or network",
        detail: "Multiple brands, locations or owner-operated sites.",
        score: 2,
      },
      {
        value: "online",
        label: "Online-first institute",
        detail: "Cohorts and counselling happen primarily online.",
        score: 1,
      },
    ],
  },
  {
    id: "enquiries",
    index: "02",
    prompt: "Where does a new enquiry land?",
    help: "Think about the last ten enquiries, not the intended process.",
    options: [
      {
        value: "one-inbox",
        label: "One shared inbox",
        detail: "A named person owns follow-up and knows what happened.",
        score: 0,
      },
      {
        value: "whatsapp-calls",
        label: "WhatsApp, calls and walk-ins",
        detail: "Enquiries arrive in personal threads and paper registers.",
        score: 1,
      },
      {
        value: "tagged-pipeline",
        label: "A tagged pipeline",
        detail: "Every enquiry has a stage, owner and next action.",
        score: 2,
      },
    ],
  },
  {
    id: "fees",
    index: "03",
    prompt: "How are fees and student records kept?",
    help: "Include receipts, attendance and the record a parent would ask for.",
    options: [
      {
        value: "spreadsheet",
        label: "Spreadsheets and paper",
        detail: "Reconciling fees is a monthly manual exercise.",
        score: 0,
      },
      {
        value: "payment-links",
        label: "Payment links and manual receipts",
        detail: "Collection works, but the record is assembled by hand.",
        score: 1,
      },
      {
        value: "system-receipts",
        label: "A system with receipts",
        detail: "Fees, balances and student records reconcile in one place.",
        score: 2,
      },
    ],
  },
  {
    id: "updates",
    index: "04",
    prompt: "How do parents and students get updates?",
    help: "Consider routine updates, not the emergency call.",
    options: [
      {
        value: "calls",
        label: "Calls and personal messages",
        detail: "Updates depend on who remembers to send them.",
        score: 0,
      },
      {
        value: "scattered-whatsapp",
        label: "Scattered WhatsApp groups",
        detail: "Broadcasts happen, but there is no reliable record.",
        score: 1,
      },
      {
        value: "portal-scheduled",
        label: "A portal or scheduled comms",
        detail: "Updates go out on a schedule and can be checked later.",
        score: 2,
      },
    ],
  },
  {
    id: "first-fix",
    index: "05",
    prompt: "If one thing moved first, what would it be?",
    help: "Pick the bottleneck you would fix on Monday, not the biggest project.",
    options: [
      {
        value: "website",
        label: "The public website",
        detail: "Make the offer, faculty and outcomes legible before the enquiry.",
        score: 0,
        layer: "website",
      },
      {
        value: "admissions",
        label: "Admissions follow-up",
        detail: "Turn every enquiry into a tracked next action.",
        score: 0,
        layer: "admissions",
      },
      {
        value: "fees-portal",
        label: "Fees and student records",
        detail: "Give the front office one reliable record.",
        score: 0,
        layer: "portal",
      },
      {
        value: "intelligence",
        label: "Reporting and decisions",
        detail: "Agree on the numbers before building another dashboard.",
        score: 0,
        layer: "intelligence",
      },
    ],
  },
];

const SCORED_QUESTIONS = FIT_QUESTIONS.filter(
  (question) => question.id !== "first-fix",
);

export const FIT_MAX_SCORE = SCORED_QUESTIONS.reduce(
  (total, question) =>
    total + Math.max(...question.options.map((option) => option.score)),
  0,
);

const BANDS: FitBand[] = [
  {
    id: "foundation",
    label: "Foundation",
    summary:
      "The basics are still manual. Start with a credible public site and one visible enquiry path.",
  },
  {
    id: "connected",
    label: "Connected",
    summary:
      "The parts exist, but they do not hand off cleanly. Connect the enquiry path before adding more surface.",
  },
  {
    id: "compound",
    label: "Compound",
    summary:
      "The operating layer is in place. Use the data you already have to tighten follow-up, fees and reporting.",
  },
];

const BOTTLENECKS: Record<FitLayerId, FitBottleneck> = {
  brand: {
    id: "brand",
    label: "The brand layer",
    detail:
      "The identity is not carrying enough trust or consistency. Fix the public expression before scaling the surface.",
  },
  website: {
    id: "website",
    label: "The public front door",
    detail:
      "The site is doing too little work before a conversation starts. Make the offer, proof and next step legible on a phone.",
  },
  admissions: {
    id: "admissions",
    label: "The admissions handoff",
    detail:
      "Enquiries are arriving, but ownership and next actions are unclear. Fix the handoff before spending more on traffic.",
  },
  portal: {
    id: "portal",
    label: "The student record",
    detail:
      "Fees and records are being reconciled by hand. Give the front office one reliable system of record.",
  },
  intelligence: {
    id: "intelligence",
    label: "The reporting layer",
    detail:
      "Decisions depend on assembled spreadsheets. Agree on definitions and one reporting view before adding tools.",
  },
};

function priceFor(slug: PackageSlug): string {
  const tier = PACKAGES.find((item) => item.slug === slug);
  return tier ? formatINR(tier.price) : "";
}

const PACKAGE_RECOMMENDATIONS: Record<FitPackage, FitPackageRecommendation> = {
  starter: {
    slug: "starter",
    name: "Starter",
    price: priceFor("starter"),
    note: "A credible public site with one clear enquiry path.",
    href: "/estimate?package=starter#estimator",
  },
  growth: {
    slug: "growth",
    name: "Growth",
    price: priceFor("growth"),
    note: "A public site plus tracked enquiry handoff and local search setup.",
    href: "/estimate?package=growth#estimator",
  },
  pro: {
    slug: "pro",
    name: "Pro",
    price: priceFor("pro"),
    note: "A site plus the portal or management modules the front office needs.",
    href: "/estimate?package=pro#estimator",
  },
  institutional: {
    slug: "institutional",
    name: "Institutional",
    price: "From ₹3,00,000",
    note: "A governed multi-branch rollout, scoped in writing.",
    href: "/contact?intent=institutional",
  },
};

function bandFor(score: number): FitBand {
  if (score <= 2) return BANDS[0];
  if (score <= 5) return BANDS[1];
  return BANDS[2];
}

function packageFor(shape: string | undefined, score: number): FitPackage {
  if (shape === "group" && score >= 4) return "institutional";
  if (score <= 2) return "starter";
  if (score <= 5) return "growth";
  return "pro";
}

function bottleneckFor(answers: FitAnswers): FitBottleneck {
  const firstFix = FIT_QUESTIONS.find(
    (question) => question.id === "first-fix",
  );
  const selected = firstFix?.options.find(
    (option) => option.value === answers["first-fix"],
  );
  return BOTTLENECKS[selected?.layer ?? "website"];
}

export function calculateFit(answers: FitAnswers): FitResult {
  const score = SCORED_QUESTIONS.reduce((total, question) => {
    const selected = question.options.find(
      (option) => option.value === answers[question.id],
    );
    return total + (selected?.score ?? 0);
  }, 0);

  const packageSlug = packageFor(answers.shape, score);

  return {
    score,
    maxScore: FIT_MAX_SCORE,
    band: bandFor(score),
    bottleneck: bottleneckFor(answers),
    package: PACKAGE_RECOMMENDATIONS[packageSlug],
  };
}
