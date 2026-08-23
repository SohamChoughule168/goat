import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Scope Estimator",
  description: "Answer four questions and receive an indicative price band.",
  path: "/estimate",
});

const PRACTICES = ["Build", "Grow", "Content & Brand", "Enable"];
const SCOPES = ["Landing page", "Marketing site", "Web app", "Mobile app"];
const TIMELINES = ["Flexible", "1 month", "2–3 months", "ASAP"];
const SUPPORT = ["None", "Monthly care", "Quarterly reviews"];

export default async function EstimatePage(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await props.searchParams;
  const step = Number(params.step || "0");
  const has = (k: string) => Boolean(params[k]);

  const steps = [
    { key: "practice", label: "What do you need?", options: PRACTICES },
    { key: "scope", label: "Scope size?", options: SCOPES },
    { key: "timeline", label: "Timeline?", options: TIMELINES },
    { key: "support", label: "Ongoing support level?", options: SUPPORT },
  ];

  return (
    <main className="shell section-y max-w-xl">
      <p className="micro">Estimator</p>
      <h1 className="display mt-4">Indicative price band.</h1>
      <p className="lede muted mt-5 text-sm">
        Four questions. No email required until you ask us to follow up.
      </p>

      {/* Step indicator */}
      <ol className="mt-8 flex gap-2" aria-label={`Step ${step + 1} of ${steps.length}`}>
        {steps.map((_, i) => (
          <li key={i} aria-current={i === step ? "step" : undefined}>
            <span className={`block h-1 w-10 rounded ${i <= step ? "bg-accent" : "bg-border-hairline"}`} />
          </li>
        ))}
      </ol>

      <form method="GET" action="/estimate" className="mt-10 space-y-6">
        {steps.map(({ key, label, options }, i) => {
          if (i > step) return null;
          if (has(key) && i < step) {
            return (
              <input key={key} type="hidden" name={key} value={params[key] || ""} />
            );
          }
          return (
            <fieldset key={key} className="space-y-2">
              <legend className="font-medium">{label}</legend>
              {options.map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input type="radio" name={key} value={opt} required={i === 0} />
                  {opt}
                </label>
              ))}
            </fieldset>
          );
        })}

        {step < steps.length - 1 ? (
          <button type="submit" name="step" value={String(step + 1)} className="btn btn-primary">
            Next question →
          </button>
        ) : (
          <div className="rounded-md border p-6">
            <h2 className="text-h4 font-semibold">Your indicative band</h2>
            <p className="micro mt-3 opacity-60">TODO(positioning: pricing rules table)</p>
            <p className="text-sm text-muted-foreground mt-2">
              This is an indicative range, not a quote. For a fixed price,{" "}
              <Link href="/contact" className="link-line">send a brief</Link>.
            </p>
          </div>
        )}
      </form>
    </main>
  );
}

import Link from "next/link";
