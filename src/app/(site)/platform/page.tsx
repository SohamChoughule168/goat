import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import "../../../styles/evidence.css";
import EvidenceHeader from "@/components/evidence/evidence-header";
import PlatformMap from "@/components/evidence/platform-map";
import HaloPrism from "@/components/three/HaloPrism";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "The platform",
  description:
    "Eight operating layers for institutes: brand, website, admissions, student portal, assessments, payments, communications and intelligence.",
  path: "/platform",
});

const CONSTANTS = [
  {
    index: "01",
    title: "One definition",
    copy:
      "An enquiry, a qualified lead, an enrolment and a receipt mean the same thing in every branch and every report.",
    note: "Shared vocabulary",
  },
  {
    index: "02",
    title: "One owner per seam",
    copy:
      "Every integration has a named owner on your side and ours, with a written fallback if a tool fails.",
    note: "Named accountability",
  },
  {
    index: "03",
    title: "One exit",
    copy:
      "Documentation, credentials and a walkthrough are delivered before the final invoice. The system stays yours.",
    note: "Full handover",
  },
];

const ENGAGEMENT = [
  {
    title: "Diagnose",
    detail: "A written account of where enquiries, admissions and parent communication break.",
  },
  {
    title: "Assemble",
    detail: "The layers you need, built in sequence on one architecture and one owner.",
  },
  {
    title: "Hand over",
    detail: "Accounts, code, documentation and a working walkthrough for your team.",
  },
];

export default function PlatformPage() {
  return (
    <>
      <EvidenceHeader
        index="02"
        label="Platform"
        title={
          <>
            The institute, layer by <span className="inst-serif">layer.</span>
          </>
        }
        lede="Not a suite of products. A build order for the systems an institute already needs, with the seams written down."
        meta={[
          { label: "Layers", value: "08" },
          { label: "Named seams", value: "05" },
          { label: "Entry point", value: "Brand + website" },
          { label: "Owner", value: "One team" },
        ]}
        status="System map"
        actions={
          <>
            <Link href="/blueprint" className="inst-btn">
              Draft your blueprint
              <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
            </Link>
            <Link href="/book" className="inst-btn inst-btn-ghost">
              Book a working session
            </Link>
          </>
        }
        note={["Built in sequence", "Five named seams", "Handover included"]}
      />

      <section className="inst-section" aria-labelledby="stack-title">
        <div className="inst-shell">
          <div className="ev-section-head">
            <div>
              <p className="inst-label">The Institution Stack</p>
              <h2 id="stack-title" className="inst-h2 mt-4">
                Eight layers and the seams between them.
              </h2>
            </div>
            <p>
              Most systems fail at the joins, not inside the tools. Open a layer to see the problem
              it solves, what gets built, and the signals that say it is missing.
            </p>
          </div>

          <PlatformMap />

          <div className="mt-16">
            <HaloPrism />
          </div>
        </div>
      </section>

      <section className="inst-section" aria-labelledby="platform-engagement">
        <div className="inst-shell">
          <div className="ev-section-head">
            <div>
              <p className="inst-label">What stays constant</p>
              <h2 id="platform-engagement" className="inst-h2 mt-4">
                The boundaries are part of the build.
              </h2>
            </div>
            <p>
              The layer list can shrink or grow with the engagement. These three commitments do
              not.
            </p>
          </div>

          <div className="ev-rules">
            {CONSTANTS.map((item) => (
              <article key={item.index} className="ev-rule">
                <span className="inst-num">{item.index}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <span className="ev-rule-note">{item.note}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="inst-section" aria-labelledby="platform-next">
        <div className="inst-shell">
          <div className="ev-cta">
            <div>
              <p className="inst-label">Next step</p>
              <h2 id="platform-next" className="inst-h2 mt-4">
                Start with the seam that is costing you.
              </h2>
              <p className="mt-5">
                A working session traces one enquiry path end to end — from the page a parent
                lands on to the record your office can act on — and tells you which layer to fix
                first.
              </p>
              <div className="ev-actions">
                <Link href="/book" className="inst-btn">
                  Book a working session
                </Link>
                <Link href="/pricing" className="inst-btn inst-btn-ghost">
                  Read the economics
                </Link>
              </div>
            </div>

            <ol className="ev-steps">
              {ENGAGEMENT.map((stage, index) => (
                <li key={stage.title}>
                  <span className="inst-num">{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <strong>{stage.title}</strong>
                    <span className="ev-steps-detail">{stage.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
