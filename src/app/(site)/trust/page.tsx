import type { Metadata } from "next";
import Link from "next/link";
import EvidenceHeader from "@/components/evidence/evidence-header";
import TrustSeal from "@/components/evidence/trust-seal";
import HandoverCinema from "@/components/trust/handover-cinema";
import { handoverPlates } from "@/content/trust";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createMetadata({
  title: "Trust & Security",
  description:
    "Confidentiality posture, data handling, access control, IP ownership and the practical terms behind an engagement.",
  path: "/trust",
});

const SECTIONS = [
  {
    h: "Confidentiality",
    p: "Client material shared with us stays confidential during and after the engagement. We never reference client-confidential projects publicly without written permission, and we treat those obligations as absolute. NDAs are welcome before the first substantive call.",
  },
  {
    h: "Data handling",
    p: "Enquiry data is used solely to respond to you or to operate a feature you bought. Analytics on this site are privacy-first with no cross-site tracking cookies. We do not sell, rent or trade your information.",
  },
  {
    h: "Where client material lives",
    p: "Project repositories, design files and communication are stored in access-controlled environments. Access is limited to the people actively working on your project and removed when the engagement ends.",
  },
  {
    h: "Subcontractors",
    p: "We work with a vetted network of specialists assembled per project. Every subcontractor signs the same confidentiality terms we hold ourselves to, and we remain your single point of accountability.",
  },
  {
    h: "IP ownership",
    p: "Upon full payment, deliverables become yours: code, designs, accounts and pipelines configured in your name from day one. We retain the right to reference publicly released work unless confidentiality applies.",
  },
  {
    h: "Engagement terms",
    p: "Every project runs on a written scope with milestones and payment terms agreed before work begins. Work outside that scope is quoted separately before it starts.",
  },
];

const DATA_MAP = [
  ["Enquiry form", "Name, contact, message, optional service interest", "Retained until you ask us to delete it"],
  ["Analytics", "Aggregate page views and device class", "No cross-site identifier; no advertising profile"],
  ["Student portal", "Student name, batch, results and fee status", "Owned by the institute; role-based access"],
  ["Payments", "Transaction reference and amount", "Card data handled by the payment provider, never stored by us"],
];

const PRACTICES = [
  {
    h: "Least-privilege access",
    p: "Shared accounts are avoided. Each collaborator gets their own login with only the permissions the work requires, and access is revoked at handover.",
    note: "Revoked at handover",
  },
  {
    h: "Encrypted transport",
    p: "Sites ship with HTTPS and HSTS. Forms submit over TLS. Payment flows use hosted fields so card details never touch our servers.",
    note: "TLS end to end",
  },
  {
    h: "Backups before launch",
    p: "For portal and database work we agree a backup cadence during discovery. A backup you have never restored is a hope, not a plan, so we test the restore.",
    note: "Restore tested",
  },
  {
    h: "Documented handover",
    p: "You receive account ownership, environment notes and a runbook. If something breaks after handover, any competent developer can find the relevant configuration.",
    note: "Runbook included",
  },
];

const SUBPROCESSORS = [
  ["Hosting", "Vercel", "Application hosting and deployment"],
  ["Source control", "GitHub", "Private repositories"],
  ["Workspace", "Google Workspace", "Email and documents"],
  ["Payments", "Razorpay / Stripe", "Only when a payment module is purchased"],
  ["Messaging", "Meta WhatsApp Business API", "Only when broadcast is purchased"],
];

const SEAL_POINTS = [
  "Scope written and agreed before the build starts.",
  "Accessibility and performance checks run before launch.",
  "Accounts, code and documentation handed over at the end.",
];

