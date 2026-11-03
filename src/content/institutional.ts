export interface StackCapability {
  label: string;
  href?: string;
}

export interface StackLayer {
  id: string;
  index: string;
  title: string;
  short: string;
  problem: string;
  build: string;
  signals: string[];
  capabilities: StackCapability[];
  audience: { label: string; href: string };
}

export const stackLayers: StackLayer[] = [
  {
    id: "brand",
    index: "01",
    title: "Brand",
    short: "Identity, voice and rules that hold across every branch and channel.",
    problem:
      "Each campus improvises its own deck, poster and tone, so the institution reads as several unrelated businesses.",
    build:
      "A brand system with approved marks, type, colour, templates and a governance model branch teams can actually use.",
    signals: ["Branch-level design drift", "No approved templates", "Inconsistent prospectus and signage"],
    capabilities: [{ label: "Brand Management & Collaboration", href: "/services/brand-management" }],
    audience: { label: "Multi-branch groups", href: "/solutions#multi-branch" },
  },
  {
    id: "website",
    index: "02",
    title: "Website",
    short: "The public front door, connected to the systems behind it.",
    problem:
      "The site explains the institution but cannot answer a fee question, book a campus visit or route an enquiry to a named person.",
    build:
      "A fast, accessible public site with course architecture, proof, local discovery and a traceable enquiry path.",
    signals: ["Enquiries land in a shared inbox", "Course pages out of date", "No source tracking"],
    capabilities: [
      { label: "Web Development", href: "/services/web-development" },
      { label: "Website Refurbishment", href: "/services/website-refurbishment" },
      { label: "AI-Driven Websites", href: "/services/ai-driven-websites" },
    ],
    audience: { label: "Coaching classes", href: "/solutions#coaching" },
  },
  {
    id: "admissions",
    index: "03",
    title: "Admissions",
    short: "Enquiry capture, follow-up and conversion in one visible path.",
    problem:
      "Enquiries arrive across forms, calls, WhatsApp and walk-ins. Nobody can say which source produced which admission.",
    build:
      "A single admissions pipeline with source tagging, ownership, follow-up stages and reporting the front office trusts.",
    signals: ["Unanswered enquiries", "Duplicate follow-up", "No cost-per-admission view"],
    capabilities: [
      { label: "Digital Marketing Strategy", href: "/services/digital-marketing" },
      { label: "SEM & Paid Search", href: "/services/sem" },
      { label: "Meta Ad Management", href: "/services/meta-advertising" },
      { label: "Google Business Profile", href: "/services/google-business-profile" },
      { label: "Generative Engine Optimization", href: "/services/generative-engine-optimization" },
      { label: "Answer Engine Optimization", href: "/services/answer-engine-optimization" },
    ],
    audience: { label: "Coaching classes", href: "/solutions#coaching" },
  },
  {
    id: "portal",
    index: "04",
    title: "Student Portal",
    short: "A secure place for learners and parents to get answers.",
    problem:
      "Batch schedules, results and attendance are answered manually, repeatedly, by the same three people.",
    build:
      "A portal with role-based access for students, parents and staff, built on the Pro application foundation or as a standalone engagement.",
    signals: ["Repeated status calls", "Spreadsheet attendance", "Parents without a single source of truth"],
    capabilities: [
      { label: "Mobile App Development", href: "/services/mobile-app-development" },
      { label: "Pro portal entitlement", href: "/pricing#pro" },
    ],
    audience: { label: "Edtech teams", href: "/solutions#edtech" },
  },
  {
    id: "assessments",
    index: "05",
    title: "Assessments",
    short: "Question banks, scheduled tests and results without manual chasing.",
    problem:
      "Tests live in documents, marking is manual, and results reach students days after the feedback would have mattered.",
    build:
      "An online test and exam module with question banks, scheduling, attempts and result publication inside the portal.",
    signals: ["Paper-based test logistics", "Delayed results", "No question-level performance view"],
    capabilities: [{ label: "Online test / exam module", href: "/pricing#builder" }],
    audience: { label: "Edtech teams", href: "/solutions#edtech" },
  },
  {
    id: "payments",
    index: "06",
    title: "Payments",
    short: "Fee collection, receipts and reconciliation that match the ledger.",
    problem:
      "Fees are collected across cash, transfer and payment links, then reconciled by hand at the end of the month.",
    build:
      "Fee payment integration with instalments, receipts, reminders and a reconciliation view the accounts team can close against.",
    signals: ["Manual reconciliation", "Missing receipts", "No instalment visibility"],
    capabilities: [{ label: "Fee payment integration", href: "/pricing#builder" }],
    audience: { label: "Multi-branch groups", href: "/solutions#multi-branch" },
  },
  {
    id: "communications",
    index: "07",
    title: "Communications",
    short: "Scheduled, auditable messages across the channels parents use.",
    problem:
      "Notices are sent from personal phones. Nobody knows who received what, or which message produced a response.",
    build:
      "A communication layer for announcements, SMS and WhatsApp broadcasts, with templates, schedules and delivery records.",
    signals: ["Personal-number messaging", "No delivery record", "Branch notices contradict each other"],
    capabilities: [
      { label: "Social Media Marketing", href: "/services/social-media-marketing" },
      { label: "SMS / WhatsApp broadcast", href: "/pricing#builder" },
    ],
    audience: { label: "Schools", href: "/solutions#schools" },
  },
  {
    id: "intelligence",
    index: "08",
    title: "Intelligence",
    short: "One reporting layer for enquiries, cohorts, fees and outcomes.",
    problem:
      "Leadership receives three versions of the truth: the website dashboard, the CRM export and a spreadsheet maintained by the accountant.",
    build:
      "A measurement layer that connects acquisition, admissions, cohorts and fees, with the definitions written down before the dashboard.",
    signals: ["Conflicting reports", "No cohort-level economics", "Decisions based on last month's export"],
    capabilities: [
      { label: "AI analytics & insights", href: "/pricing#builder" },
      { label: "AI lead scoring & follow-up", href: "/pricing#builder" },
      { label: "Growth analytics setup", href: "/pricing#growth" },
    ],
    audience: { label: "Multi-branch groups", href: "/solutions#multi-branch" },
  },
];

