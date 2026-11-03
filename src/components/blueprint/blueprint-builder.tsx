"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Clipboard,
  Printer,
  RotateCcw,
} from "lucide-react";
import {
  BLUEPRINT_BOTTLENECKS,
  BLUEPRINT_EXISTING_OPTIONS,
  BLUEPRINT_INSTITUTIONS,
  BLUEPRINT_STARTS,
  DEFAULT_BLUEPRINT_INPUT,
  buildBlueprintPlan,
  formatBlueprintBrief,
  readBlueprintParams,
  type BlueprintExistingLayerId,
  type BlueprintInput,
} from "@/content/blueprint";
import PlanEmailForm from "@/components/leads/plan-email-form";

type CopyState = "idle" | "copied" | "failed";

export default function BlueprintBuilder() {
  const [input, setInput] = useState<BlueprintInput>(DEFAULT_BLUEPRINT_INPUT);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const baseId = useId();
  const copyTimer = useRef<number | null>(null);

  useEffect(() => {
    // The query string is external state; hydrate the draft once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInput(readBlueprintParams(window.location.search));
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) {
        window.clearTimeout(copyTimer.current);
      }
    };
  }, []);

  const plan = useMemo(() => buildBlueprintPlan(input), [input]);
  const institution =
    BLUEPRINT_INSTITUTIONS.find((item) => item.id === input.institution) ??
    BLUEPRINT_INSTITUTIONS[0];
  const bottleneck =
    BLUEPRINT_BOTTLENECKS.find((item) => item.id === input.bottleneck) ??
    BLUEPRINT_BOTTLENECKS[0];
  const start =
    BLUEPRINT_STARTS.find((item) => item.id === input.start) ?? BLUEPRINT_STARTS[1];
  const brief = formatBlueprintBrief(input, plan);
  const contactHref = `/contact/?intent=blueprint&brief=${encodeURIComponent(brief)}`;

  function update<K extends keyof BlueprintInput>(
    key: K,
    value: BlueprintInput[K],
  ) {
    setInput((previous) => ({ ...previous, [key]: value }));
    setCopyState("idle");
  }

  function toggleExisting(id: BlueprintExistingLayerId) {
    setInput((previous) => ({
      ...previous,
      existing: previous.existing.includes(id)
        ? previous.existing.filter((item) => item !== id)
        : [...previous.existing, id],
    }));
    setCopyState("idle");
  }

  async function copyBrief() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(brief);
      } else {
        const field = document.createElement("textarea");
        field.value = brief;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        document.execCommand("copy");
        document.body.removeChild(field);
      }
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }

    if (copyTimer.current !== null) {
      window.clearTimeout(copyTimer.current);
    }
    copyTimer.current = window.setTimeout(() => setCopyState("idle"), 2600);
  }

  function reset() {
    setInput(DEFAULT_BLUEPRINT_INPUT);
    setCopyState("idle");
    window.history.replaceState(null, "", window.location.pathname);
  }

  const status =
    copyState === "copied"
      ? "Brief copied to the clipboard."
      : copyState === "failed"
        ? "Copy failed. Use Print instead."
        : "Nothing is saved. Refreshing clears the sheet.";

  return (
    <>
      <div className="bp-workbench-head">
        <p className="inst-label">The workbench</p>
        <p className="bp-live">
          <span aria-hidden="true" />
          Live sheet
        </p>
      </div>

      <div className="bp-workbench">
        <form
          className="bp-controls"
          onSubmit={(event) => event.preventDefault()}
          aria-label="Blueprint options"
        >
          <fieldset className="bp-fieldset">
            <legend className="bp-legend">
              <span>01</span> What kind of institution?
            </legend>
            <div className="bp-option-grid">
              {BLUEPRINT_INSTITUTIONS.map((option) => (
                <label
                  className="bp-choice"
                  data-selected={input.institution === option.id}
                  key={option.id}
                >
                  <input
                    type="radio"
                    name={`${baseId}-institution`}
                    value={option.id}
                    checked={input.institution === option.id}
                    onChange={() => update("institution", option.id)}
                  />
                  <span className="bp-choice-mark" aria-hidden="true" />
                  <strong>{option.label}</strong>
                  <span>{option.detail}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="bp-fieldset">
            <legend className="bp-legend">
              <span>02</span> Where does it break first?
            </legend>
            <div className="bp-option-grid bp-option-grid-bottleneck">
              {BLUEPRINT_BOTTLENECKS.map((option) => (
                <label
                  className="bp-choice"
                  data-selected={input.bottleneck === option.id}
                  key={option.id}
                >
                  <input
                    type="radio"
                    name={`${baseId}-bottleneck`}
                    value={option.id}
                    checked={input.bottleneck === option.id}
                    onChange={() => update("bottleneck", option.id)}
                  />
                  <span className="bp-choice-mark" aria-hidden="true" />
                  <strong>{option.label}</strong>
                  <span>{option.detail}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="bp-fieldset">
            <legend className="bp-legend">
              <span>03</span> What already works?
            </legend>
            <div className="bp-toggle-grid">
              {BLUEPRINT_EXISTING_OPTIONS.map((option) => {
                const selected = input.existing.includes(option.id);
                return (
                  <label
                    className="bp-toggle"
                    data-selected={selected}
                    key={option.id}
                  >
                    <input
                      type="checkbox"
                      name={`${baseId}-existing`}
                      value={option.id}
                      checked={selected}
                      onChange={() => toggleExisting(option.id)}
                    />
                    <span className="bp-toggle-box" aria-hidden="true">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
            <p className="bp-field-note">
              Only tick a layer if it is reliable enough to build on. Leave the
              rest blank.
            </p>
          </fieldset>

          <fieldset className="bp-fieldset">
            <legend className="bp-legend">
              <span>04</span> What is the window?
            </legend>
            <div className="bp-segments">
              {BLUEPRINT_STARTS.map((option) => (
                <label
                  className="bp-segment"
                  data-selected={input.start === option.id}
                  key={option.id}
                >
                  <input
                    type="radio"
                    name={`${baseId}-start`}
                    value={option.id}
                    checked={input.start === option.id}
                    onChange={() => update("start", option.id)}
                  />
                  <strong>{option.label}</strong>
                  <span>{option.detail}</span>
                </label>
              ))}
            </div>
            <p className="bp-field-note">{start.note}</p>
          </fieldset>
        </form>

        <aside className="bp-sheet-wrap" aria-label="Live blueprint sheet">
          <div className="bp-sheet">
            <span className="bp-reg bp-reg-tl" aria-hidden="true" />
            <span className="bp-reg bp-reg-tr" aria-hidden="true" />
            <span className="bp-reg bp-reg-bl" aria-hidden="true" />
            <span className="bp-reg bp-reg-br" aria-hidden="true" />

            <div className="bp-sheet-head">
              <span>ImaginarsClub / institution blueprint</span>
              <span className="bp-sheet-status">Working draft</span>
            </div>

            <div className="bp-sheet-title">
              <p className="bp-sheet-kicker">{plan.headline}</p>
              <h2>System sequence</h2>
              <p className="bp-sheet-summary">{plan.summary}</p>
            </div>

            <div className="bp-sheet-meta">
              <div>
                <span>Institution</span>
                <strong>{institution.label}</strong>
              </div>
              <div>
                <span>Priority</span>
                <strong>{bottleneck.short}</strong>
              </div>
              <div>
                <span>Window</span>
                <strong>{start.label}</strong>
              </div>
              <div>
                <span>Existing</span>
                <strong>
                  {input.existing.length > 0
                    ? `${input.existing.length} in place`
                    : "None recorded"}
                </strong>
              </div>
            </div>

            <div className="bp-priority">
              <div className="bp-sheet-label-row">
                <p className="bp-sheet-label">Priority move</p>
                <span>
                  Layer {plan.priorityMove.layer.index} /{" "}
                  {plan.priorityMove.layer.title}
                </span>
              </div>
              <h3>{plan.priorityMove.title}</h3>
              <p>{plan.priorityMove.detail}</p>
            </div>

            <div className="bp-sequence">
              <div className="bp-sheet-label-row">
                <p className="bp-sheet-label">Build sequence</p>
                <span>
                  {plan.buildLayers.length} layers / {plan.phases.length} phases
                </span>
              </div>

              {plan.phases.length > 0 ? (
                plan.phases.map((phase) => (
                  <div className="bp-phase" key={phase.id}>
                    <span className="bp-phase-index">{phase.index}</span>
                    <div className="bp-phase-body">
                      <h4>
                        {phase.title}
                        {phase.priority ? (
                          <span className="bp-mini-tag">Priority</span>
                        ) : null}
                      </h4>
                      {phase.layers.map((layer) => (
                        <div className="bp-build-row" key={layer.id}>
                          <span>L{layer.index}</span>
                          <strong>{layer.title}</strong>
                          <small>{layer.scope}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="bp-empty">
                  Every recommended layer is already marked as in place. The
                  next useful step is a diagnosis, not another build.
                </p>
              )}
            </div>

            {plan.connections.length > 0 ? (
              <div className="bp-connections">
                <div className="bp-sheet-label-row">
                  <p className="bp-sheet-label">Connect, don&apos;t rebuild</p>
                  <span>
                    {plan.connections.length} of {input.existing.length} connect
                  </span>
                </div>
                <ul>
                  {plan.connections.map((layer) => (
                    <li key={layer.id}>
                      <span aria-hidden="true">↳</span>
                      {layer.title}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="bp-measures">
              <p className="bp-sheet-label">Measure after handover</p>
              <ul>
                {plan.measures.map((measure, index) => (
                  <li key={measure}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {measure}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bp-sheet-foot">
              <div>
                <p className="bp-sheet-label">Closest starting package</p>
                <p className="bp-package-name">{plan.package.name}</p>
                <p className="bp-package-price">{plan.package.price}</p>
                <p className="bp-package-note">
                  {plan.package.note} {plan.package.reason}
                </p>
              </div>
              <div className="bp-stamp" aria-hidden="true">
                <span>Working draft</span>
                <strong>Not a quote</strong>
              </div>
            </div>

            <div className="bp-scope">
              <p className="bp-sheet-label">Not included in this draft</p>
              <ul>
                {plan.scope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <p className="bp-timeline">{plan.timelineNote}</p>
          </div>

          <div className="bp-actions">
            <Link className="inst-btn" href={contactHref}>
              Send to studio
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <button
              className="inst-btn inst-btn-ghost"
              type="button"
              onClick={copyBrief}
            >
              <Clipboard size={14} aria-hidden="true" />
              Copy brief
            </button>
            <button
              className="inst-btn inst-btn-ghost"
              type="button"
              onClick={() => window.print()}
            >
              <Printer size={14} aria-hidden="true" />
              Print sheet
            </button>
            <button
              className="inst-btn inst-btn-ghost"
              type="button"
              onClick={reset}
            >
              <RotateCcw size={14} aria-hidden="true" />
              Reset
            </button>
          </div>
          <p className="bp-action-note" role="status" aria-live="polite">
            {status}
          </p>
          <p className="visually-hidden" role="status" aria-live="polite">
            {`${institution.label}. Priority: ${bottleneck.short}. ${plan.buildLayers.length} layers. Closest package: ${plan.package.name}.`}
          </p>
          <PlanEmailForm
            title="Institution blueprint"
            plan="blueprint"
            source="blueprint"
            compact
            className="bp-capture"
            lines={[
              `Institution: ${institution.label}`,
              `Priority: ${bottleneck.short}`,
              `Priority move: ${plan.priorityMove.title}`,
              `Build sequence: ${plan.buildLayers.map((layer) => `L${layer.index} ${layer.title}`).join(" → ")}`,
              `Closest package: ${plan.package.name} — ${plan.package.price}`,
            ]}
            footer="Working draft, not a quote. Prepared from the ImaginarsClub blueprint."
          />
        </aside>
      </div>
    </>
  );
}
