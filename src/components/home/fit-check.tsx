"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import {
  FIT_QUESTIONS,
  calculateFit,
  type FitAnswers,
} from "@/content/fit-check";
import { FIT_LAYER_TO_BOTTLENECK } from "@/content/blueprint";
import PlanEmailForm from "@/components/leads/plan-email-form";

const TOTAL = FIT_QUESTIONS.length;

export default function FitCheck() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<FitAnswers>({});
  const [complete, setComplete] = useState(false);
  const baseId = useId();

  const current = FIT_QUESTIONS[step];
  const selected = current ? answers[current.id] : undefined;
  const result = complete ? calculateFit(answers) : null;
  const institutional = result?.package.slug === "institutional";
  const progress = complete ? 100 : Math.round((step / TOTAL) * 100);

  const select = (value: string) => {
    if (!current) return;
    setAnswers((previous) => ({ ...previous, [current.id]: value }));
  };

  const next = () => {
    if (!current || !selected) return;
    if (step === TOTAL - 1) {
      setComplete(true);
      return;
    }
    setStep((value) => Math.min(TOTAL - 1, value + 1));
  };

  const back = () => {
    setStep((value) => Math.max(0, value - 1));
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setComplete(false);
  };

  return (
    <section
      id="fit-check"
      className="inst-section fit-section"
      aria-labelledby="fit-check-title"
    >
      <div className="inst-shell">
        <div className="fit-head">
          <div>
            <p className="inst-label">Fit check / 60 seconds</p>
            <h2 id="fit-check-title" className="inst-h2 mt-5 max-w-[15ch]">
              Before the pitch, <span className="inst-serif">a diagnosis.</span>
            </h2>
          </div>
          <p className="inst-body fit-head-copy">
            Five questions about how enquiries, fees and updates actually move
            today. The result names the first bottleneck and the closest
            published package. No email.
          </p>
        </div>

        <div className="fit-card">
          <div className="fit-card-main">
            <p className="sr-only" aria-live="polite">
              {result
                ? `Diagnosis complete. First bottleneck: ${result.bottleneck.label}. Closest package: ${result.package.name}.`
                : `Question ${step + 1} of ${TOTAL}.`}
            </p>

            <div className="fit-progress">
              <div className="fit-progress-meta">
                <span>
                  {complete
                    ? "Diagnosis"
                    : `Question ${String(step + 1).padStart(2, "0")} / ${String(TOTAL).padStart(2, "0")}`}
                </span>
                <span>{complete ? "Complete" : `${progress}%`}</span>
              </div>
              <div className="fit-progress-track" aria-hidden="true">
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>

            {result ? (
              <div className="fit-result">
                <p className="inst-label">First bottleneck</p>
                <h3 className="fit-result-title">{result.bottleneck.label}</h3>
                <p className="fit-result-copy">{result.bottleneck.detail}</p>

                <div className="fit-result-grid">
                  <div>
                    <p className="fit-result-label">Readiness band</p>
                    <p className="fit-result-value">{result.band.label}</p>
                    <p className="fit-result-note">{result.band.summary}</p>
                  </div>
                  <div>
                    <p className="fit-result-label">Closest package</p>
                    <p className="fit-result-value">{result.package.name}</p>
                    <p className="fit-result-note">
                      {result.package.price} · {result.package.note}
                    </p>
                  </div>
                </div>

                <div
                  className="fit-score"
                  aria-label={`Readiness score ${result.score} out of ${result.maxScore}`}
                >
                  <span>Readiness</span>
                  <div className="fit-score-ticks" aria-hidden="true">
                    {Array.from({ length: result.maxScore }).map((_, index) => (
                      <i key={index} data-on={index < result.score} />
                    ))}
                  </div>
                  <span className="fit-score-value">
                    {result.score} / {result.maxScore}
                  </span>
                </div>

                <div className="fit-result-actions">
                  <Link href={result.package.href} className="inst-btn">
                    {institutional
                      ? "Scope an institutional rollout"
                      : "Take this to the estimator"}
                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </Link>
                  <Link
                    href={institutional ? "/pricing#builder" : "/contact"}
                    className="inst-btn inst-btn-ghost"
                  >
                    {institutional
                      ? "Compare published packages"
                      : "Talk it through"}
                  </Link>
                </div>
                <p className="fit-result-fine">
                  A diagnostic, not a quote. The estimator shows a band; a
                  written scope fixes the price.
                </p>
                <Link
                  href={`/blueprint?priority=${FIT_LAYER_TO_BOTTLENECK[result.bottleneck.id]}`}
                  className="inst-link mt-4"
                >
                  Turn this into a build sequence
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.6}
                    className="inst-link-arrow"
                    aria-hidden="true"
                  />
                </Link>
                <PlanEmailForm
                  title="Fit check diagnosis"
                  plan="fit-check"
                  source="fit-check"
                  compact
                  className="mt-8"
                  lines={[
                    `First bottleneck: ${result.bottleneck.label}`,
                    result.bottleneck.detail,
                    `Readiness band: ${result.band.label} (${result.score}/${result.maxScore})`,
                    `Closest package: ${result.package.name} — ${result.package.price}`,
                  ]}
                  footer="Prepared from the ImaginarsClub fit check. A diagnostic, not a quote."
                />
              </div>
            ) : current ? (
              <div className="fit-question">
                <fieldset>
                  <legend className="fit-question-title">
                    {current.prompt}
                  </legend>
                  <p className="fit-question-help">{current.help}</p>
                  <div className="fit-options">
                    {current.options.map((option, index) => (
                      <label
                        key={option.value}
                        className="fit-option"
                        data-selected={selected === option.value}
                      >
                        <input
                          type="radio"
                          name={`${baseId}-${current.id}`}
                          value={option.value}
                          checked={selected === option.value}
                          onChange={() => select(option.value)}
                          className="sr-only"
                        />
                        <span className="fit-option-index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="fit-option-copy">
                          <strong>{option.label}</strong>
                          <span>{option.detail}</span>
                        </span>
                        <span className="fit-option-mark" aria-hidden="true" />
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="fit-question-actions">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={back}
                      className="inst-btn inst-btn-ghost"
                    >
                      <ArrowLeft
                        size={15}
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                      Back
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={next}
                    disabled={!selected}
                    className="inst-btn disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {step === TOTAL - 1 ? "See the diagnosis" : "Next question"}
                    <ArrowRight
                      size={15}
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </button>
                  <span className="fit-question-note">No email required</span>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="fit-aside" aria-label="How the fit check works">
            <div>
              <p className="inst-label">How to read it</p>
              <ol className="fit-aside-list">
                <li>
                  <span className="inst-num">01</span>
                  <p>
                    Answer for the current state, not the version you want to
                    present.
                  </p>
                </li>
                <li>
                  <span className="inst-num">02</span>
                  <p>
                    The result names one bottleneck. It does not try to score
                    the whole institution.
                  </p>
                </li>
                <li>
                  <span className="inst-num">03</span>
                  <p>
                    The package is the closest published starting point, not a
                    quote.
                  </p>
                </li>
              </ol>
            </div>
            <div className="fit-aside-foot">
              <p className="inst-tag">No email required</p>
              <button type="button" onClick={reset} className="fit-reset">
                <RotateCcw size={13} strokeWidth={1.6} aria-hidden="true" />
                Reset
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