export const referenceArchitectures = [
  {
    id: "coaching",
    index: "01",
    title: "Coaching institute operating layer",
    description:
      "A single-branch coaching institute connects course pages, source-tagged enquiries, batch schedules, tests, fees and parent updates.",
    system: ["Website", "Admissions", "Assessments", "Payments", "Communications"],
  },
  {
    id: "schools",
    index: "02",
    title: "Multi-branch school group",
    description:
      "A group runs one brand system, branch-level sites and a central admissions and reporting layer without erasing local identity.",
    system: ["Brand", "Website", "Admissions", "Communications", "Intelligence"],
  },
  {
    id: "edtech",
    index: "03",
    title: "Edtech cohort platform",
    description:
      "An edtech team connects cohort onboarding, content access, assessments, subscriptions and learner analytics in one account.",
    system: ["Portal", "Assessments", "Payments", "Communications", "Intelligence"],
  },
] as const;

export const methodPhases = [
  {
    index: "01",
    title: "Diagnose",
    detail:
      "Stakeholder interviews, systems audit, enquiry-path review and a written account of what is actually broken.",
    output: "Findings and priority map",
    gate: "You agree the diagnosis before design starts.",
  },
  {
    index: "02",
    title: "Architect",
    detail:
      "Information architecture, stack map, scope, success measures and the integration boundaries written down.",
    output: "Architecture and signed scope",
    gate: "You approve the system before a single screen is built.",
  },
  {
    index: "03",
    title: "Build",
    detail:
      "Design system, public site, portal modules, integrations, content, accessibility and performance QA.",
    output: "Working system and launch checklist",
    gate: "Every release passes the agreed checklist.",
  },
  {
    index: "04",
    title: "Operate",
    detail:
      "Measurement, iteration, team training, documentation and an agreed care model after handover.",
    output: "Handover pack and review cadence",
    gate: "You own the accounts, code and roadmap.",
  },
] as const;

export const trustCommitments = [
  {
    index: "01",
    title: "Ownership",
    detail: "You own the domains, source code, accounts and data. Handover is part of the scope, not an upsell.",
    href: "/trust",
  },
  {
    index: "02",
    title: "Security",
    detail: "Least-privilege access, documented credentials and no secret material in the repository.",
    href: "/trust",
  },
  {
    index: "03",
    title: "Accessibility",
    detail: "WCAG 2.2 AA is the build target. Keyboard access and contrast are tested before launch.",
    href: "/trust",
  },
  {
    index: "04",
    title: "Performance",
    detail: "Budgets are set before design and measured before launch. A beautiful page that fails on 4G is not finished.",
    href: "/trust",
  },
  {
    index: "05",
    title: "Handover",
    detail: "Documentation, a working walkthrough and named access for your team at the end of every engagement.",
    href: "/trust",
  },
  {
    index: "06",
    title: "Continuity",
    detail: "Care plans and exit terms are agreed in writing, so the system does not depend on one freelancer.",
    href: "/trust",
  },
] as const;

export const audienceSolutions = [
  {
    id: "coaching",
    index: "01",
    title: "Coaching classes",
    problem:
      "Enquiries leak between calls and WhatsApp, batches are tracked manually, parents ask for updates and fees live in spreadsheets.",
    response: "Website, admissions, batch schedules, assessments, fee collection and parent communication in one path.",
    system: ["Website", "Admissions", "Assessments", "Payments", "Communications"],
  },
  {
    id: "schools",
    index: "02",
    title: "Schools",
    problem:
      "Admissions are fragmented, parent communication is ad hoc and the website, ERP and reporting tools do not speak to each other.",
    response: "Admissions, a parent portal, notices, fee collection and a reporting layer that matches the school calendar.",
    system: ["Website", "Admissions", "Student Portal", "Payments", "Communications"],
  },
  {
    id: "multi-branch",
    index: "03",
    title: "Multi-branch groups",
    problem:
      "Branches drift in brand and offer, local search is inconsistent and leadership has no consolidated view of demand or fees.",
    response: "A brand system, branch sites, local discovery, a central dashboard and governance for local teams.",
    system: ["Brand", "Website", "Admissions", "Intelligence"],
  },
  {
    id: "edtech",
    index: "04",
    title: "Edtech teams",
    problem:
      "Cohorts, content, assessments and subscriptions sit in separate tools, so learner progress and revenue are never in one view.",
    response: "A cohort portal, assessments, subscription billing, learner analytics and scheduled communication.",
    system: ["Student Portal", "Assessments", "Payments", "Communications", "Intelligence"],
  },
] as const;
