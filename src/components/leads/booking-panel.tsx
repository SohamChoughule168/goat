"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Loader2,
  Mail,
} from "lucide-react";
import { site } from "@/content/site";
import {
  buildBookingLead,
  validateLeadEmail,
} from "@/lib/lead-actions";
import { getLeadContext, submitLead } from "@/lib/leads";
import WhatsAppCta from "@/components/leads/whatsapp-cta";

const TOPICS = [
  "Website or systems rebuild",
  "More admissions enquiries",
  "Portal or operations",
  "Brand and content",
  "Not sure yet",
];

const WINDOWS = ["This week", "Next week", "This month", "Flexible"];

function calendarSrc(link: string) {
  const withProtocol = /^https?:\/\//i.test(link) ? link : `https://${link}`;
  try {
    const url = new URL(withProtocol);
    url.searchParams.set("embed", "true");
    url.searchParams.set("theme", "light");
    return url.toString();
  } catch {
    return withProtocol;
  }
}

export default function BookingPanel() {
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK?.trim();
  const [showCalendar, setShowCalendar] = useState(false);

  if (!calLink) return <BookingRequestForm />;

  return (
    <div className="booking-panel">
      <div className="booking-panel-head">
        <p className="inst-label">Pick a time</p>
        <h2 className="booking-panel-title">Thirty minutes, no deck.</h2>
        <p className="booking-panel-copy">
          Bring the current site, the enquiry flow, or the operational mess.
          We&apos;ll name the first useful move and tell you if we are the wrong
          studio for it.
        </p>
      </div>

      {showCalendar ? (
        <div className="booking-calendar">
          <iframe
            src={calendarSrc(calLink)}
            title="Book a discovery call"
            loading="lazy"
          />
          <p className="booking-calendar-note">
            Calendar not loading?{" "}
            <a href={calendarSrc(calLink)} target="_blank" rel="noreferrer">
              Open it in a new tab
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          </p>
        </div>
      ) : (
        <div className="booking-load">
          <button
            type="button"
            className="inst-btn"
            onClick={() => setShowCalendar(true)}
          >
            <CalendarDays size={15} aria-hidden="true" />
            Load the calendar
          </button>
          <p>
            The calendar is hosted outside this site. Load it only when you are
            ready to pick a time.
          </p>
        </div>
      )}

      <div className="booking-fallback">
        <p>
          Prefer email? Write to{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> or use the form
          below.
        </p>
        <Link href="#request-a-time" className="inst-link">
          Request a time instead
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>

      <div id="request-a-time" className="booking-request">
        <BookingRequestForm compact />
      </div>
    </div>
  );
}

export function BookingRequestForm({ compact = false }: { compact?: boolean }) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    organisation: "",
    topic: TOPICS[0],
    preferredWindow: WINDOWS[3],
    notes: "",
    company: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );

  function update(field: keyof typeof values, value: string) {
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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (values.company) {
      setStatus("success");
      return;
    }

    const nextErrors: Record<string, string> = {};
    const emailError = validateLeadEmail(values.email);
    if (!values.name.trim()) nextErrors.name = "Add your name.";
    if (emailError) nextErrors.email = emailError;

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
        source: "booking-form",
      });
      await submitLead(
        buildBookingLead({
          name: values.name,
          email: values.email,
          phone: values.phone,
          organisation: values.organisation,
          topic: values.topic,
          preferredWindow: values.preferredWindow,
          notes: values.notes,
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
      <div className="lead-success" role="status">
        <span className="lead-success-mark">
          <Check size={18} aria-hidden="true" />
        </span>
        <p className="inst-label">Request received</p>
        <h3>We&apos;ll come back with two or three times.</h3>
        <p>
          Expect a reply at {values.email} within one business day. If it is
          urgent, WhatsApp is faster.
        </p>
        <div className="lead-success-actions">
          <WhatsAppCta label="WhatsApp the studio" />
          <Link href="/work/" className="inst-btn inst-btn-ghost">
            See the work
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      className={`lead-form${compact ? " lead-form-compact" : ""}`}
      onSubmit={onSubmit}
      noValidate
    >
      <div className="lead-form-head">
        <p className="inst-label">Request a time</p>
        <h2>{compact ? "Send three details." : "Tell us what to prepare for."}</h2>
        <p>
          We reply with two or three workable slots. No calendar link, no
          back-and-forth.
        </p>
      </div>

      <div className="lead-form-grid">
        <div className="lead-field">
          <label htmlFor="booking-name">Name</label>
          <input
            id="booking-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "booking-name-error" : undefined}
            required
          />
          {errors.name ? (
            <p className="lead-field-error" id="booking-name-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="lead-field">
          <label htmlFor="booking-email">Email</label>
          <input
            id="booking-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "booking-email-error" : undefined}
            required
          />
          {errors.email ? (
            <p className="lead-field-error" id="booking-email-error">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="lead-field">
          <label htmlFor="booking-phone">Phone (optional)</label>
          <input
            id="booking-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </div>

        <div className="lead-field">
          <label htmlFor="booking-organisation">Institution (optional)</label>
          <input
            id="booking-organisation"
            name="organisation"
            autoComplete="organization"
            value={values.organisation}
            onChange={(event) => update("organisation", event.target.value)}
          />
        </div>

        <div className="lead-field">
          <label htmlFor="booking-topic">What should we prepare for?</label>
          <select
            id="booking-topic"
            name="topic"
            value={values.topic}
            onChange={(event) => update("topic", event.target.value)}
          >
            {TOPICS.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </div>

        <div className="lead-field">
          <label htmlFor="booking-window">Best window</label>
          <select
            id="booking-window"
            name="preferredWindow"
            value={values.preferredWindow}
            onChange={(event) => update("preferredWindow", event.target.value)}
          >
            {WINDOWS.map((window) => (
              <option key={window}>{window}</option>
            ))}
          </select>
        </div>

        <div className="lead-field lead-field-wide">
          <label htmlFor="booking-notes">Anything else? (optional)</label>
          <textarea
            id="booking-notes"
            name="notes"
            rows={4}
            value={values.notes}
            onChange={(event) => update("notes", event.target.value)}
          />
        </div>
      </div>

      <div className="lead-honeypot" aria-hidden="true">
        <label htmlFor="booking-company">Company</label>
        <input
          id="booking-company"
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
          {status === "submitting" ? "Sending" : "Request a time"}
        </button>
        <p>One business day. No newsletter.</p>
      </div>
    </form>
  );
}
