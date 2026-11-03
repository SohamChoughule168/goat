import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { services } from "@/content/services";
import { FaqExplorer, type FaqItem } from "./FaqExplorer";

export const metadata: Metadata = createMetadata({
  title: "FAQ — Packages, Portals & Working With Us",
  description:
    "Answers on packages, festive pricing, student portals, online tests, fee payments, ownership and how an engagement runs.",
  path: "/faq",
});

const WORKING_FAQS: FaqItem[] = [
  {
    q: "How fast do you respond to enquiries?",
    a: "Every enquiry gets a reply within one business day. WhatsApp messages are usually faster. We commit to this in writing because it is the minimum you should expect from any partner.",
    category: "Working together",
  },
  {
    q: "Do you work with clients outside Mumbai?",
    a: "Yes. We are based in Mumbai but work remotely with clients across India and internationally. Timezone differences are managed through async communication and scheduled calls.",
    category: "Working together",
  },
  {
    q: "Do you offer payment plans?",
    a: "Standard engagements are 50% on signing, 50% on delivery. Larger projects are split across milestones agreed in the written scope. Monthly care plans are billed at the start of each month.",
    category: "Working together",
  },
  {
    q: "What if the project goes over scope?",
    a: "Work outside the agreed scope is quoted separately before it begins. You will never receive an invoice for something you did not approve in writing.",
    category: "Working together",
  },
  {
    q: "Can we start with one service and add others later?",
    a: "Yes, and many clients do. Starting narrow lets both sides validate fit before expanding into a broader engagement. Portals, tests and payment modules can be added to an existing site.",
    category: "Working together",
    href: "/pricing#builder",
    hrefLabel: "Build a package",
  },
  {
    q: "How long does a project take?",
    a: "Starter usually ships in about two weeks once content is ready. Growth takes three to four weeks. Pro depends on the agreed modules, typically six to eight weeks. Each project gets a written milestone plan before kickoff.",
    category: "Working together",
  },
];

const PACKAGE_FAQS: FaqItem[] = [
  {
    q: "Which package should we start with?",
    a: "If you need a credible presence and an enquiry form, start with Starter. If admissions enquiries are the priority and you want to see where they come from, choose Growth. If you need logins, a portal or custom workflows, choose Pro.",
    category: "Packages & pricing",
    href: "/pricing",
    hrefLabel: "Compare packages",
  },
  {
    q: "What exactly is included in Starter?",
    a: "Up to five pages, a mobile-first design, an enquiry form, WhatsApp click-to-chat, a map, basic on-page SEO, deployment and fourteen days of post-launch support. You supply the content and logo; we structure and edit the pages.",
    category: "Packages & pricing",
  },
  {
    q: "What does the festive offer include?",
    a: "The Dusshera–Diwali drop applies to the three website packages and is already reflected in the prices shown. Add-ons are priced separately. A written quote confirms the final scope before work begins.",
    category: "Packages & pricing",
    href: "/pricing",
    hrefLabel: "See current prices",
  },
  {
    q: "How long is support included?",
    a: "Starter includes fourteen days, Growth thirty days and Pro sixty days of post-launch support for fixes covered by the agreed scope. After that, monthly care plans start at ₹2,500 per month.",
    category: "Packages & pricing",
  },
  {
    q: "Are domain and hosting included?",
    a: "They are required for launch but quoted separately, because prices vary by provider and plan. We set them up in your name and show you the actual cost — there is no hidden markup on renewals.",
    category: "Packages & pricing",
  },
  {
    q: "Is there a monthly fee after launch?",
    a: "Only if you choose a care or AI plan. A finished website does not require an ongoing payment to us. Care plans cover updates, backups, security checks and small changes; AI plans cover assistant usage and tuning.",
    category: "Packages & pricing",
  },
];

