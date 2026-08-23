import type { Service } from "./types";

export const buildServices: Service[] = [
  {
    slug: "web-development",
    title: "Web Development",
    pillar: "build",
    tagline: "Fast, findable websites that carry your brand and convert visitors.",
    description:
      "Custom websites and web applications built on Next.js and modern tooling. Performance, accessibility and SEO are engineering requirements, not afterthoughts.",
    body: [
      "Your website is the one asset every other marketing activity points at. Ads, social posts, sales calls and word-of-mouth all land here, so the site has one job: turn that attention into enquiries without friction. We build sites that do this by treating speed, clarity and search visibility as engineering requirements from the first commit, not a pre-launch checklist.",
      "Every build starts with structure. Before visual design we agree the sitemap, the job of each page and the action each audience should take. That document becomes the contract for the rest of the project: content modelled around visitor intent rather than internal org charts, copy written to answer real questions, and a component architecture your team can extend later.",
      "Engineering standards are fixed across all our builds: Next.js with server rendering so pages paint fast on mid-range phones, images served in modern formats at responsive sizes, fonts self-hosted and subset, accessibility checked against WCAG AA, and Core Web Vitals passing before launch. You get a staging link from week one and watch the product exist instead of waiting for a reveal.",
      "After launch you own everything: repository, hosting account, analytics, domain. We hand over documentation your next developer can read, and we stay available for support if you want it — but nothing we build is designed to keep you dependent on us.",
    ],
    deliverables: [
      "Responsive, accessible front-end build",
      "Headless CMS or custom admin where needed",
      "E-commerce and payment integrations",
      "Progressive Web App capabilities",
      "Third-party API integrations",
      "Analytics, SEO foundations and handover docs",
    ],
    timeline: "3–6 weeks for a focused marketing site; larger applications scoped in phases",
    processStages: [
      "Discovery session and written audit",
      "Scoped plan with sitemap and milestones",
      "Weekly staging builds",
      "Launch, training and full handover",
    ],
    exclusions: [
      "Copywriting beyond structural page copy (quoted separately)",
      "Ongoing hosting management after handover",
      "Native mobile apps (see Mobile App Development)",
    ],
    priceBand: "TODO(positioning: entry price band)",
    faqs: [
      {
        q: "How long does a typical website take?",
        a: "A focused marketing site usually ships in 3–6 weeks. Larger applications are scoped in phases so you see working software early instead of waiting months for a reveal.",
      },
      {
        q: "Can you work with our existing design?",
        a: "Yes. We can build from your designer's files, extend an existing site, or handle design end-to-end — whichever serves the project best.",
      },
      {
        q: "What happens after launch?",
        a: "You receive full documentation and ownership of everything we build. Ongoing care plans are available but never required.",
      },
    ],
    relatedServices: ["website-refurbishment", "ai-driven-websites", "seo-package"],
    legacySlugs: ["web-dev"],
    caseStudyRef: "prv-financial-services",
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    pillar: "build",
    tagline: "iOS and Android apps people actually keep on their phones.",
    description:
      "Native and cross-platform mobile development focused on retention: fast startup, sensible offline behaviour, push notifications that respect attention, and store listings optimised for discovery.",
    body: [
      "An app lives or dies on retention, not downloads. The stores are full of beautiful apps opened once and deleted, because teams optimised the launch screenshot instead of the tenth-session experience. Our mobile work starts from the opposite end: what makes someone open this a second time, a tenth time, and what gets in the way.",
      "We build cross-platform with React Native or Flutter when one codebase serves both stores without compromise, and go native when a feature genuinely demands it. The decision is made during scoping based on your requirements, not our preference. Either way the bar is the same: fast cold start, graceful offline behaviour, push notifications that arrive when they matter and stay silent when they don't.",
      "Store submission is part of every engagement, not an afterthought. We prepare listings, screenshots, privacy declarations and review responses, and we stay through approval. Crash reporting and release pipelines ship with the first build so every subsequent release is measured, not hoped for.",
      "You receive the full codebase, store accounts and signing credentials at handover. Nothing about the app requires us to remain involved — though most clients keep us on for iteration once the first cohort of reviews arrives.",
    ],
    deliverables: [
      "React Native or Flutter cross-platform builds",
      "App Store and Play Store submission",
      "Push notification architecture",
      "Crash reporting and release pipelines",
      "Analytics events mapped to retention goals",
    ],
    timeline: "8–16 weeks to first store release depending on scope",
    processStages: [
      "Retention-focused scoping workshop",
      "Prototype and platform decision",
      "Sprint delivery with TestFlight/Play beta",
      "Store submission and post-launch measurement",
    ],
    exclusions: [
      "Complex backend/API development (scoped separately)",
      "Hardware-level integrations without a feasibility spike",
      "ASO copywriting in languages other than English",
    ],
    priceBand: "TODO(positioning: entry price band)",
    faqs: [
      {
        q: "Do you publish to the app stores for us?",
        a: "Yes. We prepare listings, screenshots, privacy declarations and review responses, and we stay through approval including resubmission cycles.",
      },
      {
        q: "Cross-platform or native?",
        a: "For most products React Native or Flutter reaches both platforms at roughly half the cost. We recommend native only when a feature genuinely demands it.",
      },
      {
        q: "Who owns the app accounts?",
        a: "You do, from day one. Developer accounts, signing keys and store listings are configured in your name.",
      },
    ],
    relatedServices: ["web-development", "ai-driven-websites", "google-ai-integration"],
    legacySlugs: ["mobile"],
  },
  {
    slug: "ai-driven-websites",
    title: "AI-Driven Websites",
    pillar: "build",
    tagline: "Sites that adapt, assist and automate — without gimmicks.",
    description:
      "AI assistants grounded in your actual content, recommendation logic, smart search and content workflows that save hours weekly — deployed behind evaluation, not hype.",
    body: [
      "Most 'AI websites' are a chatbot bolted onto a homepage. They answer badly, hallucinate confidently, and quietly embarrass the brand. Useful AI on a website does one of three jobs: answers real customer questions from verified content, automates a repetitive content task with human review, or personalises an experience using data you already trust. If a feature doesn't do one of those, we will tell you not to build it.",
      "Our implementations start with your content, not the model. Assistants are grounded in documentation you have verified, so answers carry citations instead of confidence. Smart search understands synonyms and intent because it indexes meaning, not keywords. Content workflows generate drafts into a review queue, never straight to publication. Every feature ships with an evaluation set: twenty real questions with known-good answers, run on every change.",
      "Cost control is engineering, not luck. Token budgets, response caching and model-tier routing mean cheap models handle easy requests and stronger ones run only where quality demands it. Latency budgets are set per feature so a slow model never blocks a fast page.",
      "The result reads less like a demo and more like staff: quiet, accurate, always on shift, and honest about what it doesn't know.",
    ],
    deliverables: [
      "AI assistant grounded in your content",
      "Personalisation and smart recommendations",
      "Automated content pipelines with human review",
      "Predictive analytics dashboards",
      "Evaluation harness and cost controls",
    ],
    timeline: "2-week feasibility spike, then 4–8 week implementation",
    processStages: [
      "Feasibility spike on one real workflow",
      "Grounded prototype against your content",
      "Evaluation harness and cost controls",
      "Deployment with monitoring",
    ],
    exclusions: [
      "Autonomous publishing without human review",
      "Training models on your data without explicit agreement",
      "Features that fail the feasibility spike's honesty test",
    ],
    priceBand: "TODO(positioning: entry price band)",
    faqs: [
      {
        q: "Will an AI chatbot actually help my business?",
        a: "Only when grounded in verified content and measured against real questions. We prototype against your data first; if it doesn't beat the status quo, we say so.",
      },
      {
        q: "Which models do you use?",
        a: "Whatever fits the job and budget — Gemini, OpenAI or open-weight models — always behind an abstraction so you're never locked in.",
      },
      {
        q: "How do you stop it making things up?",
        a: "Answers are grounded in documents you've verified and carry citations. Questions outside that scope get referred to a human, not invented.",
      },
    ],
    relatedServices: ["web-development", "google-ai-integration", "website-refurbishment"],
    legacySlugs: ["ai"],
  },
  {
    slug: "website-refurbishment",
    title: "Website Refurbishment",
    pillar: "build",
    tagline: "Keep what works. Fix everything else.",
    description:
      "Structured modernisation of an existing site: performance audit, UX repair, content migration and SEO preservation. Keep rankings and history; lose the drag.",
    body: [
      "Refurbishment starts with evidence. We crawl the site, measure Core Web Vitals on mid-range devices, map every URL and its search performance, then audit the user journeys that matter. The output is a prioritised report: what to keep, what to fix, what to retire — with effort estimates against each item so decisions are informed, not guessed.",
      "Migration is where most redesigns destroy value. Rankings evaporate because nobody mapped redirects; content vanishes because the CMS export was treated as an afterthought. Our refurbishments treat the URL map as a first-class deliverable: every existing address lands somewhere sensible, monitored in Search Console through the transition.",
      "Performance work usually pays for itself before any redesign does. Faster pages rank better, convert better and cost less to serve. We fix the measurable things — render-blocking resources, image formats, font loading, JavaScript bloat — and report before-and-after numbers on the devices your customers actually use.",
      "The result feels new without pretending the old site never existed. Your history compounds instead of resetting.",
    ],
    deliverables: [
      "Technical and UX audit with priorities",
      "Core Web Vitals remediation",
      "URL redirect mapping and migration",
      "Post-launch ranking and speed report",
    ],
    timeline: "2–4 weeks audit-to-launch for most sites",
    processStages: [
      "Crawl, measure and prioritise",
      "Fix list agreed with effort estimates",
      "Remediation on staging",
      "Redirect cutover and post-launch report",
    ],
    exclusions: [
      "Full rebrand or new visual identity",
      "New content writing beyond migration fixes",
      "Off-site SEO work (see Growth practice)",
    ],
    priceBand: "TODO(positioning: entry price band)",
    faqs: [
      {
        q: "Will we lose our Google rankings?",
        a: "Not if the migration is done properly. Every URL maps to its new home with permanent redirects, monitored in Search Console throughout.",
      },
      {
        q: "Rebuild or refurbish — how do you decide?",
        a: "If the platform fights basic requirements, rebuilding costs less than renovating. If the bones are good, we refurbish. The audit answers honestly first.",
      },
    ],
    relatedServices: ["web-development", "seo-package", "answer-engine-optimization"],
    legacySlugs: ["refurbish"],
  },
];