export default function TrustPage() {
  return (
    <>
      <EvidenceHeader
        index="05"
        label="Trust"
        title={
          <>
            Claims are cheap. <span className="inst-serif">This page is specific.</span>
          </>
        }
        lede="This page exists because financial services and institute clients ask these questions before signing — and because publishing our answers holds us accountable."
        meta={[
          { label: "Commitments", value: "06" },
          { label: "Certifications claimed", value: "None" },
          { label: "NDA", value: "On request" },
          { label: "Client accounts", value: "Client-owned" },
        ]}
        status="Written commitments"
        actions={
          <>
            <a
              href={`mailto:${site.email}?subject=Security%20questions`}
              className="inst-btn"
            >
              Ask a security question
            </a>
            <Link href="/legal/privacy" className="inst-btn inst-btn-ghost">
              Read privacy policy
            </Link>
          </>
        }
        note={["No data selling", "NDA on request", "Client owns accounts"]}
      />

      <section className="inst-section" aria-labelledby="commitments">
        <div className="inst-shell">
          <div className="ev-doc-grid">
            <div className="ev-doc-aside">
              <p className="inst-label">The commitments</p>
              <h2 id="commitments" className="inst-h2 mt-4">
                Six answers, in <span className="inst-serif">plain language.</span>
              </h2>
              <p className="inst-body mt-5 text-[0.875rem]">
                No certifications are claimed here. These are the working commitments behind an
                engagement, written so a technical reviewer can check them.
              </p>
            </div>

            <div className="ev-commit-list">
              {SECTIONS.map((section, index) => (
                <article key={section.h} className="ev-commit">
                  <span className="inst-num">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{section.h}</h3>
                    <p>{section.p}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="inst-dark ev-seal-section" aria-labelledby="seal-heading">
        <div className="inst-shell">
          <div className="ev-seal-grid">
            <div>
              <p className="inst-label">The delivery seal</p>
              <h2 id="seal-heading" className="inst-h2 mt-4">
                A record, <span className="inst-serif">not a badge.</span>
              </h2>
              <p className="inst-lede mt-5">
                The seal stands for the checks we run and the handover we complete — nothing more.
                It is drawn here rather than purchased, and the animation is optional.
              </p>
              <ul className="ev-seal-list">
                {SEAL_POINTS.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="inst-body mt-6 text-[0.8125rem]">
                The static plate is the record. Pressing play draws the same seal; if the runtime
                fails, the plate stays.
              </p>
            </div>

            <TrustSeal />
          </div>
        </div>
      </section>

      <HandoverCinema plates={handoverPlates} />

      <section className="inst-section" aria-labelledby="data-map">
        <div className="inst-shell">
          <div className="ev-section-head">
            <div>
              <p className="inst-label">Data map</p>
              <h2 id="data-map" className="inst-h2 mt-4">
                What we collect, and <span className="inst-serif">why.</span>
              </h2>
            </div>
            <p>
              Portal and payment rows apply only where those modules are purchased. Anything not
              listed here is not collected by the site as built.
            </p>
          </div>

          <div
            className="ev-matrix-scroll"
            role="region"
            aria-label="Data collected by surface"
            tabIndex={0}
          >
            <table className="ev-matrix ev-matrix--compact">
              <caption className="sr-only">
                Data collected by surface, with its retention rule.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Surface</th>
                  <th scope="col">Data</th>
                  <th scope="col">Retention</th>
                </tr>
              </thead>
              <tbody>
                {DATA_MAP.map((row) => (
                  <tr key={row[0]}>
                    <th scope="row">{row[0]}</th>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="inst-section" aria-labelledby="security-practice">
        <div className="inst-shell">
          <div className="ev-section-head">
            <div>
              <p className="inst-label">In practice</p>
              <h2 id="security-practice" className="inst-h2 mt-4">
                Security is <span className="inst-serif">operational,</span> not a badge.
              </h2>
            </div>
            <p>
              We do not claim certifications we have not earned. These are the controls we actually
              apply to project work.
            </p>
          </div>

          <div className="ev-rules ev-rules--four">
            {PRACTICES.map((practice, index) => (
              <article key={practice.h} className="ev-rule">
                <span className="inst-num">{String(index + 1).padStart(2, "0")}</span>
                <h3>{practice.h}</h3>
                <p>{practice.p}</p>
                <span className="ev-rule-note">{practice.note}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="inst-section" aria-labelledby="subprocessors">
        <div className="inst-shell">
          <div className="ev-doc-grid">
            <div className="ev-doc-aside">
              <p className="inst-label">Subprocessors</p>
              <h2 id="subprocessors" className="inst-h2 mt-4">
                Who touches <span className="inst-serif">the work.</span>
              </h2>
              <p className="inst-body mt-5 text-[0.875rem]">
                We keep the list short and tell you before adding a new one for your project.
              </p>
            </div>

            <dl className="ev-subprocessors">
              {SUBPROCESSORS.map((row) => (
                <div key={row[0]}>
                  <dt>{row[0]}</dt>
                  <dd>
                    <p>{row[1]}</p>
                    <p>{row[2]}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="inst-section" aria-labelledby="trust-next">
        <div className="inst-shell">
          <div className="ev-cta">
            <div>
              <p className="inst-label">Questions we have not answered?</p>
              <h2 id="trust-next" className="inst-h2 mt-4">
                Ask before you sign.
              </h2>
              <p className="mt-5">
                Ask for the security and confidentiality addendum. We will send it, answer in
                writing, and take questions from your technical reviewer.
              </p>
              <div className="ev-actions">
                <a
                  href={`mailto:${site.email}?subject=Security%20questions`}
                  className="inst-btn"
                >
                  {site.email}
                </a>
                <Link href="/legal/privacy" className="inst-btn inst-btn-ghost">
                  Privacy policy
                </Link>
                <Link href="/legal/terms" className="inst-btn inst-btn-ghost">
                  Terms
                </Link>
              </div>
            </div>

            <ul className="ev-nda-list">
              <li>Security and confidentiality addendum</li>
              <li>Data map for your modules</li>
              <li>Subprocessor list</li>
              <li>Handover checklist</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
