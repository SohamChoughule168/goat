"use client";

import { useId, useState } from "react";
import { Check, Copy, Loader2, Mail, Printer } from "lucide-react";
import { site } from "@/content/site";
import {
  buildPlanEmailLead,
  validateLeadEmail,
} from "@/lib/lead-actions";
import {
  buildMailtoHref,
  formatPlanSummary,
  getLeadContext,
  submitLead,
} from "@/lib/leads";

type Status = "idle" | "submitting" | "success" | "error";

export default function PlanEmailForm({
  title,
  lines,
  footer,
  source,
  plan,
  compact = false,
  className = "",
}: {
  title: string;
  lines: string[];
  footer?: string;
  source: string;
  plan?: string;
  compact?: boolean;
  className?: string;
}) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const summary = formatPlanSummary({ title, lines, footer });
  const mailtoHref = buildMailtoHref({
    to: site.email,
    subject: `${title} — website plan`,
    body: summary,
  });

  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const emailError = validateLeadEmail(email);
    if (emailError) {
      setError(emailError);
      setStatus("idle");
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      const context = getLeadContext({
        pathname: window.location.pathname,
        search: window.location.search,
        referrer: document.referrer,
        source,
        plan: plan ?? title,
      });
      await submitLead(
        buildPlanEmailLead({ email, title, lines, footer, context }),
      );
      setStatus("success");
    } catch {
      setStatus("error");
      setError(`Could not send the plan. Email us at ${site.email}.`);
    }
  }

  return (
    <form
      className={`plan-capture${compact ? " plan-capture-compact" : ""}${className ? ` ${className}` : ""}`}
      onSubmit={onSubmit}
      noValidate
    >
      <div className="plan-capture-head">
        <p className="inst-label">Keep the plan</p>
        <p className="plan-capture-title">Email me this plan</p>
        <p className="plan-capture-note">
          No newsletter. We&apos;ll send this plan and reply within one business
          day.
        </p>
      </div>

      <div className="plan-capture-row">
        <label className="visually-hidden" htmlFor={inputId}>
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@institute.edu"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError("");
            if (status === "error") setStatus("idle");
          }}
          className="plan-capture-input"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          required
        />
        <button
          type="submit"
          className="inst-btn"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? (
            <Loader2 size={15} className="animate-spin" aria-hidden="true" />
          ) : (
            <Mail size={15} aria-hidden="true" />
          )}
          {status === "submitting" ? "Sending" : "Email the plan"}
        </button>
      </div>

      {error ? (
        <p className="plan-capture-error" id={`${inputId}-error`} role="alert">
          {error}
        </p>
      ) : null}

      {status === "success" ? (
        <p className="plan-capture-success" role="status">
          <Check size={14} aria-hidden="true" />
          Received. We&apos;ll email this plan to {email} within one business
          day.
        </p>
      ) : null}

      <div className="plan-capture-tools">
        <button type="button" onClick={copyPlan}>
          <Copy size={13} aria-hidden="true" />
          {copied ? "Copied" : "Copy plan"}
        </button>
        <button type="button" onClick={() => window.print()}>
          <Printer size={13} aria-hidden="true" />
          Print
        </button>
        <a href={mailtoHref}>Open in email</a>
      </div>
    </form>
  );
}
