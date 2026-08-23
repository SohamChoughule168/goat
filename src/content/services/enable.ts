import type { Service } from "./types";

export const enableServices: Service[] = [
  {
    slug: "google-ai-integration",
    title: "Google AI Integration",
    pillar: "enable",
    tagline: "Gemini-era AI wired into your actual workflows.",
    description: "Applied AI using Google AI Studio and the Gemini family — document understanding, vision tasks, custom assistants and automations deployed with evaluation.",
    body: [
      "Applied AI succeeds when it solves one real workflow end-to-end, not when it demos well on three. We start with a scoped feasibility spike on a single process your team does manually today. The output is a working prototype and an honest go/no-go recommendation within two weeks.",
      "Deployments ship with token budgets, response caching and model-tier routing — cheap models handle easy tasks, stronger ones run only where quality demands it. Evaluation harnesses test every change against known-good answers before deployment, so quality regressions surface in staging rather than production.",
    ],
    deliverables: ["Feasibility spike", "Model integration via AI Studio/Vertex", "Vision and NLP pipelines", "Evaluation harness", "Team documentation"],
    timeline: "2-week spike; 4–8 week implementation",
    processStages: ["Use-case assessment", "Prototype build", "Evaluation harness", "Deployment + training"],
    exclusions: ["AI features that fail the honesty test", "Models trained on unverified data"],
    priceBand: "TODO(positioning)",
    faqs: [
      { q: "Where do we start?", a: "With a scoped feasibility spike on one real workflow." },
      { q: "How do you control costs?", a: "Token budgets, caching and model-tier routing built into every deployment." },
      { q: "Which models?", a: "Whatever fits — Gemini, Vertex AI or open-weight, behind an abstraction so you're never locked in." },
    ],
    relatedServices: ["web-development", "ai-driven-websites"],
    legacySlugs: ["google-ai"],
  },
  {
    slug: "talent-acquisition",
    title: "Talent Acquisition Support",
    pillar: "enable",
    tagline: "Technical hiring help from people who read CVs for a living.",
    description: "Sourcing, screening and interview support for digital roles — run by practitioners who build software themselves.",
    body: [
      "Hiring developers, designers and marketers is hard because most recruiters can't evaluate the work. Our screening is done by senior practitioners who understand what good looks like in portfolios, code reviews and system design discussions.",
      "We scope roles precisely, source from channels that actually reach passive candidates, screen against calibrated criteria, and design structured interviews that predict performance rather than confidence.",
    ],
    deliverables: ["Role scoping", "Sourcing and screening", "Interview design", "Onboarding checklists"],
    timeline: "2–4 week screening cycles",
    processStages: ["Role calibration", "Sourcing", "Screening", "Shortlist handover"],
    exclusions: ["Roles outside digital-first disciplines", "Bulk recruitment drives"],
    priceBand: "TODO(positioning)",
    faqs: [
      { q: "Permanent or contract?", a: "Both, plus trial-project engagements for mutual fit validation." },
      { q: "What makes your screening different?", a: "Practitioners evaluate technical depth, not keyword density." },
    ],
    relatedServices: ["web-development"],
    legacySlugs: ["talent"],
  },
];

