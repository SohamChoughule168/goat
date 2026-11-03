"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, RotateCcw } from "lucide-react";
import { PACKAGES, formatINR as formatPackageINR } from "@/content/packages";
import PlanEmailForm from "@/components/leads/plan-email-form";

const PACKAGE_PREFILL: Record<string, { practice: string; scope: string }> = {
  starter: { practice: "Build", scope: "Landing page" },
  growth: { practice: "Build", scope: "Marketing site" },
  pro: { practice: "Build", scope: "Web app" },
  institutional: { practice: "Build", scope: "Web app" },
};

const PRACTICES = ["Build", "Grow", "Content & Brand", "Enable"];
const SCOPES = ["Landing page", "Marketing site", "Web app", "Mobile app"];
const TIMELINES = ["Flexible", "1 month", "2–3 months", "ASAP"];
const SUPPORT = ["None", "Monthly care", "Quarterly reviews"];

const BASE_BANDS: Record<string, [number, number]> = {
  "Landing page": [30000, 60000],
  "Marketing site": [60000, 150000],
  "Web app": [150000, 300000],
  "Mobile app": [250000, 500000],
};

const PRACTICE_MULTIPLIER: Record<string, number> = {
  Build: 1.15,
  Grow: 1,
  "Content & Brand": 1,
  Enable: 1.15,
};

const TIMELINE_MULTIPLIER: Record<string, number> = {
  Flexible: 0.95,
  "1 month": 1,
  "2–3 months": 1,
  ASAP: 1.25,
};

const STEPS = [
  {
    key: "practice",
    label: "What kind of help do you need?",
    helper: "Pick the closest practice. It adjusts the band, not the process.",
    options: PRACTICES,
  },
  {
    key: "scope",
    label: "How large is the build?",
    helper: "A landing page is one focused page. A marketing site is a full public site.",
    options: SCOPES,
  },
  {
    key: "timeline",
    label: "When does it need to be live?",
    helper: "Compressed timelines move the band because work is resequenced.",
    options: TIMELINES,
  },
  {
    key: "support",
    label: "Do you want ongoing support?",
    helper: "Care plans are quoted separately. This only affects the recommendation.",
    options: SUPPORT,
  },
];

function formatINR(value: number): string {
  if (value >= 100000) {
    const lakhs = value / 100000;
    return `₹${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)}L`;
  }
  return `₹${Math.round(value / 1000)}k`;
}

const RECOMMENDED: Record<string, string> = {
  "Landing page": "starter",
  "Marketing site": "growth",
  "Web app": "pro",
  "Mobile app": "pro",
};

function calculateEstimate(answers: Record<string, string>): { low: number; high: number } | null {
  const base = BASE_BANDS[answers.scope];
  if (!base) return null;
  const factor =
    (PRACTICE_MULTIPLIER[answers.practice] ?? 1) * (TIMELINE_MULTIPLIER[answers.timeline] ?? 1);
  return { low: Math.round(base[0] * factor), high: Math.round(base[1] * factor) };
}

