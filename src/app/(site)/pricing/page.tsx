import type { Metadata } from "next";
import Link from "next/link";
import "../../../styles/evidence.css";
import EvidenceHeader from "@/components/evidence/evidence-header";
import ScopeMatrix from "@/components/evidence/scope-matrix";
import { createMetadata } from "@/lib/seo";
import { OFFER, formatINR } from "@/content/packages";
import PricingBuilder from "./PricingBuilder";

export const metadata: Metadata = createMetadata({
  title: "Pricing — websites, portals and apps",
  description:
    "Transparent festive pricing: Starter ₹29,999, Growth ₹59,999, Pro ₹1,49,999, plus portals, payments and AI add-ons for institutes and small businesses.",
  path: "/pricing",
});

const TERMS = [
  "We create, design and optimise the website or application using accurate information supplied by you.",
  "The client provides correct business details, images where available, and the documents required to publish.",
  "Reviews, rankings and admissions results are not guaranteed; outcomes depend on the market and the quality of the offer.",
  "The client cooperates on photography, content approval and revision review within the agreed windows.",
  "The care plan is optional and can be started or stopped with prior notice.",
  "Payment is non-refundable once work has started.",
  "We are not responsible for policy or product changes made by Google or other third-party platforms.",
  "The site is built for the business's own online presence and related services.",
  "Approving a written quote confirms the scope, the milestones and these terms.",
];

const FAQS = [
  {
    q: "What is included in the festive price?",
    a: "The package price covers design, build and the listed features. The struck-through figure is the standard fee. Domain and hosting are quoted at actual cost unless your written quote includes them.",
  },
  {
    q: "How do payments work?",
    a: "A written quote confirms scope, timeline and payment milestones before work starts. Projects typically begin with an advance, with the balance released at agreed milestones. Care plans and AI add-ons are billed separately.",
  },
  {
    q: "How long does a build take?",
    a: "Starter usually ships in about two weeks once content and approvals are ready. Growth takes three to four weeks. Pro depends on the agreed modules, typically six to eight weeks.",
  },
  {
    q: "Can we add a student portal later?",
    a: "Yes. Portals, assessments, fee payments and multi-branch management can be added at any time. If you already have a website, we scope the module against it instead of rebuilding everything.",
  },
  {
    q: "Do we own the website and accounts?",
    a: "Yes. Source code, domain, hosting and analytics accounts are set up in your name or transferred at handover, with documentation.",
  },
  {
    q: "Why is Institutional quoted rather than priced?",
    a: "Multi-branch groups have different seams, data models and approval chains. A number before diagnosis would be a guess, so the institutional column is priced after a written diagnosis of what already exists.",
  },
];

export default function PricingPage() {
  return (
    <>
      <EvidenceHeader
        index="03"
        label="Pricing"
        title={
          <>
            Clear scope, <span className="inst-serif">honest bands.</span>
          </>
        }
        lede="Every engagement is scoped before it starts. These are the starting packages for websites, student portals and application builds. Configure one below for an indicative total; a written quote still governs the final scope."
        meta={[
          { label: "Tiers", value: "04" },
          { label: "Packaged", value: "03" },
          { label: "Offer", value: "Festive pricing" },
          { label: "Institutional", value: "Quoted" },
        ]}
        status="Festive terms in effect"
        actions={
          <>
            <a href="#builder" className="inst-btn">
              Configure a build
            </a>
            <Link href="/estimate" className="inst-btn inst-btn-ghost">
              Use the estimator
            </Link>
          </>
        }
        note={[
          `${OFFER.label} / save up to ${formatINR(OFFER.saveUpTo)}`,
          "Institutional / quoted after diagnosis",
          "Taxes extra where applicable",
        ]}
      />

      <section id="matrix" className="inst-section ev-anchor" aria-labelledby="matrix-title">
        <div className="inst-shell">
          <div className="ev-section-head">
            <div>
              <p className="inst-label">Scope matrix / four tiers</p>
              <h2 id="matrix-title" className="inst-h2 mt-4">
                What changes as you <span className="inst-serif">move up.</span>
              </h2>
            </div>
            <p>
              Most comparison tables bury the answer under identical ticks. Filter to changes only
              and the matrix shows exactly what a higher tier buys — and where the institutional
              column is deliberately left unpriced.
            </p>
          </div>

          <ScopeMatrix />
        </div>
      </section>

      <section id="builder" className="inst-section ev-anchor" aria-labelledby="builder-title">
        <div className="inst-shell">
          <div className="ev-section-head">
            <div>
              <p className="inst-label">Builder</p>
              <h2 id="builder-title" className="inst-h2 mt-4">
                Price the shape of the <span className="inst-serif">build.</span>
              </h2>
            </div>
            <p>
              Select a package and the modules you actually need. The total updates in place. It is
              an indicative figure, not an invoice: scope, content and integrations are confirmed in
              writing before work starts.
            </p>
          </div>

          <PricingBuilder />
        </div>
      </section>

      <section id="terms" className="inst-section ev-anchor" aria-labelledby="terms-title">
        <div className="inst-shell">
          <div className="ev-split">
            <div>
              <p className="inst-label">Terms / plain language</p>
              <h2 id="terms-title" className="inst-h2 mt-4">
                The version you can actually <span className="inst-serif">read.</span>
              </h2>
              <ol className="ev-terms mt-8">
                {TERMS.map((term, index) => (
                  <li key={term}>
                    <span className="inst-num">{String(index + 1).padStart(2, "0")}</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className="inst-label">Questions</p>
              <h2 className="inst-h2 mt-4">Before you commit.</h2>
              <div className="ev-faq mt-8">
                {FAQS.map((faq) => (
                  <details key={faq.q}>
                    <summary>{faq.q}</summary>
                    <p className="faq-answer">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="inst-section" aria-labelledby="pricing-next">
        <div className="inst-shell">
          <div className="ev-cta">
            <div>
              <p className="inst-label">Not sure where you fit?</p>
              <h2 id="pricing-next" className="inst-h2 mt-4">
                Tell us the intake you want. We will scope backwards.
              </h2>
              <p className="mt-5">
                If the right tier is not obvious, start with the outcome and the constraint. We will
                tell you the smallest build that can reach it — or that it cannot be reached on your
                budget, before you spend anything.
              </p>
              <div className="ev-actions">
                <Link href="/estimate" className="inst-btn">
                  Use the estimator
                </Link>
                <Link href="/book" className="inst-btn inst-btn-ghost">
                  Book a call
                </Link>
              </div>
            </div>

            <ol className="ev-steps">
              <li>
                <span className="inst-num">01</span>
                <span>
                  <strong>Send the constraint</strong>
                  <span className="ev-steps-detail">
                    Budget, deadline, or the one thing that must work on day one.
                  </span>
                </span>
              </li>
              <li>
                <span className="inst-num">02</span>
                <span>
                  <strong>Get a written range</strong>
                  <span className="ev-steps-detail">
                    A fixed price for a defined scope, or a range with the assumptions stated.
                  </span>
                </span>
              </li>
              <li>
                <span className="inst-num">03</span>
                <span>
                  <strong>Decide against evidence</strong>
                  <span className="ev-steps-detail">
                    No pressure to start immediately. The diagnosis remains yours either way.
                  </span>
                </span>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
