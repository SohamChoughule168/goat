import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";
import { services } from "@/content/services";

export const metadata: Metadata = createMetadata({
  title: "FAQ",
  description: "Common questions about working with ImaginarsClub Services.",
  path: "/faq",
});

const GENERAL_FAQS = [
  {
    q: "How fast do you respond to enquiries?",
    a: "Every enquiry gets a reply within one business day. WhatsApp messages are usually faster. We commit to this in writing because it is the minimum you should expect from any partner.",
  },
  {
    q: "Do you work with clients outside Mumbai?",
    a: "Yes. We are based in Mumbai but work remotely with clients across India and internationally. Timezone differences are managed through async communication and scheduled calls.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Standard engagements are 50% on signing, 50% on delivery. Larger projects are split across milestones agreed in the written scope.",
  },
  {
    q: "What if the project goes over scope?",
    a: "Work outside the agreed scope is quoted separately before it begins. You will never receive an invoice for something you did not approve in writing.",
  },
  {
    q: "Can we start with one service and add others later?",
    a: "Yes, and many clients do. Starting narrow lets both sides validate fit before expanding into a broader engagement.",
  },
];

export default function FaqPage() {
  const serviceFaqs = services.flatMap((s) =>
    s.faqs.map((f) => ({ ...f, service: s.title, slug: s.slug }))
  );

  return (
    <main className="shell max-w-3xl section-y">
      <p className="micro">FAQ</p>
      <h1 className="display mt-4">Questions people actually ask.</h1>

      <h2 className="text-h3 mt-12 mb-6 font-semibold">Working with us</h2>
      <div className="space-y-8">
        {GENERAL_FAQS.map((f) => (
          <div key={f.q}>
            <h3 className="font-medium">{f.q}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>

      <h2 className="text-h3 mt-14 mb-6 font-semibold">Service-specific</h2>
      <div className="space-y-8">
        {serviceFaqs.map((f) => (
          <div key={f.q}>
            <p className="micro mb-1">{f.service}</p>
            <h3 className="font-medium">{f.q}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            <Link href={`/services/${f.slug}`} className="link-line mt-1 inline-block text-xs text-muted-foreground">
              View service →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
