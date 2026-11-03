import type { Metadata } from "next";
import Link from "next/link";
import "../../../styles/evidence.css";
import EvidenceHeader from "@/components/evidence/evidence-header";
import ProcessTimeline from "@/components/evidence/process-timeline";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Process — How an Engagement Runs",
  description:
    "Discovery, strategy, execution and ownership — with timeframes, review cadence, client inputs and the handover checklist stated up front.",
  path: "/process",
});

const PACKAGE_ROWS = [
  ["Starter", "2 weeks", "14 days", "A credible first site"],
  ["Growth", "3–4 weeks", "30 days", "Admissions enquiries"],
  ["Pro", "6–8 weeks", "60 days", "Portals and workflows"],
];

const CLIENT_INPUTS = [
  "One decision-maker who can approve scope and design.",
  "Content, logo and photographs — or a budget for us to arrange them.",
  "Access to your domain, hosting and analytics accounts.",
  "Feedback within one business day during review windows.",
  "A named person for portal data and payment setup, if relevant.",
  "Permission to say no to features that do not serve the goal.",
];

const REVIEW_RULES = [
  {
    title: "Weekly, not whenever.",
    copy:
      "Every build gets a staging review window each week. You see progress while it is still cheap to change direction.",
    note: "Fixed cadence",
  },
  {
    title: "Async by default.",
    copy:
      "Feedback lives in a shared document with decisions and owners. Calls are for decisions that cannot be written.",
    note: "Written record",
  },
  {
    title: "One approver.",
    copy:
      "A single named decision-maker prevents conflicting notes arriving from three directions and stalling the build.",
    note: "Clear authority",
  },
  {
    title: "Changes in writing.",
    copy:
      "A request that alters scope gets a written impact note — time, cost and trade-off — before anyone starts building it.",
    note: "No surprise invoices",
  },
];

export default function ProcessPage() {
  return (
    <>
      <EvidenceHeader
        index="04"
        label="Process"
        title={
          <>
            Four phases. <span className="inst-serif">No black boxes.</span>
          </>
        }
        lede="Discovery, strategy, execution and ownership — with the timeframes, review cadence and handover stated before work starts. You should know what happens next without asking."
        meta={[
          { label: "Phases", value: "04" },
          { label: "First phase", value: "Week 1" },
          { label: "Review cadence", value: "Weekly" },
          { label: "Handover", value: "Full ownership" },
        ]}
        status="Documented sequence"
        actions={
          <>
            <Link href="/book" className="inst-btn">
              Start with discovery
            </Link>
            <Link href="/estimate" className="inst-btn inst-btn-ghost">
              Estimate the scope
            </Link>
          </>
        }
        note={["Fixed scope", "Weekly staging", "Full handover"]}
      />

      <section className="inst-section" aria-labelledby="phase-map">
        <div className="inst-shell">
          <div className="ev-section-head">
            <div>
              <p className="inst-label">The shape of it</p>
              <h2 id="phase-map" className="inst-h2 mt-4">
                A sequence, <span className="inst-serif">not a sprint.</span>
              </h2>
            </div>
            <p>
              Each phase has a job, an output and a decision. Nothing starts until the previous
              output is agreed, which is why the handover is boring in the best way.
            </p>
          </div>

          <ProcessTimeline />
        </div>
      </section>

      <section className="inst-section" aria-labelledby="by-package">
        <div className="inst-shell">
          <div className="ev-section-head">
            <div>
              <p className="inst-label">Package depth</p>
              <h2 id="by-package" className="inst-h2 mt-4">
                Same phases. <span className="inst-serif">Different depth.</span>
              </h2>
            </div>
            <p>
              The phases do not change with the package. The number of review cycles, the page count
              and the support window do.
            </p>
          </div>

          <div
            className="ev-matrix-scroll"
            role="region"
            aria-label="Timeline by package"
            tabIndex={0}
          >
            <table className="ev-matrix ev-matrix--compact">
              <caption className="sr-only">
                Typical timeline, support window and best use for each packaged tier.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Package</th>
                  <th scope="col">Typical timeline</th>
                  <th scope="col">Support</th>
                  <th scope="col">Best for</th>
                </tr>
              </thead>
              <tbody>
                {PACKAGE_ROWS.map((row) => (
                  <tr key={row[0]}>
                    <th scope="row">{row[0]}</th>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6">
            <Link href="/pricing#matrix" className="inst-link">
              Compare package inclusions <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      <section className="inst-section" aria-labelledby="review-cadence">
        <div className="inst-shell">
          <div className="ev-section-head">
            <div>
              <p className="inst-label">Review cadence</p>
              <h2 id="review-cadence" className="inst-h2 mt-4">
                How feedback <span className="inst-serif">stays useful.</span>
              </h2>
            </div>
            <p>
              Most delays are not design problems. They are decision problems. These four rules keep
              decisions moving without turning the project into a group chat.
            </p>
          </div>

          <div className="ev-rules ev-rules--four">
            {REVIEW_RULES.map((rule, index) => (
              <article key={rule.title} className="ev-rule">
                <span className="inst-num">{String(index + 1).padStart(2, "0")}</span>
                <h3>{rule.title}</h3>
                <p>{rule.copy}</p>
                <span className="ev-rule-note">{rule.note}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="inst-section" aria-labelledby="from-you">
        <div className="inst-shell">
          <div className="ev-section-head">
            <div>
              <p className="inst-label">Your side of it</p>
              <h2 id="from-you" className="inst-h2 mt-4">
                What we need <span className="inst-serif">from you.</span>
              </h2>
            </div>
            <p>
              An agency cannot carry a project alone. These six inputs keep the schedule honest and
              the handover clean.
            </p>
          </div>

          <div className="ev-split">
            <div className="ev-panel">
              <p className="inst-label">Before strategy</p>
              <ul className="ev-nda-list mt-5">
                {CLIENT_INPUTS.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="ev-panel">
              <p className="inst-label">During the build</p>
              <ul className="ev-nda-list mt-5">
                {CLIENT_INPUTS.slice(3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ev-cta mt-12">
            <div>
              <p className="inst-label">Not sure if your content is ready?</p>
              <h2 className="inst-h2 mt-4">That is normal.</h2>
              <p className="mt-5">
                Discovery exists to find out what is missing before it becomes a delay. Bring what
                you have; we will tell you what the build actually needs.
              </p>
              <div className="ev-actions">
                <Link href="/book" className="inst-btn">
                  Start with discovery
                </Link>
                <Link href="/work" className="inst-btn inst-btn-ghost">
                  Read a delivered case
                </Link>
              </div>
            </div>
            <ol className="ev-steps">
              <li>
                <span className="inst-num">01</span>
                <span>
                  <strong>One session</strong>
                  <span className="ev-steps-detail">
                    A structured conversation about audiences, goals and constraints.
                  </span>
                </span>
              </li>
              <li>
                <span className="inst-num">02</span>
                <span>
                  <strong>One written audit</strong>
                  <span className="ev-steps-detail">
                    Current state, performance on real devices and the competitive landscape.
                  </span>
                </span>
              </li>
              <li>
                <span className="inst-num">03</span>
                <span>
                  <strong>One decision</strong>
                  <span className="ev-steps-detail">
                    A scoped plan with a fixed quote, or a clear reason not to proceed.
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
