export interface CaseResult {
  label: string;
  value: string;
  note?: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  sector: string;
  year: number;
  services: string[];
  summary: string;
  challenge: string;
  approach: string[];
  execution: { title: string; detail: string }[];
  results: CaseResult[];
  proof: {
    note: string;
    links: { label: string; href: string }[];
  };
  stack: string[];
  status: "verified";
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "prv-financial-services",
    client: "PRV Financial Services",
    sector: "Financial Services",
    year: 2025,
    services: ["Web Development", "Backend Integration", "Deployment"],
    summary:
      "End-to-end design and build of a financial services company's public website — from information architecture through backend integration to production deployment.",
    challenge:
      "PRV Financial Services needed a credible, fast web presence that explained regulated financial products clearly, worked flawlessly on mobile (where most Indian finance traffic lives), and could be maintained by non-developers after handover.",
    approach: [
      "Structure first: sitemap and page goals agreed before any visual design, so every page had one job.",
      "Design for trust: conservative typography, clear disclosures, and contact paths on every screen.",
      "Build for longevity: a modern component-based front-end with a clean deployment pipeline the client owns.",
    ],
    execution: [
      {
        title: "Information architecture",
        detail:
          "Content modelled around visitor intents — understand services, check credibility, make contact — rather than internal org structure.",
      },
      {
        title: "Front-end engineering",
        detail:
          "Responsive build with performance budgets enforced during development; accessibility checked against WCAG AA.",
      },
      {
        title: "Integration & launch",
        detail:
          "Backend integrations wired in, DNS cutover planned, and post-launch monitoring configured before go-live.",
      },
    ],
    results: [
      {
        label: "Delivered",
        value: "End-to-end",
        note: "Single team from design through deployment",
      },
      {
        label: "Timeline",
        value: "On schedule",
        note: "Shipped April 2025 with formal client appreciation for timeliness",
      },
      {
        label: "Status",
        value: "Live & owned",
        note: "Client controls the site and pipeline after handover",
      },
    ],
    proof: {
      note: "This engagement is publicly documented by both the client's live website and our delivery team's verified work record.",
      links: [
        { label: "Visit the live site", href: "https://www.prvfinancialservices.com/" },
        {
          label: "Delivery record on LinkedIn",
          href: "https://in.linkedin.com/company/imaginarsclubservices",
        },
      ],
    },
    stack: ["Next.js", "TypeScript", "Responsive UI", "CI/CD Deployment"],
    status: "verified",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
