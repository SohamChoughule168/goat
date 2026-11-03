export type PackageSlug = "starter" | "growth" | "pro";

export interface PackageTier {
  slug: PackageSlug;
  name: string;
  subtitle: string;
  original: number;
  price: number;
  support: string;
  bestFor: string;
  featured?: boolean;
  features: string[];
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  monthly?: number;
  unit: "month" | "once";
}

export interface AddonGroup {
  id: string;
  title: string;
  note: string;
  addons: Addon[];
}

export const OFFER = {
  label: "Dusshera & Diwali offer",
  line: "Sale price drop on every website package",
  saveUpTo: 110000,
} as const;

export const PACKAGES: PackageTier[] = [
  {
    slug: "starter",
    name: "Starter",
    subtitle: "Professional website",
    original: 49999,
    price: 29999,
    support: "14 days support",
    bestFor: "A first, credible web presence for a single-branch institute.",
    features: [
      "Responsive website (mobile friendly)",
      "Up to 5 pages — Home, About, Courses, Gallery/Results, Contact",
      "Course / service information",
      "Enquiry form",
      "WhatsApp integration",
      "Contact & map integration",
      "Basic on-page SEO",
      "14 days support",
    ],
  },
  {
    slug: "growth",
    name: "Growth",
    subtitle: "Website + lead management",
    original: 89999,
    price: 59999,
    support: "30 days support",
    featured: true,
    bestFor: "An institute ready to turn website visits into tracked admissions enquiries.",
    features: [
      "Everything in Starter",
      "Up to 10 pages",
      "Custom design & branding",
      "Enquiry / lead tracking setup",
      "Gallery / results / testimonials",
      "Google Analytics & Search Console setup",
      "Basic local SEO",
      "30 days support",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    subtitle: "Website + application",
    original: 259999,
    price: 149999,
    support: "60 days support",
    bestFor: "A growing institute that needs a student portal or management modules.",
    features: [
      "Everything in Growth",
      "Basic custom application / student portal",
      "Login & dashboard (if specified)",
      "Agreed modules — student records, fees, attendance, etc.",
      "Admin panel & content management",
      "Deployment assistance",
      "60 days support",
    ],
  },
];

export const ADDON_GROUPS: AddonGroup[] = [
  {
    id: "care",
    title: "Care & maintenance",
    note: "Ongoing support, billed monthly. Optional after launch.",
    addons: [
      {
        id: "care-lite",
        name: "Basic maintenance",
        description: "Content updates and routine website upkeep.",
        price: 2500,
        unit: "month",
      },
      {
        id: "care-standard",
        name: "Standard care",
        description: "Content updates, updates to core software, and backups.",
        price: 5000,
        unit: "month",
      },
      {
        id: "care-premium",
        name: "Premium care",
        description: "Full support plus analytics review and monthly reporting.",
        price: 8000,
        unit: "month",
      },
      {
        id: "care-app",
        name: "Application maintenance",
        description: "Care for portals, dashboards and custom modules.",
        price: 7000,
        unit: "month",
      },
      {
        id: "care-priority",
        name: "Dedicated priority support",
        description: "Named contact with priority response for urgent issues.",
        price: 12000,
        unit: "month",
      },
    ],
  },
  {
    id: "ai",
    title: "AI add-ons",
    note: "Smart automation for enquiries, admissions and content. Billed monthly.",
    addons: [
      {
        id: "ai-chatbot",
        name: "AI enquiry chatbot",
        description: "Answers common course, fee and timing questions 24/7.",
        price: 5000,
        unit: "month",
      },
      {
        id: "ai-lead-scoring",
        name: "AI lead scoring & follow-up",
        description: "Ranks enquiries by intent and triggers follow-up prompts.",
        price: 7500,
        unit: "month",
      },
      {
        id: "ai-admissions",
        name: "Smart admission assistant",
        description: "Guides a prospect from enquiry to booked counselling call.",
        price: 10000,
        unit: "month",
      },
      {
        id: "ai-content",
        name: "AI content suggestions",
        description: "Draft ideas and outlines for blogs, notices and social posts.",
        price: 3500,
        unit: "month",
      },
      {
        id: "ai-analytics",
        name: "AI analytics & insights",
        description: "Plain-language monthly read on enquiries, sources and drop-offs.",
        price: 5000,
        unit: "month",
      },
    ],
  },
  {
    id: "modules",
    title: "Modules & growth",
    note: "One-time builds added to any package.",
    addons: [
      {
        id: "student-portal",
        name: "Student portal",
        description: "Login, profile and results for enrolled students.",
        price: 15000,
        unit: "once",
      },
      {
        id: "online-tests",
        name: "Online test / exam module",
        description: "Scheduled tests, question banks and result publication.",
        price: 12000,
        unit: "once",
      },
      {
        id: "fee-payments",
        name: "Fee payment integration",
        description: "Online fee collection with receipts and reconciliation.",
        price: 10000,
        unit: "once",
      },
      {
        id: "multi-branch",
        name: "Multi-branch management",
        description: "Separate branch pages, enquiries and reporting.",
        price: 15000,
        unit: "once",
      },
      {
        id: "advanced-seo",
        name: "Advanced SEO — 6 months",
        description: "Technical fixes, local pages and content for search visibility.",
        price: 12000,
        unit: "once",
      },
      {
        id: "broadcast",
        name: "SMS / WhatsApp broadcast",
        description: "Setup plus a monthly allowance for announcements.",
        price: 5000,
        monthly: 1000,
        unit: "once",
      },
    ],
  },
];

export const ALL_ADDONS = ADDON_GROUPS.flatMap((group) => group.addons);

export function formatINR(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export function formatMonthly(value: number): string {
  return `${formatINR(value)}/mo`;
}
