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
    readingTime: "8 min",
    excerpt:
      "Search engines are becoming answer engines. Here is what Generative Engine Optimization actually involves — and what it does not replace.",
    author: "Team ImaginarsClub",
    body: [
      {
        type: "p",
        text: "A growing share of searches now end without a click. AI Overviews, chatbots and assistants synthesise an answer from many sources, and the user may never see your beautifully ranked page. Generative Engine Optimization (GEO) is the discipline of making sure your business is understood — and cited — by those systems.",
      },
      {
        type: "p",
        text: "The shift is structural, not cosmetic. For twenty years, SEO meant optimising individual pages for individual queries. GEO requires you to think about how machines understand your entire business: who you are, what you do, where you operate, and why an engine should trust your answer over thousands of alternatives.",
      },
      { type: "h2", text: "What generative engines actually read" },
      {
        type: "p",
        text: "Large language models and AI search systems favour content that is unambiguous, well-structured and attributable. In practice that means clear entity definitions (who you are, what you do, where you operate), consistent naming across the web, and pages that answer specific questions completely rather than padding around them.",
      },
      {
        type: "list",
        items: [
          "Structured data (schema.org) so machines parse facts instead of guessing them — Organization, LocalBusiness, Service and FAQ markup at minimum",
          "An 'About' story consistent across your site, LinkedIn and directories — conflicting information erodes machine confidence",
          "Original data, checklists or frameworks other sources will want to cite; engines prefer referencing primary sources over aggregators",
          "Question-shaped headings matched to how customers actually ask — not internal jargon",
          "Author credentials and expertise signals (E-E-A-T) that demonstrate first-hand knowledge",
        ],
      },
      { type: "h2", text: "What GEO does not replace" },
      {
        type: "p",
        text: "Technical SEO remains the floor. If crawlers cannot render your pages efficiently, if Core Web Vitals fail, if canonical tags conflict — no amount of GEO rescues you. The order of operations is: crawlable, fast, structured, then citable. Skipping any earlier step undermines everything downstream.",
      },
      {
        type: "p",
        text: "Classic link building also still matters. Engines evaluate authority signals when deciding which sources to cite. A site with strong technical foundations, deep content and quality inbound links will always outperform one that only optimises for generative engines.",
      },
      {
        type: "quote",
        text: "The businesses that win AI visibility are the ones that were already the clearest source of truth in their niche.",
      },
      { type: "h2", text: "Measuring GEO results" },
      {
        type: "p",
        text: "Unlike traditional SEO where rank positions are directly observable, GEO measurement requires active probing. We run monthly visibility checks across major AI platforms — asking target questions and recording whether our clients appear in the generated answers. We also track referral traffic from AI surfaces where attribution allows.",
      },
      {
        type: "p",
        text: "The metrics that matter are: citation frequency (how often your brand appears in AI answers), citation context (whether the framing is positive and accurate), and referral quality (whether AI-referred visitors convert at comparable rates). These are directional indicators, not precise measurements — the ecosystem is too young for standardised tooling.",
      },
      { type: "h2", text: "A practical starting sequence" },
      {
        type: "p",
        text: "First, audit entity consistency: does every profile and page describe your business identically? Second, implement Organization, LocalBusiness and Service schema properly — not just homepage boilerplate. Third, pick ten questions your buyers genuinely ask and answer each one definitively on its own page. Fourth, measure citations monthly by asking major AI platforms about your category and recording who gets quoted.",
      },
      {
        type: "p",
        text: "This is not theoretical. We run this exact programme for clients — and yes, this site practises it too. Inspect our schema and you will find the same structure we recommend.",
      },
    ],
  },
  {
    slug: "website-performance-that-converts",
    title: "Website Speed Is a Sales Feature, Not a Technical Chore",
    category: "Web Development",
    date: "2026-07-28",
    readingTime: "7 min",
    excerpt:
      "Slow sites quietly tax every marketing rupee you spend. A field guide to performance budgets that hold up after launch.",
    author: "Team ImaginarsClub",
    body: [
      {
        type: "p",
        text: "Every extra second of load time taxes two budgets simultaneously: your visitors' patience and your advertising spend. On mobile connections in emerging markets, the tax is heavier still. Performance is not a developer preference — it is the multiplier on every campaign you run and every organic visit you earn.",
      },
      { type: "h2", text: "Budget before beauty" },
      {
        type: "p",
        text: "High-performing teams set hard budgets before design begins: Largest Contentful Paint under two seconds on mid-range phones, JavaScript payloads measured in kilobytes, images served in AVIF or WebP with responsive sizes. Then every feature negotiates against those numbers instead of discovering them at launch.",
      },
      {
        type: "list",
        items: [
          "Ship less JavaScript: server-render everything that does not need client-side interactivity",
          "Load heavy libraries only when the user reaches the section that uses them",
          "Give every image explicit dimensions so layout never jumps during load",
          "Self-host fonts, subset to used weights only, preload the primary display face",
          "Use next/font or equivalent to eliminate flash of unstyled text",
          "Set performance budgets in CI so regressions fail the build before they reach users",
        ],
      },
      { type: "h2", text: "The three metrics that matter" },
      {
        type: "p",
        text: "LCP tells you whether the main content arrives fast enough to keep visitors engaged. INP tells you whether taps respond while the page is busy hydrating. CLS tells you whether the page moves under someone's finger mid-read. Chase these three on real devices; ignore aggregate scores that hide a slow first visit behind cached repeat visits.",
      },
      {
        type: "p",
        text: "The most common LCP killer we see is a hero image without priority hints, or a font that loads after the text renders. Both are fixable in minutes once identified, but they require deliberate testing to surface.",
      },
      {
        type: "quote",
        text: "Test on the phone your customer owns, on the network they have — not your laptop on fibre.",
      },
      { type: "h2", text: "Performance as ongoing practice" },
      {
        type: "p",
        text: "Speed degrades naturally as features accumulate. Every new library, tracking script and third-party embed adds weight. Teams that maintain fast sites do so through continuous monitoring, not one-time optimisation sprints.",
      },
      {
        type: "p",
        text: "Set up automated performance checks in CI. Run Lighthouse on every pull request. Alert when LCP regresses beyond your budget. When we refurbish existing sites, performance work usually returns before any redesign does: faster pages rank better, convert better and cost less to serve.",
      },
      {
        type: "p",
        text: "It is the rare improvement that pleases engineers, marketers and finance simultaneously — and the foundation every other optimization depends on.",
      },
    ],
  },
  {
    slug: "ai-in-web-development-practical-view",
    title: "AI in Web Development: What Actually Changed for Clients",
    category: "AI & Technology",
    date: "2026-06-30",
    readingTime: "7 min",
    excerpt:
      "Beyond the hype: where AI genuinely speeds up website delivery today, where it still fails, and how to use it responsibly.",
    author: "Team ImaginarsClub",
    body: [
      {
        type: "p",
        text: "AI has transformed how websites get built — mostly in ways clients experience as speed and thoroughness rather than magic. Understanding where it helps helps you buy better and set realistic expectations for timelines and outcomes.",
      },
      { type: "h2", text: "Where AI genuinely earns its keep" },
      {
        type: "list",
        items: [
          "Scaffolding: components, configuration and test suites generated to team standards in minutes instead of hours",
          "Code review: automated passes catch accessibility gaps, security issues and regressions before human reviewers open the pull request",
          "Content operations: drafts, translations, alt-text and meta descriptions produced quickly, refined by humans who understand brand voice",
          "Support assistants grounded in real documentation answering actual customer questions accurately around the clock",
          "Documentation: API references, deployment guides and architecture diagrams generated from code annotations",
        ],
      },
      { type: "h2", text: "Where it still fails predictably" },
      {
        type: "p",
        text: "Strategy, taste and accountability remain human work. Generated layouts converge on the same generic look because models learn from averages. Invented statistics poison trust and create legal exposure. Unmaintained automations rot silently until they break something important. Any agency promising a fully autonomous website pipeline is selling you their QA problem for later.",
      },
      {
        type: "list",
        items: [
          "Generated layouts look generic because they are trained on generic patterns — distinctive brands need human art direction",
          "Invented statistics and fake testimonials damage credibility permanently once discovered",
          "Unmaintained chatbots give wrong answers confidently, damaging customer trust faster than having no chatbot at all",
          "AI-generated code without review introduces subtle bugs and security vulnerabilities",
        ],
      },
      {
        type: "quote",
        text: "AI writes the first draft of everything. Humans own the last draft — and the consequences.",
      },
      { type: "h2", text: "How we deploy it responsibly" },
      {
        type: "p",
        text: "Our workflow uses AI for acceleration inside strict review gates: generated code is tested, reviewed and benchmarked like any other contribution. Generated copy is fact-checked against client-approved claims only. Design decisions remain human because taste cannot be delegated to a model trained on averages.",
      },
      {
        type: "p",
        text: "The result is senior-level output at boutique speed — which is precisely the promise of this studio. Clients get faster delivery without the quality discount that pure automation would impose.",
      },
      {
        type: "p",
        text: "For buyers evaluating agencies, the right question is not 'do you use AI?' but 'how do you ensure AI-generated work meets professional standards?' The answer reveals whether they treat AI as a shortcut or as a tool within a rigorous process.",
      },
    ],
  },
  {
    slug: "write-a-brief-that-builds-a-better-website",
    title: "The Project Brief That Gets You a Better Website",
    category: "Digital Marketing",
    date: "2026-05-18",
    readingTime: "6 min",
    excerpt:
      "Most website projects go wrong before a line of code. Six questions that make any agency quote sharper — including ours.",
    author: "Team ImaginarsClub",
    body: [
      {
        type: "p",
        text: "A website project's success is largely decided in the brief. Not because agencies need paperwork, but because vague goals produce vague work. Answer six questions and any competent partner — us included — will quote you more accurately and deliver something measurably closer to what you need.",
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
      { type: "h2", text: "Why each question matters" },
      {
        type: "p",
        text: "Audience definition decides information architecture. Success metrics decide analytics setup and reporting cadence. Competitor analysis sets quality expectations and differentiation strategy. Content ownership determines timeline more than code complexity does. Integration lists determine platform choice and development cost.",
      },
      {
        type: "p",
        text: "Budget transparency enables honest recommendations. An agency that knows your budget can propose the best solution within it rather than upselling beyond it or underdelivering beneath it.",
      },
      { type: "h2", text: "Common brief mistakes" },
      {
        type: "list",
        items: [
          "'Modern and clean' as a design direction — this describes every website built since 2015",
          "'We want something like Apple' without specifying which aspect: typography, animation, product photography, or conversion flow",
          "No content plan: assuming the agency will write all copy without understanding the business deeply enough to do it accurately",
          "No integration list: discovering the CRM requirement at week four of a six-week project",
          "No success metric: launching a beautiful site that cannot demonstrate ROI",
        ],
      },
      {
        type: "quote",
        text: "The best briefs are uncomfortable: they commit to numbers, owners and dates.",
      },
      { type: "h2", text: "What happens next" },
      {
        type: "p",
        text: "Bring answers to your first meeting and we will show you exactly how they shape scope, schedule and price. That transparency is deliberate: it is how we would want to be sold to. Even rough answers improve quote accuracy dramatically compared to 'we need a website'.",
      },
      {
        type: "p",
        text: "If you cannot answer all six yet, that is fine — it just means you need a discovery phase before a build phase, and knowing that saves everyone time and money.",
      },
    ],
  },
  {
    slug: "design-tokens-and-design-systems",
    title: "Design Tokens: Why Your Next Rebuild Should Start Here",
    category: "Web Development",
    date: "2026-08-15",
    readingTime: "7 min",
    excerpt:
      "Design tokens are the contract between design and engineering. Here is how to implement them so rebrands take hours, not months.",
    author: "Team ImaginarsClub",
    body: [
      {
        type: "p",
        text: "Every website accumulates visual debt: hardcoded hex values scattered across components, inconsistent spacing that looks slightly off, button styles that drifted apart over six months of quick fixes. Design tokens solve this by defining every visual decision once, in one place, as a named variable that both designers and engineers reference.",
      },
      { type: "h2", text: "Three tiers, not one" },
      {
        type: "p",
        text: "Effective token systems have three layers. Tier 1 primitives are raw values: --blue-500, --neutral-900, --space-4. Tier 2 semantic tokens map primitives to meaning: --color-accent, --color-text-muted, --space-gutter. Tier 3 component tokens scope semantics to specific elements: --button-padding-x, --card-border-radius. Components reference only tier 2 and tier 3 — never tier 1 directly.",
      },
      {
        type: "p",
        text: "The middle tier is what makes rebranding possible. When your accent colour changes from blue to green, you update one semantic token and every button, link and indicator updates simultaneously. Without semantic indirection, you grep-and-replace across hundreds of files and pray you caught them all.",
      },
      {
        type: "list",
        items: [
          "Primitives: --indigo-600, --slate-100, --space-16 (never used directly)",
          "Semantic: --color-accent, --color-surface-raised, --space-section-y (used everywhere)",
          "Component: --button-height, --input-border-color (scoped to specific patterns)",
        ],
      },
      { type: "h2", text: "Dual-mode is the real test" },
      {
        type: "p",
        text: "Light and dark modes are where token systems prove their worth. In a well-designed system, dark mode is a remapping of tier-2 tokens: surfaces darken, text lightens, borders adjust, accents shift chroma. No component logic changes. No conditional classes. The variables simply resolve differently.",
      },
      {
        type: "p",
        text: "Systems without semantic tokens handle dark mode by duplicating every component style with a .dark prefix — doubling maintenance and guaranteeing drift between modes.",
      },
      {
        type: "quote",
        text: "If switching to dark mode requires touching component files, your token architecture has already failed.",
      },
      { type: "h2", text: "Contrast verification belongs in CI" },
      {
        type: "p",
        text: "Token values should be verified against WCAG contrast requirements automatically. A script reads the generated CSS, computes contrast ratios for every foreground-background pairing, and fails the build if any pairing falls below its target. This catches accessibility regressions before they reach users.",
      },
      {
        type: "p",
        text: "The verification script should also cross-check against the design spec: if the spec claims text-on-bg achieves 19:1 but computation says 17:1, the spec is wrong or the implementation diverged. Either way, the discrepancy surfaces before launch rather than in an audit.",
      },
      { type: "h2", text: "Getting started practically" },
      {
        type: "p",
        text: "Start with colour tokens only: define your palette as CSS custom properties, then replace every hardcoded value in your stylesheets with var() references. Add spacing tokens next, then typography. Do not try to tokenise everything at once — incremental adoption beats a big-bang migration that stalls halfway.",
      },
    ],
  },
  {
    slug: "accessibility-as-business-advantage",
    title: "Accessibility Is Not Charity. It Is a Business Advantage.",
    category: "Web Development",
    date: "2026-08-01",
    readingTime: "6 min",
    excerpt:
      "Accessible websites serve more users, rank better in search, and avoid legal risk. Here is how to approach it as engineering, not compliance theatre.",
    author: "Team ImaginarsClub",
    body: [
      {
        type: "p",
        text: "One in six people worldwide has a disability that affects how they use the internet. That includes visual impairments, motor limitations, cognitive differences and hearing loss. Accessible design serves these users — and in doing so creates better experiences for everyone, because the principles overlap heavily with good UX.",
      },
      { type: "h2", text: "The business case, plainly stated" },
      {
        type: "list",
        items: [
          "Larger addressable market: accessible sites serve users whom inaccessible sites exclude entirely",
          "Better SEO: search engines reward semantic HTML, proper heading hierarchy and alt text — the same things screen readers need",
          "Legal risk reduction: accessibility lawsuits against businesses are increasing globally",
          "Better mobile experience: accessible design principles (clear hierarchy, sufficient contrast, generous touch targets) directly improve mobile usability",
          "Future-proofing: as populations age, accessibility requirements grow — building accessible now avoids costly retrofitting later",
        ],
      },
      { type: "h2", text: "What accessibility actually means in practice" },
      {
        type: "p",
        text: "Accessibility is often reduced to adding alt text and checking colour contrast. Those matter, but comprehensive accessibility covers interaction design too: can every feature be reached with keyboard alone? Does focus order follow logical reading sequence? Are error messages descriptive enough to act on? Does the page work at 200% zoom without horizontal scrolling?",
      },
      {
        type: "list",
        items: [
          "Keyboard navigation: every interactive element reachable and operable without a mouse, with visible focus indicators that meet contrast requirements",
          "Screen reader compatibility: semantic HTML landmarks, proper heading hierarchy, descriptive links and buttons, form labels associated with inputs",
          "Colour independence: information never conveyed by colour alone — always paired with text labels, icons or patterns",
          "Motion sensitivity: prefers-reduced-motion honoured completely, no essential content hidden behind animations",
          "Zoom tolerance: functional at 200% browser zoom without loss of content or functionality",
        ],
      },
      {
        type: "quote",
        text: "Accessible design is good design. The curb cuts built for wheelchairs help parents with strollers, travellers with luggage, and delivery workers with carts.",
      },
      { type: "h2", text: "How to start without overwhelming your team" },
      {
        type: "p",
        text: "Start with automated testing: tools like axe-core catch many issues automatically and integrate into CI pipelines. Then do manual keyboard testing: tab through every page and verify focus order, visibility and logical flow. Finally, test with an actual screen reader — NVDA on Windows or VoiceOver on Mac are free.",
      },
      {
        type: "p",
        text: "Fix what automated tools catch first, then address manual findings incrementally. Accessibility is a practice, not a checkbox — and teams that treat it as such ship better products for everyone.",
      },
    ],
  },
];

export function getInsight(slug: string): Insight | undefined {
  return insights.find((i) => i.slug === slug);
}