const MODULE_FAQS: FaqItem[] = [
  {
    q: "Can we add a student portal?",
    a: "Yes. The portal module includes secure login, student profiles, results, downloads and notices. It is ₹15,000 as a one-time module and can be added to a new or existing website.",
    category: "Portals & modules",
    href: "/pricing?addon=student-portal#builder",
    hrefLabel: "Add the portal module",
  },
  {
    q: "Can students take tests online?",
    a: "Yes. The online tests module supports question banks, scheduled exams, timed attempts and result publication. It is ₹12,000 one-time, assumes you supply the questions and assessment pattern, and can be paired with the portal.",
    category: "Portals & modules",
    href: "/pricing?addon=online-tests#builder",
    hrefLabel: "Add online tests",
  },
  {
    q: "Can we collect fees on the website?",
    a: "Yes. The fee payments module adds online collection, receipts and basic reconciliation through a supported payment gateway. Gateway charges are billed by the provider, not by us. Setup is ₹10,000 one-time.",
    category: "Portals & modules",
    href: "/pricing?addon=fee-payments#builder",
    hrefLabel: "Add fee payments",
  },
  {
    q: "We run more than one branch. Can the site handle that?",
    a: "Yes. The multi-branch module adds separate pages, enquiry routing and reporting per location under one brand. It is ₹15,000 one-time and works alongside local SEO for each branch.",
    category: "Portals & modules",
    href: "/pricing?addon=multi-branch#builder",
    hrefLabel: "Add multi-branch",
  },
  {
    q: "Can you send batch reminders on WhatsApp?",
    a: "Yes. The broadcast module covers announcements, reminders and follow-ups through the official WhatsApp Business API. Setup is ₹5,000 and usage is ₹1,000 per month, excluding Meta conversation charges.",
    category: "Portals & modules",
    href: "/pricing?addon=broadcast#builder",
    hrefLabel: "Add WhatsApp broadcast",
  },
  {
    q: "What does the AI admissions assistant actually do?",
    a: "It answers common questions about courses, fees, timings and location from your approved content, then hands serious enquiries to your team with the conversation context. It does not invent fees or promise results.",
    category: "Portals & modules",
    href: "/pricing?addon=ai-admissions#builder",
    hrefLabel: "Add the assistant",
  },
  {
    q: "Can you migrate data from our current system?",
    a: "For portal, test and fee modules we can import student, batch and question data from spreadsheets or a documented export. Complex migrations from closed systems are quoted after a sample review.",
    category: "Portals & modules",
  },
];

const TRUST_FAQS: FaqItem[] = [
  {
    q: "Do we own the code and accounts?",
    a: "Yes. Source code, repositories, domains, hosting, analytics and payment accounts are created in your name or transferred at handover, with documentation. There is no proprietary platform you can only access through us.",
    category: "Ownership & trust",
    href: "/trust",
    hrefLabel: "Read the trust page",
  },
  {
    q: "Who owns the content and photographs we supply?",
    a: "You do. We use supplied logos, photographs and copy only for your project. We ask for permission before showing the work publicly, and we remove it on request.",
    category: "Ownership & trust",
  },
  {
    q: "How is enquiry data handled?",
    a: "Enquiry data is used only to respond to you or to operate the features you bought. We do not sell or rent it. Where a portal stores student data, access is role-based and the database is hosted in an access-controlled environment.",
    category: "Ownership & trust",
  },
  {
    q: "Do you guarantee first-page rankings or admission numbers?",
    a: "No, and any agency that does should be treated with suspicion. We build the technical and content foundations, report honestly on what changes, and never promise rankings or results we do not control.",
    category: "Ownership & trust",
  },
  {
    q: "What happens after the support period ends?",
    a: "You keep everything and can maintain it yourself. If you want us to continue, care plans cover updates, backups, security checks and a monthly change allowance. There is no obligation to continue.",
    category: "Ownership & trust",
  },
];

const SERVICE_FAQS: FaqItem[] = services.flatMap((service) =>
  service.faqs.slice(0, 2).map((faq) => ({
    ...faq,
    category: "Services",
    href: `/services/${service.slug}`,
    hrefLabel: service.title,
  })),
);

const ITEMS = [
  ...WORKING_FAQS,
  ...PACKAGE_FAQS,
  ...MODULE_FAQS,
  ...TRUST_FAQS,
  ...SERVICE_FAQS,
];

export default function FaqPage() {
  return (
    <div className="shell section-y">
      <div className="max-w-3xl">
        <p data-reveal="fade" className="eyebrow">
          FAQ
        </p>
        <h1 data-reveal="up" className="display-1 mt-4">
          Questions people <em>actually ask.</em>
        </h1>
        <p data-reveal="up" className="lede mt-6 max-w-[60ch]">
          Packages, portals, ownership and the practical details of working together.
          Search it, filter it, or skip straight to a conversation.
        </p>
      </div>

      <div className="mt-12 max-w-4xl" data-reveal="up">
        <FaqExplorer items={ITEMS} />
      </div>

      <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-[var(--rule)] pt-8">
        <p className="text-sm text-[var(--ink-3)]">Still unsure which package fits?</p>
        <Link href="/pricing#builder" className="btn btn-primary">
          Build a package
        </Link>
        <Link href="/contact" className="btn btn-secondary">
          Ask us directly
        </Link>
      </div>
    </div>
  );
}
