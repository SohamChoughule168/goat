import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getServicesByPillar, pillars } from "@/content/services";
import type { PillarSlug } from "@/content/services";

const outcomes: Record<string, string> = {
  "web-development": "A fast public site that carries the institution, not just describes it.",
  "mobile-app-development": "Student and parent access in the pocket, not another browser tab.",
  "ai-driven-websites": "Content and enquiry routing that answer before staff do.",
  "website-refurbishment": "An existing site brought back to speed, accessibility and credibility.",
  "digital-marketing": "Acquisition strategy tied to admissions, not impressions.",
  "social-media-marketing": "A consistent local presence without branch-level drift.",
  sem: "Paid search that buys intent, with cost per enquiry visible.",
  "generative-engine-optimization": "Presence in AI answers where parents now shortlist.",
  "answer-engine-optimization": "Structured answers for search surfaces that summarise.",
  "meta-advertising": "Campaigns that route to a named follow-up owner.",
  "google-business-profile": "Local discovery that matches the campus parents search for.",
  "google-marketplace": "Listings and offers that convert nearby demand.",
  "brand-management": "One identity and template system every branch can use.",
  "video-editing": "Consistent motion and video without an in-house edit desk.",
  "thumbnail-design": "Clicks earned honestly, with a repeatable visual system.",
  "online-events": "Webinars and open days that run without a production crew.",
  "google-ai-integration": "AI wired into the tools staff already use, with guardrails.",
  "talent-acquisition": "A hiring path that reflects the institution's standards.",
};

function buildLedgerGroups() {
  let counter = 0;

  return pillars.map((pillar) => ({
    pillar,
    services: getServicesByPillar(pillar.slug as PillarSlug).map((service) => {
      counter += 1;
      return {
        service,
        number: String(counter).padStart(2, "0"),
      };
    }),
  }));
}

const ledgerGroups = buildLedgerGroups();

export default function CapabilityLedger() {
  return (
    <div className="overflow-x-auto">
      <table className="ledger-table capability-ledger">
        <caption className="visually-hidden">
          Eighteen capabilities grouped by practice area, linked to their service pages.
        </caption>
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Capability and outcome</th>
            <th scope="col">
              <span className="visually-hidden">Open</span>
            </th>
          </tr>
        </thead>
        {ledgerGroups.map(({ pillar, services }) => (
          <tbody key={pillar.slug} className="ledger-group">
            <tr className="ledger-group-row">
              <th colSpan={3} scope="colgroup">
                <span className="inst-num">{pillar.index}</span>
                <span>{pillar.title}</span>
                <span className="ledger-group-kicker">{pillar.kicker}</span>
              </th>
            </tr>
            {services.map(({ service, number }) => (
              <tr
                key={service.slug}
                className={`ledger-row${service.slug === "web-development" ? " ledger-row--featured" : ""}`}
              >
                <td className="ledger-index inst-num">{number}</td>
                <td className="ledger-capability">
                  <Link href={`/services/${service.slug}`}>
                    <span className="ledger-title">{service.title}</span>
                    <span className="ledger-outcome">
                      {outcomes[service.slug] ?? service.tagline}
                    </span>
                  </Link>
                </td>
                <td className="ledger-arrow" aria-hidden="true">
                  <ArrowUpRight size={16} strokeWidth={1.5} />
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
