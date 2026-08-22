export type PillarSlug = "build" | "grow" | "content" | "enable";

export interface Pillar {
  slug: PillarSlug;
  index: string;
  title: string;
  kicker: string;
  description: string;
}

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface Service {
  slug: string;
  pillar: PillarSlug;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  faqs: ServiceFaq[];
  legacySlugs?: string[];
}

export const pillars: Pillar[] = [
  {
    slug: "build",
    index: "01",
    title: "Build",
    kicker: "Digital products",
    description:
      "Websites, web apps and mobile apps engineered to load fast, rank well and convert — built on modern stacks with AI woven in where it earns its place.",
  },
  {
    slug: "grow",
    index: "02",
    title: "Grow",
    kicker: "Performance marketing",
    description:
      "Search, paid media and answer-engine visibility run as an accountable system: clear targets, clean tracking, honest reporting.",
  },
  {
    slug: "content",
    index: "03",
    title: "Content & Brand",
    kicker: "Story and identity",
    description:
      "Video, design assets, brand systems and collaborations that make your business look as capable as it is.",
  },
  {
    slug: "enable",
    index: "04",
    title: "Enable",
    kicker: "AI and operations",
    description:
      "Applied AI integration and hands-on operational support that removes bottlenecks from your day-to-day.",
  },
];

