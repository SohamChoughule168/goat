export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export const primaryNav: NavItem[] = [
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
  { label: "Proof", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Check fit",
    href: "/#fit-check",
    description: "Five questions. One bottleneck.",
  },
];

export const companyNav: NavItem[] = [
  { label: "About", href: "/about", description: "The studio and the people behind it." },
  { label: "Motion Showcase", href: "/showcase", description: "3D animated and cinematic motion landing pages." },
  { label: "Process", href: "/process", description: "How an engagement runs, phase by phase." },
  { label: "Trust", href: "/trust", description: "Ownership, security and accessibility commitments." },
  { label: "Field Notes", href: "/insights", description: "Working notes on education systems." },
  { label: "Careers", href: "/careers", description: "Open roles and how we hire." },
  { label: "Book a call", href: "/book", description: "A 30-minute working call, not a pitch." },
  { label: "Contact", href: "/contact", description: "Email, phone and WhatsApp." },
];

export const footerColumns = [
  {
    title: "Institution",
    links: [
      { label: "Platform", href: "/platform" },
      { label: "Solutions", href: "/solutions" },
      { label: "Pricing", href: "/pricing" },
      { label: "Book a discovery call", href: "/book" },
      { label: "Request a quote", href: "/quote" },
      { label: "Institution blueprint", href: "/blueprint" },
      { label: "Scope Architect", href: "/estimate" },
      { label: "Health Check", href: "/contact?intent=health-check" },
    ],
  },
  {
    title: "Proof",
    links: [
      { label: "Work", href: "/work" },
      { label: "Craft", href: "/craft" },
      { label: "Motion Showcase", href: "/showcase" },
      { label: "Trust", href: "/trust" },
      { label: "Process", href: "/process" },
      { label: "Field Notes", href: "/insights" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Cookies", href: "/legal/cookies" },
    ],
  },
] as const;

export const allNavItems: NavItem[] = [...primaryNav, ...companyNav];
