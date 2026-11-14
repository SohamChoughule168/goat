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
    <div className="ledger-table-wrapper overflow-hidden">
      <table className="ledger-table capability-ledger capability-ledger-premium">
        <caption className="visually-hidden">
          Eighteen capabilities grouped by practice area, linked to their service pages.
        </caption>
        <thead>
          <tr className="ledger-header-row">
            <th scope="col" className="ledger-header-cell">No.</th>
            <th scope="col" className="ledger-header-cell">Capability and outcome</th>
            <th scope="col" className="ledger-header-cell">
              <span className="visually-hidden">Open</span>
            </th>
          </tr>
        </thead>
        {ledgerGroups.map(({ pillar, services }) => (
          <tbody key={pillar.slug} className="ledger-group ledger-group-premium">
            <tr className="ledger-group-row ledger-group-row-premium magnetic specular">
              <th colSpan={3} scope="colgroup" className="ledger-group-title">
                <span className="ledger-group-index inst-num">{pillar.index}</span>
                <span className="ledger-group-name">{pillar.title}</span>
                <span className="ledger-group-kicker">{pillar.kicker}</span>
              </th>
            </tr>
            {services.map(({ service, number }) => (
              <tr
                key={service.slug}
                className={`ledger-row ledger-row-premium ${service.slug === "web-development" ? "ledger-row--featured" : ""} magnetic specular`}
              >
                <td className="ledger-index inst-num ledger-index-premium">{number}</td>
                <td className="ledger-capability ledger-capability-premium">
                  <Link href={`/services/${service.slug}`} className="ledger-link magnetic specular">
                    <span className="ledger-title">{service.title}</span>
                    <span className="ledger-outcome">
                      {outcomes[service.slug] ?? service.tagline}
                    </span>
                  </Link>
                </td>
                <td className="ledger-arrow ledger-arrow-premium" aria-hidden="true">
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