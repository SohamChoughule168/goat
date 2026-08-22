import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description: `Terms governing use of the ${site.name} website and engagement of our services.`,
  path: "/legal/terms",
});

const SECTIONS = [
  {
    h: "The website",
    p: "Content on this site is provided for general information about our services. It does not constitute a binding offer; engagements are formed only through a written scope and agreement signed by both parties.",
  },
  {
    h: "Engagements & payment",
    p: "Every project runs on an agreed written scope with milestones and payment terms stated up front. Work outside that scope is quoted separately before it begins — no surprise invoices.",
  },
  {
    h: "Ownership",
    p: "Upon full payment, deliverables created for you become yours: code, designs, accounts and pipelines configured for your business. We retain the right to reference publicly released work in our portfolio unless confidentiality applies.",
  },
  {
    h: "Confidentiality",
    p: "Client material shared with us stays confidential during and after the engagement. Client-confidential projects never appear on this site without written permission.",
  },
  {
    h: "Accuracy of content",
    p: "We publish case studies and claims that trace to verifiable sources. Metrics shown belong to their stated context; results vary by business and no specific outcome is guaranteed.",
  },
  {
    h: "Governing law",
    p: "These terms are governed by the laws of India, with jurisdiction in Mumbai, Maharashtra.",
  },
];

export default function TermsPage() {
  return (
    <section className="section-y">
      <div className="shell max-w-3xl">
        <p className="eyebrow mb-5">Legal</p>
        <h1 className="display-2">Terms of Service</h1>
        <p className="lede mt-5 text-sm">
          Last updated: August 2026 · {site.legalName}, Mumbai
        </p>
        <div className="mt-12 space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h2 className="display-3">{s.h}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
            </div>
          ))}
          <div>
            <h2 className="display-3">Questions</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Write to{" "}
              <a href={`mailto:${site.email}`} className="link-line text-foreground">
                {site.email}
              </a>{" "}
              or call {site.phone}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
