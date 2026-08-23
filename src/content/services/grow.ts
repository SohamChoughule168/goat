import type { Service } from "./types";

export const growServices: Service[] = [
  
  {
    slug: "digital-marketing",
    title: "Digital Marketing Strategy",
    pillar: "grow",
    tagline: "One accountable system across search, social and email.",
    description:
      "Strategy-first marketing connecting channels instead of running them separately: SEO for durable traffic, paid for controlled scale, email for retention — reported against revenue.",
    body: [
      "Channels don't fail individually; they fail disconnected. Ads chase clicks the site can't convert, email blasts ignore what search taught you about language, and each agency reports its own numbers in its own currency. Strategy-first marketing fixes the system before tuning the parts.",
      "We start by defining what a qualified lead means for your business, in numbers. Then channel roles: which earns trust over months, which buys attention this week, which keeps customers after purchase. Budget follows role, not habit.",
      "Reporting is plain-language monthly: spend, return, what moved and what didn't, next actions. If a channel stops earning its place we recommend cutting it — including channels we run.",
      "This service is the umbrella under which SEO, SEM, GEO/AEO and social execution operate as one accountable system.",
    ],
    deliverables: [
      "Channel strategy with measurable targets",
      "90-day engagement cycles",
      "Plain-language monthly reporting",
      "Conversion-rate optimisation programme",
    ],
    timeline: "90-day cycles, reviewed monthly",
    processStages: [
      "Strategy session and target definition",
      "Channel role assignment and budget split",
      "Execution with weekly snapshots",
      "Monthly review and reallocation",
    ],
    exclusions: [
      "Influencer contracting (coordinated, not contracted)",
      "Offline media buying",
      "Creative production beyond ad variants (see Content practice)",
    ],
    priceBand: "TODO(positioning: entry retainer band)",
    faqs: [
      {
        q: "What do you need from us to start?",
        a: "Access to existing accounts, one strategy session, and agreement on what a qualified lead means. We handle the rest.",
      },
      {
        q: "Do you lock clients into long contracts?",
        a: "No. We earn renewals monthly. Structured engagements run 90-day cycles because most channels need a quarter to prove themselves.",
      },
    ],
    relatedServices: ["sem", "meta-advertising", "social-media-marketing"],
    legacySlugs: ["marketing"],
  },
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    pillar: "grow",
    tagline: "Presence with a purpose, on platforms that matter to you.",
    description:
      "Editorial calendars, community management and paid social built around a clear voice — ending each month with numbers you can act on.",
    body: [
      "Social media works when it has a job. For most businesses that job is staying memorable between purchases and answering questions where people ask them. Posting daily into the void achieves neither. We plan editorial themes quarterly, produce in batches, and measure saves, shares and enquiries instead of vanity reach.",
      "Community management is response playbooks, not improvisation: how fast you reply, what tone you use, when a thread moves to DMs or email. Consistency here builds more trust than any campaign.",
      "Paid social amplifies what organic proves. Creative is tested systematically — hooks first, then formats — and budgets follow evidence. Every month ends with a plain-language review: what worked, what didn't, what changes next month.",
    ],
    deliverables: [
      "Platform strategy and content calendar",
      "Community management playbooks",
      "Paid social testing matrix",
      "Monthly performance reviews",
    ],
    timeline: "Quarterly planning cycles, monthly reporting",
    processStages: [
      "Platform selection and voice definition",
      "Quarterly calendar build",
      "Batch production and scheduling",
      "Monthly review and iteration",
    ],
    exclusions: [
      "Viral stunts and trend-chasing without strategy fit",
      "Follower-buying of any kind",
      "Platforms your buyers don't use",
    ],
    priceBand: "TODO(positioning: entry retainer band)",
    faqs: [
      {
        q: "Which platforms should my business be on?",
        a: "Usually fewer than you think. We recommend based on where your buyers spend time, then go deep rather than spreading thin.",
      },
      {
        q: "Who creates the content?",
        a: "We plan and art-direct it, producing in-house through our content team or directing yours. You approve everything before it goes live.",
      },
      {
        q: "How do you measure success beyond likes?",
        a: "Saves, shares, profile visits, link clicks and assisted enquiries — the signals that correlate with business outcomes.",
      },
    ],
    relatedServices: ["digital-marketing", "video-editing", "thumbnail-design"],
    legacySlugs: ["social-media"],
  },
  {
    slug: "sem",
    title: "SEM & Paid Search",
    pillar: "grow",
    tagline: "Google Ads managed like an investment portfolio.",
    description:
      "Keyword research, tight ad groups, honest landing pages and relentless bid hygiene. Spend, return and next actions — including when a channel stops being worth it.",
    body: [
      "Paid search punishes vagueness. Every rupee is traceable to a query, an ad, a landing page and an outcome. Our management starts with account structure: campaigns mapped to intent, ad groups tight enough that message matches search, negatives maintained weekly so budget stops leaking to irrelevant queries.",
      "Landing pages are half the outcome and usually ignored. We test page-level changes — headline clarity, proof placement, form friction — as systematically as bids. Conversion tracking is implemented properly server-side where possible, because platform-reported conversions flatter everyone.",
      "Reporting shows three numbers plainly: spend, return, and what changes next week. When a campaign segment stops performing after fair testing, we cut it and say so — including recommending lower budgets when the maths says so.",
    ],
    deliverables: [
      "Account audit and restructure",
      "Conversion tracking done correctly",
      "Weekly bid and negative maintenance",
      "Landing page CRO tests",
      "Plain-language performance reports",
    ],
    timeline: "Restructure in 2 weeks, then ongoing optimisation cycles",
    processStages: [
      "Audit and account restructure",
      "Tracking verification",
      "Testing cadence launch",
      "Weekly optimisation and reporting",
    ],
    exclusions: [
      "Media spend (paid directly to Google)",
      "Guaranteed CPA targets on new accounts",
      "Display-only brand awareness buys without measurement",
    ],
    priceBand: "TODO(positioning: management fee band)",
    faqs: [
      {
        q: "How much should I budget for ads?",
        a: "Enough for meaningful data — typically ₹30–50k/month media for local and niche B2B. We tell you when the maths works and when it doesn't.",
      },
      {
        q: "Google's own recommendations keep raising my spend. Do you follow them?",
        a: "Rarely. Auto-apply recommendations optimise Google's revenue. We evaluate each against your data first.",
      },
    ],
    relatedServices: ["digital-marketing", "web-development", "digital-marketing"],
  },
  {
    slug: "generative-engine-optimization",
    title: "GEO — Generative Engine Optimization",
    pillar: "grow",
    tagline: "Be the answer AI engines quote, not just a blue link.",
    description:
      "Entity alignment, schema depth and citable content so generative engines understand and reference your business when buyers ask AI for recommendations.",
    body: [
      "AI answers are becoming the front page of the internet. When someone asks ChatGPT or Gemini for 'a web development studio in Mumbai', the engines synthesise from sources they trust. GEO makes sure your business is one of those sources — structured, verifiable and easy to cite.",
      "The work is entity alignment first: consistent naming, credentials and descriptions across your site, LinkedIn and directories, so knowledge graphs resolve you correctly. Then schema depth — Service, FAQ and Review markup that machines can parse without guessing. Then citable content: original frameworks, checklists and data other sources want to reference.",
      "We benchmark visibility monthly across major AI platforms for the questions your buyers ask, and report movement alongside classic search metrics. GEO extends strong SEO; it cannot replace it. Where fundamentals are missing, we say so first.",
    ],
    deliverables: [
      "Entity and knowledge-graph alignment",
      "Deep structured data implementation",
      "Citable content architecture",
      "Monthly AI-visibility benchmarks",
    ],
    timeline: "6-week implementation, monthly benchmark cycles",
    processStages: [
      "Entity audit and consistency fixes",
      "Schema and content restructuring",
      "Benchmark baseline across AI platforms",
      "Monthly citation tracking",
    ],
    exclusions: [
      "Prompt-injection tricks or fake-review schemes",
      "Rankings guarantees inside AI answers",
      "GEO without functional technical SEO",
    ],
    priceBand: "TODO(positioning: entry price band)",
    faqs: [
      {
        q: "Is GEO replacing SEO?",
        a: "No — it extends it. Strong technical SEO remains the floor; GEO makes sure the same investment also performs inside AI answers.",
      },
      {
        q: "How do you measure GEO results?",
        a: "Monthly visibility checks across major AI platforms — whether your brand is cited for target questions — plus referral traffic from AI surfaces where trackable.",
      },
    ],
    relatedServices: ["answer-engine-optimization", "sem", "brand-management"],
    legacySlugs: ["geo"],
  },
  {
    slug: "answer-engine-optimization",
    title: "AEO — Answer Engine Optimization",
    pillar: "grow",
    tagline: "Own the featured snippet, the voice answer, the zero-click result.",
    description:
      "Question-mapped content, FAQ schema and snippet formatting that put your answers directly in front of searchers wherever Google surfaces them.",
    body: [
      "A growing share of searches end without a click. Featured snippets, People Also Ask boxes and voice assistants surface one answer directly. AEO structures your expertise so that answer is yours: question-mapped headings, concise 40–60 word responses placed immediately under question headings, FAQ schema marking the page up for rich results.",
      "Targeting starts from proximity: pages already ranking on page one for question-shaped queries sit closest to snippet position and move fastest. We prioritise those, format the answer blocks, and monitor movement weekly.",
      "Voice results draw from the same well. Concise, factual answers formatted for extraction get pulled into assistants far more often than long-form prose. Every targeted page ships with FAQPage schema so engines can lift Q&A pairs cleanly.",
    ],
    deliverables: [
      "Question-to-intent research map",
      "Snippet-formatted answer blocks",
      "FAQPage and HowTo schema",
      "Weekly snippet-position monitoring",
    ],
    timeline: "4-week implementation on priority pages, then monthly cycles",
    processStages: [
      "Question research and proximity mapping",
      "Answer-block formatting on priority pages",
      "Schema deployment",
      "Position tracking and iteration",
    ],
    exclusions: [
      "Guaranteed featured snippets — structuring improves odds, nothing guarantees",
      "Pages without existing topical authority",
    ],
    priceBand: "TODO(positioning: entry price band)",
    faqs: [
      {
        q: "Can you guarantee featured snippets?",
        a: "No — but we structure content the way snippets are awarded and measure movement. Several wins per quarter is typical on well-chosen questions.",
      },
      {
        q: "Does AEO still matter with AI Overviews?",
        a: "Yes. AI Overviews draw from the same well-structured sources, so AEO work feeds both classic snippets and generative summaries.",
      },
    ],
    relatedServices: ["generative-engine-optimization", "sem"],
    legacySlugs: ["aeo"],
  },
  {
    slug: "meta-advertising",
    title: "Meta Ad Management",
    pillar: "grow",
    tagline: "Facebook and Instagram ads judged by pipeline, not likes.",
    description:
      "Campaign architecture, creative iteration and precise audience work across Meta placements — creative tested systematically, budgets following evidence.",
    body: [
      "Meta ads reward structure: clean campaign architecture, verified pixel and Conversions API events, creative tested in disciplined rounds. We rebuild accounts on that skeleton before scaling anything, because scaling chaos just spends more.",
      "Creative is the biggest lever. We brief hooks and angles, test them in structured matrices — one variable per round — and let winners compound. Budgets follow evidence: proven ad sets get scale, losers get cut fast, regardless of how attached anyone is to a favourite design.",
      "Attribution honesty matters here. Browser restrictions mean platform-reported conversions drift optimistic, so we implement Conversions API alongside the pixel, reconcile against actual sales where possible, and report ranges rather than false precision.",
    ],
    deliverables: [
      "Campaign architecture + pixel/CAPI setup",
      "Structured creative testing matrix",
      "Audience and retargeting strategy",
      "Weekly performance snapshots",
    ],
    timeline: "Setup in 1 week, first full test cycle within 30 days",
    processStages: [
      "Pixel/CAPI verification and architecture",
      "Creative briefs and round-one tests",
      "Budget pacing reviews",
      "Weekly snapshot, monthly deep-dive",
    ],
    exclusions: [
      "Boosted-post-only management",
      "Platforms beyond Meta (see Digital Marketing Strategy)",
      "Guaranteed ROAS figures",
    ],
    priceBand: "TODO(positioning: management fee band)",
    faqs: [
      {
        q: "Do you also produce the ad creatives?",
        a: "Yes — through our content team, or we direct your in-house creator. Testing discipline stays identical either way.",
      },
      {
        q: "iOS changes wrecked our old agency's results. How is this different?",
        a: "Server-side events via Conversions API survive browser restrictions, and we report reconciled ranges instead of platform fantasy numbers.",
      },
    ],
    relatedServices: ["digital-marketing", "web-development", "thumbnail-design"],
    legacySlugs: ["meta-ads"],
  },
  {
    slug: "google-business-profile",
    title: "Google Business Profile",
    pillar: "grow",
    tagline: "Win the map pack in your neighbourhood.",
    description:
      "Complete profile optimisation for local discovery: categories, services, photos, review velocity and weekly posts — the consistent work that moves local rankings.",
    body: [
      "Local search rewards boring consistency. Categories matching what you actually sell, services described in customers' words, photos refreshed monthly, questions answered publicly, reviews responded to within a day. None of it is glamorous; all of it compounds.",
      "We optimise the profile completely — primary and secondary categories, service areas, attributes, product listings — then set the operating rhythm: post cadence, photo uploads, review-request workflow integrated with your invoicing or delivery flow so asks happen at the moment of satisfaction.",
      "Reviews deserve special care. We draft responses in your voice, flag anything needing escalation, and track velocity and sentiment monthly. Buying reviews or incentivising them violates policy and eventually backfires; we don't touch either.",
      "Local ranking movement typically shows within weeks of profile work, stabilising over two to three months alongside review flow and proximity factors we'll explain honestly.",
    ],
    deliverables: [
      "Full profile optimisation",
      "Category/service mapping",
      "Review request workflow setup",
      "Weekly post and photo cadence",
      "Insights reporting",
    ],
    timeline: "Optimisation in 2 weeks, then monthly operating rhythm",
    processStages: [
      "Profile audit and rebuild",
      "Workflow integration",
      "Cadence operation",
      "Monthly insights review",
    ],
    exclusions: [
      "Fake reviews or incentivised review schemes",
      "Service-area businesses without physical proof of operations",
    ],
    priceBand: "TODO(positioning: monthly fee band)",
    faqs: [
      {
        q: "How fast do local profiles improve?",
        a: "Profile-driven signals often move within weeks; map-pack position stabilises over 2–3 months of consistent activity and review flow.",
      },
      {
        q: "Can you remove bad reviews?",
        a: "Only policy-violating ones, through Google's formal process. Genuine criticism gets a professional response and a fix behind it.",
      },
    ],
    relatedServices: ["google-business-profile", "google-business-profile", "google-marketplace"],
    legacySlugs: ["google-business"],
  },
  {
    slug: "google-marketplace",
    title: "Google Marketplace",
    pillar: "grow",
    tagline: "Listings set up right the first time.",
    description:
      "Merchant account configuration, feed hygiene and listing optimisation — plus review handling and performance tracking most sellers skip.",
    body: [
      "Marketplace listings fail on feed hygiene: missing GTINs, thin titles, wrong categories, images that crop badly on mobile. Setup done properly the first time prevents the suspension cycles that cost sellers months.",
      "We configure the merchant account, validate feeds against Google's requirements, write listing copy that matches search behaviour, and set up the performance dashboard covering impressions, clicks and conversion value — reconciled against actual orders.",
      "Ongoing work is rhythmic: feed error monitoring, seasonal listing refreshes, promotion setup during sale periods, and review-response handling in your voice.",
      "Fit assessment happens before commitment. Clean margins, shippable or locally serviceable products, and realistic expectations make Marketplace viable. Otherwise we say ads alone serve you better.",
    ],
    deliverables: [
      "Merchant account and feed validation",
      "Listing copy optimisation",
      "Promotion setup for sale periods",
      "Performance tracking dashboard",
    ],
    timeline: "Setup in 2–3 weeks, then monthly management",
    processStages: [
      "Feed audit and correction",
      "Listing optimisation pass",
      "Promotion calendar setup",
      "Monthly reconciliation and reporting",
    ],
    exclusions: [
      "Dropshipping catalogues with quality-control risk",
      "Categories requiring licences you don't hold",
    ],
    priceBand: "TODO(positioning: monthly fee band)",
    faqs: [
      {
        q: "Is Google Marketplace right for my products?",
        a: "Best for clean margins and shippable or locally serviceable demand. We assess fit honestly during discovery.",
      },
      {
        q: "My feed keeps getting disapproved elsewhere. Can you fix that?",
        a: "Usually yes — most disapprovals trace to GTIN gaps, category mismatches or image policies, all correctable in a structured pass.",
      },
    ],
    relatedServices: ["google-business-profile", "sem", "sem"],
  },
];
