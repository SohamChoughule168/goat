export interface InsightBlock {
  type: "p" | "h2" | "list" | "quote";
  text?: string;
  items?: string[];
}

export interface Insight {
  slug: string;
  title: string;
  category: string;
  date: string;
  readingTime: string;
  excerpt: string;
  author: string;
  body: InsightBlock[];
}

export const insightCategories = [
  "All",
  "AI & Technology",
  "SEO & Search",
  "Web Development",
  "Digital Marketing",
] as const;

export const insights: Insight[] = [
  {
    slug: "generative-engine-optimization-guide",
    title: "GEO: How to Stay Visible When AI Answers the Search",
    category: "SEO & Search",
    date: "2026-08-12",
    readingTime: "6 min",
    excerpt:
      "Search engines are becoming answer engines. Here is what Generative Engine Optimization actually involves — and what it does not replace.",
    author: "Team ImaginarsClub",
    body: [
      {
        type: "p",
        text: "A growing share of searches now end without a click. AI Overviews, chatbots and assistants synthesise an answer from many sources, and the user may never see your beautifully ranked page. Generative Engine Optimization (GEO) is the discipline of making sure your business is understood — and cited — by those systems.",
      },
      { type: "h2", text: "What generative engines actually read" },
      {
        type: "p",
        text: "Large language models and AI search systems favour content that is unambiguous, well-structured and attributable. In practice that means clear entity definitions (who you are, what you do, where you operate), consistent naming across the web, and pages that answer specific questions completely rather than padding around them.",
      },
      {
        type: "list",
        items: [
          "Structured data (schema.org) so machines parse facts instead of guessing them",
          "An 'About' story consistent across your site, LinkedIn and directories",
          "Original data, checklists or frameworks other sources will want to cite",
          "Question-shaped headings matched to how customers actually ask",
        ],
      },
      { type: "h2", text: "What GEO does not replace" },
      {
        type: "p",
        text: "Technical SEO remains the floor. If crawlers cannot render your pages efficiently, if Core Web Vitals fail, if canonical tags conflict — no amount of GEO rescues you. The order of operations is: crawlable, fast, structured, then citable.",
      },
      {
        type: "quote",
        text: "The businesses that win AI visibility are the ones that were already the clearest source of truth in their niche.",
      },
      { type: "h2", text: "A practical starting sequence" },
      {
        type: "p",
        text: "First, audit entity consistency: does every profile and page describe your business identically? Second, implement Organization, LocalBusiness and Service schema properly — not just the homepage boilerplate. Third, pick ten questions your buyers genuinely ask and answer each one definitively on its own page. Measure citations monthly by asking major AI platforms about your category and recording who gets quoted.",
      },
      {
        type: "p",
        text: "We run this exact programme for clients — and yes, this site practises it too. Inspect our schema and you will find the same structure we recommend.",
      },
    ],
  },
  {
    slug: "website-performance-that-converts",
    title: "Website Speed Is a Sales Feature, Not a Technical Chore",
    category: "Web Development",
    date: "2026-07-28",
    readingTime: "5 min",
    excerpt:
      "Slow sites quietly tax every marketing rupee you spend. A field guide to performance budgets that hold up after launch.",
    author: "Team ImaginarsClub",
    body: [
      {
        type: "p",
        text: "Every extra second of load time taxes two budgets at once: your visitors' patience and your ad spend. Performance is not a developer preference — it is the multiplier on every campaign you run.",
      },
      { type: "h2", text: "Budget before beauty" },
      {
        type: "p",
        text: "High-performing teams set hard budgets before design begins: a target for Largest Contentful Paint under 2 seconds on mid-range phones, JavaScript payloads measured in kilobytes, images served in AVIF/WebP with responsive sizes. Then every feature negotiates against those numbers instead of discovering them at launch.",
      },
      {
        type: "list",
        items: [
          "Ship less JavaScript: server-render everything that does not need interactivity",
          "Load heavy libraries only when the user reaches them",
          "Give every image explicit dimensions so layout never jumps",
          "Self-host fonts, subset to used weights, preload the primary face",
        ],
      },
      { type: "h2", text: "The three metrics that matter" },
      {
        type: "p",
        text: "LCP tells you whether the main content arrives fast. INP tells you whether taps respond while the page is busy. CLS tells you whether the page moves under someone's finger. Chase these three on real devices; ignore aggregate scores that hide a slow first visit behind cached repeat visits.",
      },
      {
        type: "quote",
        text: "Test on the phone your customer owns, on the network they have — not your laptop on fibre.",
      },
      {
        type: "p",
        text: "When we refurbish existing sites, performance work usually returns before any redesign does: faster pages rank better, convert better and cost less to serve. It is the rare improvement that pleases engineers, marketers and finance simultaneously.",
      },
    ],
  },
  {
    slug: "ai-in-web-development-practical-view",
    title: "AI in Web Development: What Actually Changed for Clients",
    category: "AI & Technology",
    date: "2026-06-30",
    readingTime: "6 min",
    excerpt:
      "Beyond the hype: where AI genuinely speeds up website delivery today, where it still fails, and how we use it responsibly.",
    author: "Team ImaginarsClub",
    body: [
      {
        type: "p",
        text: "AI has transformed how websites get built — mostly in ways clients feel as speed and thoroughness rather than as magic. Understanding where it helps helps you buy better.",
      },
      { type: "h2", text: "Where AI genuinely earns its keep" },
      {
        type: "list",
        items: [
          "Scaffolding: components, tests and configuration generated to team standards in minutes",
          "Review: automated passes catch accessibility gaps and regressions before human review",
          "Content operations: drafts, translations and alt-text produced fast, refined by humans",
          "Support assistants grounded in real documentation answering real customer questions",
        ],
      },
      { type: "h2", text: "Where it still fails predictably" },
      {
        type: "p",
        text: "Strategy, taste and accountability remain human work. Generated layouts converge on the same generic look; invented statistics poison trust; unmaintained automations rot. Any agency promising a fully autonomous website pipeline is selling you their QA problem later.",
      },
      {
        type: "quote",
        text: "AI writes the first draft of everything. Humans own the last draft — and the consequences.",
      },
      { type: "h2", text: "How we deploy it" },
      {
        type: "p",
        text: "Our workflow uses AI for acceleration inside strict review gates: generated code is tested, reviewed and benchmarked like any other; generated copy is fact-checked against client-approved claims only. The result is senior-level output at boutique speed — which is precisely the promise of this studio.",
      },
    ],
  },
  {
    slug: "write-a-brief-that-builds-a-better-website",
    title: "The Project Brief That Gets You a Better Website",
    category: "Digital Marketing",
    date: "2026-05-18",
    readingTime: "4 min",
    excerpt:
      "Most website projects go wrong before a line of code. Six questions that make any agency quote sharper — including ours.",
    author: "Team ImaginarsClub",
    body: [
      {
        type: "p",
        text: "A website project's success is largely decided in the brief. Not because agencies need paperwork, but because vague goals produce vague work. Answer these six questions and any competent partner — us included — will quote you more accurately and deliver something measurably closer to what you need.",
      },
      {
        type: "list",
        items: [
          "Who exactly is this site for, and what single action matters most per audience?",
          "What does success look like in numbers, measured how, by when?",
          "Which three competitor sites do you admire, and specifically why?",
          "What content exists today — and who owns producing what is missing?",
          "What must integrate: payments, CRM, booking, ERP?",
          "What is realistically budgeted for build and for the first year of care?",
        ],
      },
      { type: "h2", text: "Why this works" },
      {
        type: "p",
        text: "Each question forces a decision that would otherwise resurface mid-project as a change request. Audiences decide information architecture. Success metrics decide analytics setup. Content ownership decides timelines more than code ever does. Integration lists decide platform choice.",
      },
      {
        type: "quote",
        text: "The best briefs are uncomfortable: they commit to numbers, owners and dates.",
      },
      {
        type: "p",
        text: "Bring answers — even rough ones — to your first meeting with us and we will show you exactly how they shape scope, schedule and price. That transparency is deliberate: it is how we would want to be sold to.",
      },
    ],
  },
];

export function getInsight(slug: string): Insight | undefined {
  return insights.find((i) => i.slug === slug);
}
