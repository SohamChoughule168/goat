"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Mail } from "lucide-react";
import { PACKAGES } from "@/content/packages";
import { pillars } from "@/content/services";
import { site } from "@/content/site";
import {
  buildQuoteLead,
  validateLeadContact,
} from "@/lib/lead-actions";
import { getLeadContext, submitLead } from "@/lib/leads";
import WhatsAppCta from "@/components/leads/whatsapp-cta";

const PACKAGE_OPTIONS = [
  "Not sure yet",
  ...PACKAGES.map((item) => item.name),
  "Institutional engagement",
];

const SERVICE_OPTIONS = pillars.map((pillar) => pillar.title);

const BUDGETS = [
  "Need guidance",
  "Under ₹50,000",
  "₹50,000–₹1,00,000",
  "₹1,00,000–₹3,00,000",
  "₹3,00,000+",
];

const TIMELINES = ["Flexible", "Within a month", "1–2 months", "3+ months"];

const initialValues = {
  name: "",
  email: "",
  phone: "",
  organisation: "",
  packageName: PACKAGE_OPTIONS[0],
  services: [] as string[],
  budget: BUDGETS[0],
  timeline: TIMELINES[0],
  brief: "",
  company: "",
};

export default function QuoteForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      const pkg = params.get("package");
      const service = params.getAll("service").flatMap((value) => value.split(","));
      const brief = params.get("brief");

      setValues((current) => {
        const packageName =
          PACKAGE_OPTIONS.find(
            (option) =>
              option.toLowerCase() === pkg?.toLowerCase() ||
              (pkg === "institutional" &&
                option === "Institutional engagement") ||
              PACKAGES.some(
                (item) =>
                  item.slug === pkg?.toLowerCase() && item.name === option,
              ),
          ) ?? current.packageName;

        const matched = SERVICE_OPTIONS.filter((option) =>
          service.some((value) => value.toLowerCase() === option.toLowerCase()),
        );

        return {
          ...current,
          packageName,
          services: matched.length ? matched : current.services,
          brief: brief ?? current.brief,
        };
      });
    });
  }, []);

  function update<K extends keyof typeof values>(
    field: K,
    value: (typeof values)[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
    if (status === "error") setStatus("idle");
  }

  function toggleService(service: string) {
    update(
      "services",
      values.services.includes(service)
        ? values.services.filter((item) => item !== service)
        : [...values.services, service],
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (values.company) {
      setStatus("success");
      return;
    }

    const nextErrors = validateLeadContact(
      { name: values.name, email: values.email, message: values.brief },
      { messageMin: 20 },
    );

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setStatus("submitting");
    setErrors({});

    try {
      const context = getLeadContext({
        pathname: window.location.pathname,
        search: window.location.search,
        referrer: document.referrer,
        source: "quote-form",
      });
      await submitLead(
        buildQuoteLead({
          name: values.name,
          email: values.email,
          phone: values.phone,
          organisation: values.organisation,
          packageName:
            values.packageName === "Not sure yet"
              ? undefined
              : values.packageName,
          services: values.services,
          budget: values.budget === "Need guidance" ? undefined : values.budget,
          timeline: values.timeline,
          brief: values.brief,
          context,
        }),
      );
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="lead-success lead-success-wide" role="status">
        <span className="lead-success-mark">
          <Check size={18} aria-hidden="true" />
        </span>
        <p className="inst-label">Request received</p>
        <h2>We&apos;ll write back within one business day.</h2>
        <p>
          If the brief is clear, the first reply is a written scope with a
          price, a timeline, and what is excluded. If it is not clear, we will
          ask the two questions that matter before quoting.
        </p>
        <div className="lead-success-actions">
          <WhatsAppCta label="WhatsApp the studio" />
          <Link href="/estimate/" className="inst-btn inst-btn-ghost">
            Check a budget band
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={onSubmit} noValidate>
      <div className="lead-form-head">
        <p className="inst-label">Request a quote</p>
        <h2>Tell us the shape of the work.</h2>
        <p>
          A written quote needs a scope. Give us enough here to name one, and
          we&apos;ll reply with a fixed price, a timeline, and the exclusions in
          writing.
        </p>
      </div>

      <div className="lead-form-grid">
        <div className="lead-field">
          <label htmlFor="quote-name">Name</label>
          <input
            id="quote-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "quote-name-error" : undefined}
            required
          />
          {errors.name ? (
            <p className="lead-field-error" id="quote-name-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="lead-field">
          <label htmlFor="quote-email">Email</label>
          <input
            id="quote-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "quote-email-error" : undefined}
            required
          />
          {errors.email ? (
            <p className="lead-field-error" id="quote-email-error">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="lead-field">
          <label htmlFor="quote-phone">Phone (optional)</label>
          <input
            id="quote-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </div>

        <div className="lead-field">
          <label htmlFor="quote-organisation">Institution (optional)</label>
          <input
            id="quote-organisation"
            name="organisation"
            autoComplete="organization"
            value={values.organisation}
            onChange={(event) => update("organisation", event.target.value)}
          />
        </div>

        <div className="lead-field">
          <label htmlFor="quote-package">Closest package</label>
          <select
            id="quote-package"
            name="package"
            value={values.packageName}
            onChange={(event) => update("packageName", event.target.value)}
          >
            {PACKAGE_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="lead-field">
          <label htmlFor="quote-budget">Budget band</label>
          <select
            id="quote-budget"
            name="budget"
            value={values.budget}
            onChange={(event) => update("budget", event.target.value)}
          >
            {BUDGETS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <fieldset className="lead-field lead-field-wide lead-checks">
          <legend>What needs to change?</legend>
          <div>
            {SERVICE_OPTIONS.map((service) => (
              <label key={service}>
                <input
                  type="checkbox"
                  name="services"
                  value={service}
                  checked={values.services.includes(service)}
                  onChange={() => toggleService(service)}
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="lead-field">
          <label htmlFor="quote-timeline">Timeline</label>
          <select
            id="quote-timeline"
            name="timeline"
            value={values.timeline}
            onChange={(event) => update("timeline", event.target.value)}
          >
            {TIMELINES.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="lead-field lead-field-wide">
          <label htmlFor="quote-brief">
            What is the work?{" "}
            <span className="lead-field-hint">Minimum 20 characters</span>
          </label>
          <textarea
            id="quote-brief"
            name="brief"
            rows={6}
            value={values.brief}
            onChange={(event) => update("brief", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "quote-brief-error" : undefined}
            required
          />
          {errors.message ? (
            <p className="lead-field-error" id="quote-brief-error">
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="lead-honeypot" aria-hidden="true">
        <label htmlFor="quote-company">Company</label>
        <input
          id="quote-company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(event) => update("company", event.target.value)}
        />
      </div>

      {status === "error" ? (
        <p className="lead-form-error" role="alert">
          Could not send the request. Email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> directly.
        </p>
      ) : null}

      <div className="lead-form-actions">
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
          {status === "submitting" ? "Sending" : "Request the quote"}
        </button>
        <p>One business day. No newsletter.</p>
      </div>
    </form>
  );
}
