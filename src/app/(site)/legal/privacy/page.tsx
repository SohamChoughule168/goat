import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects information submitted through this website.`,
  path: "/legal/privacy",
});

const SECTIONS = [
  {
    h: "What we collect",
    p: "When you contact us through the brief form, email, phone or WhatsApp, we receive the details you choose to share — typically your name, contact information and project description. Our server logs standard technical request data for security and reliability.",
  },
  {
    h: "How we use it",
    p: "Contact details are used solely to respond to your enquiry and, if we proceed, to deliver the agreed work. We do not sell, rent or trade your information, and we do not add you to marketing lists without consent.",
  },
  {
    h: "Third parties",
    p: "Messages may be processed by infrastructure providers strictly as needed to operate the site and deliver communications (for example our hosting and email provider). We share the minimum required, never for advertising.",
  },
  {
    h: "Analytics & cookies",
    p: "This site runs privacy-first analytics without cross-site tracking cookies where enabled. No advertising trackers are embedded.",
  },
  {
    h: "Retention & your rights",
    p: "Enquiry records are kept only as long as useful for our working relationship. You may request access, correction or deletion of your data at any time by writing to us — we action requests within 30 days.",
  },
];

export default function PrivacyPage() {
  return (
    <section className="section-y">
      <div className="shell max-w-3xl">
        <p className="eyebrow mb-5">Legal</p>
        <h1 className="display-2">Privacy Policy</h1>
        <p className="lede mt-5 text-sm">
          Last updated: August 2026 · Applies to {site.url}
        </p>
        <div className="mt-12 space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h2 className="display-3">{s.h}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
            </div>
          ))}
          <div>
            <h2 className="display-3">Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Privacy questions:{" "}
              <a href={`mailto:${site.email}`} className="link-line text-foreground">
                {site.email}
              </a>{" "}
              · {site.phone} · {site.address.line1}, {site.address.line2}, {site.address.city}{" "}
              {site.address.postalCode}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