export function EstimateClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const packageSlug = new URLSearchParams(window.location.search).get("package");
    const prefill = packageSlug ? PACKAGE_PREFILL[packageSlug] : undefined;
    if (!prefill) return;
    const frame = window.requestAnimationFrame(() => setAnswers(prefill));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const current = STEPS[step];
  const isComplete = step >= STEPS.length;
  const estimate = isComplete ? calculateEstimate(answers) : null;
  const recommended = PACKAGES.find(
    (tier) => tier.slug === (answers.scope ? RECOMMENDED[answers.scope] : undefined),
  );

  const brief = [
    `Practice: ${answers.practice ?? "Not selected"}`,
    `Scope: ${answers.scope ?? "Not selected"}`,
    `Timeline: ${answers.timeline ?? "Not selected"}`,
    `Support: ${answers.support ?? "Not selected"}`,
    `Estimator band: ${estimate ? `${formatINR(estimate.low)} – ${formatINR(estimate.high)}` : "Not calculated"}`,
  ].join("\n");

  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <div className="shell">
      <div className="estimate-layout">
        <aside className="estimate-aside">
          <p className="eyebrow">How to read the band</p>
          <h2 className="display-2 mt-4">A budgeting tool, not a quote.</h2>
          <p className="mt-5 max-w-[40ch] text-sm leading-relaxed text-[var(--ink-3)]">
            The band uses the same published starting points we use in a first reply, adjusted for
            practice and timeline. It cannot see content volume, integrations or custom modules —
            those are what a written scope resolves.
          </p>

          <div className="estimate-facts">
            <div className="estimate-fact">
              <h3>Grounded in published prices.</h3>
              <p>
                Starter, Growth and Pro are visible on the pricing page. The estimator does not
                invent a separate discount ladder.
              </p>
            </div>
            <div className="estimate-fact">
              <h3>One range, not three.</h3>
              <p>
                We show a single band rather than a “good, better, best” spread designed to push you
                upward.
              </p>
            </div>
            <div className="estimate-fact">
              <h3>No email wall.</h3>
              <p>
                You can see the band without submitting anything. Share the brief only if you want a
                written scope back.
              </p>
            </div>
          </div>

          <p className="mt-6 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-[var(--ink-3)]">
            Indicative only · Fixed price follows a written scope
          </p>
        </aside>

        <div className="estimate-card" aria-live="polite">
          {!isComplete && current ? (
            <>
              <div className="estimate-head">
                <div>
                  <p className="micro">Scope estimator</p>
                  <p className="estimate-step-count mt-2">
                    Step {step + 1} of {STEPS.length}
                  </p>
                  <div className="estimate-progress" aria-hidden="true">
                    {STEPS.map((_, i) => (
                      <i key={i} data-active={i <= step} />
                    ))}
                  </div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
                  {String(STEPS.length - step - 1).padStart(2, "0")} left
                </span>
              </div>

              <h2 className="estimate-question">{current.label}</h2>
              <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-[var(--ink-3)]">
                {current.helper}
              </p>

              <div className="option-grid">
                {current.options.map((option, i) => (
                  <label
                    key={option}
                    className="option-card has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--paper-2)]"
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <strong>{option}</strong>
                    <ArrowRight aria-hidden="true" />
                    <input
                      type="radio"
                      name={current.key}
                      value={option}
                      checked={answers[current.key] === option}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [current.key]: option }))
                      }
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>

              <div className="estimate-actions">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                    className="btn btn-secondary"
                  >
                    <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setStep((prev) => prev + 1)}
                  disabled={!answers[current.key]}
                  className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {step === STEPS.length - 1 ? "See the band" : "Next question"}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </button>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
                  No email required
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="estimate-head">
                <div>
                  <p className="micro">Indicative band</p>
                  <p className="estimate-step-count mt-2">All four questions answered</p>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)] transition-colors hover:text-[var(--accent)]"
                >
                  <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                  Start over
                </button>
              </div>

              <p className="mt-6 text-sm text-[var(--ink-3)]">
                Based on the answers below, a sensible starting band is:
              </p>
              <div className="estimate-result">
                <p>
                  {estimate ? `${formatINR(estimate.low)} – ${formatINR(estimate.high)}` : "—"}
                </p>
              </div>

              <dl className="estimate-summary">
                {STEPS.map(({ key, label }) => (
                  <div key={key}>
                    <dt>{label.replace("?", "")}</dt>
                    <dd>{answers[key] ?? "—"}</dd>
                  </div>
                ))}
              </dl>

              {recommended && (
                <div className="estimate-included">
                  <p className="micro text-[var(--accent)]">Closest published package</p>
                  <p className="mt-2 text-sm">
                    <span className="font-medium text-[var(--ink)]">{recommended.name}</span> —{" "}
                    {formatPackageINR(recommended.price)} · {recommended.support}
                  </p>
                  <p className="mt-2">{recommended.bestFor}</p>
                  <Link
                    href={`/pricing?package=${recommended.slug}#builder`}
                    className="link-line mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                  >
                    Configure {recommended.name} with add-ons
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

              {answers.support !== "None" && (
                <p className="mt-4 text-sm leading-relaxed text-[var(--ink-3)]">
                  Ongoing support is quoted separately once the build is defined.{" "}
                  <Link href="/pricing#builder" className="link-line text-[var(--accent)]">
                    See monthly care plans
                  </Link>
                  .
                </p>
              )}

              <p className="mt-4 text-sm leading-relaxed text-[var(--ink-3)]">
                This is an indicative range, not a quote. A fixed price follows a written scope.{" "}
                <Link href="/contact" className="link-line text-[var(--accent)]">
                  Send the brief
                </Link>{" "}
                or take these answers with you.
              </p>

              <div className="estimate-actions">
                <Link
                  href={`/quote/?service=${encodeURIComponent(answers.practice ?? "")}&brief=${encodeURIComponent(brief)}`}
                  className="btn btn-primary"
                >
                  Request a written quote
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link href="/pricing" className="btn btn-secondary">
                  See packages
                </Link>
              </div>

              <PlanEmailForm
                title="Scope estimate"
                plan="estimate"
                source="estimator"
                compact
                className="mt-8"
                lines={brief.split("\n")}
                footer="Indicative band only. A fixed price follows a written scope."
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