export const services: Service[] = [
  {
    slug: "web-development",
    pillar: "build",
    title: "Web Development",
    tagline: "Fast, findable websites that carry your brand and convert visitors.",
    description:
      "Custom websites and web applications built on Next.js and modern tooling. We treat performance, accessibility and SEO as engineering requirements, not afterthoughts — the same standards this site is held to.",
    deliverables: [
      "Responsive, accessible front-end build",
      "Headless CMS or custom admin where needed",
      "E-commerce and payment integrations",
      "Progressive Web App capabilities",
      "Third-party API integrations",
      "Analytics, SEO foundations and handover docs",
    ],
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
    legacySlugs: ["web-dev"],
  },
  {
    slug: "mobile-app-development",
    pillar: "build",
    title: "Mobile App Development",
    tagline: "iOS and Android apps people actually keep on their phones.",
    description:
      "Native and cross-platform mobile development focused on retention: fast startup, sensible offline behaviour, push notifications that respect attention, and store listings optimised for discovery.",
    deliverables: [
      "React Native or Flutter cross-platform builds",
      "Native iOS and Android where performance demands it",
      "App Store and Play Store submission support",
      "Push notification architecture",
      "Crash reporting and release pipelines",
    ],
    faqs: [
      {
        q: "Do you publish to the app stores for us?",
        a: "Yes — we prepare listings, screenshots, privacy declarations and handle submission, including resolving review feedback.",
      },
      {
        q: "Cross-platform or native?",
        a: "For most products React Native or Flutter reaches both platforms at roughly half the cost. We recommend native only when a feature genuinely demands it.",
      },
    ],
    legacySlugs: ["mobile"],
  },
  {
    slug: "ai-driven-websites",
    pillar: "build",
    title: "AI-Driven Websites",
    tagline: "Sites that adapt, assist and automate — without gimmicks.",
    description:
      "We add AI where it measurably improves the experience: assistants trained on your actual content, recommendation logic, smart search and content workflows that save your team hours every week.",
    deliverables: [
      "AI assistants grounded in your content",
      "Personalisation and smart product recommendations",
      "Automated content pipelines with human review",
      "Predictive analytics dashboards",
      "Cost and latency engineering for LLM features",
    ],
    faqs: [
      {
        q: "Will an AI chatbot actually help my business?",
        a: "Only when it is grounded in real content and measured against real questions. We prototype against your data first; if it does not beat the status quo, we say so.",
      },
      {
        q: "Which models do you use?",
        a: "Whatever fits the job and budget — Google AI Studio, OpenAI or open-weight models — always behind an abstraction so you are never locked in.",
      },
    ],
    legacySlugs: ["ai"],
  },
  {
    slug: "website-refurbishment",
    pillar: "build",
    title: "Website Refurbishment",
    tagline: "Keep what works. Fix everything else.",
    description:
      "A structured modernisation of an existing site: performance audit, UX repair, content migration and SEO preservation. You keep your rankings and your history; you lose the drag.",
    deliverables: [
      "Full technical and UX audit with prioritised fixes",
      "Core Web Vitals remediation",
      "UI/UX redesign of key templates",
      "Content migration with URL redirect mapping",
      "Post-launch ranking and speed report",
    ],
    faqs: [
      {
        q: "Will we lose our Google rankings?",
        a: "Not if the migration is done properly. Every existing URL is mapped to its new home with permanent redirects, and we monitor Search Console through the transition.",
      },
      {
        q: "Rebuild or refurbish — how do you decide?",
        a: "If your platform fights basic requirements, rebuilding is cheaper than renovating. If the bones are good, we refurbish. The audit answers this honestly before any large commitment.",
      },
    ],
    legacySlugs: ["refurbish"],
  },
  {
    slug: "digital-marketing",
    pillar: "grow",
    title: "Digital Marketing",
    tagline: "One accountable system across search, social and email.",
    description:
      "Strategy-first marketing that connects channels instead of running them separately: SEO for durable traffic, paid media for controlled scale, content and email for retention — all reported against revenue, not vanity metrics.",
    deliverables: [
      "Channel strategy with measurable targets",
      "SEO and SEM programmes",
      "Email campaigns and automation",
      "Conversion-rate optimisation",
      "Plain-language monthly reporting",
    ],
    faqs: [
      {
        q: "What do you need from us to start?",
        a: "Access to existing accounts, one strategy session, and agreement on what a qualified lead means for your business. We handle the rest.",
      },
      {
        q: "Do you lock clients into long contracts?",
        a: "No. We earn renewals monthly. Structured engagements run in 90-day cycles because most channels need a quarter to prove themselves.",
      },
    ],
    legacySlugs: ["marketing"],
  },
  {
    slug: "social-media-marketing",
    pillar: "grow",
    title: "Social Media Marketing",
    tagline: "Presence with a purpose, on the platforms that matter to you.",
    description:
      "Editorial calendars, community management and paid social built around a clear voice — not posting for the sake of posting. Every month ends with numbers you can act on.",
    deliverables: [
      "Platform strategy and content calendar",
      "Community management and response playbooks",
      "Paid social campaign management",
      "Creator and influencer coordination",
      "Monthly performance reviews",
    ],
    faqs: [
      {
        q: "Which platforms should my business be on?",
        a: "Usually fewer than you think. We recommend platforms based on where your buyers actually spend time, then go deep rather than spreading thin everywhere.",
      },
      {
        q: "Who creates the content?",
        a: "We plan and art-direct it, then either produce in-house through our content team or direct your in-house creator. Nothing goes live without your approval.",
      },
    ],
    legacySlugs: ["social-media"],
  },
  {
    slug: "sem",
    pillar: "grow",
    title: "SEM & Paid Search",
    tagline: "Google Ads managed like an investment portfolio.",
    description:
      "Keyword research, tight ad groups, honest landing pages and relentless bid hygiene. We report spend, return and next actions — including when a channel stops being worth it.",
    deliverables: [
      "Account audit and restructure",
      "Keyword and audience research",
      "Ad copywriting and creative testing",
      "Bid and budget management",
      "Conversion tracking done correctly",
    ],
    faqs: [
      {
        q: "How much should I budget for ads?",
        a: "Enough to gather meaningful data — for most local and niche B2B businesses in India that starts around ₹30–50k per month in media. We tell you when the maths works and when it does not.",
      },
      {
        q: "Is there a long-term lock-in?",
        a: "No. Paid search needs roughly 90 days to stabilise, so engagements run in quarterly cycles — but you can pause or stop any month.",
      },
    ],
    legacySlugs: [],
  },
  {
    slug: "generative-engine-optimization",
    pillar: "grow",
    title: "GEO — Generative Engine Optimization",
    tagline: "Be the answer AI engines quote, not just a blue link.",
    description:
      "Search is shifting toward AI-generated answers. GEO structures your expertise — entities, schema, citable content — so generative engines understand and reference your business.",
    deliverables: [
      "Entity and knowledge-graph alignment",
      "Structured data implementation at depth",
      "Citable, source-worthy content architecture",
      "AI-platform visibility benchmarking",
    ],
    faqs: [
      {
        q: "Is GEO replacing SEO?",
        a: "No — it extends it. Strong technical SEO remains the floor; GEO makes sure the same investment also performs inside AI answers. We do both together.",
      },
      {
        q: "How do you measure GEO results?",
        a: "Monthly visibility checks across major AI platforms — whether your brand gets cited for target questions — plus tracked referral traffic from AI surfaces where attribution allows.",
      },
    ],
    legacySlugs: ["geo"],
  },
  {
    slug: "answer-engine-optimization",
    pillar: "grow",
    title: "AEO — Answer Engine Optimization",
    tagline: "Own the featured snippet, the voice answer, the zero-click result.",
    description:
      "Question-mapped content, FAQ schema and snippet formatting that put your answers directly in front of searchers — wherever Google surfaces them.",
    deliverables: [
      "Question research mapped to intent",
      "Featured-snippet targeting formats",
      "FAQPage and HowTo schema",
      "Voice-search readiness review",
    ],
    faqs: [
      {
        q: "Can you guarantee featured snippets?",
        a: "Nobody honestly can. We can structure content the way snippets are awarded and measure movement — typically several wins per quarter on well-chosen questions.",
      },
      {
        q: "Which pages should we optimise first?",
        a: "The ones already ranking on page one for question-shaped queries — they sit closest to snippet position. We prioritise by proximity to winning, not raw volume.",
      },
    ],
    legacySlugs: ["aeo"],
  },
  {
    slug: "meta-advertising",
    pillar: "grow",
    title: "Meta Ad Management",
    tagline: "Facebook and Instagram ads judged by pipeline, not likes.",
    description:
      "Campaign strategy, creative iteration and precise audience work across Meta placements. Creative is tested systematically; budgets follow evidence; reports show what each rupee returned.",
    deliverables: [
      "Campaign architecture and pixel/CAPI setup",
      "Creative briefs and iterative testing matrix",
      "Audience and retargeting strategy",
      "Budget pacing and scaling rules",
      "Weekly performance snapshots",
    ],
    faqs: [
      {
        q: "Do you also produce the ad creatives?",
        a: "Yes — through our content team, or we direct your in-house creator. Either way, creative testing discipline stays the same.",
      },
      {
        q: "How do you handle tracking privacy changes?",
        a: "Server-side event delivery (Conversions API) runs alongside the pixel so attribution survives browser restrictions, and reporting shows honest ranges instead of false precision.",
      },
    ],
    legacySlugs: ["meta-ads"],
  },
  {
    slug: "google-business-profile",
    pillar: "grow",
    title: "Google Business Profile",
    tagline: "Win the map pack in your neighbourhood.",
    description:
      "Complete profile optimisation for local discovery: categories, services, photos, review velocity and weekly posts — the unglamorous work that consistently moves local rankings.",
    deliverables: [
      "Profile setup or full optimisation",
      "Category and service mapping",
      "Review generation and response workflow",
      "Photo and post cadence management",
      "Insights reporting",
    ],
    faqs: [
      {
        q: "How fast do local profiles improve?",
        a: "Profile-driven signals often move within weeks; map-pack position stabilises over 2–3 months of consistent activity and review flow.",
      },
      {
        q: "How are reviews handled?",
        a: "We set up a review-request cadence and draft responses in your brand voice, published from your account following the playbook we agree on together.",
      },
    ],
    legacySlugs: ["google-business"],
  },
  {
    slug: "google-marketplace",
    pillar: "grow",
    title: "Google Marketplace",
    tagline: "Listings set up right the first time.",
    description:
      "Merchant account configuration, feed hygiene and listing optimisation — plus review handling and the performance tracking most sellers skip.",
    deliverables: [
      "Merchant account and feed setup",
      "Product listing optimisation",
      "Review management workflow",
      "Performance tracking dashboard",
    ],
    faqs: [
      {
        q: "Is Google Marketplace right for my products?",
        a: "It suits businesses with clean margins and shippable or locally serviceable demand. We assess fit honestly during discovery — including telling you when ads alone would serve you better.",
      },
      {
        q: "What does setup actually include?",
        a: "Merchant account configuration, product feed creation and validation, listing copy, plus the performance dashboard most sellers never set up.",
      },
    ],
    legacySlugs: [],
  },
  {
    slug: "brand-management",
    pillar: "content",
    title: "Brand Management & Collaboration",
    tagline: "A brand that looks intentional everywhere it shows up.",
    description:
      "Identity systems, guidelines and partnership strategy that keep your presentation consistent — and collaborations chosen for strategic fit rather than follower counts.",
    deliverables: [
      "Brand guidelines and asset systems",
      "Partnership identification and outreach",
      "Collaboration campaign direction",
      "Reputation monitoring",
    ],
    faqs: [
      {
        q: "Do you design logos?",
        a: "Yes, within broader identity work — logo alone rarely solves a brand problem, so we scope identity systems rather than one-off marks.",
      },
      {
        q: "How do you choose collaboration partners?",
        a: "Audience overlap first, follower counts second. A partner with 5,000 aligned customers beats one with 500,000 passive ones — we shortlist on fit and negotiate on your behalf.",
      },
    ],
    legacySlugs: ["brand"],
  },
  {
    slug: "video-editing",
    pillar: "content",
    title: "Video Editing",
    tagline: "Footage in, stories out — cut for the platform they live on.",
    description:
      "Commercial edits, social-native verticals, motion graphics, colour and sound finishing. Fast turnaround without the template look.",
    deliverables: [
      "Long-form and short-form editing",
      "Motion graphics and titles",
      "Colour grading and audio cleanup",
      "Subtitles and platform-specific exports",
    ],
    faqs: [
      {
        q: "What is the typical turnaround?",
        a: "Short-form edits usually land within 2–4 business days; larger commercial projects are scheduled per scope with milestone previews.",
      },
      {
        q: "Do you shoot as well as edit?",
        a: "Editing is our core service. For shoots we coordinate trusted videographers and handle direction, post-production and delivery end-to-end.",
      },
    ],
    legacySlugs: ["video"],
  },
  {
    slug: "thumbnail-design",
    pillar: "content",
    title: "Thumbnail Design",
    tagline: "Thumbnails engineered for the click — tested, not guessed.",
    description:
      "Custom thumbnails built on readability-at-a-glance principles, consistent with your channel identity, with A/B variants where volume justifies testing.",
    deliverables: [
      "Custom thumbnail design",
      "A/B variant sets",
      "Template systems for series",
      "Fast turnaround slots",
    ],
    faqs: [
      {
        q: "Do you need raw footage?",
        a: "Helpful but not required — high-quality stills plus your brief are enough for most thumbnail work.",
      },
      {
        q: "Can you match an existing channel style?",
        a: "Yes — share three recent thumbnails you're happy with and we'll reverse-engineer the visual system, then refine it against click performance.",
      },
    ],
    legacySlugs: ["thumbnails"],
  },
  {
    slug: "online-events",
    pillar: "content",
    title: "Online Events",
    tagline: "Webinars and digital events that run boringly on schedule.",
    description:
      "End-to-end virtual event production: platform setup, registration flows, rehearsal support, live streaming and the post-event analytics that inform the next one.",
    deliverables: [
      "Platform selection and setup",
      "Registration and reminder flows",
      "Live-stream production support",
      "Engagement tooling",
      "Post-event analytics pack",
    ],
    faqs: [
      {
        q: "Can you run recurring event series?",
        a: "Yes — recurring formats benefit most, since registration funnels compound and production checklists mature with each edition.",
      },
      {
        q: "Which platforms do you support?",
        a: "Platform-agnostic by design: Zoom Webinars, StreamYard, YouTube Live or custom registration stacks — chosen for audience size, budget and the analytics you need afterwards.",
      },
    ],
    legacySlugs: ["events"],
  },
  {
    slug: "google-ai-integration",
    pillar: "enable",
    title: "Google AI Integration",
    tagline: "Gemini-era AI wired into your actual workflows.",
    description:
      "Practical applied-AI work using Google AI Studio and the Gemini family: document understanding, vision tasks, custom assistants and automations — deployed with evaluation, not vibes.",
    deliverables: [
      "Use-case assessment and feasibility spike",
      "Model integration via AI Studio / Vertex APIs",
      "Vision and NLP task pipelines",
      "Evaluation harness and cost controls",
      "Team enablement documentation",
    ],
    faqs: [
      {
        q: "We don't know if AI fits our process — where do we start?",
        a: "With a scoped feasibility spike on one real workflow. It produces a working prototype and an honest go/no-go recommendation, usually within two weeks.",
      },
      {
        q: "How do you keep AI costs under control?",
        a: "Every deployment ships with token budgets, response caching and model-tier routing — cheap models handle easy tasks, stronger ones run only where quality demands it.",
      },
    ],
    legacySlugs: ["google-ai"],
  },
  {
    slug: "talent-acquisition",
    pillar: "enable",
    title: "Talent Acquisition Support",
    tagline: "Technical hiring help from people who read CVs for a living.",
    description:
      "Sourcing, screening and interview support for digital roles — run by practitioners who build software themselves, so candidates meet someone who understands the work.",
    deliverables: [
      "Role scoping and requirement calibration",
      "Candidate sourcing and screening",
      "Structured interview design",
      "Onboarding checklist setup",
    ],
    faqs: [
      {
        q: "Which roles do you recruit for?",
        a: "Digital-first roles we understand deeply: developers, designers, marketers and content specialists. We decline mandates outside that range.",
      },
      {
        q: "Permanent or contract hires?",
        a: "Both — plus trial-project engagements that let both sides validate fit before committing to full-time.",
      },
    ],
    legacySlugs: ["talent"],
  },
];

export const PILLAR_SLUGS = pillars.map((p) => p.slug);

export function getPillar(slug: string): Pillar | undefined {
  return pillars.find((p) => p.slug === slug);
}

export function getServicesByPillar(pillar: PillarSlug): Service[] {
  return services.filter((s) => s.pillar === pillar);
}

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
