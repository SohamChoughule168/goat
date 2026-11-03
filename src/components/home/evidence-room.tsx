import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/content/work";

const BLUEPRINTS = [
  {
    index: "B-01",
    tier: "Growth",
    name: "The credible institute site",
    problem:
      "A public site that makes the offer, faculty and outcomes legible before the enquiry.",
    href: "/blueprint?priority=website",
  },
  {
    index: "B-02",
    tier: "Pro",
    name: "The admissions handoff",
    problem:
      "One tracked path from first enquiry to booked counselling call.",
    href: "/blueprint?type=schools&priority=enquiries",
  },
  {
    index: "B-03",
    tier: "Institutional",
    name: "The multi-branch view",
    problem:
      "Shared definitions for enquiries, fees and reporting across locations.",
    href: "/blueprint?type=multi-branch&priority=branch-consistency",
  },
];

export default function EvidenceRoom() {
  const proof = caseStudies[0];
  if (!proof) return null;

  return (
    <section className="inst-section" aria-labelledby="home-evidence">
      <div className="inst-shell">
        <div className="evidence-head">
          <div>
            <p className="inst-label">Evidence room</p>
            <h2
              id="home-evidence"
              className="inst-h2 mt-5 max-w-[16ch]"
            >
              Proof, with <span className="inst-serif">the edges left on.</span>
            </h2>
          </div>
          <p className="inst-body evidence-head-copy">
            One public build, documented end to end. Everything else is
            labelled for what it is: an illustrative blueprint, not a client
            result.
          </p>
        </div>

        <div className="evidence-grid">
          <article className="evidence-record">
            <div className="evidence-record-head">
              <p className="inst-label">Verified record / 01</p>
              <span className="inst-tag">Live</span>
            </div>
            <h3 className="evidence-record-title">{proof.client}</h3>
            <p className="evidence-record-meta">
              {proof.sector} / {proof.year} / {proof.services.join(" · ")}
            </p>
            <p className="evidence-record-summary">{proof.summary}</p>

            <dl className="evidence-results">
              {proof.results.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>
                    {item.value}
                    {item.note ? <p>{item.note}</p> : null}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="evidence-links">
              {proof.proof.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="inst-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </a>
              ))}
              <Link
                href={`/work/${proof.slug}`}
                className="inst-link"
              >
                Read the full case
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </article>

          <aside className="evidence-ledger" aria-label="What can be checked">
            <div>
              <p className="inst-label">Artifact ledger</p>
              <h3 className="evidence-ledger-title">What can be checked.</h3>
              <ul className="evidence-ledger-list">
                <li>
                  <span className="inst-num">01</span>
                  <div>
                    <strong>Live website</strong>
                    <p>Public URL, current build.</p>
                  </div>
                </li>
                <li>
                  <span className="inst-num">02</span>
                  <div>
                    <strong>Case record</strong>
                    <p>Challenge, approach, delivery and handover.</p>
                  </div>
                </li>
                <li>
                  <span className="inst-num">03</span>
                  <div>
                    <strong>Delivery note</strong>
                    <p>Public record of the engagement.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="evidence-boundary">
              <p className="inst-label">What we do not show</p>
              <ul>
                <li>Client logos we do not have permission to publish.</li>
                <li>Testimonials that have not been approved.</li>
                <li>Dashboards, data or screenshots that are not real.</li>
              </ul>
            </div>
          </aside>
        </div>

        <div className="evidence-blueprints">
          <div className="evidence-blueprints-head">
            <p className="inst-label">Illustrative blueprints</p>
            <p>Not client work. Starting points for a scoping conversation.</p>
          </div>
          <div className="evidence-blueprint-grid">
            {BLUEPRINTS.map((blueprint) => (
              <Link
                key={blueprint.index}
                href={blueprint.href}
                className="evidence-blueprint"
              >
                <div className="evidence-blueprint-meta">
                  <span>{blueprint.index}</span>
                  <span>{blueprint.tier}</span>
                </div>
                <h3>{blueprint.name}</h3>
                <p>{blueprint.problem}</p>
                <span className="evidence-blueprint-link">
                  Open the starting point
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
