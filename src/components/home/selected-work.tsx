import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/content/work";

export default function SelectedWork() {
  const cs = caseStudies[0];
  if (!cs) return null;

  return (
    <section className="field" data-field="cobalt" aria-label="Selected work">
      <div className="container">
        <div className="flex items-baseline justify-between gap-6">
          <p className="micro">Selected work</p>
          <span className="index">01 / 01 published</span>
        </div>

        <article>
          <p className="index mt-12">{cs.sector} · {cs.year}</p>
          <h2 className="mega mt-4" aria-label={cs.client}>
            {cs.client.split(" ")[0]}
            <span className="opacity-60">.</span>
          </h2>
          <p className="display mt-6 max-w-[24ch]" style={{ fontSize: "var(--text-h2)" }}>
            A regulated business needed a public face it fully owned.
          </p>

          <hr className="rule-heavy my-10" />

          <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
            <div>
              <p className="micro">Problem</p>
              <p className="lede mt-3 muted">{cs.challenge}</p>
            </div>
            <div>
              <p className="micro">Outcome</p>
              <ul className="mt-3 space-y-2">
                {cs.results.map((r) => (
                  <li key={r.label} className="flex items-baseline justify-between gap-4 border-b border-current/15 pb-2">
                    <span className="text-sm">{r.value}</span>
                    <span className="index">{r.label}</span>
                  </li>
                ))}
              </ul>
              <a
                href={cs.proof.links[0]?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line mt-6 inline-flex items-center gap-2 text-sm font-medium"
              >
                Visit the live site
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </article>

        <div className="mt-16 flex flex-wrap items-baseline justify-between gap-4 border-t border-current/15 pt-6">
          <p className="text-sm muted max-w-[52ch]">
            Further engagements sit under client confidentiality.
          </p>
          <Link href="/contact" className="link-line text-sm font-medium">
            Request references
          </Link>
        </div>
      </div>
    </section>
  );
}

